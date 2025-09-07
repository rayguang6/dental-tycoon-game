import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { CheckCircle2, AlertTriangle, Users, Zap, Trophy, Share2, RefreshCw, Sparkles } from "lucide-react";

/**
 * Dental Clinic Tycoon — Viral Web Game (Single‑file React)
 * ---------------------------------------------------------
 * NOW with Cashflow elements (inspired by Kiyosaki):
 * - Assets & Liabilities, Passive Income vs Expenses, Debt paydown
 * - Small/Big Deals, Doodads (surprise expenses), Net Worth
 * - Win condition: Passive Income ≥ Daily Expenses (Escape the Rat Race)
 *
 * Plus Visual & Animation pass for Waiting + Treatment.
 * Tech: Tailwind + shadcn/ui. Saves to localStorage.
 */

// ---------------- Constants & Data ----------------
const currency = (n) => `$${Math.round(n).toLocaleString()}`;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const DAY_SECONDS = 90; // one in‑game day lasts 90s
const TICK_MS = 1000;   // engine tick

const PATIENT_TYPES = [
  { id: "checkup",   name: "Checkup",          emoji: "🪥", baseTime: 10, revenue: 60,  patience: 25, hygieneCost: 3 },
  { id: "scaling",   name: "Scaling",          emoji: "🫧", baseTime: 14, revenue: 140, patience: 28, hygieneCost: 6 },
  { id: "filling",   name: "Filling",          emoji: "🧱", baseTime: 16, revenue: 180, patience: 22, hygieneCost: 8 },
  { id: "whitening", name: "Whitening",        emoji: "✨", baseTime: 18, revenue: 260, patience: 20, hygieneCost: 9 },
  { id: "braces",    name: "Braces Consult",   emoji: "😬", baseTime: 20, revenue: 320, patience: 18, hygieneCost: 5 },
];

// Cashflow Catalogs
const SMALL_DEALS = [
  { id:"membership", name:"Dental Membership Plan", cost: 300, cashflow: 18, desc:"Sell in‑clinic membership; recurring income.", emoji:"📘" },
  { id:"newsletter", name:"Local Newsletter Ad", cost: 150, cashflow: 8, desc:"Cheap ad, steady trickle.", emoji:"📰" },
  { id:"refprog", name:"Referral Cards", cost: 120, cashflow: 10, desc:"Happy patients invite friends.", emoji:"🎟️" },
];
const BIG_DEALS = [
  { id:"room_sublet", name:"Sublet Spare Room", down: 1000, loan: 2000, rate: 0.08, cashflow: 55, desc:"Rent out to a hygienist 2 days/week.", emoji:"🏢" },
  { id:"whiten_kiosk", name:"Whitening Kiosk", down: 1200, loan: 1800, rate: 0.1, cashflow: 70, desc:"Kiosk share inside mall.", emoji:"🛒" },
  { id:"aligner_partnership", name:"Aligner Partnership", down: 1500, loan: 2500, rate: 0.09, cashflow: 85, desc:"Rev‑share with ortho partner.", emoji:"🧩" },
];
const DOODADS = [
  { id:"autoclave", name:"Autoclave Repair", cost: 420, desc:"Unexpected breakdown.", emoji:"🛠️" },
  { id:"chair_fix", name:"Chair Hydraulics", cost: 260, desc:"Leaky piston.", emoji:"🪛" },
  { id:"aircon", name:"Air‑Con Service", cost: 180, desc:"Clinic too warm.", emoji:"❄️" },
];

const ACHIEVEMENTS = [
  { id: "served_25", name: "Served 25 Patients", cond: (s) => s.stats.patientsServed >= 25, icon: "🎉" },
  { id: "rep_50",    name: "Reputation 50",     cond: (s) => s.reputation >= 50, icon: "⭐" },
  { id: "cash_10k",  name: "$10k Cash Banked",  cond: (s) => s.cash >= 10000, icon: "💰" },
  { id: "clean_freak", name: "Clean Freak",      cond: (s) => s.bestHygiene >= 95, icon: "🧽" },
  { id: "day_7",     name: "Week One Survivor", cond: (s) => s.day >= 7, icon: "📅" },
  { id: "escape_rat", name: "Escaped the Rat Race", cond: (s)=> dailyPassive(s) >= dailyFixedExpenses(s), icon: "🚀" },
];

const BASE_STATE = {
  clinicName: "Smileworks Dental",
  day: 1,
  tick: 0,
  cash: 800,
  reputation: 0,
  hygiene: 80,
  bestHygiene: 80,
  queue: [], // waiting patients
  treatments: [], // active: {id, srcId, typeId, remaining, total, emoji, revenue, name}
  chairs: 1,
  dentists: 1,
  assistants: 0,
  receptionist: 0,
  marketingLevel: 0,
  promoTicksLeft: 0,
  powerOutTicksLeft: 0,
  autoAssign: true,
  upgrades: {},
  // Cashflow layer
  assets: [],        // [{id,name,emoji,cashflow,worth}]
  liabilities: [],   // [{id,name,emoji,balance,rate}]
  logs: ["Welcome! Run your clinic, build assets, escape the rat race."],
  achievements: {},
  stats: { patientsServed: 0, patientsLost: 0, bestQueue: 0, totalRevenue: 0 },
};

