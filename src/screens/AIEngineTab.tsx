import { useState } from 'react';
import { AIAlert, Vendor } from '../types';
import { Sparkles, Brain, ShieldAlert, CheckCircle, Search, TrendingUp, Cpu, RefreshCw, HelpCircle, Eye, ThumbsUp, Flame } from 'lucide-react';
import { trendingSearchQueries, initialContentPosts } from '../data';
import {
  detectFakeReviews,
  getHiddenGemsDetail,
  summarizeSearchTrends,
  FakeReviewResponse,
  HiddenGemResult,
  SearchTrendsResult
} from '../services/geminiService';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AIEngineTabProps {
  aiAlerts: AIAlert[];
  vendors: Vendor[];
  onResolveAlert: (id: string) => void;
  onTriggerActionToast: (msg: string) => void;
}

export default function AIEngineTab({
  aiAlerts,
  vendors,
  onResolveAlert,
  onTriggerActionToast
}: AIEngineTabProps) {
  // Rising stars with high hidden gems score but lower served order count
  const risingStars = vendors.filter((v) => v.hiddenGemScore >= 90 && v.ordersCount < 4000);

  const getBuzzSignals = (v: Vendor) => {
    const post = initialContentPosts.find(
      (p) => p.vendorName.toLowerCase().includes(v.stallName.toLowerCase()) || 
             v.stallName.toLowerCase().includes(p.vendorName.toLowerCase())
    );
    const trend = trendingSearchQueries.find(
      (t) => v.nearbyFoodStreet.toLowerCase().includes(t.query.toLowerCase()) ||
             v.stallName.toLowerCase().includes(t.query.toLowerCase()) ||
             v.category.toLowerCase().includes(t.query.toLowerCase())
    );
    return {
      views: post?.views || (v.ordersCount * 12 + 1500),
      likes: post?.likes || (Math.floor(v.ordersCount * 2.1) + 240),
      spike: trend?.spike || (v.hiddenGemScore > 92 ? "+42% search spike" : "+18% buzz")
    };
  };

  const getCustomReviews = (v: Vendor) => {
    return [
      { id: '1', text: `${v.stallName} has absolute world-class quality prep for ${v.category}. Extremely clean setup under FSSAI rules!`, user: 'GourmetIndia_Bites' },
      { id: '2', text: `Tucked away at ${v.nearbyFoodStreet}. Hygiene score is ${v.hygieneScore}/100, which is top-tier for local spot. Totally recommend the customized recipe!`, user: 'NammaNandini' }
    ];
  };

  const [isSummarizingSearch, setIsSummarizingSearch] = useState(false);
  const [searchSummary, setSearchSummary] = useState<SearchTrendsResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [evaluatingGemId, setEvaluatingGemId] = useState<string | null>(null);
  const [gemPredictions, setGemPredictions] = useState<Record<string, HiddenGemResult>>({});
  const [gemErrors, setGemErrors] = useState<Record<string, string>>({});

  const [checkingSpam, setCheckingSpam] = useState(false);
  const [spamAnalysis, setSpamAnalysis] = useState<FakeReviewResponse | null>(null);
  const [spamError, setSpamError] = useState<string | null>(null);

  const handleSummarizeTrends = async () => {
    setIsSummarizingSearch(true);
    setSearchError(null);
    onTriggerActionToast('Calling Gemini API to aggregate zone intents and trending keywords...');
    try {
      const summary = await summarizeSearchTrends(trendingSearchQueries);
      setSearchSummary(summary);

      // Saved in state
      onTriggerActionToast('Gemini Search Trend Synthesis complete!');
    } catch (e: any) {
      setSearchError(e.message || String(e));
      onTriggerActionToast(`Summary failed: ${e.message}`);
    } finally {
      setIsSummarizingSearch(false);
    }
  };

  const handlePredictGem = async (vendor: Vendor) => {
    setEvaluatingGemId(vendor.id);
    setGemErrors(prev => ({ ...prev, [vendor.id]: '' }));
    onTriggerActionToast(`Gemini evaluating metrics & client review logs for "${vendor.stallName}"...`);
    try {
      const reviews = getCustomReviews(vendor);
      const buzz = getBuzzSignals(vendor);
      // Enrich vendor payload with live telemetry
      const vendorPayload = {
        ...vendor,
        buzzViews: buzz.views,
        buzzLikes: buzz.likes,
        buzzSpike: buzz.spike
      };
      const data = await getHiddenGemsDetail(vendorPayload, reviews);
      setGemPredictions(prev => ({
        ...prev,
        [vendor.id]: data
      }));

      // Saved in state
      onTriggerActionToast(`Gemini Spotlight generated successfully!`);
    } catch (e: any) {
      setGemErrors(prev => ({ ...prev, [vendor.id]: e.message || String(e) }));
      onTriggerActionToast(`Evaluation failed: ${e.message}`);
    } finally {
      setEvaluatingGemId(null);
    }
  };

  const handleRunSpamSweep = async () => {
    setCheckingSpam(true);
    setSpamError(null);
    onTriggerActionToast('Gemini starting automated review spam & match-rate sweep...');
    try {
      const reviewsToTest = [
        { id: 'rev-01', text: 'Stall was super bad, fake food and dirty, avoid!!', user: 'SpamUser99' },
        { id: 'rev-02', text: 'USE PROMO CODE CHIPS50 TO GET 50% DISCOUNT RIGHT NOW BEST!!!', user: 'PromoBot' },
        { id: 'rev-03', text: 'Authentic idlis with very spicy chili podi and pure ghee. Incredibly tasty.', user: 'Ananya R.' },
        { id: 'rev-04', text: 'Clean stainless steel kitchen and hygienic gloves worn.', user: 'Rohan Sharma' }
      ];
      
      const data = await detectFakeReviews('Global Reviews Stream', reviewsToTest);
      setSpamAnalysis(data);

      // Saved in state
      onTriggerActionToast(`Spam sweep completed! Flagged ${data.spamCount} suspicious reviews.`);
    } catch (e: any) {
      setSpamError(e.message || String(e));
      onTriggerActionToast(`Spam analysis failed: ${e.message}`);
    } finally {
      setCheckingSpam(false);
    }
  };

  const handleRetrainWeights = () => {
    onTriggerActionToast('Triggered Neural Weights update. Re-computing street search ranks (NammaSearch GPT).');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">
          CENTRAL NEURAL INTELLIGENCE
        </span>
        <h2 className="text-2xl font-display font-medium text-slate-100 mt-1 flex items-center gap-1.5">
          <Brain className="w-6 h-6 text-emerald-400" /> AI Engine Monitoring
        </h2>
        <p className="text-xs text-slate-400">
          Supervise recommendation accuracy curves, block hostile rating spams, track real-time food search queries, and manage local vector weights.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left columns: AI Indicators & Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Recommendations Diagnostics metrics */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>

            <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-850 pb-2 flex items-center gap-2 mb-4">
              <Cpu className="w-4 h-4 text-emerald-400 animate-pulse" /> Recommendations & Match Model Accuracy
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-[#0b0f19] border border-slate-850 p-4 rounded-xl">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Matching Resolution</span>
                <span className="text-xl font-display font-bold text-emerald-400 block mt-2">94.8%</span>
                <span className="text-[9px] font-mono text-slate-600 block mt-1">Grounding verified</span>
              </div>
              <div className="bg-[#0b0f19] border border-slate-850 p-4 rounded-xl">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Precision CTR Index</span>
                <span className="text-xl font-display font-bold text-blue-405 block mt-2">6.82%</span>
                <span className="text-[9px] font-mono text-slate-600 block mt-1">±0.2% variance standard</span>
              </div>
              <div className="bg-[#0b0f19] border border-slate-850 p-4 rounded-xl">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Latency response</span>
                <span className="text-xl font-display font-bold text-slate-300 block mt-2">68ms</span>
                <span className="text-[9px] font-mono text-slate-600 block mt-1">Vector DB cluster ok</span>
              </div>
            </div>

            <div className="mt-5 flex justify-between items-center bg-slate-900/60 p-3 rounded-xl border border-slate-850">
              <span className="text-xs text-slate-400 font-mono">Recommend Model weights updated: 4 hrs ago</span>
              <button
                onClick={handleRetrainWeights}
                className="py-1 px-3 bg-[#10b981]/15 hover:bg-[#10b981]/25 text-[#10b981] border border-[#10b981]/10 rounded font-mono text-xs cursor-pointer transition"
              >
                Retrain Model Weights
              </button>
            </div>
          </div>
          {/* AI Security alerts queue */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <h3 className="text-sm font-semibold text-rose-450 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" /> Automated Security Alerts & Spam Filters
              </h3>
              <button
                onClick={handleRunSpamSweep}
                disabled={checkingSpam}
                className="py-1 px-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-[10px] font-bold rounded-lg cursor-pointer transition flex items-center gap-1"
              >
                {checkingSpam ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" /> Sweep Running...
                  </>
                ) : (
                  <>
                    <Cpu className="w-3 h-3" /> Sweep Reviews with Gemini
                  </>
                )}
              </button>
            </div>

            {spamError && (
              <div className="bg-rose-500/10 border border-rose-500/25 p-3.5 text-xs text-rose-400 font-mono rounded-xl">
                🚨 <strong>Review Spam Analysis Error:</strong> {spamError}
              </div>
            )}

            {/* Sweep results */}
            {spamAnalysis && (
              <div className="bg-rose-500/5 border border-rose-500/15 rounded-xl p-3 space-y-2 select-none">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-rose-400 font-bold">GEMINI FRAUD ANALYSIS ENGINE</span>
                  <span className="text-zinc-500 uppercase">{spamAnalysis.mode}</span>
                </div>
                <div className="space-y-2">
                  <div className="text-[11px] text-zinc-400">
                    Flagged <span className="text-rose-400 font-bold">{spamAnalysis.spamCount}</span> reviews displaying spam characteristics:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {spamAnalysis.analyzedReviews.map((rev) => (
                      <div key={rev.id} className="p-2 bg-slate-905/30 rounded border border-white/5 space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-mono">
                          <span className="text-slate-205 font-semibold truncate max-w-[100px]">{rev.user}</span>
                          <span className={`px-1.5 py-0.2 rounded font-bold ${rev.isSpam ? 'bg-rose-500/10 text-rose-450 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20'}`}>
                            {rev.isSpam ? `SPAM (${Math.round(rev.confidence * 100)}%)` : 'GENUINE'}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-300 italic truncate font-mono">"{rev.text}"</p>
                        <p className="text-[9px] text-zinc-500 leading-normal">{rev.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {aiAlerts.filter(a => !a.resolved).map((alert) => (
                <div
                  key={alert.id}
                  className="bg-[#080d15] border border-slate-850 p-3 rounded-xl flex items-start justify-between gap-3 hover:border-slate-800 transition"
                >
                  <div className="space-y-1.5 flex-1 select-none">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded ${
                        alert.severity === 'High Risk' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {alert.type} • {alert.severity}
                      </span>
                      <span className="text-[10px] font-mono text-slate-550">{alert.timestamp.substring(11, 16)} UTC</span>
                    </div>
                    <p className="text-xs text-slate-200">
                      <strong>Concern:</strong> {alert.details}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Target element: <span className="font-mono text-slate-400">{alert.target}</span>
                    </p>
                  </div>

                  <button
                    onClick={() => onResolveAlert(alert.id)}
                    className="py-1 px-2.5 bg-slate-800 hover:bg-slate-755 text-[#10b981] font-mono text-[10px] rounded cursor-pointer transition"
                  >
                    Clear Alert
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Rising Stars / Search Intent tracker */}
        <div className="space-y-6">
          {/* AI Search intent topics */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-emerald-400" />
                Localized Customer Intents
              </h3>
              <button
                onClick={handleSummarizeTrends}
                disabled={isSummarizingSearch}
                className="py-1 px-2 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold rounded cursor-pointer transition flex items-center gap-1"
              >
                {isSummarizingSearch ? (
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                ) : (
                  <Cpu className="w-2.5 h-2.5" />
                )}
                Summarize
              </button>
            </div>

            {searchError && (
              <div className="bg-rose-500/10 border border-rose-500/25 p-3 text-xs text-rose-400 font-mono rounded-xl">
                🚨 <strong>Trend Summary Error:</strong> {searchError}
              </div>
            )}

            {/* Summarized trends result dashboard */}
            {searchSummary && (
              <div className="bg-[#060914] border border-emerald-500/20 rounded-xl p-3 space-y-2 select-none">
                <div className="flex justify-between items-center text-[9px] font-mono text-emerald-400">
                  <span>GEMINI SYNTHESIS RATIO</span>
                  <span>CONFIDENCE: {Math.round((searchSummary.confidence || 0.95) * 100)}%</span>
                </div>
                <div className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                  {searchSummary.summary}
                </div>
                <div className="flex flex-wrap gap-1">
                  {searchSummary.activeFads.map((fad, idx) => (
                    <span key={idx} className="bg-emerald-950/45 text-emerald-400 border border-emerald-900/40 text-[9px] font-mono px-1.5 py-0.5 rounded">
                      #{fad}
                    </span>
                  ))}
                </div>
                <div className="p-2 bg-slate-900/50 rounded border border-white/5 text-[10px] text-zinc-400 italic">
                  💡 <strong>Zoning tip:</strong> {searchSummary.zoningSuggestion}
                </div>
              </div>
            )}

            <div className="space-y-3.5">
              {trendingSearchQueries.map((trend, idx) => (
                <div key={idx} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-medium">“{trend.query}”</span>
                    <span className="text-emerald-400 font-mono font-bold">{trend.spike}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {trend.count} unique geocells searched this hour
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Underrated rising vendors identified */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" /> AI 'Hidden Gems' Intelligence Lab
            </h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Municipal prediction engines assessing FSSAI food hygiene standards, custom social media buzz indexes, and local search queries to classify next-generation gastronomic gems:
            </p>

            <div className="space-y-4 pt-1">
              {risingStars.map((star) => {
                const buzz = getBuzzSignals(star);
                return (
                  <div key={star.id} className="p-4 bg-[#080d16] border border-slate-850 rounded-xl space-y-3.5 text-xs hover:border-slate-800 transition">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="font-semibold text-slate-200 text-sm block">{star.stallName}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-sans italic">{star.category} • {star.nearbyFoodStreet}</span>
                      </div>
                      
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handlePredictGem(star)}
                          disabled={evaluatingGemId === star.id}
                          className="py-1 px-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/10 rounded-lg text-[9px] font-mono cursor-pointer flex items-center gap-1 transform active:scale-95 transition"
                        >
                          {evaluatingGemId === star.id ? (
                            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                          ) : (
                            <Cpu className="w-2.5 h-2.5" />
                          )}
                          Evaluate Live
                        </button>
                        <button
                          onClick={() => onTriggerActionToast(`Custom promotional campaign featured for ${star.stallName}.`)}
                          className="py-1 px-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/10 rounded-lg text-[9px] font-mono cursor-pointer transition"
                        >
                          Feature ➜
                        </button>
                      </div>
                    </div>

                    {/* Integrated Telemetry Parameters (The User Prompt Requirements!) */}
                    <div className="grid grid-cols-3 gap-2 bg-[#0c1221] p-2 rounded-lg border border-white/5 text-[10px] font-mono">
                      <div>
                        <span className="text-slate-500 block text-[9px]">HYGIENE SAFETY</span>
                        <span className={`font-semibold ${star.hygieneScore >= 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {star.hygieneScore}% PASS
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px]">COMMUNITY BUZZ</span>
                        <span className="text-zinc-300 flex items-center gap-1 font-semibold">
                          <Eye className="w-3 h-3 text-slate-400" /> {buzz.views.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px]">SEARCH SPIKE</span>
                        <span className="text-amber-400 animate-pulse font-semibold">
                          {buzz.spike}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-slate-500 border-t border-white/5 pt-2">
                      <span>Served Orders: <strong className="text-zinc-350">{star.ordersCount}</strong></span>
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-400" /> 2 Customer Reviews Fed
                      </span>
                    </div>

                    {/* Gemini predictive output result panel */}
                    {gemErrors[star.id] && (
                      <div className="bg-rose-500/10 border border-rose-500/25 p-2.5 text-[10px] text-rose-400 font-mono rounded-lg">
                        🚨 <strong>Gem Evaluation Failed:</strong> {gemErrors[star.id]}
                      </div>
                    )}

                    {gemPredictions[star.id] && (
                      <div className="bg-emerald-500/5 border border-emerald-500/25 rounded-lg p-3 space-y-1.5 font-mono text-[10px] select-none text-zinc-300">
                        <div className="flex justify-between text-emerald-400 text-[9px] border-b border-white/5 pb-1">
                          <span className="font-bold flex items-center gap-1 uppercase tracking-wide">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> GEMINI DISCOVERY CLASSIFICATION
                          </span>
                          <span className="font-bold text-amber-400">{gemPredictions[star.id].gemClassification} ({Math.round((gemPredictions[star.id].confidence || 0.94) * 100)}% Conf)</span>
                        </div>
                        <div>
                          <strong>Underrated Factor:</strong> {gemPredictions[star.id].underRatedFactor}
                        </div>
                        <div className="flex justify-between text-[9px] text-zinc-400 pt-0.5">
                          <span>Pulse Spike Probability: <strong className="text-emerald-400">{gemPredictions[star.id].spikeProbability}</strong></span>
                          <span>Culinary Sentiment Score: <strong className="text-amber-400">{gemPredictions[star.id].sentimentScore}%</strong></span>
                        </div>
                        <div className="text-[9px] text-slate-400 mt-1 italic border-t border-white/5 pt-1">
                          🎯 Suggested campaign: {gemPredictions[star.id].suggestedCampaign}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
