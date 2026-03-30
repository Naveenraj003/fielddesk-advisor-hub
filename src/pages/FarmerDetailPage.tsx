import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import {
  Loader2,
  ArrowLeft,
  CalendarDays,
  ClipboardCheck,
  Droplets,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  Sprout,
  Tractor,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { getMockFarmerById, getMockRecommendationsByFarmerId, getMockSoilHistoryByFarmerId } from '@/lib/mockData';
import { useDataMode } from '@/contexts/DataModeContext';

interface FarmerDetail {
  id: number;
  name: string;
  phone: string;
  village: string;
  farm_size_acres: number;
  primary_crop?: string;
  status: string;
  last_soil_test_date?: string;
  notes?: string;
}

interface SoilTest {
  id: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
  test_date: string;
}

interface Recommendation {
  id: number;
  crop: string;
  total_cost: number;
  cost_saving: number;
  whatsapp_sent: boolean;
  farmer_confirmed: boolean;
  expected_yield_min?: number;
  expected_yield_max?: number;
  created_at: string;
}

const statusTheme: Record<string, string> = {
  green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  yellow: 'bg-amber-100 text-amber-800 border-amber-200',
  red: 'bg-rose-100 text-rose-700 border-rose-200',
};

const cropPlaybook: Record<string, { stage: string; water: string; focus: string; market: string }> = {
  maize: {
    stage: 'Vegetative to early tasseling',
    water: 'Light irrigation if rain probability < 35%',
    focus: 'Nitrogen split management and pH stabilization',
    market: 'Local demand positive in next 2 weeks',
  },
  groundnut: {
    stage: 'Flowering and pegging',
    water: 'Maintain balanced moisture, avoid over-irrigation',
    focus: 'Phosphorus support with micronutrient watch',
    market: 'Price trend stable with slight upside',
  },
  cotton: {
    stage: 'Square initiation',
    water: 'Drip cycle preferred over flood irrigation',
    focus: 'Potassium correction and stress prevention',
    market: 'Ginning demand improving regionally',
  },
  millet: {
    stage: 'Tillering',
    water: 'Irrigation only if top-soil moisture drops',
    focus: 'Balanced NPK with cost-optimized mix',
    market: 'Steady local procurement signals',
  },
};

const villageIntel: Record<string, { cluster: string; rainfall: string; travel: string }> = {
  Palacode: { cluster: 'North Cluster', rainfall: 'Medium-High', travel: '32 min from field office' },
  Pennagaram: { cluster: 'River Belt Cluster', rainfall: 'Medium', travel: '44 min from field office' },
  Harur: { cluster: 'Eastern Cluster', rainfall: 'Medium', travel: '39 min from field office' },
  Morappur: { cluster: 'Central Dry Zone', rainfall: 'Low-Medium', travel: '29 min from field office' },
  Nallampalli: { cluster: 'South Cluster', rainfall: 'Low', travel: '26 min from field office' },
};

function formatDate(value?: string) {
  if (!value) return 'Not available';
  return new Date(value).toLocaleDateString();
}

function daysSince(value?: string) {
  if (!value) return null;
  const diff = Date.now() - new Date(value).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export default function FarmerDetailPage() {
  const { isDemo } = useDataMode();
  const { id } = useParams();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState<FarmerDetail | null>(null);
  const [soilTests, setSoilTests] = useState<SoilTest[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editData, setEditData] = useState({ name: '', phone: '', village: '', farm_size_acres: 0, primary_crop: '', notes: '' });
  const [isLoading, setIsLoading] = useState(true);

  const sortedSoilTests = useMemo(
    () => [...soilTests].sort((a, b) => new Date(b.test_date).getTime() - new Date(a.test_date).getTime()),
    [soilTests]
  );

  const latestSoilTest = sortedSoilTests[0] || null;

  const recommendationSummary = useMemo(() => {
    const total = recommendations.length;
    const sent = recommendations.filter((item) => item.whatsapp_sent).length;
    const confirmed = recommendations.filter((item) => item.farmer_confirmed).length;
    const savings = recommendations.reduce((sum, item) => sum + (item.cost_saving || 0), 0);
    return {
      total,
      sent,
      confirmed,
      savings,
      confirmationRate: sent > 0 ? Math.round((confirmed / sent) * 100) : 0,
    };
  }, [recommendations]);

  const profileData = useMemo(() => {
    if (!farmer) return null;
    const crop = (farmer.primary_crop || '').toLowerCase();
    const playbook = cropPlaybook[crop] || {
      stage: 'Field stage review pending',
      water: 'Use weather-aware irrigation guidance',
      focus: 'Collect latest soil values to calibrate recommendation',
      market: 'Awaiting local market update',
    };
    const villageData = villageIntel[farmer.village] || {
      cluster: 'Assigned regional cluster',
      rainfall: 'Medium',
      travel: 'Travel time needs confirmation',
    };
    const lastSoilAge = daysSince(farmer.last_soil_test_date || latestSoilTest?.test_date || undefined);

    const nextAction =
      farmer.status === 'red'
        ? 'High risk: prioritize call and same-day field touchpoint.'
        : farmer.status === 'yellow'
          ? 'Needs attention: confirm recommendation delivery and schedule follow-up.'
          : 'On-track: maintain cadence and monitor seasonal nutrient response.';

    return {
      playbook,
      villageData,
      lastSoilAge,
      nextAction,
    };
  }, [farmer, latestSoilTest]);

  useEffect(() => {
    loadData();
  }, [id, isDemo]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (!id) return;
      const farmerId = parseInt(id);

      if (isDemo) {
        const demoFarmer = getMockFarmerById(farmerId);
        if (demoFarmer) {
          setFarmer(demoFarmer as any);
          setEditData({
            name: demoFarmer.name,
            phone: demoFarmer.phone,
            village: demoFarmer.village,
            farm_size_acres: demoFarmer.farm_size_acres,
            primary_crop: demoFarmer.primary_crop || '',
            notes: demoFarmer.notes || '',
          });
          setSoilTests(getMockSoilHistoryByFarmerId(farmerId) as any);
          setRecommendations(getMockRecommendationsByFarmerId(farmerId) as any);
        } else {
          setFarmer(null);
          setSoilTests([]);
          setRecommendations([]);
        }
        return;
      }
      
      const farmerResp = await api.getFarmer(farmerId);
      setFarmer(farmerResp.data);
      setEditData({
        name: farmerResp.data.name,
        phone: farmerResp.data.phone,
        village: farmerResp.data.village,
        farm_size_acres: farmerResp.data.farm_size_acres,
        primary_crop: farmerResp.data.primary_crop || '',
        notes: farmerResp.data.notes || '',
      });
      
      const testsResp = await api.getSoilHistory(farmerId);
      setSoilTests(testsResp.data);

      const recResp = await api.getFarmerRecommendations(farmerId);
      setRecommendations(recResp.data);
    } catch (error) {
      console.error('Error loading farmer:', error);
      if (id) {
        const farmerId = parseInt(id);
        const mockFarmer = getMockFarmerById(farmerId);
        if (mockFarmer) {
          setFarmer(mockFarmer as any);
          setEditData({
            name: mockFarmer.name,
            phone: mockFarmer.phone,
            village: mockFarmer.village,
            farm_size_acres: mockFarmer.farm_size_acres,
            primary_crop: mockFarmer.primary_crop || '',
            notes: mockFarmer.notes || '',
          });
          setSoilTests(getMockSoilHistoryByFarmerId(farmerId) as any);
          setRecommendations(getMockRecommendationsByFarmerId(farmerId) as any);
          toast.info('Showing fallback profile data');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const markFarmerConfirmed = async (recommendationId: number) => {
    try {
      if (isDemo) {
        setRecommendations((prev) =>
          prev.map((rec) => (rec.id === recommendationId ? { ...rec, farmer_confirmed: true } : rec))
        );
        toast.success('Farmer action confirmed (demo mode)');
        return;
      }

      await api.confirmFarmerAction(recommendationId);
      await loadData();
    } catch (error) {
      console.error('Error confirming farmer action:', error);
    }
  };

  const saveFarmer = async () => {
    if (!id) return;
    setIsSaving(true);
    try {
      if (isDemo) {
        setFarmer((prev) =>
          prev
            ? {
                ...prev,
                ...editData,
                farm_size_acres: Number(editData.farm_size_acres),
              }
            : prev
        );
        toast.success('Farmer profile updated (demo mode)');
        setIsEditing(false);
        return;
      }

      await api.updateFarmer(parseInt(id), {
        ...editData,
        farm_size_acres: Number(editData.farm_size_acres),
      });
      toast.success('Farmer profile updated');
      setIsEditing(false);
      await loadData();
    } catch (error) {
      console.error('Error updating farmer:', error);
      toast.error('Unable to update farmer profile');
    } finally {
      setIsSaving(false);
    }
  };

  const goToRecommendations = () => {
    const section = document.getElementById('recommendation-timeline');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const copyPhone = async () => {
    if (!farmer?.phone) return;
    try {
      await navigator.clipboard.writeText(farmer.phone);
      toast.success('Farmer phone copied');
    } catch {
      toast.error('Unable to copy number');
    }
  };

  const startCall = () => {
    if (!farmer?.phone) return;
    window.location.href = `tel:${farmer.phone}`;
  };

  const sendReminder = () => {
    toast.success('Reminder marked for WhatsApp follow-up queue');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!farmer) {
    return <div>Farmer not found</div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate('/portfolio-live')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Portfolio
        </Button>
        <div className="flex items-center gap-2">
          <Badge className={statusTheme[farmer.status] || 'bg-slate-100 text-slate-700 border-slate-200'}>
            {farmer.status.toUpperCase()} PRIORITY
          </Badge>
          <Badge variant="outline">Farmer ID #{farmer.id}</Badge>
        </div>
      </div>

      <Card className="border-white/70 bg-[radial-gradient(circle_at_20%_10%,#f7f9ec_0,#edf5ef_45%,#e7f0eb_100%)]">
        <CardContent className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary-mid">
              <Sparkles className="h-4 w-4" /> Farmer 360 Intelligence View
            </div>
            <h1 className="mt-2 text-3xl font-bold text-primary">{farmer.name}</h1>
            <p className="mt-2 text-sm text-slate-700">
              {profileData?.nextAction}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-white/85 px-3 py-1 text-slate-700">
                <MapPin className="mr-1 inline h-4 w-4" /> {farmer.village}
              </span>
              <span className="rounded-full bg-white/85 px-3 py-1 text-slate-700">
                <Tractor className="mr-1 inline h-4 w-4" /> {farmer.farm_size_acres} acres
              </span>
              <span className="rounded-full bg-white/85 px-3 py-1 text-slate-700">
                <Sprout className="mr-1 inline h-4 w-4" /> {farmer.primary_crop || 'Crop pending'}
              </span>
            </div>
          </div>
          <div className="space-y-2 rounded-xl border border-primary/15 bg-white/85 p-4 text-sm">
            <div className="font-semibold text-primary">Cluster Context</div>
            <div className="text-slate-700">{profileData?.villageData.cluster}</div>
            <div className="text-slate-600">Rainfall: {profileData?.villageData.rainfall}</div>
            <div className="text-slate-600">Travel: {profileData?.villageData.travel}</div>
            <div className="text-slate-600">Last Soil Test: {formatDate(farmer.last_soil_test_date || latestSoilTest?.test_date || undefined)}</div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-slate-500">Recommendations</div>
            <div className="text-2xl font-bold">{recommendationSummary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-slate-500">Confirmed Actions</div>
            <div className="text-2xl font-bold">{recommendationSummary.confirmed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-slate-500">Confirm Rate</div>
            <div className="text-2xl font-bold">{recommendationSummary.confirmationRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-slate-500">Total Savings</div>
            <div className="text-2xl font-bold">₹{recommendationSummary.savings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-slate-500">Soil Test Age</div>
            <div className="text-2xl font-bold">{profileData?.lastSoilAge ?? '-'}d</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Farmer Details</CardTitle>
            <CardDescription>Complete profile, crop strategy, and field notes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {isEditing ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <Label>Name</Label>
                  <Input value={editData.name} onChange={(e) => setEditData((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={editData.phone} onChange={(e) => setEditData((p) => ({ ...p, phone: e.target.value }))} />
                </div>
                <div>
                  <Label>Village</Label>
                  <Input value={editData.village} onChange={(e) => setEditData((p) => ({ ...p, village: e.target.value }))} />
                </div>
                <div>
                  <Label>Farm Size (acres)</Label>
                  <Input type="number" value={editData.farm_size_acres} onChange={(e) => setEditData((p) => ({ ...p, farm_size_acres: Number(e.target.value) }))} />
                </div>
                <div>
                  <Label>Primary Crop</Label>
                  <Input value={editData.primary_crop} onChange={(e) => setEditData((p) => ({ ...p, primary_crop: e.target.value }))} />
                </div>
                <div className="md:col-span-2">
                  <Label>Notes</Label>
                  <Input value={editData.notes} onChange={(e) => setEditData((p) => ({ ...p, notes: e.target.value }))} />
                </div>
                <div className="md:col-span-2 flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={saveFarmer} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-slate-500">Phone</div>
                    <div className="font-medium">{farmer.phone}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-slate-500">Primary Crop Stage</div>
                    <div className="font-medium">{profileData?.playbook.stage}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-slate-500">Water Guidance</div>
                    <div className="font-medium">{profileData?.playbook.water}</div>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-slate-500">Nutrient Focus</div>
                    <div className="font-medium">{profileData?.playbook.focus}</div>
                  </div>
                  <div className="rounded-lg border p-3 md:col-span-2">
                    <div className="text-xs text-slate-500">Market Signal</div>
                    <div className="font-medium">{profileData?.playbook.market}</div>
                  </div>
                </div>
                {farmer.notes && (
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-slate-700">
                    <span className="font-medium text-primary">Field Notes:</span> {farmer.notes}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Fast controls for advisor workflow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" onClick={() => navigate(`/farmer/${id}/soil`)}>
              <Droplets className="mr-2 h-4 w-4" /> Add Soil Test
            </Button>
            <Button className="w-full" variant="outline" onClick={() => navigate(`/farmer/${id}/soil`)}>
              <Sprout className="mr-2 h-4 w-4" /> Generate Recommendation
            </Button>
            <Button className="w-full" variant="outline" onClick={goToRecommendations}>
              <TrendingUp className="mr-2 h-4 w-4" /> View Timeline
            </Button>
            <Button className="w-full" variant="outline" onClick={() => setIsEditing(true)}>
              <ClipboardCheck className="mr-2 h-4 w-4" /> Edit Farmer Info
            </Button>
            <Button className="w-full" variant="outline" onClick={copyPhone}>
              <Phone className="mr-2 h-4 w-4" /> Copy Phone
            </Button>
            <Button className="w-full" variant="outline" onClick={startCall}>
              <Phone className="mr-2 h-4 w-4" /> Call Farmer
            </Button>
            <Button className="w-full" variant="outline" onClick={sendReminder}>
              <MessageCircle className="mr-2 h-4 w-4" /> Send Reminder
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card id="recommendation-timeline">
        <CardHeader>
          <CardTitle>Soil Test History</CardTitle>
          <CardDescription>{sortedSoilTests.length} tests recorded with nutrient detail.</CardDescription>
        </CardHeader>
        <CardContent>
          {sortedSoilTests.length === 0 ? (
            <div className="py-8 text-center text-gray-600">No soil tests recorded yet</div>
          ) : (
            <div className="space-y-3">
              {sortedSoilTests.map((test) => (
                <div key={test.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="font-medium">
                      <CalendarDays className="mr-1 inline h-4 w-4" /> {new Date(test.test_date).toLocaleDateString()}
                    </div>
                    <Badge variant="outline">Soil Test #{test.id}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
                    <div className="rounded-md bg-slate-50 p-2">N: {test.nitrogen} kg/ha</div>
                    <div className="rounded-md bg-slate-50 p-2">P: {test.phosphorus} kg/ha</div>
                    <div className="rounded-md bg-slate-50 p-2">K: {test.potassium} kg/ha</div>
                    <div className="rounded-md bg-slate-50 p-2">pH: {test.ph}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recommendation Timeline</CardTitle>
          <CardDescription>
            {recommendations.length} recommendations · ₹{recommendationSummary.savings} cumulative savings tracked.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <div className="py-8 text-center text-gray-600">No recommendations generated yet</div>
          ) : (
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.id} className="rounded-lg border p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-medium">{rec.crop} recommendation</div>
                      <div className="text-xs text-slate-500">{new Date(rec.created_at).toLocaleString()}</div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={rec.whatsapp_sent ? 'default' : 'outline'}>
                        {rec.whatsapp_sent ? 'WhatsApp Sent' : 'Not Sent'}
                      </Badge>
                      <Badge variant={rec.farmer_confirmed ? 'default' : 'outline'}>
                        {rec.farmer_confirmed ? 'Farmer Confirmed' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
                    <div className="rounded-md bg-slate-50 p-2">
                      <Wallet className="mr-1 inline h-4 w-4" /> Total Cost: ₹{rec.total_cost}
                    </div>
                    <div className="rounded-md bg-slate-50 p-2">
                      <TrendingUp className="mr-1 inline h-4 w-4" /> Cost Saving: ₹{rec.cost_saving || 0}
                    </div>
                    <div className="rounded-md bg-slate-50 p-2">
                      Yield: {rec.expected_yield_min || 0}% - {rec.expected_yield_max || 0}%
                    </div>
                  </div>
                  {!rec.farmer_confirmed && (
                    <div className="mt-3">
                      <Button size="sm" variant="outline" onClick={() => markFarmerConfirmed(rec.id)}>
                        Mark Farmer Action Confirmed
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