const UPGRADE_SHOP = [
  { id: "chair",        name: "+1 Chair", desc: "Add a treatment chair.",       baseCost: 600,  max: 5 },
  { id: "dentist",      name: "+1 Dentist", desc: "Treat more patients in parallel.", baseCost: 900,  max: 4 },
  { id: "assistant",    name: "+1 Assistant", desc: "Faster treatments (15% / assistant).", baseCost: 400,  max: 4 },
  { id: "reception",    name: "Receptionist", desc: "Queue patience drains slower.", baseCost: 550,  max: 1 },
  { id: "marketing",    name: "Marketing Level", desc: "More patient arrivals.", baseCost: 500, max: 5 },
  { id: "kids",         name: "Kids Corner & TV", desc: "-20% queue stress.", baseCost: 450, max: 1 },
  { id: "sterilizer",   name: "Pro Sterilizer", desc: "-30% hygiene loss per treatment.", baseCost: 700, max: 1 },
  { id: "generator",    name: "Backup Generator", desc: "Ignore power outages.", baseCost: 800, max: 1 },
  { id: "crm",          name: "Simple CRM (soft AI)", desc: "+1 rep per success & +1 referral / day.", baseCost: 650, max: 1 },
];

// --------------- Storage & Normalization ---------------
const normalize = (s) => ({
  ...BASE_STATE,
  ...s,
  upgrades: s?.upgrades || {},
  achievements: s?.achievements || {},
  stats: s?.stats || { patientsServed: 0, patientsLost: 0, bestQueue: 0, totalRevenue: 0 },
  assets: Array.isArray(s?.assets) ? s.assets : [],
  liabilities: Array.isArray(s?.liabilities) ? s.liabilities : [],
  queue: Array.isArray(s?.queue) ? s.queue : [],
  treatments: Array.isArray(s?.treatments) ? s.treatments : [],
});

const load = () => {
  try {
    const raw = localStorage.getItem("dental-clinic-tycoon");
    if (!raw) return { ...BASE_STATE };
    const parsed = JSON.parse(raw);
    return normalize(parsed);
  } catch {
    return { ...BASE_STATE };
  }
};
const save = (s) => { try { localStorage.setItem("dental-clinic-tycoon", JSON.stringify(s)); } catch {} };

// --------------- Helpers ---------------
const uid = () => Math.random().toString(36).slice(2);
const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];

function arrivalRate(state) {
  const base = 0.35; // ~35% chance per second
  const marketingBoost = state.marketingLevel * 0.18;
  const repBoost = clamp(state.reputation, -50, 150) / 200; // -0.25..0.75
  const promoBoost = state.promoTicksLeft > 0 ? 0.6 : 0;
  const hygienePenalty = state.hygiene < 50 ? -0.1 : 0;
  return clamp(base + marketingBoost + repBoost + promoBoost + hygienePenalty, 0.05, 1);
}

function patienceDecayPerSec(state) {
  let decay = 1;
  if (state.queue.length > 2) decay += (state.queue.length - 2) * 0.25; // stress from long lines
  if (state.receptionist > 0) decay *= 0.85; // receptionist soothes
  if (state.upgrades.kids) decay *= 0.8; // kids corner
  return decay;
}

function treatmentSpeed(state) {
  const helpers = Math.min(state.assistants, state.dentists);
  return 1 + helpers * 0.15; // each assistant speeds up one dentist ~15%
}

function hygieneLossFor(typeId, state) {
  const t = PATIENT_TYPES.find((x) => x.id === typeId);
  const base = t?.hygieneCost ?? 5;
  return Math.round(base * (state.upgrades.sterilizer ? 0.7 : 1));
}

function addLog(s, msg) {
  const logs = [msg, ...s.logs].slice(0, 8);
  return { ...s, logs };
}

function costForUpgrade(id, currentCount) {
  const cfg = UPGRADE_SHOP.find((u) => u.id === id);
  if (!cfg) return Infinity;
  const step = currentCount || 0;
  // gentle exponential growth
  return Math.round(cfg.baseCost * Math.pow(1.35, step));
}

function moodFrom(pct) {
  if (pct >= 0.7) return "happy";
  if (pct >= 0.35) return "neutral";
  return "angry";
}

// Cashflow math (hardened for old saves)
function dailyFixedExpenses(s){
  const rent = 120; // from endOfDay
  const salary = (s.dentists || 0) * 120 + (s.assistants || 0) * 60 + (s.receptionist || 0) * 50;
  const marketingSpend = (s.marketingLevel || 0) * 50;
  const loansDaily = (s.liabilities || []).reduce((a,l)=> a + Math.ceil(((l.balance||0) * (l.rate||0))/30), 0);
  return Math.max(0, Math.round((rent + salary + marketingSpend)/30) + loansDaily);
}
function dailyPassive(s){
  const assetDaily = (s.assets || []).reduce((a,x)=> a + Math.round((x.cashflow||0)/30), 0);
  return assetDaily;
}

