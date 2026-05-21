import { X, AlertTriangle, ShieldAlert, CheckCircle, Info } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type: 'approve' | 'reject' | 'suspend' | 'delete' | 'warning';
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const getStyle = () => {
    switch (type) {
      case 'approve':
        return {
          icon: <CheckCircle className="w-5 h-5 text-emerald-400" />,
          glow: 'shadow-[0_0_50px_rgba(16,185,129,0.12)] border-emerald-500/20',
          btn: 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold',
          circleBg: 'bg-emerald-500/10 border-emerald-500/20'
        };
      case 'delete':
      case 'reject':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-rose-400" />,
          glow: 'shadow-[0_0_50px_rgba(239,68,68,0.12)] border-rose-500/20',
          btn: 'bg-rose-500 hover:bg-rose-600 text-white font-bold',
          circleBg: 'bg-rose-500/10 border-rose-500/20'
        };
      case 'suspend':
        return {
          icon: <ShieldAlert className="w-5 h-5 text-amber-400" />,
          glow: 'shadow-[0_0_50px_rgba(245,158,11,0.12)] border-amber-500/20',
          btn: 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold',
          circleBg: 'bg-amber-500/10 border-amber-500/20'
        };
      default:
        return {
          icon: <Info className="w-5 h-5 text-blue-400" />,
          glow: 'shadow-[0_0_50px_rgba(59,130,246,0.12)] border-blue-500/20',
          btn: 'bg-[#3b82f6] hover:bg-blue-600 text-slate-950 font-bold',
          circleBg: 'bg-blue-500/10 border-blue-500/20'
        };
    }
  };

  const style = getStyle();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with elegant blur */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className={`w-full max-w-md bg-[#161618] border border-white/5 rounded-3xl p-6 relative z-10 transition-all duration-350 transform scale-100 ${style.glow}`}>
        
        {/* Header Indicators */}
        <div className="flex justify-between items-start mb-4">
          <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${style.circleBg}`}>
            {style.icon}
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-2.5 bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-white/5 rounded-xl transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informational Text */}
        <div className="space-y-2 mb-6 text-left">
          <h3 className="text-base font-semibold font-display text-white">{title}</h3>
          <p className="text-slate-400 text-xs leading-relaxed">{message}</p>
        </div>

        {/* Buttons Panel */}
        <div className="flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-[#0d0d0f] border border-white/5 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold cursor-pointer transition"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs cursor-pointer transition ${style.btn}`}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}
