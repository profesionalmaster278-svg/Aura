import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Lock, EyeOff, Check, X } from 'lucide-react';

interface PrivacyConsentModalProps {
  isOpen: boolean;
  onAgree: () => void;
  onClose: () => void;
}

export const PrivacyConsentModal: React.FC<PrivacyConsentModalProps> = ({
  isOpen,
  onAgree,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[#0e0e12] border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-7 text-neutral-100"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-900 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-[#E0A99A]/10 border border-[#E0A99A]/30 text-[#E0A99A]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-serif font-semibold text-neutral-100">
                  AI Cranial Mapping & Biometric Privacy
                </h2>
                <div className="text-xs font-mono text-neutral-400">
                  Compliant with GDPR, COPPA & App Store 5.1.2
                </div>
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              Aura Crown & Cut AI is committed to biological privacy and ethical computer vision. Please review our architectural invariants:
            </p>

            <div className="space-y-2.5 text-xs text-neutral-300 mb-6">
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
                <Lock className="w-4 h-4 text-[#E0A99A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-200">Local Cranial Ratios:</strong> Camera frames are processed for anatomical proportions (facial thirds, gonial jaw angles, hairline contour) with zero facial recognition or identity tracking.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
                <EyeOff className="w-4 h-4 text-[#E0A99A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-200">24-Hour Ephemeral Storage:</strong> Any snapshot analyzed for AR Hairstyle Preview is strictly ephemeral and auto-purged from edge memory within 24 hours.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/80">
                <ShieldCheck className="w-4 h-4 text-[#E0A99A] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-200">Kids Safety Invariant (Under 13):</strong> If demographic tier is calibrated for youth/kids, all external cloud generation is locked; rendering falls back strictly to local on-device 2D landmark anchors.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800/80">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                Review Later
              </button>
              <button
                onClick={() => {
                  navigator.vibrate?.(15);
                  onAgree();
                }}
                className="px-5 py-2 rounded-lg bg-[#E0A99A] hover:bg-[#d89c8c] text-neutral-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Agree & Continue</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
