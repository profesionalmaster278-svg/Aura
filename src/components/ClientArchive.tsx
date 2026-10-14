import React, { useState } from 'react';
import { ConsultationTicket } from '../types';
import { FileText, Trash2, ArrowRight, Calendar, MessageSquare, Edit3, BarChart3, ListFilter } from 'lucide-react';
import { SalonAnalytics } from './SalonAnalytics';

interface ClientArchiveProps {
  tickets: ConsultationTicket[];
  onSelectTicket: (ticket: ConsultationTicket) => void;
  onDeleteTicket: (ticketId: string) => void;
  onOpenStudio: () => void;
}

export const ClientArchive: React.FC<ClientArchiveProps> = ({
  tickets,
  onSelectTicket,
  onDeleteTicket,
  onOpenStudio,
}) => {
  const [subView, setSubView] = useState<'tickets' | 'analytics'>('tickets');

  return (
    <div className="flex flex-col gap-6">
      {/* Header and Sub-Navigation Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-neutral-100">
            Client Archive & Salon Analytics
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Persisted digital consultation tickets, stylist client notes, and real-time hair-type frequency diagnostics
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Segmented Sub-View Switcher */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900 rounded-lg border border-neutral-800">
            <button
              onClick={() => {
                navigator.vibrate?.(15);
                setSubView('tickets');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                subView === 'tickets'
                  ? 'bg-[#E0A99A] text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tickets ({tickets.length})</span>
            </button>

            <button
              onClick={() => {
                navigator.vibrate?.(15);
                setSubView('analytics');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                subView === 'analytics'
                  ? 'bg-[#E0A99A] text-neutral-950 font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Salon Analytics</span>
            </button>
          </div>

          <button
            onClick={onOpenStudio}
            className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <span>Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Render Subview: Analytics View */}
      {subView === 'analytics' && (
        <SalonAnalytics tickets={tickets} />
      )}

      {/* Render Subview: Consultation Tickets Grid */}
      {subView === 'tickets' && (
        <div>
          {tickets.length === 0 ? (
            <div className="bg-neutral-900/30 border border-neutral-800 rounded-xl p-12 text-center flex flex-col items-center justify-center">
              <FileText className="w-10 h-10 text-neutral-600 mb-3" />
              <h3 className="text-base font-serif font-medium text-neutral-300">No Saved Consultations</h3>
              <p className="text-xs text-neutral-500 max-w-sm mt-1">
                Perform an AI Cranial Mapping scan or select a hairstyle model to export and save official tickets with stylist notes.
              </p>
              <button
                onClick={onOpenStudio}
                className="mt-4 px-4 py-2 bg-[#E0A99A] hover:bg-[#d89c8c] text-neutral-950 font-semibold text-xs rounded-lg transition-colors"
              >
                Start First Consultation
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tickets.map((t) => (
                <div
                  key={t.ticketId}
                  className="bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 rounded-xl p-5 flex flex-col justify-between transition-all shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="text-[11px] font-mono text-[#E0A99A] uppercase">
                          ID: {t.ticketId}
                        </div>
                        <h3 className="text-lg font-serif font-semibold text-neutral-100 mt-0.5">
                          {t.clientName}
                        </h3>
                      </div>

                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-neutral-950 text-[#E0A99A] border border-neutral-800">
                        {t.faceShape} ({t.symmetryScore}%)
                      </span>
                    </div>

                    <div className="text-xs text-neutral-300 font-medium mb-1">
                      Style: <span className="text-neutral-100">{t.selectedStyleName}</span>
                    </div>

                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                      {t.shearProtocol}
                    </p>

                    {/* Stylist Personal Notes Preview */}
                    {t.notes && (
                      <div className="mb-3 p-2.5 rounded-lg bg-neutral-950/80 border border-neutral-800/90 text-[11px] text-neutral-300">
                        <div className="font-mono text-[#E0A99A] text-[10px] uppercase flex items-center gap-1.5 mb-1 font-semibold">
                          <MessageSquare className="w-3 h-3 text-[#E0A99A]" />
                          <span>Stylist Notes:</span>
                        </div>
                        <p className="text-neutral-300 leading-relaxed italic">
                          "{t.notes}"
                        </p>
                      </div>
                    )}

                    <div className="text-[11px] text-neutral-500 font-mono flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{t.timestamp}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                    <button
                      onClick={() => onSelectTicket(t)}
                      className="text-xs font-semibold text-[#E0A99A] hover:text-[#d89c8c] flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>View & Edit Ticket</span>
                    </button>

                    <button
                      onClick={() => {
                        navigator.vibrate?.(15);
                        onDeleteTicket(t.ticketId);
                      }}
                      className="p-1.5 text-neutral-500 hover:text-red-400 rounded transition-colors"
                      title="Delete ticket"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
