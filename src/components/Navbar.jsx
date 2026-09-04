import React from 'react';
import { Scissors, Clock, ShieldCheck, UserCheck, MessageCircle } from 'lucide-react';
import { BARBERSHOP_DATA } from '../data/barberData';

export default function Navbar({ activeTab, setActiveTab, onOpenBooking }) {
  // Determina se está aberto baseado na hora atual
  const isOpenNow = () => {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    
    // Domingo
    if (day === 0) return false;
    // Sábado: 8h às 13h
    if (day === 6) return hours >= 8 && hours < 13;
    // Seg a Sex: 13h às 18h
    return hours >= 13 && hours < 18;
  };

  const open = isOpenNow();

  return (
    <header className="sticky top-0 z-40 bg-dark-950/90 backdrop-blur-md border-b border-dark-800 transition-all">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo & Nome */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-dark-950 shadow-gold-glow-sm">
            <Scissors className="w-5 h-5 -rotate-45 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wide text-white font-heading">
                BARBEARIA
              </span>
              <span className="font-extrabold text-base tracking-wide text-gold-400 font-heading">
                ANDRADE
              </span>
            </div>
            
            {/* Tag de Status */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className={`w-2 h-2 rounded-full ${open ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-neutral-300 font-medium">
                {open ? 'Aberto Agora' : 'Abre às 13:00'}
              </span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-400 text-[10px]">Tuntum - MA</span>
            </div>
          </div>
        </div>

        {/* Alternador de Visão (Cliente vs Barbeiro) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab(activeTab === 'client' ? 'barber' : 'client')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              activeTab === 'barber'
                ? 'bg-gold-500 text-dark-950 border-gold-400 shadow-gold-glow-sm'
                : 'bg-dark-800/80 text-neutral-300 border-dark-700 hover:border-gold-500/50 hover:text-white'
            }`}
            title="Alternar entre visão do cliente e visão administrativa do barbeiro"
          >
            {activeTab === 'barber' ? (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                <span>Área Barbeiro</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                <span className="text-[11px]">Painel Barbeiro</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
