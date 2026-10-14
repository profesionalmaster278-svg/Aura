import React, { useState, useEffect } from 'react';
import { ClientProfile, HairstyleModel, ConsultationTicket } from './types';
import { PRESET_CLIENT_PROFILES } from './data/presetProfiles';
import { HAIRSTYLE_CATALOG, HAIR_COLORS } from './data/hairstyleCatalog';
import { TopBar } from './components/TopBar';
import { StyleStudio } from './components/StyleStudio';
import { TechnicalExecutionBrief } from './components/TechnicalExecutionBrief';
import { ConsultationTicketModal } from './components/ConsultationTicketModal';
import { ClientArchive } from './components/ClientArchive';
import { PrivacyConsentModal } from './components/PrivacyConsentModal';
import { initAuth, googleSignIn, logout, db } from './lib/firebase';
import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'catalog' | 'execution' | 'archive'>('studio');
  const [currentProfile, setCurrentProfile] = useState<ClientProfile>(PRESET_CLIENT_PROFILES[0]);
  const [selectedStyle, setSelectedStyle] = useState<HairstyleModel>(HAIRSTYLE_CATALOG[0]);
  const [selectedColorHex, setSelectedColorHex] = useState<string>(HAIR_COLORS[2].hex); // Honey Caramel
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  
  // Firebase & Workspace Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Ticket Modal state & currently viewed ticket
  const [isTicketModalOpen, setIsTicketModalOpen] = useState<boolean>(false);
  const [activeTicket, setActiveTicket] = useState<ConsultationTicket | null>(null);

  // Privacy Consent Modal state
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);

  // Stored tickets in localStorage with realistic Stylist Personal Notes
  const [tickets, setTickets] = useState<ConsultationTicket[]>(() => {
    try {
      const saved = localStorage.getItem('aura_consultation_tickets');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    // Seed initial high-end consultation records
    return [
      {
        ticketId: 'AUR-9402',
        timestamp: 'Oct 12, 2026 · 11:30 AM',
        clientName: 'Sophia Laurent',
        stylistName: 'Atelier Director Julian Cole',
        faceShape: 'Oval',
        symmetryScore: 96,
        selectedStyleName: 'Italian Sculpted Bob with French Fringe',
        styleCategory: 'Precision Cut',
        barberClipperSpecs: 'Clean hairline outline with zero-gap detailer; gentle nape cleanup.',
        shearProtocol: '0-degree blunt baseline at jawline; 45-degree interior graduation to remove bulk; slide-cut curtain fringe.',
        colorFormula: 'Level 6.1 Cool Ash base with hand-painted Level 8.32 Warm Caramel ribbons; 10 vol developer toner gloss.',
        finishPrescription: 'Hydrating prep primer, lightweight heat-activated smoothing serum, botanical argan shine mist.',
        rebookingWeeks: 6,
        notes: 'Client has fine texture but high density. Gentle counter-clockwise whorl on left vertex. Prefers weightless argan elixir over holding sprays. Requested curtain fringe to accentuate cheekbone height.',
      },
      {
        ticketId: 'AUR-9403',
        timestamp: 'Oct 10, 2026 · 02:15 PM',
        clientName: 'Marcus Vance',
        stylistName: 'Master Barber David Ruiz',
        faceShape: 'Square',
        symmetryScore: 92,
        selectedStyleName: 'Precision Low Skin Taper with Textured Crop',
        styleCategory: 'Taper / Fade',
        barberClipperSpecs: '#0 foil shaver at base, #0.5 open lever taper, #1.5 guard at parietal ridge, clipper-over-comb finish.',
        shearProtocol: '90-degree uniform crown elevation with aggressive deep notch point-cutting for jagged separation.',
        colorFormula: 'Natural Jet Slate tone with subtle matte charcoal anti-shine wash.',
        finishPrescription: 'Matte styling clay with bentonite earth, sea salt pre-styler, zero-shine hair spray.',
        rebookingWeeks: 3,
        notes: 'Resilient coarse 1C hair. Keep temple lineup natural with zero enhancement spray. Occipital bone is prominent—maintain soft taper transition.',
      },
    ];
  });

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => setCurrentUser(user),
      () => setCurrentUser(null)
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Sync tickets from Cloud SQL if available
  useEffect(() => {
    const fetchCloudTickets = async () => {
      try {
        const res = await fetch('/api/consultations');
        if (res.ok) {
          const data = await res.json();
          if (data.consultations && Array.isArray(data.consultations) && data.consultations.length > 0) {
            setTickets((prev) => {
              const existingIds = new Set(prev.map((t) => t.ticketId));
              const newItems: ConsultationTicket[] = data.consultations
                .filter((c: any) => !existingIds.has(c.ticketId))
                .map((c: any) => ({
                  ticketId: c.ticketId,
                  timestamp: new Date(c.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  }),
                  clientName: c.clientName,
                  stylistName: 'Aura Master Specialist',
                  faceShape: c.faceShape,
                  symmetryScore: c.symmetryScore || 94,
                  selectedStyleName: c.selectedStyleName,
                  styleCategory: c.styleCategory || 'Precision Cut',
                  barberClipperSpecs: '#0.5 open lever taper to perimeter baseline',
                  shearProtocol: '45-degree interior graduation with soft texturizing shears',
                  colorFormula: 'Bespoke gloss tone with conditioning bond multiplier',
                  finishPrescription: 'Lightweight styling elixir and thermal protector',
                  rebookingWeeks: c.rebookingWeeks || 4,
                  notes: c.notes || '',
                }));
              return [...newItems, ...prev];
            });
          }
        }
      } catch (err) {
        // Fallback to local storage silently
      }
    };
    fetchCloudTickets();
  }, []);

  // Sync tickets to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aura_consultation_tickets', JSON.stringify(tickets));
    } catch {
      // Ignore storage errors
    }
  }, [tickets]);

  const handleSignInWithGoogle = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
      }
    } catch (err) {
      console.error('Google Sign In failed:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setCurrentUser(null);
    } catch (err) {
      console.error('Sign Out failed:', err);
    }
  };

  // Handle new consultation reset
  const handleNewConsultation = () => {
    navigator.vibrate?.(15);
    setCurrentProfile(PRESET_CLIENT_PROFILES[0]);
    setSelectedStyle(HAIRSTYLE_CATALOG[0]);
    setSelectedColorHex(HAIR_COLORS[2].hex);
    setActiveTab('studio');
  };

  // Generate current ticket from active studio state
  const createCurrentStudioTicket = (): ConsultationTicket => ({
    ticketId: `AUR-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    clientName: currentProfile.name,
    stylistName: currentUser?.displayName || 'Aura Master Specialist',
    faceShape: currentProfile.faceShape,
    symmetryScore: currentProfile.biometricAnalysis.symmetryScore,
    selectedStyleName: selectedStyle.name,
    styleCategory: selectedStyle.category,
    barberClipperSpecs: selectedStyle.clipperGuard || currentProfile.biometricAnalysis.technicalSalonBrief.clipperSpecs,
    shearProtocol: selectedStyle.shearTechnique || currentProfile.biometricAnalysis.technicalSalonBrief.shearWork,
    colorFormula: selectedStyle.recommendedColor || currentProfile.biometricAnalysis.technicalSalonBrief.colorFormulation,
    finishPrescription: currentProfile.biometricAnalysis.technicalSalonBrief.finishProducts,
    rebookingWeeks: currentProfile.biometricAnalysis.technicalSalonBrief.maintenanceCadenceWeeks || 4,
    notes: currentProfile.notes || '',
  });

  // Launch modal for current studio brief
  const handleOpenStudioTicket = () => {
    navigator.vibrate?.(15);
    const newTicket = createCurrentStudioTicket();
    setActiveTicket(newTicket);
    setIsTicketModalOpen(true);
  };

  // Launch modal for existing archived ticket
  const handleOpenArchivedTicket = (t: ConsultationTicket) => {
    navigator.vibrate?.(15);
    setActiveTicket(t);
    setIsTicketModalOpen(true);
  };

  // Save or update ticket in client book, Cloud SQL, and Firestore
  const handleSaveToArchive = async (savedTicket: ConsultationTicket) => {
    setTickets((prev) => {
      const existsIndex = prev.findIndex((item) => item.ticketId === savedTicket.ticketId);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = savedTicket;
        return updated;
      }
      return [savedTicket, ...prev];
    });
    setActiveTicket(savedTicket);

    // Persist to Cloud SQL PostgreSQL
    try {
      await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userUid: currentUser?.uid || 'guest_stylist',
          ticketId: savedTicket.ticketId,
          clientName: savedTicket.clientName,
          faceShape: savedTicket.faceShape,
          selectedStyleName: savedTicket.selectedStyleName,
          styleCategory: savedTicket.styleCategory,
          symmetryScore: savedTicket.symmetryScore,
          rebookingWeeks: savedTicket.rebookingWeeks,
          notes: savedTicket.notes || '',
          technicalBriefJson: JSON.stringify({
            barberClipperSpecs: savedTicket.barberClipperSpecs,
            shearProtocol: savedTicket.shearProtocol,
            colorFormula: savedTicket.colorFormula,
            finishPrescription: savedTicket.finishPrescription,
          }),
        }),
      });
    } catch (e) {
      console.warn('Failed to persist consultation to Cloud SQL:', e);
    }

    // Persist to Firebase Firestore if user is authenticated
    if (currentUser) {
      try {
        await setDoc(
          doc(db, 'users', currentUser.uid, 'consultations', savedTicket.ticketId),
          {
            ticketId: savedTicket.ticketId,
            userId: currentUser.uid,
            clientName: savedTicket.clientName,
            faceShape: savedTicket.faceShape,
            selectedStyleName: savedTicket.selectedStyleName,
            styleCategory: savedTicket.styleCategory,
            symmetryScore: savedTicket.symmetryScore,
            rebookingWeeks: savedTicket.rebookingWeeks,
            notes: savedTicket.notes || '',
            timestamp: savedTicket.timestamp,
          },
          { merge: true }
        );
      } catch (e) {
        console.warn('Failed to persist consultation to Firestore:', e);
      }
    }
  };

  const handleDeleteTicket = (ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t.ticketId !== ticketId));
  };

  return (
    <div className="min-h-screen bg-[#0B0B0E] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#E0A99A]/30 selection:text-[#E0A99A]">
      {/* 3-Zone Top Navigation Contract */}
      <TopBar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          navigator.vibrate?.(15);
          setActiveTab(tab);
        }}
        onNewConsultation={handleNewConsultation}
        currentUser={currentUser}
        onSignInWithGoogle={handleSignInWithGoogle}
        onSignOut={handleSignOut}
      />

      {/* Main Atelier Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Studio View: Master Style Studio */}
        {activeTab === 'studio' && (
          <StyleStudio
            currentProfile={currentProfile}
            onSelectProfile={setCurrentProfile}
            onAnalysisComplete={(profile) => {
              setCurrentProfile(profile);
              setIsAnalyzing(false);
            }}
            isAnalyzing={isAnalyzing}
            selectedStyle={selectedStyle}
            onSelectStyle={setSelectedStyle}
            selectedColorHex={selectedColorHex}
            onSelectColorHex={setSelectedColorHex}
            onOpenExecutionBrief={() => setActiveTab('execution')}
            onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
          />
        )}

        {/* Catalog & Hairstyle Simulator View */}
        {activeTab === 'catalog' && (
          <StyleStudio
            currentProfile={currentProfile}
            onSelectProfile={setCurrentProfile}
            onAnalysisComplete={(profile) => {
              setCurrentProfile(profile);
              setIsAnalyzing(false);
            }}
            isAnalyzing={isAnalyzing}
            selectedStyle={selectedStyle}
            onSelectStyle={setSelectedStyle}
            selectedColorHex={selectedColorHex}
            onSelectColorHex={setSelectedColorHex}
            onOpenExecutionBrief={() => setActiveTab('execution')}
            onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
          />
        )}

        {/* Technical Execution Brief View */}
        {activeTab === 'execution' && (
          <TechnicalExecutionBrief
            currentProfile={currentProfile}
            selectedStyle={selectedStyle}
            onGenerateTicket={handleOpenStudioTicket}
          />
        )}

        {/* Client Archive View */}
        {activeTab === 'archive' && (
          <ClientArchive
            tickets={tickets}
            onSelectTicket={handleOpenArchivedTicket}
            onDeleteTicket={handleDeleteTicket}
            onOpenStudio={() => setActiveTab('studio')}
          />
        )}
      </main>

      {/* Exportable Consultation Ticket Modal with Stylist Personal Notes & Gmail Send */}
      {activeTicket && (
        <ConsultationTicketModal
          ticket={activeTicket}
          isOpen={isTicketModalOpen}
          onClose={() => setIsTicketModalOpen(false)}
          onSaveToArchive={handleSaveToArchive}
          currentUser={currentUser}
          onSignInWithGoogle={handleSignInWithGoogle}
        />
      )}

      {/* Biometric Privacy & AI Cranial Mapping Consent Modal */}
      <PrivacyConsentModal
        isOpen={isPrivacyModalOpen}
        onAgree={() => {
          setIsPrivacyModalOpen(false);
        }}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Quiet Anti-Slop Atelier Footer */}
      <footer className="border-t border-[#262633] bg-[#0e0e12]/80 px-6 py-6 text-xs text-[#94A3B8]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-[#F8FAFC]">Aura Crown & Cut AI</span>
            <span aria-hidden="true">·</span>
            <span>AI Cranial Mapping & Salon Atelier Engine</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Cloud SQL PostgreSQL</span>
            <span aria-hidden="true">·</span>
            <span>Firebase Firestore & Auth</span>
            <span aria-hidden="true">·</span>
            <span>Gmail Integration</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsPrivacyModalOpen(true)}
              className="hover:text-[#E0A99A] underline cursor-pointer"
            >
              Privacy & Consent Notice
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
