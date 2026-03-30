import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CloudRain, Droplets, IndianRupee, MessageCircle, Sprout, TriangleAlert, Users } from 'lucide-react';

const kpiData = [
  { title: 'Farmers Managed', value: '842', delta: '+17 this month', icon: Users, tone: 'bg-primary text-primary-foreground' },
  { title: 'Urgent Cases', value: '19', delta: '5 need same-day visit', icon: TriangleAlert, tone: 'bg-red-100 text-red-700' },
  { title: 'Avg Input Saving', value: '₹1,860', delta: 'per acre recommendation', icon: IndianRupee, tone: 'bg-emerald-100 text-emerald-700' },
  { title: 'Adoption Rate', value: '74%', delta: 'farmer follow-through', icon: Sprout, tone: 'bg-amber-100 text-amber-700' },
];

const priorityQueue = [
  { farmer: 'Ravi Kumar', village: 'Palacode', crop: 'Maize', reason: 'Nitrogen critical + no irrigation 4 days', risk: 'red', eta: 'Visit today 4:30 PM' },
  { farmer: 'Priya Devi', village: 'Papireddipatti', crop: 'Groundnut', reason: 'Flowering stage + rain uncertainty', risk: 'red', eta: 'Call in 45 min' },
  { farmer: 'Meena Lakshmi', village: 'Pennagaram', crop: 'Millet', reason: 'Soil test stale (> 24 months)', risk: 'yellow', eta: 'Schedule test tomorrow' },
  { farmer: 'Murugan', village: 'Nallampalli', crop: 'Cotton', reason: 'DAP availability mismatch locally', risk: 'yellow', eta: 'Dealer sync required' },
];

const villageHealth = [
  { village: 'Palacode', green: 34, yellow: 19, red: 8 },
  { village: 'Pennagaram', green: 27, yellow: 22, red: 6 },
  { village: 'Harur', green: 31, yellow: 14, red: 3 },
  { village: 'Morappur', green: 21, yellow: 16, red: 7 },
  { village: 'Nallampalli', green: 26, yellow: 11, red: 2 },
];

const weatherWindow = [
  { day: 'Mon', rain: 72, evap: 4.8, advisory: 'Hold irrigation' },
  { day: 'Tue', rain: 58, evap: 5.1, advisory: 'Light irrigation only' },
  { day: 'Wed', rain: 31, evap: 6.0, advisory: 'Resume drip cycle' },
  { day: 'Thu', rain: 24, evap: 6.3, advisory: 'Irrigate high-risk plots' },
  { day: 'Fri', rain: 65, evap: 4.5, advisory: 'Delay flood irrigation' },
];

interface WeatherItem {
  day: string;
  rain: number;
  evap: number;
  advisory: string;
}

const savingsTrend = [
  { week: 'W1', saving: 1280 },
  { week: 'W2', saving: 1460 },
  { week: 'W3', saving: 1710 },
  { week: 'W4', saving: 1860 },
  { week: 'W5', saving: 1930 },
  { week: 'W6', saving: 2010 },
];

const pocTargets = [
  { label: 'Daily active officer usage', current: 82, target: 100, text: '82 min avg vs 15 min target' },
  { label: 'WhatsApp recommendation delivery', current: 74, target: 80, text: '74% delivered this week' },
  { label: 'Farmer action confirmations', current: 61, target: 70, text: '61% confirmations of sent recs' },
  { label: 'Recommendation change after insight', current: 46, target: 50, text: '46% advisors changed base recommendation' },
];

