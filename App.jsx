import React, { useState, useMemo } from 'react';
import { 
  Globe, Zap, ArrowRight, Activity, Sprout,
  Map as MapIcon, Wheat, Leaf, Dna, CloudRain, Cpu,
  Search, ShieldAlert, CheckCircle2, AlertTriangle, AlertCircle, PlaySquare, Settings
} from 'lucide-react';

const TOP_CROPS = [
  { name: 'Maize', calories: '19.5%', regions: ['USA', 'China', 'Brazil'], icon: Sprout, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { name: 'Rice', calories: '16.5%', regions: ['China', 'India', 'Indonesia'], icon: CloudRain, color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { name: 'Wheat', calories: '15.0%', regions: ['China', 'India', 'USA', 'Ukraine', 'Australia', 'Canada', 'Egypt', 'Pakistan'], icon: Wheat, color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { name: 'Cassava', calories: '2.6%', regions: ['Nigeria', 'Brazil', 'Indonesia'], icon: Dna, color: 'bg-lime-100 text-lime-800 border-lime-200' },
  { name: 'Soybeans', calories: '2.1%', regions: ['Brazil', 'USA', 'India', 'China'], icon: Leaf, color: 'bg-green-100 text-green-800 border-green-200' }
];

const COUNTRY_DATA = {
  'USA': {
    description: 'A global powerhouse in maize and soybean production, heavily reliant on steady NPK input flows for high yields.',
    crops: ['Maize', 'Soybeans', 'Wheat'],
    inputs: [
      { type: 'Nitrogen (N)', rawMaterial: 'Natural Gas', companies: ['CF Industries', 'Nutrien'], sources: ['USA', 'Canada', 'Qatar'], status: 'Stable', statusReason: 'Domestic natural gas abundance secures N production.' },
      { type: 'Phosphorus (P)', rawMaterial: 'Phosphate Rock', companies: ['Mosaic'], sources: ['USA', 'Morocco'], status: 'Stable', statusReason: 'Significant domestic mining supplemented by Moroccan imports.' },
      { type: 'Potassium (K)', rawMaterial: 'Potash Ore', companies: ['Nutrien', 'Mosaic'], sources: ['Canada', 'Russia'], status: 'Stable', statusReason: 'Direct supply lines from Canadian potash reserves.' }
    ]
  },
  'Canada': {
    description: 'Major exporter of wheat and key supplier of potassium (potash) to the global market.',
    crops: ['Wheat'],
    inputs: [
      { type: 'Nitrogen (N)', rawMaterial: 'Natural Gas', companies: ['Nutrien'], sources: ['Canada', 'USA'], status: 'Stable', statusReason: 'Strong domestic production.' },
      { type: 'Phosphorus (P)', rawMaterial: 'Phosphate Rock', companies: ['Nutrien'], sources: ['USA', 'Morocco'], status: 'Stable', statusReason: 'Integrated North American supply chain.' },
      { type: 'Potassium (K)', rawMaterial: 'Potash Ore', companies: ['Nutrien'], sources: ['Canada'], status: 'Stable', statusReason: 'World\'s largest potash reserves.' }
    ]
  },
  'Brazil': {
    description: 'World\'s largest agricultural net exporter, deeply vulnerable to fertilizer trade disruptions due to low domestic production.',
    crops: ['Soybeans', 'Maize', 'Cassava'],
    inputs: [
      { type: 'Nitrogen (N)', rawMaterial: 'Ammonia', companies: ['Petrobras', 'Yara'], sources: ['Qatar', 'Russia', 'USA'], status: 'Vulnerable', statusReason: 'High reliance on sea-borne imports of urea and ammonia.' },
      { type: 'Phosphorus (P)', rawMaterial: 'Phosphate Rock', companies: ['Mosaic', 'Copebras'], sources: ['Morocco', 'Saudi Arabia'], status: 'Deficit', statusReason: 'Domestic reserves insufficient for Cerrado soil requirements.' },
      { type: 'Potassium (K)', rawMaterial: 'Potash Ore', companies: ['Uralkali', 'Nutrien'], sources: ['Russia', 'Canada'], status: 'Vulnerable', statusReason: 'Over 85% imported, highly sensitive to geopolitical shocks.' }
    ]
  },
  'China': {
    description: 'Massive producer and consumer of agricultural goods. Prioritizes food security via state-controlled fertilizer reserves.',
    crops: ['Maize', 'Rice', 'Wheat', 'Soybeans'],
    inputs: [
      { type: 'Nitrogen (N)', rawMaterial: 'Coal', companies: ['Sinopec', 'CNPC'], sources: ['China'], status: 'Stable', statusReason: 'Self-sufficient using coal gasification, though carbon intensive.' },
      { type: 'Phosphorus (P)', rawMaterial: 'Phosphate Rock', companies: ['Yuntianhua'], sources: ['China', 'Morocco'], status: 'Stable', statusReason: 'Large domestic reserves under strict export controls.' },
      { type: 'Potassium (K)', rawMaterial: 'Potash Ore', companies: ['Qinghai Salt Lake'], sources: ['China', 'Russia', 'Canada'], status: 'Deficit', statusReason: 'Domestic lakes depleting; reliance on rail from Russia.' }
    ]
  },
  'India': {
    description: 'Major agrarian economy driven by subsidies. Highly sensitive to global fertilizer price volatility.',
    crops: ['Rice', 'Wheat', 'Soybeans'],
    inputs: [
      { type: 'Nitrogen (N)', rawMaterial: 'Natural Gas', companies: ['IFFCO'], sources: ['UAE', 'Qatar', 'India'], status: 'Vulnerable', statusReason: 'Heavy reliance on imported LNG for urea production.' },
      { type: 'Phosphorus (P)', rawMaterial: 'DAP / Phosphoric Acid', companies: ['Coromandel', 'IFFCO'], sources: ['Morocco', 'Saudi Arabia'], status: 'Vulnerable', statusReason: 'Near total dependence on imported rock and acid.' },
      { type: 'Potassium (K)', rawMaterial: 'MOP', companies: ['IPL'], sources: ['Canada', 'Russia'], status: 'Deficit', statusReason: '100% imported; no domestic potash resources available.' }
    ]
  },
  'Australia': {
    description: 'Vast export-oriented wheat and barley producer with structurally impoverished soils requiring continuous inputs.',
    crops: ['Wheat'],
    inputs: [
      { type: 'Nitrogen (N)', rawMaterial: 'Urea', companies: ['Incitec Pivot'], sources: ['Qatar', 'Saudi Arabia', 'Australia'], status: 'Vulnerable', statusReason: 'Transitioning to imports as domestic manufacturing closes.' },
      { type: 'Phosphorus (P)', rawMaterial: 'MAP', companies: ['Incitec Pivot'], sources: ['Morocco', 'China'], status: 'Deficit', statusReason: 'Highly dependent on imported monoammonium phosphate.' },
      { type: 'Potassium (K)', rawMaterial: 'Potash', companies: ['BHP'], sources: ['Canada'], status: 'Stable', statusReason: 'Secure supply lines from Canada.' }
    ]
  },
  'Nigeria': {
    description: 'Rapidly growing population heavily reliant on cassava and imported grains. Local fertilizer production is scaling up.',
    crops: ['Cassava'],
    inputs: [
      { type: 'Nitrogen (N)', rawMaterial: 'Natural Gas', companies: ['Dangote', 'Indorama'], sources: ['Nigeria'], status: 'Stable', statusReason: 'Massive new urea plants make Nigeria a net exporter of N.' },
      { type: 'Phosphorus (P)', rawMaterial: 'Phosphate Rock', companies: ['OCP Group (Partner)'], sources: ['Morocco'], status: 'Vulnerable', statusReason: 'Totally dependent on Moroccan supply through joint ventures.' },
      { type: 'Potassium (K)', rawMaterial: 'Potash', companies: ['Uralkali (Supplier)'], sources: ['Russia', 'Canada'], status: 'Deficit', statusReason: 'No domestic production.' }
    ]
  },
  'Ukraine': {
    description: 'The "breadbasket of Europe," output severely curtailed by conflict but remains critical.',
    crops: ['Wheat', 'Maize'],
    inputs: [
      { type: 'Nitrogen (N)', rawMaterial: 'Natural Gas', companies: ['Ostchem'], sources: ['Ukraine'], status: 'Vulnerable', statusReason: 'Production disrupted by conflict and high energy costs.' },
      { type: 'Phosphorus (P)', rawMaterial: 'Phosphate', companies: ['Imported'], sources: ['Morocco'], status: 'Deficit', statusReason: 'Logistical chokepoints restrict import volumes.' },
      { type: 'Potassium (K)', rawMaterial: 'Potash', companies: ['Imported'], sources: ['Canada'], status: 'Vulnerable', statusReason: 'Previous supply lines cut; sourcing shifted entirely.' }
    ]
  },
  'Pakistan': {
    description: 'Irrigation-dependent agriculture system highly vulnerable to energy shocks and fertilizer shortages.',
    crops: ['Wheat', 'Rice'],
    inputs: [
      { type: 'Nitrogen (N)', rawMaterial: 'Natural Gas', companies: ['Engro', 'FFC'], sources: ['Pakistan', 'Qatar'], status: 'Stable', statusReason: 'Strong domestic production, though gas rationing poses risks.' },
      { type: 'Phosphorus (P)', rawMaterial: 'DAP', companies: ['Fauji'], sources: ['Morocco', 'Saudi Arabia'], status: 'Vulnerable', statusReason: 'Heavily reliant on sea-borne imports of DAP.' },
      { type: 'Potassium (K)', rawMaterial: 'Potash', companies: ['Imported'], sources: ['Canada', 'Russia'], status: 'Deficit', statusReason: 'Fully imported.' }
    ]
  },
  'Indonesia': {
    description: 'Major archipelagic nation, leading palm oil producer, and significant consumer of rice and cassava.',
    crops: ['Rice', 'Cassava'],
    inputs: [
      { type: 'Nitrogen (N)', rawMaterial: 'Natural Gas', companies: ['Pupuk Indonesia'], sources: ['Indonesia'], status: 'Stable', statusReason: 'State-owned enterprises ensure domestic sufficiency.' },
      { type: 'Phosphorus (P)', rawMaterial: 'Phosphate Rock', companies: ['Pupuk Indonesia'], sources: ['Morocco', 'Egypt'], status: 'Deficit', statusReason: 'High reliance on imported rock for processing.' },
      { type: 'Potassium (K)', rawMaterial: 'MOP', companies: ['Uralkali (Supplier)'], sources: ['Canada', 'Russia'], status: 'Vulnerable', statusReason: 'Significant import requirement for cash crops.' }
    ]
  },
  'Egypt': {
    description: 'Major wheat importer and vital regional supplier of phosphate and nitrogen fertilizers.',
    crops: ['Wheat'],
    inputs: [
      { type: 'Nitrogen (N)', rawMaterial: 'Natural Gas', companies: ['Abu Qir', 'OCI'], sources: ['Egypt'], status: 'Stable', statusReason: 'Export hub utilizing domestic Mediterranean gas finds.' },
      { type: 'Phosphorus (P)', rawMaterial: 'Phosphate Rock', companies: ['NCIC'], sources: ['Egypt'], status: 'Stable', statusReason: 'Major exporter holding significant regional reserves.' },
      { type: 'Potassium (K)', rawMaterial: 'Potash', companies: ['Arab Potash (Jordan)'], sources: ['Russia'], status: 'Deficit', statusReason: 'Net importer.' }
    ]
  }
};

const NODES = {
  'USA': { x: 180, y: 150, isProducer: true, isSupplier: true },
  'Canada': { x: 200, y: 100, isProducer: true, isSupplier: true },
  'Brazil': { x: 280, y: 320, isProducer: true, isSupplier: false },
  'China': { x: 750, y: 180, isProducer: true, isSupplier: true },
  'India': { x: 680, y: 240, isProducer: true, isSupplier: false },
  'Australia': { x: 800, y: 380, isProducer: true, isSupplier: false },
  'Nigeria': { x: 480, y: 260, isProducer: true, isSupplier: false },
  'Ukraine': { x: 550, y: 140, isProducer: true, isSupplier: false },
  'Pakistan': { x: 640, y: 220, isProducer: true, isSupplier: false },
  'Indonesia': { x: 780, y: 300, isProducer: true, isSupplier: false },
  'Egypt': { x: 520, y: 200, isProducer: true, isSupplier: false },
  'Morocco': { x: 440, y: 190, isProducer: false, isSupplier: true },
  'Saudi Arabia': { x: 570, y: 230, isProducer: false, isSupplier: true },
  'Qatar': { x: 590, y: 240, isProducer: false, isSupplier: true },
  'UAE': { x: 600, y: 245, isProducer: false, isSupplier: true },
  'Russia': { x: 650, y: 110, isProducer: false, isSupplier: true },
};

const WORLD_MAP_PATH = "M 10 250 Q 80 180 150 250 T 250 250 T 350 250 T 450 250 T 550 250 T 650 250 T 750 250 T 850 250 T 950 250"; // Simplified for presentation, normally an SVG D string.
// Instead of simple blobs, we use a beautifully stylized light grid background in index.html,
// but let's provide a stylized placeholder or rely on map nodes.

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [apiKey, setApiKey] = useState(localStorage?.getItem('gemini_api_key') || '');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [globalBriefing, setGlobalBriefing] = useState('');
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [strategicAssessment, setStrategicAssessment] = useState('');
  const [assessmentLoading, setAssessmentLoading] = useState(false);

  const callGeminiAPI = async (prompt, systemInstruction) => {
    const key = apiKey;
    if (!key) throw new Error("API Key is missing!");
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${key}`;
    const retries = 5;
    const backoff = 1000;
    
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: systemInstruction }] },
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (e) {
            if (i === retries - 1) throw e;
            await new Promise(r => setTimeout(r, backoff * Math.pow(2, i)));
        }
    }
  };

  const runGlobalBriefing = async () => {
    if (!apiKey) {
      alert("Please enter a Gemini API Key in the settings field at the top right.");
      return;
    }
    setBriefingLoading(true);
    setIsAiModalOpen(true);
    try {
      const sysInst = "You are an executive agricultural commodities analyst. Produce a brief, concise markdown report.";
      const pmt = `Here is our 2026 data. Identify the 2 most vulnerable regions and 2 critical chokepoints, returning a concise macro outlook.\n\nCrops: ${JSON.stringify(TOP_CROPS)}\nCountries: ${JSON.stringify(COUNTRY_DATA)}`;
      const res = await callGeminiAPI(pmt, sysInst);
      setGlobalBriefing(res);
    } catch(e) {
      setGlobalBriefing("Error fetching briefing: " + e.message);
    } finally {
      setBriefingLoading(false);
    }
  };

  const runStrategicAssessment = async () => {
    if (!apiKey) {
      alert("Please enter a Gemini API Key.");
      return;
    }
    setAssessmentLoading(true);
    try {
      const sysInst = "You are an executive agricultural commodities analyst. Keep responses under 150 words. Be direct and insightful.";
      const pmt = `Analyze fertilizer supply chain risks, corporate dependencies, and maritime disruption impacts for this specific country network:\n${JSON.stringify(COUNTRY_DATA[selectedRegion])}`;
      const res = await callGeminiAPI(pmt, sysInst);
      setStrategicAssessment(res);
    } catch (e) {
      setStrategicAssessment("Error fetching assessment: " + e.message);
    } finally {
      setAssessmentLoading(false);
    }
  };

  const tradeFlows = useMemo(() => {
    if (!selectedRegion) return [];
    const flows = [];
    const data = COUNTRY_DATA[selectedRegion];
    if (!data) return [];
    
    data.inputs.forEach(input => {
      input.sources.forEach(source => {
        if (source !== selectedRegion && NODES[source]) {
           let found = false;
           // avoid duplicate routes visually if same source across N P K
           flows.forEach(f => {
              if (f.source === source) found = true;
           });
           if (!found) {
               flows.push({
                 source,
                 startX: NODES[source].x,
                 startY: NODES[source].y,
                 endX: NODES[selectedRegion].x,
                 endY: NODES[selectedRegion].y
               });
           }
        }
      });
    });
    return flows;
  }, [selectedRegion]);

  const createCurvedPath = (startX, startY, endX, endY) => {
    const isRtl = startX > endX;
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2 - (isRtl ? 80 : 50); // Curve arc
    return `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;
  };

  return (
    <div className="min-h-screen p-4 md:p-8 pt-4 pb-20">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
               <Globe className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
               <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">AgriTrade Nexus</h1>
               <div className="flex items-center gap-3 mt-1.5">
                 <span className="px-2.5 py-0.5 bg-slate-800 text-emerald-400 text-[10px] font-bold rounded shadow-sm tracking-widest uppercase">2026 Market Data</span>
                 <span className="text-slate-500 text-sm font-medium">Global Food Security & Input Dependencies</span>
               </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
             <input type="password" placeholder="Gemini API Key..." aria-label="Gemini API Key" value={apiKey} onChange={e => { setApiKey(e.target.value); localStorage?.setItem('gemini_api_key', e.target.value); }} className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg shadow-inner text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-56 transition-all" />
             <button onClick={runGlobalBriefing} disabled={briefingLoading} className="flex whitespace-nowrap items-center gap-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white px-5 py-2.5 rounded-lg shadow-md font-semibold transition-all">
               {briefingLoading ? <span className="animate-spin text-xl leading-none">↻</span> : <Zap size={18} />}
               Global AI Briefing
             </button>
          </div>
        </header>

        {/* TOP STATS */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {TOP_CROPS.map(crop => {
              const Icon = crop.icon;
              const isActive = selectedRegion && crop.regions.includes(selectedRegion);
              const cardClass = isActive ? `shadow-lg border-2 border-blue-400 bg-white scale-105 z-10` : 'bg-white border-transparent shadow-sm border border-slate-200 opacity-80';
              return (
                <div key={crop.name} className={`p-4 rounded-2xl transition-all duration-300 ${cardClass}`}>
                  <div className="flex justify-between items-start mb-3">
                     <span className={`p-2 rounded-xl shadow-sm ${crop.color}`}><Icon size={22} strokeWidth={1.5} /></span>
                     <span className="text-xl font-black text-slate-800 tracking-tight">{crop.calories}</span>
                  </div>
                  <h4 className="font-bold text-slate-700">{crop.name}</h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-semibold">Calories Global</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* SVG MAP */}
        <section className="relative overflow-hidden bg-slate-50 border border-slate-200 rounded-2xl shadow-inner md:min-h-[500px]">
          <svg viewBox="0 0 1000 500" className="w-full h-auto">
            {/* Soft map base */}
            <rect width="1000" height="500" fill="#f8fafc" />
            
            {/* Draw Equirectangular outline if we had paths, else abstract circles indicating zones */}
            <g className="opacity-10 pointer-events-none">
                <circle cx="200" cy="200" r="150" fill="#cbd5e1" />
                <circle cx="650" cy="220" r="180" fill="#cbd5e1" />
                <circle cx="850" cy="350" r="80" fill="#cbd5e1" />
                <ellipse cx="600" cy="100" rx="300" ry="100" fill="#cbd5e1" />
                <ellipse cx="280" cy="350" rx="100" ry="150" fill="#cbd5e1" />
            </g>

            {/* Trade flows */}
            {tradeFlows.map((flow, i) => (
              <path key={i} d={createCurvedPath(flow.startX, flow.startY, flow.endX, flow.endY)} fill="none" className="stroke-blue-500 opacity-60 flow-line" strokeWidth="2.5" />
            ))}

            {/* Nodes */}
            {Object.entries(NODES).map(([country, node]) => {
               const isSelected = selectedRegion === country;
               const isDimmed = selectedRegion && !isSelected && !node.isSupplier; 
               
               const opacity = isDimmed ? "opacity-30" : "opacity-100 hover:opacity-90";
               
               const renderDiamond = () => {
                  const dx = node.isProducer ? node.x + 16 : node.x;
                  const dy = node.isProducer ? node.y - 10 : node.y;
                  return <polygon points={`${dx},${dy - 8} ${dx + 8},${dy} ${dx},${dy + 8} ${dx - 8},${dy}`} className={isSelected ? "fill-teal-600 shadow-xl" : "fill-teal-500"} />;
               };
               
               return (
                 <g key={country} className={`transition-all duration-300 transform origin-center ${opacity} cursor-pointer`} onClick={() => { if (node.isProducer) { setSelectedRegion(country); setStrategicAssessment(''); } }}>
                    {node.isProducer && (
                       <circle cx={node.x} cy={node.y} r={isSelected ? 8 : 6} className={isSelected ? "fill-blue-600 stroke-white stroke-2 drop-shadow-lg" : "fill-slate-700"} />
                    )}
                    {node.isSupplier && renderDiamond()}
                    <rect x={node.x - 30} y={node.y + 8} width="60" height="14" rx="4" fill="rgba(255,255,255,0.7)" className="pointer-events-none" />
                    <text x={node.x} y={node.y + 18} fontSize="11" textAnchor="middle" className={`font-bold pointer-events-none ${isSelected ? 'fill-blue-800' : 'fill-slate-800'}`}>{country}</text>
                 </g>
               )
            })}
          </svg>
          <div className="absolute bottom-4 left-4 flex flex-col gap-2 bg-white/90 backdrop-blur pointer-events-none px-4 py-3 border border-slate-200 rounded-xl shadow-sm">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><circle cx="6" cy="6" r="6" className="fill-slate-700" width="12" height="12" viewBox="0 0 12 12" /> Growing Country</div>
             <div className="flex items-center gap-2 text-xs font-bold text-slate-700"><svg width="12" height="12" viewBox="0 0 12 12"><polygon points="6,0 12,6 6,12 0,6" className="fill-teal-500" /></svg> Raw Material Hub</div>
          </div>
          {!selectedRegion && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <span className="px-6 py-3 bg-white/80 backdrop-blur-sm text-slate-600 font-bold border border-slate-200 rounded-full shadow-sm text-sm tracking-wide">Select a Growing Country to view dependencies</span>
            </div>
          )}
        </section>

        {/* DETAIL PANEL */}
        {selectedRegion && COUNTRY_DATA[selectedRegion] && (
          <div className="bg-white rounded-2xl shadow border border-slate-200 fadeIn">
            <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                   <h2 className="text-3xl font-black text-slate-900">{selectedRegion}</h2>
                   <div className="flex gap-2">
                      {COUNTRY_DATA[selectedRegion].crops.map(crop => (
                         <span key={crop} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold shadow-sm border border-slate-200 uppercase tracking-widest">{crop}</span>
                      ))}
                   </div>
                </div>
                <p className="text-slate-600 max-w-2xl font-medium leading-relaxed">{COUNTRY_DATA[selectedRegion].description}</p>
              </div>
              <button onClick={runStrategicAssessment} disabled={assessmentLoading} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-md active:bg-indigo-800 w-full md:w-auto justify-center whitespace-nowrap">
                 {assessmentLoading ? <span className="animate-spin text-xl leading-none">↻</span> : <Cpu size={18} />}
                 Strategic AI Assessment
              </button>
            </div>
            
            {strategicAssessment && (
               <div className="px-6 md:px-8 py-6 bg-indigo-50/50 border-b border-indigo-100 fadeIn">
                  <div className="mb-2 uppercase text-xs font-bold text-indigo-800 tracking-widest flex items-center gap-2"><Cpu size={14} /> AI Analysis</div>
                  <div className="prose prose-sm prose-indigo max-w-none text-indigo-900 font-medium" dangerouslySetInnerHTML={{ __html: strategicAssessment.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
               </div>
            )}

            <div className="p-6 md:p-8">
                <h3 className="uppercase text-xs font-bold text-slate-500 tracking-widest mb-6">Input Matrix (NPK)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {COUNTRY_DATA[selectedRegion].inputs.map((input, idx) => {
                     const isBad = input.status === 'Vulnerable' || input.status === 'Deficit';
                     
                     return (
                     <div key={idx} className={`p-6 rounded-2xl border flex flex-col transition-all hover:shadow-md ${isBad ? 'bg-red-50/30 border-red-100' : 'bg-slate-50 border-slate-200'}`}>
                       <div className="flex justify-between items-center mb-5">
                         <h4 className="font-extrabold text-slate-800 text-lg tracking-tight">{input.type}</h4>
                         <span className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider ${isBad ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                           {input.status}
                         </span>
                       </div>
                       
                       <div className="space-y-4">
                           <div>
                             <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Raw Material</p>
                             <p className="text-sm font-bold text-slate-700">{input.rawMaterial}</p>
                           </div>
                           
                           <div>
                             <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Key Corps</p>
                             <p className="text-sm font-bold text-slate-700">{input.companies.join(', ')}</p>
                           </div>
                           
                           <div>
                             <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Origins</p>
                             <div className="flex flex-wrap gap-1.5">
                               {input.sources.map(src => (
                                 <span key={src} className="px-2.5 py-1 bg-white text-blue-700 border border-blue-200 rounded text-xs font-bold shadow-sm">{src}</span>
                               ))}
                             </div>
                           </div>
                       </div>
                       
                       <div className={`mt-6 pt-4 border-t italic text-sm font-medium leading-relaxed ${isBad ? 'text-red-700/80 border-red-200' : 'text-slate-500 border-slate-200'}`}>
                         "{input.statusReason}"
                       </div>
                     </div>
                   )})}
                </div>
            </div>
          </div>
        )}
      </div>

      {/* AI MODAL */}
      {isAiModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 fadeIn">
           <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
             <div className="px-8 py-5 flex justify-between items-center bg-slate-50 border-b border-slate-100">
               <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3"><Globe className="text-blue-600" /> Executive AI Briefing</h2>
               <button onClick={() => setIsAiModalOpen(false)} className="text-slate-400 hover:text-slate-800 transition-colors p-2 -mr-2 rounded-full hover:bg-slate-200">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
               </button>
             </div>
             <div className="p-8 overflow-y-auto w-full prose prose-slate max-w-none prose-h2:text-xl prose-h3:text-lg prose-p:text-slate-600">
                {briefingLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                     <span className="animate-pulse text-5xl mb-6">✨</span>
                     <p className="text-lg font-medium">Synthesizing global trade node data...</p>
                  </div>
                ) : (
                   <div dangerouslySetInnerHTML={{ __html: globalBriefing.replace(/\n\n/g, '<br/><br/>').replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/## (.*?)<br\/>/g, '<h2 class="mt-4 mb-2">$1</h2>') }} />
                )}
             </div>
           </div>
        </div>
      )}
    </div>
  );
}
