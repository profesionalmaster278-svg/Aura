import React from 'react';
import { User } from 'firebase/auth';
import { Mail, CheckCircle2, LogOut } from 'lucide-react';

interface TopBarProps {
  activeTab: 'studio' | 'catalog' | 'execution' | 'archive';
  onSelectTab: (tab: 'studio' | 'catalog' | 'execution' | 'archive') => void;
  onNewConsultation: () => void;
  currentUser: User | null;
  onSignInWithGoogle: () => void;
  onSignOut: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  onSelectTab,
  onNewConsultation,
  currentUser,
  onSignInWithGoogle,
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 px-6 py-4 flex items-center justify-between gap-8">
      {/* Zone 1: Single text element Brand wordmark */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSelectTab('studio');
        }}
        className="text-lg font-serif tracking-wide text-neutral-100 hover:text-amber-200 transition-colors whitespace-nowrap shrink-0 flex items-baseline gap-2"
      >
        <span className="font-semibold text-amber-200">Aura</span>
        <span className="text-neutral-400 font-sans text-xs tracking-widest uppercase">Crown & Cut AI</span>
      </a>

      {/* Zone 2: 4 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-400">
        <button
          onClick={() => onSelectTab('studio')}
          className={`hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 pb-1 ${
            activeTab === 'studio' ? 'text-amber-300 border-b border-amber-400/80' : ''
          }`}
        >
          Biometric Studio
        </button>

        <button
          onClick={() => onSelectTab('catalog')}
          className={`hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 pb-1 ${
            activeTab === 'catalog' ? 'text-amber-300 border-b border-amber-400/80' : ''
          }`}
        >
          Crown & Wig Lab
        </button>

        <button
          onClick={() => onSelectTab('execution')}
          className={`hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 pb-1 ${
            activeTab === 'execution' ? 'text-amber-300 border-b border-amber-400/80' : ''
          }`}
        >
          Technical Brief
        </button>

        <button
          onClick={() => onSelectTab('archive')}
          className={`hover:text-neutral-100 transition-colors whitespace-nowrap shrink-0 pb-1 ${
            activeTab === 'archive' ? 'text-amber-300 border-b border-amber-400/80' : ''
          }`}
        >
          Client Archive
        </button>
      </nav>

      {/* Zone 3: Google Auth & Primary Action */}
      <div className="flex items-center gap-3 shrink-0">
        {currentUser ? (
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]" title="Connected to Google Workspace & Gmail">
              <Mail className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline text-neutral-300 truncate max-w-[120px]">{currentUser.email}</span>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            </span>
            <button
              onClick={onSignOut}
              title="Sign Out"
              className="p-1 text-neutral-500 hover:text-neutral-200 transition-colors ml-1"
            >
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={onSignInWithGoogle}
            className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700/80 text-xs font-medium rounded-md transition-colors shadow-sm"
            title="Sign in with Google to enable Gmail & Cloud synchronization"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span className="hidden sm:inline">Connect Gmail</span>
          </button>
        )}

        <button
          onClick={onNewConsultation}
          className="px-4 py-2 text-xs font-semibold tracking-wide text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors whitespace-nowrap shrink-0 shadow-sm"
        >
          New Consultation
        </button>
      </div>
    </header>
  );
};