const riskColor = {
  red: 'bg-red-100 text-red-700 border-red-200',
  yellow: 'bg-amber-100 text-amber-700 border-amber-200',
  green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

export default function FPOCommandCenter() {
  const navigate = useNavigate();
  const [weatherData, setWeatherData] = useState<WeatherItem[]>(weatherWindow);

  const openCase = (farmer: string) => {
    const mapping: Record<string, number> = {
      'Ravi Kumar': 1,
      'Priya Devi': 5,
      'Meena Lakshmi': 2,
      Murugan: 6,
    };
    const id = mapping[farmer] || 1;
    navigate(`/farmer/${id}`);
  };

  const sendAdvisories = () => {
    toast.success('Queued advisories marked for dispatch. Opening advisor intelligence view.');
    navigate('/insights');
  };

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const url =
          'https://api.open-meteo.com/v1/forecast?latitude=12.1165&longitude=78.1582&daily=precipitation_probability_max,et0_fao_evapotranspiration&timezone=auto&forecast_days=5';
        const response = await fetch(url);
        const data = await response.json();
        const times = data?.daily?.time || [];
        const rain = data?.daily?.precipitation_probability_max || [];
        const evap = data?.daily?.et0_fao_evapotranspiration || [];

        if (!times.length) return;

        const converted: WeatherItem[] = times.map((item: string, idx: number) => {
          const day = new Date(item).toLocaleDateString('en-US', { weekday: 'short' });
          const rainPct = Number(rain[idx] ?? 0);
          const evapValue = Number((evap[idx] ?? 0).toFixed(1));
          const advisory = rainPct >= 60 ? 'Hold irrigation' : rainPct >= 35 ? 'Light irrigation only' : 'Resume drip cycle';
          return { day, rain: rainPct, evap: evapValue, advisory };
        });

        setWeatherData(converted);
      } catch (error) {
        console.error('Open-Meteo fetch failed, using mock weather.', error);
      }
    };

    loadWeather();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_10%_10%,#f7f4e8_0,#e6efe2_45%,#d7e6df_100%)]">
      <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />
      <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

      <main className="relative mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="rounded-2xl border border-primary/20 bg-white/80 p-6 backdrop-blur"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary-mid">FPO Officer Command Center</p>
              <h1 className="mt-2 text-3xl font-bold text-primary">Good morning, Senthil</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                You have 19 urgent farmer situations today. Focus first on Palacode and Papireddipatti clusters.
                Current projection: 13.9% yield lift if top priority actions are completed by tonight.
              </p>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary">
              <div className="font-semibold">Today’s Mission</div>
              <div>Visit 6 farms · Call 14 farmers · Dispatch 21 WhatsApp advisories</div>
            </div>
          </div>
        </motion.section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpiData.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
            >
              <Card className="border-white/60 bg-white/85 shadow-sm backdrop-blur">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">{item.title}</p>
                      <p className="mt-2 text-3xl font-bold text-slate-900">{item.value}</p>
                    </div>
                    <div className={`rounded-full p-3 ${item.tone}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-slate-500">{item.delta}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 border-white/70 bg-white/85">
            <CardHeader>
              <CardTitle>Priority Queue - Action First</CardTitle>
              <CardDescription>
                Auto-prioritized list based on nutrient risk, irrigation timing, and stale soil data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {priorityQueue.map((item, i) => (
                <motion.div
                  key={item.farmer}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{item.farmer} · {item.village}</div>
                      <div className="text-xs text-slate-600">{item.crop} · {item.reason}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={riskColor[item.risk as keyof typeof riskColor]}>{item.risk.toUpperCase()}</Badge>
                      <Button size="sm" className="bg-primary hover:bg-primary-mid" onClick={() => openCase(item.farmer)}>
                        Open Case
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-500">Next step: {item.eta}</div>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/70 bg-white/85">
            <CardHeader>
              <CardTitle>WhatsApp Dispatch</CardTitle>
              <CardDescription>Advisor voice with data confidence.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900">
                <div className="mb-1 font-medium">Tamil Preview</div>
                <p>
                  Senthil here. Soil update for Ravi Kumar: use 45 kg Urea + 25 kg DAP per acre.
                  Rain likely in 2 days, delay heavy irrigation.
                </p>
              </div>
              <div className="rounded-lg border p-3 text-slate-600">
                Confidence band: 68% rainfall probability · Recommendation certainty: Medium-High
              </div>
              <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90" onClick={sendAdvisories}>
                <MessageCircle className="mr-2 h-4 w-4" /> Send 21 queued advisories
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="border-white/70 bg-white/85">
            <CardHeader>
              <CardTitle>Village Health Heatboard</CardTitle>
              <CardDescription>Find where intervention pressure is accumulating.</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={villageHealth}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="village" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="green" stackId="a" fill="#4d8f5a" />
                  <Bar dataKey="yellow" stackId="a" fill="#d6a323" />
                  <Bar dataKey="red" stackId="a" fill="#d35b4c" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-white/70 bg-white/85">
            <CardHeader>
              <CardTitle>Input Cost Optimization Trend</CardTitle>
              <CardDescription>Average per-acre saving over recent advisory cycles.</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={savingsTrend}>
                  <defs>
                    <linearGradient id="savingGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2f6f4f" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#2f6f4f" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`₹${value}`, 'Avg saving']} />
                  <Area type="monotone" dataKey="saving" stroke="#2f6f4f" fill="url(#savingGradient)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="border-white/70 bg-white/85">
            <CardHeader>
              <CardTitle>Weather-Aware Irrigation Window</CardTitle>
              <CardDescription>5-day advisory with confidence signals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {weatherData.map((item) => (
                <div key={item.day} className="grid grid-cols-4 items-center rounded-lg border p-3 text-sm">
                  <div className="font-medium text-slate-800">{item.day}</div>
                  <div className="flex items-center gap-1 text-slate-600"><CloudRain className="h-4 w-4" /> {item.rain}%</div>
                  <div className="flex items-center gap-1 text-slate-600"><Droplets className="h-4 w-4" /> ET {item.evap}</div>
                  <div className="text-xs font-medium text-primary">{item.advisory}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-white/70 bg-white/85">
            <CardHeader>
              <CardTitle>POC Success Tracker</CardTitle>
              <CardDescription>Live score against 8-week validation targets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pocTargets.map((target) => (
                <div key={target.label}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-800">{target.label}</span>
                    <span className="text-slate-500">{target.current}%</span>
                  </div>
                  <Progress value={target.current} className="h-2.5" />
                  <div className="mt-1 text-xs text-slate-500">{target.text}</div>
                </div>
              ))}
              <div className="rounded-lg border border-primary/25 bg-primary/5 p-3 text-sm text-primary">
                Week 6 status: POC trajectory is positive. Team should prepare first institutional case-study deck.
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
