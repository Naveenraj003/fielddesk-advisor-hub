import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const teamMembers = [
  { name: 'Naveen Raj', role: 'Lead Developer', focus: 'Full-stack architecture, product integration, and delivery.' },
  { name: 'Arziya Nazirin', role: 'UX and Story Design', focus: 'Onboarding flow, user clarity, and design narratives.' },
  { name: 'Latchana', role: 'Data and Validation', focus: 'Mock datasets, field metrics, and scenario quality checks.' },
  { name: 'Meganathan', role: 'Agronomy Logic Support', focus: 'Soil recommendation structure and farmer workflow alignment.' },
  { name: 'Kabilan', role: 'QA and Operations', focus: 'Journey testing, edge-case validation, and release readiness.' },
];

const realityScenarios = [
  {
    title: 'Scenario 1: Pre-Rain Fertilizer Decision',
    location: 'Palacode Cluster, Dharmapuri',
    example: 'Advisor must decide before rain whether to apply urea now or delay by 48 hours.',
    impact: 'Avoided nutrient washout on 18 acres and prevented repeat application cost.',
    stat: 'Estimated savings: ₹32,400 in one cluster cycle.',
  },
  {
    title: 'Scenario 2: High-Risk Farmer Prioritization',
    location: 'Pennagaram Block',
    example: 'Officer had 47 pending calls; FieldDesk moved 9 critical farmers to top queue.',
    impact: 'Same-day intervention improved expected yield outcome for urgent cases.',
    stat: 'Priority response time reduced by 41%.',
  },
  {
    title: 'Scenario 3: Advisor-Led WhatsApp Action',
    location: 'Harur and Morappur Villages',
    example: 'Localized message sent in advisor tone with timing and fertilizer mix details.',
    impact: 'Farmers acted faster due to trusted source and clear instruction format.',
    stat: 'Action confirmation reached 61% in pilot.',
  },
];

const websiteDataHighlights = [
  { label: 'Farmers Managed per Advisor', value: '500-900' },
  { label: 'Top Priority Review Window', value: '< 15 mins' },
  { label: 'Average Cost Saving per Acre', value: '₹1,800+' },
  { label: 'Pilot Delivery Benchmarks', value: '74% sent / 61% confirmed' },
];

const workflowSteps = [
  {
    title: '1. Portfolio Command Center',
    detail: 'FPO officer sees all farmers with priority flags (green/yellow/red) and daily action queue.',
  },
  {
    title: '2. Soil Intelligence Engine',
    detail: 'Capture soil values, optimize fertilizer cost, and generate yield improvement range.',
  },
  {
    title: '3. WhatsApp Delivery',
    detail: 'Send advisor-branded recommendations in Tamil to farmers with confidence and timing context.',
  },
  {
    title: '4. Advisor Intelligence Layer',
    detail: 'Track recommendation adoption, farmer confirmations, village health and impact metrics.',
  },
];

const scenarioImages = [
  {
    title: 'Officer Field Visit Reality',
    caption: 'One advisor handles hundreds of farmers across scattered villages.',
    image:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Soil-to-Decision Intelligence',
    caption: 'FieldDesk converts soil values into practical cost-optimized actions.',
    image:
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1000&q=80',
  },
  {
    title: 'Trusted Advisor Delivery',
    caption: 'Recommendations are shared in the advisor voice through WhatsApp.',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
  },
];

interface LaunchIntroPageProps {
  onDone?: () => void;
}

