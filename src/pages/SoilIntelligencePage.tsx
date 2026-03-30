import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { useForm } from 'react-hook-form';
import { Loader2, Copy } from 'lucide-react';

interface FarmerDetail {
  id: number;
  name: string;
  primary_crop?: string;
  phone: string;
  village: string;
}

export default function SoilIntelligencePage() {
  const { id } = useParams();
  const [farmer, setFarmer] = useState<FarmerDetail | null>(null);
  const [crop, setCrop] = useState('maize');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [whatsappMessage, setWhatsappMessage] = useState<string>('');
  const [irrigationOverride, setIrrigationOverride] = useState('Wait for 24-48 hours if rainfall probability is high.');
  const [ocrConfidence, setOcrConfidence] = useState(89);

  const form = useForm({
    defaultValues: {
      nitrogen: 0,
      phosphorus: 0,
      potassium: 0,
      ph: 6.5,
      ec: 0,
      organic_matter: 0,
      soil_texture: 'loam',
      notes: '',
    },
  });

  useEffect(() => {
    const loadFarmer = async () => {
      if (!id) return;
      try {
        const response = await api.getFarmer(parseInt(id));
        setFarmer(response.data);
        if (response.data.primary_crop) {
          setCrop(response.data.primary_crop.toLowerCase());
        }
      } catch (error) {
        console.error('Error loading farmer context:', error);
      }
    };

    loadFarmer();
  }, [id]);

  const fertilizerMix = useMemo(() => {
    if (!recommendation?.fertilizer_mix) {
      return [];
    }
    try {
      return JSON.parse(recommendation.fertilizer_mix);
    } catch {
      return [];
    }
  }, [recommendation]);

  const genericCost = useMemo(() => {
    if (!recommendation?.total_cost) {
      return 0;
    }
    return recommendation.total_cost + (recommendation.cost_saving || 0);
  }, [recommendation]);

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      if (!id) return;

      // Create soil test first
      const soilTestResp = await api.createSoilTest(parseInt(id), values);
      
      // Generate recommendation
      const recResp = await api.generateRecommendation(parseInt(id), {
        crop,
        nitrogen_kg_per_acre: values.nitrogen * 0.405,
        phosphorus_kg_per_acre: values.phosphorus * 0.405,
        potassium_kg_per_acre: values.potassium * 0.405,
        soil_test_id: soilTestResp.data.id,
      });

      setRecommendation(recResp.data);
    } catch (error) {
      console.error('Error creating soil test:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendViaWhatsApp = async () => {
    if (!recommendation?.id) return;
    setIsSendingWhatsApp(true);
    try {
      const messageResp = await api.generateWhatsAppMessage(recommendation.id, 'ta');
      setWhatsappMessage(messageResp.data.message);
      await api.markRecommendationSent(recommendation.id);
      const recResp = await api.getRecommendation(recommendation.id);
      setRecommendation(recResp.data);
    } catch (error) {
      console.error('Error preparing WhatsApp message:', error);
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  const copyMessage = async () => {
    if (!whatsappMessage) return;
    try {
      await navigator.clipboard.writeText(whatsappMessage);
    } catch (error) {
      console.error('Unable to copy message:', error);
    }
  };

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-2">
      {/* Soil Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Soil Test Data</CardTitle>
          <CardDescription>
            {farmer
              ? `${farmer.name} · ${farmer.village} · Crop: ${crop}`
              : 'Enter soil test values from the lab report'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="rounded-lg border bg-slate-50 p-3 text-sm">
              <div className="font-medium">OCR Capture Status</div>
              <div className="text-slate-600">
                Confidence: {ocrConfidence}% · Values below 85% should be manually reviewed.
              </div>
            </div>

            <div className="space-y-2">
              <Label>Crop</Label>
              <Input value={crop} onChange={(e) => setCrop(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nitrogen (kg/ha)</label>
                <Input 
                  type="number"
                  step="0.1"
                  {...form.register('nitrogen', { valueAsNumber: true })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phosphorus (kg/ha)</label>
                <Input 
                  type="number"
                  step="0.1"
                  {...form.register('phosphorus', { valueAsNumber: true })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Potassium (kg/ha)</label>
                <Input 
                  type="number"
                  step="0.1"
                  {...form.register('potassium', { valueAsNumber: true })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">pH</label>
                <Input 
                  type="number"
                  step="0.1"
                  {...form.register('ph', { valueAsNumber: true })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">EC (dS/m)</label>
                <Input 
                  type="number"
                  step="0.01"
                  {...form.register('ec', { valueAsNumber: true })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Organic Matter (%)</label>
                <Input 
                  type="number"
                  step="0.1"
                  {...form.register('organic_matter', { valueAsNumber: true })}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Notes</label>
              <Input 
                placeholder="Any additional observations"
                {...form.register('notes')}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Irrigation Override</label>
              <Input
                value={irrigationOverride}
                onChange={(e) => setIrrigationOverride(e.target.value)}
                placeholder="Advisor field observation override"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Generate Recommendation
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recommendation Result */}
      {recommendation && (
        <Card>
          <CardHeader>
            <CardTitle>Fertilizer Recommendation</CardTitle>
            <CardDescription>Cost-optimized based on soil test</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Total Cost (Optimized)</div>
              <div className="text-3xl font-bold">₹{recommendation.total_cost}</div>
              {recommendation.cost_saving > 0 && (
                <div className="text-sm text-green-700 mt-2">
                  💰 Save ₹{recommendation.cost_saving} vs regular recommendation
                </div>
              )}
            </div>

            <div className="rounded-lg border bg-slate-50 p-4">
              <div className="text-sm text-slate-600">Cost Comparison</div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div>Generic recommendation</div>
                <div className="font-medium">₹{genericCost}</div>
                <div>FieldDesk optimized</div>
                <div className="font-medium">₹{recommendation.total_cost}</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Recommended Fertilizers</h3>
              <div className="space-y-2">
                {fertilizerMix.map((fert: any, idx: number) => (
                  <div key={idx} className="flex justify-between p-2 border rounded">
                    <span>{fert.name}</span>
                    <span className="font-medium">{fert.quantity_kg} kg · ₹{fert.total_cost}</span>
                  </div>
                ))}
              </div>
            </div>

            {recommendation.expected_yield_min && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Expected Yield Improvement</div>
                <div className="text-2xl font-bold">
                  {recommendation.expected_yield_min}% - {recommendation.expected_yield_max}%
                </div>
              </div>
            )}

            <div className="rounded-lg border bg-amber-50 p-4 text-sm text-amber-900">
              <div className="font-medium">Weather-aware irrigation guidance</div>
              <div className="mt-1">{irrigationOverride}</div>
            </div>

            {whatsappMessage && (
              <div className="rounded-lg border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="font-medium">WhatsApp Message Preview (Tamil)</div>
                  <Button variant="outline" size="sm" onClick={copyMessage}>
                    <Copy className="mr-1 h-4 w-4" /> Copy
                  </Button>
                </div>
                <pre className="whitespace-pre-wrap text-sm text-slate-700">{whatsappMessage}</pre>
              </div>
            )}

            <Button className="w-full" onClick={sendViaWhatsApp} disabled={isSendingWhatsApp}>
              {isSendingWhatsApp && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Prepare WhatsApp Delivery
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
