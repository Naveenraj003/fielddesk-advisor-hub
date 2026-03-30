import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { mockFarmers, mockRecommendations } from '@/lib/mockData';
import { useDataMode } from '@/contexts/DataModeContext';

interface Farmer {
  id: number;
  name: string;
  village: string;
  status: string;
  primary_crop?: string;
}

interface Recommendation {
  id: number;
  farmer_id: number;
  total_cost: number;
  cost_saving?: number;
  whatsapp_sent: boolean;
  farmer_confirmed: boolean;
  expected_yield_min?: number;
  expected_yield_max?: number;
}

export default function AdvisorInsightsPage() {
  const { isDemo } = useDataMode();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        if (isDemo) {
          setFarmers(mockFarmers as any);
          setRecommendations(mockRecommendations as any);
          setStats({
            total_farmers: mockFarmers.length,
            recommendation_metrics: {
              total_recommendations: mockRecommendations.length,
              whatsapp_delivery_rate: 74,
              farmer_confirmation_rate: 61,
            },
          });
          return;
        }

        const [farmersResp, statsResp] = await Promise.all([
          api.getFarmers(),
          api.getAdvisorStats(1),
        ]);

        const farmersData = farmersResp.data.farmers || [];
        setFarmers(farmersData);
        setStats(statsResp.data);

        const recPromises = farmersData.map((farmer: Farmer) => api.getFarmerRecommendations(farmer.id));
        const recResponses = await Promise.all(recPromises);
        const allRecommendations = recResponses.flatMap((response) => response.data || []);
        setRecommendations(allRecommendations);
      } catch (error) {
        console.error('Error loading advisor insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [isDemo]);

  const metrics = useMemo(() => {
    const recCount = recommendations.length;
    const sent = recommendations.filter((rec) => rec.whatsapp_sent).length;
    const confirmed = recommendations.filter((rec) => rec.farmer_confirmed).length;
    const sentPct = recCount > 0 ? Math.round((sent / recCount) * 100) : 0;
    const confirmedPct = sent > 0 ? Math.round((confirmed / sent) * 100) : 0;

    const avgSaving = recCount > 0
      ? Math.round(recommendations.reduce((sum, rec) => sum + (rec.cost_saving || 0), 0) / recCount)
      : 0;

    const avgYield = recCount > 0
      ? Math.round(
          recommendations.reduce((sum, rec) => sum + ((rec.expected_yield_min || 0) + (rec.expected_yield_max || 0)) / 2, 0) /
            recCount
        )
      : 0;

    return {
      recCount,
      sentPct,
      confirmedPct,
      avgSaving,
      avgYield,
    };
  }, [recommendations]);

  const villageBreakdown = useMemo(() => {
    const counts: Record<string, { total: number; red: number; yellow: number; green: number }> = {};
    for (const farmer of farmers) {
      if (!counts[farmer.village]) {
        counts[farmer.village] = { total: 0, red: 0, yellow: 0, green: 0 };
      }
      counts[farmer.village].total += 1;
      counts[farmer.village][farmer.status as 'red' | 'yellow' | 'green'] += 1;
    }
    return Object.entries(counts).sort((a, b) => b[1].total - a[1].total);
  }, [farmers]);

  const exportCsv = () => {
    const rows = [
      ['farmer_id', 'name', 'village', 'status', 'primary_crop'],
      ...farmers.map((f) => [String(f.id), f.name, f.village, f.status, f.primary_crop || '']),
    ];

    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fielddesk-phase1-portfolio-report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <div className="mx-auto max-w-7xl p-6 text-sm text-slate-500">Loading advisor intelligence...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Advisor Intelligence Layer</h1>
          <p className="text-sm text-slate-600">
            Portfolio performance, recommendation outcomes, and exportable pilot evidence.
          </p>
        </div>
        <Button onClick={exportCsv}>Export Portfolio Report (CSV)</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Farmers Managed</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{stats?.total_farmers ?? farmers.length}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{metrics.recCount}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">WhatsApp Delivery</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{metrics.sentPct}%</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Farmer Confirm Rate</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{metrics.confirmedPct}%</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Cost Saving</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">₹{metrics.avgSaving}</CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Village Portfolio Health</CardTitle>
            <CardDescription>Identify villages requiring immediate intervention.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {villageBreakdown.map(([village, values]) => (
              <div key={village} className="rounded-md border p-3">
                <div className="font-medium">{village}</div>
                <div className="mt-1 text-sm text-slate-600">
                  Total: {values.total} · Red: {values.red} · Yellow: {values.yellow} · Green: {values.green}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>POC Outcome Snapshot</CardTitle>
            <CardDescription>Aligned to Project.md Phase-1 validation metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-md border p-3">
              Recommendation throughput: {metrics.recCount} total generated.
            </div>
            <div className="rounded-md border p-3">
              WhatsApp delivery rate: {metrics.sentPct}% (target &gt; 60%).
            </div>
            <div className="rounded-md border p-3">
              Farmer action confirmations: {metrics.confirmedPct}% of sent messages.
            </div>
            <div className="rounded-md border p-3">
              Estimated average yield improvement: {metrics.avgYield}% (target range 10%-18%).
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
