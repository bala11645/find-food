import { useState } from 'react';
import { ContentPost } from '../types';
import {
  ShieldAlert,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Heart,
  TrendingUp,
  Award,
  Sparkles,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { checkContentModeration, ContentModerationResult } from '../services/geminiService';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface ContentModerationTabProps {
  posts: ContentPost[];
  onUpdatePostStatus: (id: string, status: 'Approved' | 'Flagged' | 'Removed', aiResult?: any) => void;
  onTriggerActionToast: (msg: string) => void;
}

export default function ContentModerationTab({
  posts,
  onUpdatePostStatus,
  onTriggerActionToast
}: ContentModerationTabProps) {
  // Show all unless isolated
  const activePosts = posts.filter((p) => p.status !== 'Removed');

  const [moderatingPostId, setModeratingPostId] = useState<string | null>(null);
  const [moderationErrors, setModerationErrors] = useState<Record<string, string>>({});
  const [moderationScans, setModerationScans] = useState<Record<string, ContentModerationResult>>(() => {
    const initial: Record<string, ContentModerationResult> = {};
    posts.forEach((p) => {
      if ((p as any).aiModerationResult) {
        initial[p.id] = (p as any).aiModerationResult;
      }
    });
    return initial;
  });

  const handleTriggerAIScreen = async (post: ContentPost) => {
    setModeratingPostId(post.id);
    setModerationErrors(prev => ({ ...prev, [post.id]: '' }));
    onTriggerActionToast(`Calling Gemini multi-modal auditor for visual safety screening...`);
    try {
      const data = await checkContentModeration(post);
      setModerationScans(prev => ({
        ...prev,
        [post.id]: data
      }));

      // Update post status and pass moderation outcome
      onUpdatePostStatus(post.id, data.status, data);
      onTriggerActionToast(`Gemini content check complete! Decision: ${data.status}`);
    } catch (e: any) {
      setModerationErrors(prev => ({ ...prev, [post.id]: e.message || String(e) }));
      onTriggerActionToast(`Audit failed: ${e.message}`);
    } finally {
      setModeratingPostId(null);
    }
  };

  const handleWarnVendor = (vendorName: string) => {
    onTriggerActionToast(`Strict warning citation sent to the owner of "${vendorName}". Infringement logged under Media Pol. III.`);
  };

  const handleFeatureContent = (vendorName: string) => {
    onTriggerActionToast(`Success: High-impact video content boosted. Featured on Bangalore Street Discovery homepage banner!`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-mono text-emerald-400 font-semibold uppercase tracking-wider block">
            VISUAL MODERATION COGNITIVE SCREENER
          </span>
          <h2 className="text-2xl font-display font-medium text-slate-100 mt-1">Reels & Media Content Moderation</h2>
          <p className="text-xs text-slate-400">
            Audit automatic computer-vision flags on street cooking video feeds, verify captions, and boost viral gems.
          </p>
        </div>
      </div>

      {/* STATS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl flex items-center gap-3">
          <div className="bg-emerald-500/10 text-emerald-500 p-2 rounded-lg">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Video Impressions</span>
            <span className="text-lg font-bold text-slate-200">88.2K views today</span>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl flex items-center gap-3">
          <div className="bg-amber-500/10 text-amber-500 p-2 rounded-lg">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">AI Flags Under Review</span>
            <span className="text-lg font-bold text-amber-500">
              {posts.filter((p) => p.status === 'Flagged').length} triggers active
            </span>
          </div>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 p-4 rounded-xl flex items-center gap-3">
          <div className="bg-blue-500/10 text-blue-400 p-2 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Boosted Marketing Gems</span>
            <span className="text-lg font-bold text-blue-450">3 videos featured</span>
          </div>
        </div>
      </div>

      {/* GRID VIEWS */}
      {activePosts.length === 0 ? (
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          No social video posts require moderating right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activePosts.map((post) => {
            let statusBorderColor = 'border-slate-800';
            if (post.status === 'Flagged') statusBorderColor = 'border-rose-500/30';

            return (
              <div
                key={post.id}
                className={`bg-[#0f172a] border ${statusBorderColor} rounded-2xl overflow-hidden flex flex-col justify-between group/card relative`}
              >
                {/* Visual Video Thumbnail Placeholder */}
                <div className="relative aspect-[9/10] bg-[#0c101b] border-b border-slate-850 flex flex-col items-center justify-center p-5 text-center text-slate-400 select-none overflow-hidden">
                  {/* Glowing camera lens overlay */}
                  <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0f172a]/20 to-[#0c101b] z-10"></div>
                  
                  {/* Decorative background visualizers representing video lines */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-center gap-1 opacity-20 z-0">
                    <span className="w-1 bg-emerald-400 h-10 animate-pulse"></span>
                    <span className="w-1 bg-emerald-400 h-6 animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1 bg-emerald-400 h-12 animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                    <span className="w-1 bg-emerald-400 h-4 animate-pulse" style={{ animationDelay: '0.6s' }}></span>
                    <span className="w-1 bg-emerald-400 h-8 animate-pulse" style={{ animationDelay: '0.8s' }}></span>
                  </div>

                  <span className="text-[44px] block mb-2 relative z-10 opacity-70">🎥</span>
                  <span className="text-xs font-mono font-semibold text-slate-300 relative z-10">
                    {post.videoPlaceholderText}
                  </span>
                  
                  {/* Text subheadline */}
                  <p className="text-[10px] text-slate-500 italic mt-2 max-w-[200px] leading-tight relative z-10">
                    {post.foodPhotoUrl}
                  </p>

                  {/* Views / Likes badge overhead */}
                  <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-800 rounded px-2 py-0.5 text-[9px] font-mono text-slate-300 flex items-center gap-1.5 z-20">
                    <Eye className="w-3 h-3 text-slate-400" /> {post.views.toLocaleString()}
                    <span className="text-slate-650">|</span>
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500/20" /> {post.likes.toLocaleString()}
                  </div>

                  {post.status === 'Flagged' && (
                    <div className="absolute top-3 right-3 bg-rose-500/10 border border-rose-500/25 rounded px-2 py-0.5 text-[9px] font-mono text-rose-400 font-bold uppercase z-20 animate-pulse">
                      🚨 Moderation Flag
                    </div>
                  )}
                </div>
                {/* Text and Caption */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono text-emerald-400 block font-semibold">
                      {post.vendorName}
                    </span>
                    <p className="text-[11px] text-zinc-300 line-clamp-3 leading-normal font-sans italic">
                      "{post.caption}"
                    </p>
                  </div>

                  {moderationErrors[post.id] && (
                    <div className="bg-rose-500/10 border border-rose-500/25 rounded-xl p-3 text-xs text-rose-400 font-mono mt-3">
                      🚨 <strong>Screening Failed:</strong> {moderationErrors[post.id]}
                    </div>
                  )}

                  {/* Gemini Live Scan Diagnostic Box */}
                  {moderationScans[post.id] && (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 space-y-2 select-none text-[10px] font-mono mt-3">
                      <div className="flex items-center justify-between text-[9px] font-bold text-emerald-400">
                        <span className="flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-emerald-400 animate-pulse" /> GEMINI MODERATOR
                        </span>
                        <span>CONFIDENCE: {Math.round(moderationScans[post.id].confidence * 100)}%</span>
                      </div>
                      <div className="text-zinc-350">
                        {moderationScans[post.id].reason}
                      </div>
                      {moderationScans[post.id].safesensors && (
                        <div className="grid grid-cols-2 gap-1 text-[8.5px] border-t border-white/5 pt-1.5 text-zinc-550">
                          <span>UNHYGIENIC: <strong className="text-zinc-300">{moderationScans[post.id].safesensors.unhygienicSigns}</strong></span>
                          <span>SAFETY SENSOR: <strong className="text-zinc-300">{moderationScans[post.id].safesensors.violence}</strong></span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* AI Flags detailed panel */}
                  {post.aiFlags.length > 0 && (
                    <div className="bg-[#0b0f19] border border-slate-850 p-2.5 rounded-xl space-y-1 mt-3">
                      <span className="text-[9px] font-mono text-amber-500 font-bold uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> COMPUTER VISION SIGNALS:
                      </span>
                      {post.aiFlags.map((flag, i) => (
                        <div key={i} className="text-[10px] text-slate-400 flex items-center gap-1">
                          <span className="text-rose-455">•</span> {flag}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action controls */}
                <div className="p-4 border-t border-slate-850 bg-slate-900/20 flex flex-col gap-2">
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleTriggerAIScreen(post)}
                      disabled={moderatingPostId === post.id}
                      className="flex-1 py-1.5 bg-[#10b981]/10 hover:bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/15 text-[11px] font-bold rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5"
                    >
                      {moderatingPostId === post.id ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Screening...
                        </>
                      ) : (
                        <>
                          <Cpu className="w-3.5 h-3.5" /> Gemini Screen
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        onUpdatePostStatus(post.id, 'Approved');
                        onTriggerActionToast(`Content verified & cleared for ${post.id}.`);
                      }}
                      className="py-1.5 px-2 bg-slate-800 hover:bg-slate-750 text-slate-350 text-[11px] font-medium rounded-lg transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        onUpdatePostStatus(post.id, 'Removed');
                        onTriggerActionToast(`Media removed & isolated from platform search for ${post.id}.`);
                      }}
                      className="py-1.5 px-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-455 border border-rose-500/10 text-[11px] font-medium rounded-lg transition"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => handleFeatureContent(post.vendorName)}
                      className="flex-1 py-1 px-2.5 bg-slate-800 hover:bg-slate-750 text-slate-300 text-[10px] font-medium rounded-lg transition flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-amber-400" /> Boost Content
                    </button>
                    <button
                      onClick={() => handleWarnVendor(post.vendorName)}
                      className="flex-1 py-1 px-2.5 bg-[#ef4444]/5 hover:bg-[#ef4444]/15 text-rose-450 text-[10px] font-medium rounded-lg transition border border-[#ef4444]/10"
                    >
                      Warn Vendor
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