export default function LaunchIntroPage({ onDone }: LaunchIntroPageProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);

  useEffect(() => {
    if (step !== 1) return;
    const timer = window.setInterval(() => {
      setActiveScenarioIndex((prev) => (prev + 1) % realityScenarios.length);
    }, 2800);

    return () => window.clearInterval(timer);
  }, [step]);

  const currentTitle = useMemo(() => {
    if (step === 0) return 'Meet the FieldDesk Team';
    if (step === 1) return 'Why FieldDesk Exists';
    return 'FieldDesk Workflow';
  }, [step]);

  const continueFlow = () => {
    if (step < 2) {
      setStep((prev) => prev + 1);
      return;
    }
    if (onDone) {
      onDone();
      return;
    }
    navigate('/portfolio', { replace: true });
  };

  const skipIntro = () => {
    if (onDone) {
      onDone();
      return;
    }
    navigate('/portfolio', { replace: true });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#f4eedf_0,#dbe9df_45%,#cfe0d8_100%)]">
      <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-gold/25 blur-3xl" />
      <div className="absolute right-0 top-36 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

      <section className="relative mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary-mid">FieldDesk</p>
            <h1 className="text-3xl font-bold text-primary sm:text-4xl">{currentTitle}</h1>
          </div>
          <Button variant="outline" onClick={skipIntro}>Skip</Button>
        </div>

        {step === 0 && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, delay: index * 0.18 }}
                className="rounded-xl border border-white/80 bg-white/85 p-5 shadow-sm backdrop-blur"
              >
                <div className="text-xl font-semibold text-slate-800">{member.name}</div>
                <div className="mt-1 text-sm font-medium text-primary">{member.role}</div>
                <div className="mt-2 text-xs text-slate-600">{member.focus}</div>
              </motion.div>
            ))}
          </div>
        )}

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border border-primary/15 bg-white/85 p-7 text-slate-700 shadow-sm">
              <p className="mb-3 text-lg font-semibold text-primary">Built for Agricultural Advisors and FPO Officers</p>
              <p className="mb-2 leading-relaxed">
                FieldDesk was created because extension officers and FPO agronomists manage hundreds of farmers with limited tools.
                The platform replaces memory, guesswork, and fragmented sheets with a single decision workspace.
              </p>
              <p className="leading-relaxed">
                It is designed for users with maximum leverage: Extension Officers, FPO Agronomists, and Input Advisors.
                Farmers benefit through trusted advisor communication, especially via WhatsApp in their local language.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-xl border border-white/80 bg-white/85 p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-widest text-primary-mid">Running Real-World Scenario</div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeScenarioIndex}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -18 }}
                    transition={{ duration: 0.35 }}
                    className="rounded-lg border border-primary/15 bg-primary/5 p-4"
                  >
                    <div className="text-sm font-semibold text-primary">{realityScenarios[activeScenarioIndex].title}</div>
                    <div className="mt-1 text-xs text-slate-500">{realityScenarios[activeScenarioIndex].location}</div>
                    <div className="mt-2 text-sm text-slate-700">{realityScenarios[activeScenarioIndex].example}</div>
                    <div className="mt-2 text-sm text-slate-700">{realityScenarios[activeScenarioIndex].impact}</div>
                    <div className="mt-2 text-sm font-medium text-emerald-700">{realityScenarios[activeScenarioIndex].stat}</div>
                  </motion.div>
                </AnimatePresence>
                <div className="flex flex-wrap gap-2">
                  {realityScenarios.map((item, idx) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setActiveScenarioIndex(idx)}
                      className={`rounded-full px-3 py-1 text-xs ${activeScenarioIndex === idx ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {websiteDataHighlights.map((item) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl border border-white/80 bg-white/90 p-4 shadow-sm"
                  >
                    <div className="text-xs text-slate-500">{item.label}</div>
                    <div className="mt-1 text-lg font-semibold text-primary">{item.value}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            {workflowSteps.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: index * 0.14 }}
                className="rounded-xl border border-white/80 bg-white/85 p-5 shadow-sm"
              >
                <h3 className="text-base font-semibold text-primary">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-700">{item.detail}</p>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8 flex justify-end">
          {step > 0 && (
            <Button variant="outline" className="mr-2" onClick={() => setStep((prev) => Math.max(prev - 1, 0))}>
              Back
            </Button>
          )}
          {step === 2 && (
            <>
              <Button variant="outline" className="mr-2" onClick={() => navigate('/portfolio')}>
                Command Center
              </Button>
              <Button variant="outline" className="mr-2" onClick={() => navigate('/portfolio-live')}>
                Portfolio Live
              </Button>
              <Button variant="outline" className="mr-2" onClick={() => navigate('/insights')}>
                Advisor Insights
              </Button>
            </>
          )}
          <Button className="bg-primary hover:bg-primary-mid" onClick={continueFlow}>
            {step < 2 ? 'Continue' : 'Enter FieldDesk'}
          </Button>
        </div>
      </section>
    </main>
  );
}
