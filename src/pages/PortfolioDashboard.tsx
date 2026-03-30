import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { Loader2, AlertCircle, CheckCircle2, AlertTriangle, Plus } from 'lucide-react';
import { mockFarmers } from '@/lib/mockData';
import { useDataMode } from '@/contexts/DataModeContext';

interface Farmer {
  id: number;
  name: string;
  phone: string;
  village: string;
  farm_size_acres: number;
  primary_crop?: string;
  status: string;
  last_soil_test_date?: string;
}

interface PriorityResponse {
  count: number;
  priority_farmers: Farmer[];
}

const emptyFarmerForm = {
  name: '',
  phone: '',
  village: '',
  farm_size_acres: 1,
  primary_crop: '',
  notes: '',
};

export default function PortfolioDashboard() {
  const { isDemo } = useDataMode();
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [priority, setPriority] = useState<PriorityResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingFarmer, setIsCreatingFarmer] = useState(false);
  const [showAddFarmer, setShowAddFarmer] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [farmerForm, setFarmerForm] = useState(emptyFarmerForm);

  useEffect(() => {
    loadData();
  }, [selectedStatus, isDemo]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (isDemo) {
        const demoFarmers = selectedStatus
          ? mockFarmers.filter((farmer) => farmer.status === selectedStatus)
          : mockFarmers;

        setFarmers(demoFarmers as Farmer[]);
        setStats({
          total_farmers: mockFarmers.length,
          portfolio_health: {
            on_track: mockFarmers.filter((f) => f.status === 'green').length,
            needs_attention: mockFarmers.filter((f) => f.status === 'yellow').length,
            urgent: mockFarmers.filter((f) => f.status === 'red').length,
          },
          recommendation_metrics: {
            total_recommendations: 26,
            whatsapp_delivery_rate: 74,
            farmer_confirmation_rate: 61,
          },
        });
        setPriority({
          count: Math.min(10, demoFarmers.length),
          priority_farmers: [...demoFarmers]
            .sort((a, b) => (a.status > b.status ? 1 : -1))
            .slice(0, 10) as Farmer[],
        });
        return;
      }

      // Load portfolio
      const portfolioResp = await api.getFarmers(selectedStatus || undefined);
      const apiFarmers = portfolioResp.data.farmers || [];
      setFarmers(apiFarmers.length > 0 ? apiFarmers : mockFarmers);
      
      // Load stats
      const statsResp = await api.getAdvisorStats(1);
      setStats(statsResp.data);

      const priorityResp = await api.getPriorityFarmers(10);
      setPriority(priorityResp.data);
    } catch (error) {
      console.error('Error loading portfolio:', error);
      setFarmers(mockFarmers);
      const mockSummary = {
        total_farmers: mockFarmers.length,
        portfolio_health: {
          on_track: mockFarmers.filter((f) => f.status === 'green').length,
          needs_attention: mockFarmers.filter((f) => f.status === 'yellow').length,
          urgent: mockFarmers.filter((f) => f.status === 'red').length,
        },
        recommendation_metrics: {
          total_recommendations: 26,
          whatsapp_delivery_rate: 74,
          farmer_confirmation_rate: 61,
        },
      };
      setStats(mockSummary);
      setPriority({ count: 10, priority_farmers: [...mockFarmers].sort((a, b) => (a.status > b.status ? 1 : -1)).slice(0, 10) });
    } finally {
      setIsLoading(false);
    }
  };

  const createFarmer = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsCreatingFarmer(true);
    try {
      if (isDemo) {
        const newFarmer: Farmer = {
          id: Date.now(),
          name: farmerForm.name,
          phone: farmerForm.phone,
          village: farmerForm.village,
          farm_size_acres: Number(farmerForm.farm_size_acres),
          primary_crop: farmerForm.primary_crop || undefined,
          status: 'yellow',
        };
        setFarmers((prev) => [newFarmer, ...prev]);
        setFarmerForm(emptyFarmerForm);
        setShowAddFarmer(false);
        return;
      }

      await api.createFarmer({
        ...farmerForm,
        farm_size_acres: Number(farmerForm.farm_size_acres),
      });
      setFarmerForm(emptyFarmerForm);
      setShowAddFarmer(false);
      await loadData();
    } catch (error) {
      console.error('Error creating farmer:', error);
    } finally {
      setIsCreatingFarmer(false);
    }
  };

  const updateFarmerStatus = async (farmerId: number, status: 'green' | 'yellow' | 'red') => {
    try {
      if (isDemo) {
        setFarmers((prev) => prev.map((farmer) => (farmer.id === farmerId ? { ...farmer, status } : farmer)));
        setPriority((prev) =>
          prev
            ? {
                ...prev,
                priority_farmers: prev.priority_farmers.map((farmer) =>
                  farmer.id === farmerId ? { ...farmer, status } : farmer
                ),
              }
            : prev
        );
        return;
      }

      await api.updateFarmerStatus(farmerId, status);
      await loadData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'green':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'yellow':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'red':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'green':
        return 'bg-green-100 text-green-800';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800';
      case 'red':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredFarmers = useMemo(() => {
    if (!searchText.trim()) {
      return farmers;
    }

    const query = searchText.toLowerCase();
    return farmers.filter((farmer) => {
      return (
        farmer.name.toLowerCase().includes(query) ||
        farmer.village.toLowerCase().includes(query) ||
        (farmer.primary_crop || '').toLowerCase().includes(query)
      );
    });
  }, [farmers, searchText]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      {/* Dashboard Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Farmers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_farmers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">On Track</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.portfolio_health.on_track}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600">Needs Attention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.portfolio_health.needs_attention}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Urgent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.portfolio_health.urgent}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Advisor Intelligence Layer</CardTitle>
          <CardDescription>
            Season performance from your portfolio actions and follow-through.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-slate-500">Recommendations Issued</div>
            <div className="text-2xl font-semibold">
              {stats?.recommendation_metrics?.total_recommendations ?? 0}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-slate-500">WhatsApp Delivery Rate</div>
            <div className="text-2xl font-semibold">
              {stats?.recommendation_metrics?.whatsapp_delivery_rate ?? 0}%
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-slate-500">Farmer Confirmation Rate</div>
            <div className="text-2xl font-semibold">
              {stats?.recommendation_metrics?.farmer_confirmation_rate ?? 0}%
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Priority List</CardTitle>
          <CardDescription>
            The top farmers needing action this week based on current status and soil recency.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {(priority?.priority_farmers || []).map((farmer) => (
              <div
                key={farmer.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <div className="font-medium">{farmer.name}</div>
                  <div className="text-xs text-slate-500">
                    {farmer.village} · {farmer.primary_crop || 'Crop not set'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(farmer.status)}>{farmer.status}</Badge>
                  <Button size="sm" onClick={() => navigate(`/farmer/${farmer.id}`)}>
                    Open
                  </Button>
                </div>
              </div>
            ))}
            {(priority?.priority_farmers || []).length === 0 && (
              <div className="text-sm text-slate-500">No priority farmers found.</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedStatus === null ? 'default' : 'outline'}
            onClick={() => setSelectedStatus(null)}
          >
            All Farmers
          </Button>
          <Button
            variant={selectedStatus === 'green' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('green')}
          >
            On Track
          </Button>
          <Button
            variant={selectedStatus === 'yellow' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('yellow')}
          >
            Needs Attention
          </Button>
          <Button
            variant={selectedStatus === 'red' ? 'default' : 'outline'}
            onClick={() => setSelectedStatus('red')}
          >
            Urgent
          </Button>
        </div>
        <div className="flex w-full gap-2 md:w-auto">
          <Input
            placeholder="Search name, village, crop"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button variant="outline" onClick={() => setShowAddFarmer((prev) => !prev)}>
            <Plus className="mr-1 h-4 w-4" />
            Add Farmer
          </Button>
        </div>
      </div>

      {showAddFarmer && (
        <Card>
          <CardHeader>
            <CardTitle>Add Farmer Profile</CardTitle>
            <CardDescription>Create a new farmer in your managed portfolio.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={createFarmer}>
              <div className="space-y-1">
                <Label>Name</Label>
                <Input
                  required
                  value={farmerForm.name}
                  onChange={(e) => setFarmerForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input
                  required
                  value={farmerForm.phone}
                  onChange={(e) => setFarmerForm((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label>Village</Label>
                <Input
                  required
                  value={farmerForm.village}
                  onChange={(e) => setFarmerForm((prev) => ({ ...prev, village: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label>Farm Size (acres)</Label>
                <Input
                  required
                  type="number"
                  min={0.1}
                  step="0.1"
                  value={farmerForm.farm_size_acres}
                  onChange={(e) => setFarmerForm((prev) => ({ ...prev, farm_size_acres: Number(e.target.value) }))}
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label>Primary Crop</Label>
                <Input
                  value={farmerForm.primary_crop}
                  onChange={(e) => setFarmerForm((prev) => ({ ...prev, primary_crop: e.target.value }))}
                  placeholder="e.g. maize"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddFarmer(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreatingFarmer}>
                  {isCreatingFarmer ? 'Saving...' : 'Create Farmer'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Farmers List */}
      <Card>
        <CardHeader>
          <CardTitle>Farmer Portfolio</CardTitle>
          <CardDescription>
            {filteredFarmers.length} farmers · click any row to open profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredFarmers.map((farmer) => (
              <div
                key={farmer.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/farmer/${farmer.id}`)}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0">
                    {getStatusIcon(farmer.status)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{farmer.name}</div>
                    <div className="text-sm text-gray-600">
                      {farmer.village} · {farmer.farm_size_acres} acres
                      {farmer.primary_crop && ` · ${farmer.primary_crop}`}
                    </div>
                    {farmer.last_soil_test_date && (
                      <div className="text-xs text-gray-500">
                        Last soil test: {new Date(farmer.last_soil_test_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getStatusColor(farmer.status)}>
                    {farmer.status.charAt(0).toUpperCase() + farmer.status.slice(1)}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/farmer/${farmer.id}`);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      updateFarmerStatus(farmer.id, 'yellow');
                    }}
                  >
                    Flag
                  </Button>
                </div>
              </div>
            ))}
            {filteredFarmers.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-slate-500">
                No farmers match your filters yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
