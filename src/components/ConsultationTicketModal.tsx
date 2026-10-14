import React, { useState, useEffect } from 'react';
import { ConsultationTicket } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  Printer,
  Copy,
  Check,
  X,
  Sparkles,
  Scissors,
  Clock,
  Edit3,
  MessageSquare,
  Mail,
  Send,
  AlertTriangle,
  Loader2,
  Database,
} from 'lucide-react';
import { User } from 'firebase/auth';
import { sendConsultationEmail } from '../lib/gmail.ts';

interface ConsultationTicketModalProps {
  ticket: ConsultationTicket;
  isOpen: boolean;
  onClose: () => void;
  onSaveToArchive: (ticket: ConsultationTicket) => void;
  currentUser?: User | null;
  onSignInWithGoogle?: () => void;
}

export const ConsultationTicketModal: React.FC<ConsultationTicketModalProps> = ({
  ticket,
  isOpen,
  onClose,
  onSaveToArchive,
  currentUser,
  onSignInWithGoogle,
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notesSaveStatus, setNotesSaveStatus] = useState<'saved' | 'idle'>('idle');
  const [stylistNotes, setStylistNotes] = useState(ticket.notes || '');

  // Quick observation tags for busy stylists
  const QUICK_STYLIST_TAGS = [
    'Fine texture / high density',
    'Clockwise crown whorl',
    'Scalp sensitivity',
    'Air-dry low maintenance',
    'Preserve natural hairline',
    'Porous ends / moisture needed',
  ];

  // Gmail Drawer / Modal state
  const [isEmailViewOpen, setIsEmailViewOpen] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [isConfirmedToSend, setIsConfirmedToSend] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSuccessMessage, setEmailSuccessMessage] = useState<string | null>(null);
  const [emailErrorMessage, setEmailErrorMessage] = useState<string | null>(null);

  // Keep notes synchronized when ticket changes
  useEffect(() => {
    setStylistNotes(ticket.notes || '');
    setNotesSaveStatus('idle');
    // Pre-populate email fields
    setEmailSubject(`[Aura Crown & Cut] Consultation Ticket & Technical Brief - ${ticket.clientName}`);
    setIsConfirmedToSend(false);
    setEmailSuccessMessage(null);
    setEmailErrorMessage(null);
  }, [ticket]);

  const getUpdatedTicket = (): ConsultationTicket => ({
    ...ticket,
    notes: stylistNotes.trim(),
  });

  const handleSaveNotes = () => {
    navigator.vibrate?.(15);
    const updated = getUpdatedTicket();
    onSaveToArchive(updated);
    setNotesSaveStatus('saved');
    setTimeout(() => setNotesSaveStatus('idle'), 2500);
  };

  const handleAddQuickTag = (tag: string) => {
    navigator.vibrate?.(10);
    const updatedText = stylistNotes.trim() ? `${stylistNotes.trim()} • ${tag}` : tag;
    setStylistNotes(updatedText);
    const updated = {
      ...ticket,
      notes: updatedText,
    };
    onSaveToArchive(updated);
    setNotesSaveStatus('saved');
    setTimeout(() => setNotesSaveStatus('idle'), 2500);
  };

  const handleSafeClose = () => {
    if (stylistNotes !== (ticket.notes || '')) {
      const updated = getUpdatedTicket();
      onSaveToArchive(updated);
    }
    onClose();
  };

  const getFormattedEmailBody = (currentTicket: ConsultationTicket): string => {
    return `AURA CROWN & CUT AI - OFFICIAL SALON & BARBERSHOP CONSULTATION BRIEF

Ticket ID: ${currentTicket.ticketId}
Date: ${currentTicket.timestamp}
Client Name: ${currentTicket.clientName}
Lead Stylist: ${currentTicket.stylistName}

==================================================
BIOMETRIC CRANIAL ARCHITECTURE
==================================================
Face Architecture: ${currentTicket.faceShape}
Symmetry Score: ${currentTicket.symmetryScore}%
Prescribed Silhouette: ${currentTicket.selectedStyleName} (${currentTicket.styleCategory})

==================================================
TECHNICAL SALON FORMULAS & PROTOCOLS
==================================================
[A] Clipper & Perimeter Specifications:
${currentTicket.barberClipperSpecs}

[B] Shear Work & Sectioning Geometry:
${currentTicket.shearProtocol}

[C] Color Formulation & Gloss Glaze:
${currentTicket.colorFormula}

[D] Prescribed Home Care Regimen:
${currentTicket.finishPrescription}

==================================================
STYLIST PERSONAL OBSERVATIONS
==================================================
${currentTicket.notes || 'No special notes recorded.'}

Recommended Rebooking Cadence: ${currentTicket.rebookingWeeks} weeks.

Verified by Aura Atelier AI Cranial Biometrics.`;
  };

  const handlePrint = () => {
    navigator.vibrate?.(15);
    const updated = getUpdatedTicket();
    onSaveToArchive(updated);
    window.print();
  };

  const handleCopySummary = () => {
    navigator.vibrate?.(15);
    const updated = getUpdatedTicket();
    onSaveToArchive(updated);
    const text = getFormattedEmailBody(updated);

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    navigator.vibrate?.(15);
    const updated = getUpdatedTicket();
    onSaveToArchive(updated);
    setSaved(true);
    setNotesSaveStatus('saved');
    setTimeout(() => {
      setSaved(false);
      setNotesSaveStatus('idle');
    }, 2000);
  };

  const handleTriggerEmailView = () => {
    navigator.vibrate?.(15);
    setIsEmailViewOpen(true);
    setEmailErrorMessage(null);
    setEmailSuccessMessage(null);
  };

  const handleSendGmail = async () => {
    if (!recipientEmail || !recipientEmail.includes('@')) {
      setEmailErrorMessage('Please enter a valid recipient email address.');
      return;
    }

    if (!isConfirmedToSend) {
      setEmailErrorMessage('Please verify and check the confirmation box before sending.');
      return;
    }

    setIsSendingEmail(true);
    setEmailErrorMessage(null);
    setEmailSuccessMessage(null);

    try {
      const updated = getUpdatedTicket();
      const body = getFormattedEmailBody(updated);

      const result = await sendConsultationEmail({
        to: recipientEmail.trim(),
        subject: emailSubject.trim(),
        body,
      });

      if (result.success) {
        setEmailSuccessMessage(`Consultation brief successfully sent via Gmail! (Message ID: ${result.messageId || 'Delivered'})`);
        setIsConfirmedToSend(false);
      }
    } catch (err: any) {
      console.error('Failed to send email:', err);
      setEmailErrorMessage(err.message || 'Failed to send email. Please check your Gmail authorization.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleSafeClose();
          }}
        >
          {/* Modal Container with Spring Scale-Up & Fade Entry */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 18 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-[#0e0e12] border border-neutral-800/90 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-neutral-100"
          >
            {/* Close Button */}
            <button
              onClick={handleSafeClose}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Ticket Container */}
            <div id="printable-ticket" className="flex flex-col gap-6">
              {/* Ticket Header Lockup */}
              <div className="border-b border-neutral-800 pb-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-widest text-[#E0A99A]">
                    Official Salon & Barbershop Prescription
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-neutral-100 mt-1">
                    Aura Crown & Cut AI
                  </h1>
                </div>

                <div className="text-left sm:text-right font-mono text-xs text-neutral-400">
                  <div>ID: <span className="text-neutral-200">{ticket.ticketId}</span></div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">{ticket.timestamp}</div>
                </div>
              </div>

              {/* Client & Cranial Diagnostic Block */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-4 text-xs">
                <div>
                  <div className="text-neutral-500 font-mono text-[10px] uppercase">Client Name</div>
                  <div className="font-semibold text-neutral-200 text-sm mt-0.5">{ticket.clientName}</div>
                </div>
                <div>
                  <div className="text-neutral-500 font-mono text-[10px] uppercase">Face Architecture</div>
                  <div className="font-semibold text-[#E0A99A] text-sm mt-0.5">{ticket.faceShape}</div>
                </div>
                <div>
                  <div className="text-neutral-500 font-mono text-[10px] uppercase">Symmetry Index</div>
                  <div className="font-semibold text-neutral-200 text-sm mt-0.5">{ticket.symmetryScore}%</div>
                </div>
                <div>
                  <div className="text-neutral-500 font-mono text-[10px] uppercase">Lead Stylist</div>
                  <div className="font-semibold text-neutral-200 text-sm mt-0.5">{ticket.stylistName}</div>
                </div>
              </div>

              {/* Target Silhouette Prescription */}
              <div className="bg-neutral-900/30 border border-neutral-800/80 rounded-xl p-4">
                <div className="text-[11px] font-mono text-[#E0A99A] uppercase tracking-wider mb-1">
                  Prescribed Hairstyle / Hairpiece
                </div>
                <div className="text-lg font-serif font-semibold text-neutral-100">
                  {ticket.selectedStyleName}
                </div>
                <div className="text-xs text-neutral-400 mt-0.5 font-mono">
                  Category: {ticket.styleCategory}
                </div>
              </div>

              {/* Technical Salon Formulas & Protocols */}
              <div className="space-y-3 text-xs">
                <div className="border border-neutral-800/80 rounded-lg p-3 bg-neutral-900/20">
                  <span className="font-mono text-[#E0A99A] font-semibold uppercase text-[10px] block mb-1">
                    [A] Clipper & Perimeter Specifications:
                  </span>
                  <p className="text-neutral-300 leading-relaxed">{ticket.barberClipperSpecs}</p>
                </div>

                <div className="border border-neutral-800/80 rounded-lg p-3 bg-neutral-900/20">
                  <span className="font-mono text-[#E0A99A] font-semibold uppercase text-[10px] block mb-1">
                    [B] Shear Work & Sectioning Geometry:
                  </span>
                  <p className="text-neutral-300 leading-relaxed">{ticket.shearProtocol}</p>
                </div>

                <div className="border border-neutral-800/80 rounded-lg p-3 bg-neutral-900/20">
                  <span className="font-mono text-[#E0A99A] font-semibold uppercase text-[10px] block mb-1">
                    [C] Color Formulation & Gloss Glaze:
                  </span>
                  <p className="text-neutral-300 leading-relaxed">{ticket.colorFormula}</p>
                </div>

                <div className="border border-neutral-800/80 rounded-lg p-3 bg-neutral-900/20">
                  <span className="font-mono text-[#E0A99A] font-semibold uppercase text-[10px] block mb-1">
                    [D] Prescribed Home Care Regimen:
                  </span>
                  <p className="text-neutral-300 leading-relaxed">{ticket.finishPrescription}</p>
                </div>
              </div>

              {/* Stylist Free-Text Personal Notes Field */}
              <div className="border border-[#262633] rounded-xl p-4 bg-[#14141B] shadow-inner">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <label htmlFor="stylist-notes" className="font-mono text-[#E0A99A] font-semibold uppercase text-[10px] flex items-center gap-1.5 cursor-pointer">
                    <Edit3 className="w-3.5 h-3.5" />
                    Stylist Personal Notes & Client Observations
                  </label>

                  <div className="flex items-center gap-2">
                    {notesSaveStatus === 'saved' ? (
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                        <Check className="w-3 h-3 text-emerald-400" />
                        Saved in localStorage
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-500 font-mono">
                        Auto-saves to localStorage on blur
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={handleSaveNotes}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-[#E0A99A] border border-neutral-700 hover:border-[#E0A99A]/50 transition-colors"
                      title="Save notes directly to localStorage ticket archive"
                    >
                      Save Note
                    </button>
                  </div>
                </div>

                {/* Quick Observation Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider mr-1">Quick Tags:</span>
                  {QUICK_STYLIST_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddQuickTag(tag)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 border border-neutral-800 hover:border-neutral-700 transition-colors"
                    >
                      +{tag}
                    </button>
                  ))}
                </div>

                <textarea
                  id="stylist-notes"
                  value={stylistNotes}
                  onChange={(e) => setStylistNotes(e.target.value)}
                  onBlur={() => {
                    if (stylistNotes !== (ticket.notes || '')) {
                      handleSaveNotes();
                    }
                  }}
                  rows={3}
                  placeholder="Record personal notes about this client (e.g., sensitive scalp near occipital ridge, clockwise crown whorl, prefers matte styling clay, air-dry routine, previous color allergy test passed)..."
                  className="w-full bg-[#0B0B0E] border border-[#262633] focus:border-[#E0A99A] rounded-lg p-3 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none transition-colors resize-none leading-relaxed"
                />

                <div className="flex items-center justify-between mt-2 text-[10px] text-neutral-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3 text-[#E0A99A]" />
                    <span>Included in printed tickets, digital exports, and salon records</span>
                  </div>
                  <span className="text-neutral-500">{stylistNotes.length} chars</span>
                </div>
              </div>

              {/* Ticket Footer / Rebooking & Signatures */}
              <div className="pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#E0A99A]" />
                  <span>Recommended Rebooking: <strong className="text-neutral-200">{ticket.rebookingWeeks} weeks</strong></span>
                </div>

                <div className="text-left sm:text-right font-serif italic text-sm text-neutral-400">
                  Verified by Aura Atelier AI Cranial Mapping
                </div>
              </div>
            </div>

            {/* Gmail Sending Drawer / Section */}
            {isEmailViewOpen && (
              <div className="mt-6 pt-5 border-t border-neutral-800 bg-neutral-950/60 p-5 rounded-xl border border-amber-500/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-neutral-200">
                    <Mail className="w-4 h-4 text-red-400" />
                    <span>Send Consultation Brief via Gmail</span>
                  </div>
                  <button
                    onClick={() => setIsEmailViewOpen(false)}
                    className="text-xs text-neutral-400 hover:text-neutral-200"
                  >
                    Cancel
                  </button>
                </div>

                {!currentUser ? (
                  <div className="flex flex-col items-center text-center p-4 bg-neutral-900/60 rounded-lg border border-neutral-800 gap-3">
                    <p className="text-xs text-neutral-300">
                      Sign in with your Google account to send this technical consultation card directly through your authorized Gmail.
                    </p>
                    {onSignInWithGoogle && (
                      <button
                        onClick={onSignInWithGoogle}
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700 text-xs font-semibold rounded-lg transition-colors shadow-sm"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                        </svg>
                        <span>Sign in with Google to Connect Gmail</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-[11px] text-neutral-400 font-mono">
                      Sending from: <span className="text-emerald-400">{currentUser.email}</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Recipient Email Address:
                      </label>
                      <input
                        type="email"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="client.name@gmail.com or salon@atelier.com"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Subject Line:
                      </label>
                      <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Mandatory User Confirmation Checkpoint */}
                    <div className="bg-amber-950/20 border border-amber-800/40 rounded-lg p-3 text-xs text-amber-200">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <label className="flex items-center gap-2 cursor-pointer text-[11px] leading-tight select-none">
                          <input
                            type="checkbox"
                            checked={isConfirmedToSend}
                            onChange={(e) => setIsConfirmedToSend(e.target.checked)}
                            className="rounded border-neutral-700 text-amber-400 focus:ring-0"
                          />
                          <span>
                            I confirm and authorize sending this technical consultation brief and notes to <strong className="text-neutral-100">{recipientEmail || '[recipient]'}</strong> on my behalf using Gmail.
                          </span>
                        </label>
                      </div>
                    </div>

                    {emailErrorMessage && (
                      <div className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 p-2.5 rounded-lg">
                        {emailErrorMessage}
                      </div>
                    )}

                    {emailSuccessMessage && (
                      <div className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 p-2.5 rounded-lg flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>{emailSuccessMessage}</span>
                      </div>
                    )}

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEmailViewOpen(false)}
                        className="px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSendGmail}
                        disabled={isSendingEmail || !isConfirmedToSend}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
                      >
                        {isSendingEmail ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Sending via Gmail...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Confirm & Send via Gmail</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modal Action Buttons */}
            <div className="mt-8 pt-5 border-t border-neutral-800 flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={handleTriggerEmailView}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-medium rounded-lg border border-neutral-700 transition-colors flex items-center gap-1.5"
                title="Send official consultation brief via connected Gmail account"
              >
                <Mail className="w-3.5 h-3.5 text-red-400" />
                <span>Email via Gmail</span>
              </button>

              <button
                onClick={handleCopySummary}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-medium rounded-lg border border-neutral-700 transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Brief' : 'Copy Digital Summary'}</span>
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-medium rounded-lg border border-neutral-700 transition-colors flex items-center gap-1.5"
              >
                {saved ? <Check className="w-3.5 h-3.5 text-[#E0A99A]" /> : <Sparkles className="w-3.5 h-3.5 text-[#E0A99A]" />}
                <span>{saved ? 'Saved to Book' : 'Save to Client Book & Cloud'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-[#E0A99A] hover:bg-[#d89c8c] text-neutral-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Consultation Ticket</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