// --------------- Component ---------------
export default function DentalClinicTycoon() {
  const [state, setState] = useState(load);

  const maxParallel = useMemo(() => Math.min(state.chairs, state.dentists), [state.chairs, state.dentists]);
  const speed = useMemo(() => treatmentSpeed(state), [state.assistants, state.dentists]);

  // Engine tick
  useEffect(() => {
    const id = setInterval(() => {
      setState((prev) => engineTick(normalize(prev)));
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  // Save
  useEffect(() => { save(state); }, [state]);

  // -------------- UI Actions --------------
  const reset = () => setState({ ...BASE_STATE, clinicName: state.clinicName });
  const assignNext = () => setState((s) => manualAssign(s));
  const clean = () => setState((s) => cleanClinic(s));
  const startPromo = () => setState((s) => startWhiteningPromo(s));
  const buy = (id) => setState((s) => purchaseUpgrade(s, id));
  const smallDeal = () => setState((s)=> takeSmallDeal(s));
  const bigDeal = () => setState((s)=> takeBigDeal(s));
  const payDebt = () => setState((s)=> payDownDebt(s));
  const share = async () => {
    const text = `I grew ${state.clinicName} to ${currency(state.cash)} cash, rep ${state.reputation}, day ${state.day} in Dental Clinic Tycoon. Can you beat me?`;
    try {
      if (navigator.share) { await navigator.share({ title: "Dental Clinic Tycoon", text }); }
      else { await navigator.clipboard.writeText(text); alert("Copied share text to clipboard!"); }
    } catch {}
  };

  const escaped = dailyPassive(state) >= dailyFixedExpenses(state);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-50 to-indigo-50 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dental Clinic Tycoon</h1>
            <p className="text-slate-600">Day {state.day} • Keep patients happy, stay clean, build assets.</p>
            {escaped && <div className="mt-1 rounded bg-emerald-100 px-2 py-1 text-sm text-emerald-700">🚀 You escaped the rat race! Passive income covers daily expenses.</div>}
          </div>
          <div className="flex items-center gap-2">
            <Input value={state.clinicName} onChange={(e) => setState({ ...state, clinicName: e.target.value })} className="w-64"/>
            <Button variant="outline" onClick={reset} className="gap-2"><RefreshCw className="h-4 w-4"/>Reset</Button>
            <Button onClick={share} className="gap-2"><Share2 className="h-4 w-4"/>Share</Button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid gap-4 md:grid-cols-5">
          <KPI title="Cash" value={currency(state.cash)} />
          <KPI title="Reputation" value={state.reputation} />
          <KPI title="Hygiene" value={<Hygiene value={state.hygiene} />} />
          <KPI title="Queue" value={`${state.queue.length}`} />
          <KPI title="Served" value={state.stats.patientsServed} />
        </div>

        <Tabs defaultValue="clinic" className="space-y-4">
          <TabsList>
            <TabsTrigger value="clinic" className="gap-2"><Zap className="h-4 w-4"/>Clinic</TabsTrigger>
            <TabsTrigger value="cashflow" className="gap-2"><Sparkles className="h-4 w-4"/>Cashflow</TabsTrigger>
            <TabsTrigger value="upgrades" className="gap-2"><Users className="h-4 w-4"/>Upgrades & Staff</TabsTrigger>
            <TabsTrigger value="achv" className="gap-2"><Trophy className="h-4 w-4"/>Achievements</TabsTrigger>
          </TabsList>

          {/* Clinic Tab */}
          <TabsContent value="clinic">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Queue & Actions + Visual Floor */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Patient Queue</span>
                    <span className="text-sm font-normal text-slate-500">Auto‑assign: {state.autoAssign ? "On" : "Off"}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Button onClick={assignNext} disabled={state.queue.length === 0} className="gap-2">Assign Next</Button>
                    <Button variant="outline" onClick={() => setState({ ...state, autoAssign: !state.autoAssign })}>
                      Toggle Auto‑Assign
                    </Button>
                    <Button variant="secondary" onClick={clean} className="gap-2"><Sparkles className="h-4 w-4"/>Clean (+15 Hygiene)</Button>
                    <Button onClick={startPromo} disabled={state.promoTicksLeft > 0 || state.cash < 150} className="gap-2">Run Whitening Promo ($150)</Button>
                  </div>

                  {/* Visual Clinic Floor (Waiting + Treatment) */}
                  <VisualClinic state={state} />

                  {/* (Optional) Text list under visuals */}
                  <div className="grid gap-2">
                    {state.queue.length === 0 && (
                      <div className="rounded-xl border bg-white p-4 text-sm text-slate-600">No one waiting. Marketing and reputation bring more patients.</div>
                    )}
                    {state.queue.map((p) => (
                      <div key={p.id} className="flex items-center justify-between rounded-xl border bg-white p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{p.emoji}</span>
                          <div>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-xs text-slate-500">Patience</div>
                            <Progress value={(p.patience / p.maxPatience) * 100} className="h-2 w-40"/>
                          </div>
                        </div>
                        <Badge variant="secondary">${p.revenue}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Active Treatments (text) */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Treatments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-slate-600">Capacity: {state.treatments.length}/{maxParallel} (chairs {state.chairs} • dentists {state.dentists})</div>
                  <div className="grid gap-2">
                    {state.treatments.length === 0 && (
                      <div className="rounded-xl border bg-white p-4 text-sm text-slate-600">No ongoing treatments. Assign a patient.</div>
                    )}
                    {state.treatments.map((t) => (
                      <div key={t.id} className="rounded-xl border bg-white p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{t.emoji}</span>
                            <div>
                              <div className="font-medium">{t.name}</div>
                              <div className="text-xs text-slate-500">Time left</div>
                              <Progress value={(1 - t.remaining / t.total) * 100} className="h-2 w-40"/>
                            </div>
                          </div>
                          <Badge>{currency(t.revenue)}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Logs */}
                  <div className="mt-4 rounded-xl border bg-white p-3">
                    <div className="mb-2 text-sm font-medium text-slate-700">Events</div>
                    <ul className="space-y-1 text-sm text-slate-600">
                      {state.logs.map((l, i) => (
                        <li key={i} className="flex items-start gap-2">
                          {l.startsWith("!") ? <AlertTriangle className="mt-0.5 h-4 w-4"/> : <CheckCircle2 className="mt-0.5 h-4 w-4"/>}
                          <span>{l.replace(/^!\s*/, "")}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cashflow Tab */}
          <TabsContent value="cashflow">
            <div className="grid gap-4 md:grid-cols-3">
              {/* Snapshot */}
              <Card>
                <CardHeader>
                  <CardTitle>Cashflow Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-700">
                  <div className="flex items-center justify-between"><span>Passive Income (daily)</span><span className="font-semibold text-emerald-600">{currency(dailyPassive(state))}</span></div>
                  <div className="flex items-center justify-between"><span>Fixed Expenses (daily)</span><span className="font-semibold text-rose-600">{currency(dailyFixedExpenses(state))}</span></div>
                  <Progress value={Math.min(100, (dailyPassive(state)/Math.max(1,dailyFixedExpenses(state)))*100)} />
                  <div className="text-xs text-slate-500">Goal: Passive Income ≥ Fixed Expenses to escape the rat race.</div>
                  <div className="pt-2">
                    <Button onClick={smallDeal} className="mr-2">Draw Small Deal</Button>
                    <Button variant="outline" onClick={bigDeal}>Draw Big Deal</Button>
                  </div>
                  {(state.liabilities?.length ?? 0)>0 && (
                    <div className="pt-2">
                      <Button variant="secondary" onClick={payDebt}>Pay Down Debt ($200)</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Assets */}
              <Card>
                <CardHeader>
                  <CardTitle>Assets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-700">
                  {(state.assets?.length ?? 0)===0 && <div className="rounded border bg-white p-2 text-slate-500">No assets yet. Try Small/Big Deals.</div>}
                  {(state.assets||[]).map((a)=> (
                    <div key={a.id} className="flex items-center justify-between rounded border bg-white p-2"><span>{a.emoji} {a.name}</span><span className="text-emerald-600">+{currency(Math.round((a.cashflow||0)/30))}/day</span></div>
                  ))}
                </CardContent>
              </Card>

              {/* Liabilities */}
              <Card>
                <CardHeader>
                  <CardTitle>Liabilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-slate-700">
                  {(state.liabilities?.length ?? 0)===0 && <div className="rounded border bg-white p-2 text-slate-500">No liabilities.</div>}
                  {(state.liabilities||[]).map((l)=> (
                    <div key={l.id} className="flex items-center justify-between rounded border bg-white p-2">
                      <div><span className="mr-1">💸</span>{l.name}<div className="text-xs text-slate-500">Balance {currency(l.balance)} • Rate {Math.round((l.rate||0)*100)}%</div></div>
                      <div className="text-rose-600">-{currency(Math.ceil(((l.balance||0)*(l.rate||0))/30))}/day</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Upgrades Tab */}
          <TabsContent value="upgrades">
            <div className="grid gap-4 md:grid-cols-3">
              {UPGRADE_SHOP.map((u) => (
                <UpgradeCard key={u.id} u={u} state={state} buy={buy} />
              ))}
            </div>
          </TabsContent>

          {/* Achievements */}
          <TabsContent value="achv">
            <div className="grid gap-4 md:grid-cols-3">
              {ACHIEVEMENTS.map((a) => (
                <Card key={a.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">{a.icon} {a.name}</span>
                      {state.achievements[a.id] ? <Badge className="bg-green-600">Unlocked</Badge> : <Badge variant="secondary">Locked</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-slate-600">
                    {achievementHint(a.id)}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Soft CTA */}
        <div className="rounded-2xl border bg-white p-4 text-center text-sm text-slate-600">
          Love optimizing systems? That’s what we do for real businesses too. When you’re ready, check out the <span className="font-semibold">Internet Income Masterclass</span>.
        </div>
      </div>
    </div>
  );
}

// ---------- Visual Floor (Waiting + Treatment) ----------
function VisualClinic({ state }){
  const [escorts, setEscorts] = useState([]); // {id, emoji, y}
  const [fx, setFx] = useState([]);           // {id, x, y, glyph, ttl}
  const prevTreatSrcIds = useRef([]);

  // Detect new treatments to trigger escort animation
  useEffect(() => {
    const srcIds = state.treatments.map(t => t.srcId).filter(Boolean);
    const prev = prevTreatSrcIds.current;
    const added = srcIds.filter(id => !prev.includes(id));
    if (added.length){
      const addId = added[0];
      const t = state.treatments.find(x => x.srcId === addId);
      const emoji = t?.emoji || "🧑";
      setEscorts(es => [...es, { id: uid(), emoji, y: 30 }]);
      setTimeout(() => setEscorts(es => es.slice(1)), 700);
    }
    prevTreatSrcIds.current = srcIds;
  }, [state.treatments]);

  // Sparkles when a treatment finishes (detect drop in total remaining time)
  const totalRemaining = state.treatments.reduce((a,b)=>a+(b.remaining||0),0);
  const prevRemain = useRef(totalRemaining);
  useEffect(()=>{
    if (prevRemain.current > totalRemaining){
      // completion likely occurred
      for (let i=0;i<2;i++) setFx(f => [...f, { id: uid(), glyph: "✨", x: 82+Math.random()*12, y: 40+Math.random()*60, ttl: 6 }]);
    }
    prevRemain.current = totalRemaining;
  }, [totalRemaining]);

  // Fade out FX
  useEffect(()=>{
    const id = setInterval(()=>{
      setFx(items => items.map(e=>({...e, ttl:e.ttl-1})).filter(e=>e.ttl>0));
    }, 250);
    return ()=> clearInterval(id);
  },[]);

  return (
    <div className="rounded-2xl border bg-white/60 p-3">
      {/* keyframes */}
      <style>{`
        @keyframes breath{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}
        @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-1.5px)}75%{transform:translateX(1.5px)}}
        @keyframes escort{from{transform:translateX(0)}to{transform:translateX(140px)}}
        @keyframes lamp{0%,100%{opacity:.55}50%{opacity:1}}
        @keyframes popin{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.06);opacity:1}100%{transform:scale(1)}}
        .breath{animation:breath 1.6s ease-in-out infinite}
        .shake{animation:shake .45s linear infinite}
        .escort{animation:escort .65s ease-in-out forwards}
        .lamp{animation:lamp 1.2s ease-in-out infinite}
        .pop{animation:popin .28s ease-out}
      `}</style>

      <div className="grid gap-3 md:grid-cols-2">
        {/* Waiting Panel */}
        <div className="relative rounded-xl bg-gradient-to-b from-amber-50 to-amber-100/50 p-3 shadow-inner">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-600">
            <span className="font-medium">Waiting Area</span>
            <span className="rounded bg-slate-800 px-1 text-[10px] text-white">{state.queue.length} waiting</span>
          </div>
          <div className="absolute inset-x-3 bottom-3 grid grid-cols-1 gap-2 opacity-40">
            {Array.from({length:8}).map((_,i)=> (<div key={i} className="h-[3px] rounded bg-amber-200"/>))}
          </div>
          <div className="flex min-h-[220px] flex-col gap-3">
            {state.queue.map((p, idx) => {
              const pct = Math.max(0, p.patience / p.maxPatience);
              const mood = moodFrom(pct);
              const barColor = pct < 0.2 ? 'bg-rose-500' : pct < 0.4 ? 'bg-amber-500' : 'bg-emerald-500';
              return (
                <div key={p.id} className="relative flex items-center gap-3 pop">
                  <Sprite emoji={p.emoji} mood={mood} anim={mood==='angry'?'shake':'breath'} />
                  <div className="flex-1">
                    <div className="h-2 w-full overflow-hidden rounded bg-white/60">
                      <div className={`h-full ${barColor}`} style={{ width: `${pct*100}%` }} />
                    </div>
                  </div>
                  <Badge variant="secondary">${p.revenue}</Badge>
                </div>
              );
            })}
          </div>

          {/* escort overlay */}
          {escorts.map(e => (
            <Sprite key={e.id} emoji={e.emoji} mood="neutral" anim="escort" style={{ position:'absolute', left: 120, top: e.y }} />
          ))}
        </div>

        {/* Treatment Panel */}
        <div className="relative rounded-xl bg-gradient-to-b from-emerald-50 to-emerald-100/50 p-3 shadow-inner">
          <div className="mb-2 flex items-center justify-between text-xs text-slate-600">
            <span className="font-medium">Treatment</span>
            <span className="text-[10px]">Chairs {state.chairs} • Dentists {state.dentists}</span>
          </div>
          <div className="grid min-h-[220px] grid-cols-1 gap-3">
            {Array.from({length: state.chairs}).map((_,i)=>{
              const t = state.treatments[i];
              return (
                <div key={i} className="relative flex h-[96px] items-center gap-3 rounded-xl border bg-white/70 p-3 shadow">
                  <div className="grid h-full w-12 place-items-center rounded-lg bg-slate-100 text-slate-500">🪑</div>
                  {t ? (
                    <>
                      <Sprite emoji={t.emoji} mood="happy" anim="breath" treating />
                      <div className="ml-2 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-full overflow-hidden rounded bg-slate-200">
                            <div className="h-full bg-emerald-500" style={{ width: `${(1 - t.remaining / t.total) * 100}%` }} />
                          </div>
                          <span className="lamp text-[12px]">💡</span>
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500">{t.name}</div>
                      </div>
                    </>
                  ) : (
                    <div className="text-[11px] text-slate-400">Empty Chair</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* chair-side FX */}
          {fx.map(f => (
            <div key={f.id} className="pointer-events-none absolute text-[16px]" style={{ left: f.x, top: f.y }}>{f.glyph}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Sprite({ mood='neutral', emoji='🧑', anim='none', treating=false, style }){
  const moodIcon = mood === 'happy' ? '🙂' : mood === 'neutral' ? '😐' : '😡';
  const bubbleBg = mood === 'happy' ? 'bg-emerald-500' : mood === 'neutral' ? 'bg-amber-500' : 'bg-rose-600';
  const animClass = anim==='breath' ? 'breath' : anim==='shake' ? 'shake' : anim==='escort' ? 'escort' : '';
  return (
    <div className={`relative ${animClass}`} style={style}>
      <div className={`absolute -top-4 left-7 h-5 min-w-5 rounded-full px-1 text-xs text-white ${bubbleBg} shadow`}>{moodIcon}</div>
      <div className={`grid h-12 w-12 place-items-center rounded-full ${treating?'bg-emerald-100':'bg-white'} shadow-lg`}>{emoji}</div>
    </div>
  );
}

// ---------------- Subcomponents ----------------
function KPI({ title, value }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent className="text-2xl font-semibold">{value}</CardContent>
    </Card>
  );
}
function Hygiene({ value }) {
  return (
    <div className="flex items-center gap-2">
      <Progress value={value} className="h-2 w-24"/>
      <span className="text-sm tabular-nums">{value}</span>
    </div>
  );
}
function UpgradeCard({ u, state, buy }) {
  const count = getCount(state, u.id);
  const maxed = u.max !== undefined && count >= u.max;
  const cost = costForUpgrade(u.id, count);
  return (
    <Card className={maxed ? "opacity-80" : ""}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{u.name}</span>
          {maxed ? <Badge>Max</Badge> : <Badge variant="secondary">{currency(cost)}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-slate-600">{u.desc}</div>
        <Button className="w-full" disabled={maxed || state.cash < cost} onClick={() => buy(u.id)}>
          {maxed ? "Purchased" : `Buy for ${currency(cost)}`}
        </Button>
      </CardContent>
    </Card>
  );
}

// ---------------- Engine ----------------
function engineTick(prev) {
  let s = normalize(prev);

  // end of day?
  if ((s.tick + 1) % DAY_SECONDS === 0) {
    s = endOfDay(s);
  }

  // promo & outages countdown
  if (s.promoTicksLeft > 0) s.promoTicksLeft -= 1;
  if (s.powerOutTicksLeft > 0) s.powerOutTicksLeft -= 1;

  // random daily event chance (only once per ~20s)
  if (s.tick % 20 === 0) s = maybeRandomEvent(s);

  // patient arrival
  if (Math.random() < arrivalRate(s)) {
    s = spawnPatient(s);
  }

  // patience decay
  const decay = patienceDecayPerSec(s);
  s.queue = s.queue.map((p) => ({ ...p, patience: p.patience - decay }));
  const stayed = [];
  for (const p of s.queue) {
    if (p.patience <= 0) {
      s = addLog(s, "! A patient left angry. -1 reputation");
      s.reputation = Math.max(-50, s.reputation - 1);
      s.stats.patientsLost += 1;
    } else stayed.push(p);
  }
  s.queue = stayed;
  s.stats.bestQueue = Math.max(s.stats.bestQueue, s.queue.length);

  // auto-assign
  if (s.autoAssign) s = manualAssign(s);

  // progress treatments
  if (s.powerOutTicksLeft === 0) {
    const speed = treatmentSpeed(s);
    for (const t of s.treatments) {
      t.remaining -= speed; // faster with assistants
    }
  }
  const finished = [];
  const ongoing = [];
  for (const t of s.treatments) {
    if (t.remaining <= 0) finished.push(t); else ongoing.push(t);
  }
  s.treatments = ongoing;
  for (const t of finished) {
    s.cash += t.revenue;
    s.reputation += 1 + (s.upgrades.crm ? 1 : 0);
    s.stats.patientsServed += 1;
    s.stats.totalRevenue += t.revenue;
    s.hygiene = clamp(s.hygiene - hygieneLossFor(t.typeId, s), 0, 100);
    s.bestHygiene = Math.max(s.bestHygiene, s.hygiene);
    s = addLog(s, `Treated ${t.name}. +${currency(t.revenue)}`);
  }

  // achievement checks
  for (const a of ACHIEVEMENTS) {
    if (!s.achievements[a.id] && a.cond(s)) s.achievements[a.id] = true;
  }

  s.tick += 1;
  return s;
}

function spawnPatient(s) {
  const t = choice(PATIENT_TYPES);
  const p = {
    id: uid(),
    typeId: t.id,
    name: t.name,
    emoji: t.emoji,
    revenue: t.revenue,
    patience: t.patience,
    maxPatience: t.patience,
    baseTime: t.baseTime,
    born: Date.now(),
  };
  s.queue = [...s.queue, p];
  return s;
}

function manualAssign(s) {
  // cannot exceed capacity
  const capacity = Math.min(s.chairs, s.dentists);
  if (s.treatments.length >= capacity) return s;
  if (s.queue.length === 0) return s;
  // take first patient in queue
  const [p, ...rest] = s.queue;
  s.queue = rest;
  const total = p.baseTime;
  s.treatments = [...s.treatments, { id: uid(), srcId: p.id, typeId: p.typeId, name: p.name, emoji: p.emoji, revenue: p.revenue, total, remaining: total }];
  return s;
}

function cleanClinic(s) {
  const gain = 15;
  const cost = 10;
  if (s.cash < cost) return addLog(s, "! Not enough cash to buy cleaning supplies.");
  s.cash -= cost;
  s.hygiene = clamp(s.hygiene + gain, 0, 100);
  return addLog(s, `Clinic cleaned. +${gain} hygiene (${currency(cost)} supplies)`);
}

function startWhiteningPromo(s) {
  const cost = 150;
  if (s.cash < cost) return addLog(s, "! Not enough cash for promo.");
  s.cash -= cost;
  s.promoTicksLeft = 30; // 30s burst
  return addLog(s, "Whitening promo launched! Patient arrivals surging for 30s.");
}

function endOfDay(prev) {
  let s = normalize(prev);
  s.day += 1;

  // Passive income daily credit
  const passive = dailyPassive(s);
  if (passive>0){ s.cash += passive; s = addLog(s, `Passive income credited: +${currency(passive)}.`); }

  // daily costs (portion of monthly)
  const fixed = dailyFixedExpenses(s);
  s.cash -= fixed;

  // CRM referrals
  if (s.upgrades.crm) {
    s.queue = [...s.queue, ...Array.from({ length: 1 }, () => (
      { id: uid(), typeId: "checkup", name: "Referral Checkup", emoji: "🪥", revenue: 70, patience: 25, maxPatience: 25, baseTime: 9, born: Date.now() }
    ))];
    s = addLog(s, "CRM brought a referral patient.");
  }

  s = addLog(s, `End of Day: -${currency(fixed)} fixed costs | +${currency(passive)} passive.`);
  if (s.cash < -500) {
    s = addLog(s, "! You are deep in debt. Consider restarting or cutting costs.");
  }
  return s;
}

function maybeRandomEvent(prev) {
  let s = normalize(prev);
  // 35% chance of some event
  if (Math.random() > 0.35) return s;
  const options = ["inspection", "kid", "doodad"];
  if (!s.upgrades.generator) options.push("power");
  const e = choice(options);

  if (e === "inspection") {
    if (s.hygiene >= 70) { s.cash += 150; s.reputation += 5; s = addLog(s, "Inspection passed! +$150, +5 rep."); }
    else { s.cash -= 200; s.reputation -= 8; s = addLog(s, "! Inspection failed. -$200, -8 rep."); }
  } else if (e === "power") {
    s.powerOutTicksLeft = 12; s = addLog(s, "! Power outage. Treatments paused for a while.");
  } else if (e === "kid") {
    s.queue = s.queue.map((p) => ({ ...p, patience: p.patience - 3 })); s = addLog(s, "A kid is crying loudly! Queue patience drops.");
  } else if (e === "doodad") {
    const d = choice(DOODADS); s.cash -= d.cost; s = addLog(s, `! Doodad: ${d.name} -${currency(d.cost)}.`);
  }
  return s;
}

function takeSmallDeal(prev){
  let s = normalize(prev);
  const d = choice(SMALL_DEALS);
  if (s.cash < d.cost) return addLog(s, `! Not enough cash for ${d.name}.`);
  s.cash -= d.cost;
  s.assets = [...(s.assets||[]), { id: uid(), name: d.name, emoji: d.emoji, cashflow: d.cashflow, worth: d.cost }];
  return addLog(s, `Acquired ${d.name}. +${currency(Math.round(d.cashflow/30))}/day passive.`);
}

function takeBigDeal(prev){
  let s = normalize(prev);
  const d = choice(BIG_DEALS);
  if (s.cash < d.down) return addLog(s, `! Need ${currency(d.down)} down for ${d.name}.`);
  s.cash -= d.down;
  s.assets = [...(s.assets||[]), { id: uid(), name: d.name, emoji: d.emoji, cashflow: d.cashflow, worth: d.down + d.loan }];
  s.liabilities = [...(s.liabilities||[]), { id: uid(), name: d.name + " Loan", balance: d.loan, rate: d.rate }];
  return addLog(s, `Big Deal: ${d.name} acquired. +${currency(Math.round(d.cashflow/30))}/day, loan ${currency(d.loan)} @ ${Math.round(d.rate*100)}%.`);
}

function payDownDebt(prev){
  let s = normalize(prev);
  const current = Array.isArray(s.liabilities) ? s.liabilities : [];
  if (current.length===0) return addLog(s, "No debt to pay.");
  const amt = 200;
  if (s.cash < amt) return addLog(s, "! Not enough cash to pay debt.");
  s.cash -= amt;
  const liabs = current.map(l=> ({...l}));
  liabs.sort((a,b)=> (a.balance*a.rate) - (b.balance*b.rate)); // lowest interest first
  liabs[0].balance = Math.max(0, (liabs[0].balance||0) - amt);
  s.liabilities = liabs.filter(l=> (l.balance||0)>0);
  return addLog(s, `Paid down debt ${currency(amt)}.`);
}

function purchaseUpgrade(prev, id) {
  let s = normalize(prev);
  const cfg = UPGRADE_SHOP.find((u) => u.id === id);
  if (!cfg) return s;
  const count = getCount(s, id);
  if (cfg.max !== undefined && count >= cfg.max) return s;
  const cost = costForUpgrade(id, count);
  if (s.cash < cost) return addLog(s, "! Not enough cash.");
  s.cash -= cost;
  // apply effect
  if (id === "chair") s.chairs += 1;
  if (id === "dentist") s.dentists += 1;
  if (id === "assistant") s.assistants += 1;
  if (id === "reception") s.receptionist = 1;
  if (id === "marketing") s.marketingLevel = Math.min(5, s.marketingLevel + 1);
  if (id === "kids") s.upgrades.kids = true;
  if (id === "sterilizer") s.upgrades.sterilizer = true;
  if (id === "generator") s.upgrades.generator = true;
  if (id === "crm") s.upgrades.crm = true;
  s = addLog(s, `${cfg.name} purchased.`);
  return s;
}

function getCount(s, id) {
  switch (id) {
    case "chair": return s.chairs - 1;
    case "dentist": return s.dentists - 1;
    case "assistant": return s.assistants;
    case "reception": return s.receptionist;
    case "marketing": return s.marketingLevel;
    default: return s.upgrades[id] ? 1 : 0;
  }
}

function achievementHint(id) {
  switch (id) {
    case "served_25": return "Keep the queue moving and expand capacity.";
    case "rep_50": return "Quality + hygiene + reviews.";
    case "cash_10k": return "Avoid debt, run promos, scale wisely.";
    case "clean_freak": return "Clean often or buy a sterilizer.";
    case "day_7": return "Survive the first week of chaos.";
    case "escape_rat": return "Build assets that pay you daily until they exceed fixed costs.";
    default: return "";
  }
}

// ---------------- Minimal Self‑Tests (run once in browser) ----------------
function runSelfTests(){
  const tests = [];
  const expectNoThrow = (name, fn) => { try { fn(); tests.push([name, true]); } catch(e){ console.error("Test failed:", name, e); tests.push([name,false]); } };
  const expect = (name, cond) => { tests.push([name, !!cond]); if(!cond) console.error("Test failed:", name); };

  // 1) Should not throw if liabilities/assets missing
  expectNoThrow("dailyFixedExpenses handles undefined liabilities", () => dailyFixedExpenses({ dentists:0, assistants:0, receptionist:0, marketingLevel:0, liabilities: undefined }));
  expectNoThrow("dailyPassive handles undefined assets", () => dailyPassive({ assets: undefined }));

  // 2) Migration should fill arrays
  const migrated = normalize({ cash:123 });
  expect("normalize sets arrays", Array.isArray(migrated.assets) && Array.isArray(migrated.liabilities));

  // 3) Deals should work with empty liabilities
  expectNoThrow("takeBigDeal with undefined liabilities", ()=> takeBigDeal({ ...BASE_STATE, cash: 2000, liabilities: undefined, assets: undefined }));

  // 4) Debt paydown no‑crash / proper message on no debt
  const afterPay = payDownDebt({ ...BASE_STATE, liabilities: [] });
  expect("payDownDebt no crash without liabilities", Array.isArray(afterPay.liabilities));

  console.log("✔ DentalClinicTycoon self‑tests:", tests.map(([n,ok])=> `${ok?"PASS":"FAIL"} ${n}`));
}
if (typeof window !== 'undefined' && !window.__DCT_TESTED__) { window.__DCT_TESTED__ = true; try{ runSelfTests(); }catch(e){ console.error(e); } }
