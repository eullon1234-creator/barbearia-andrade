import React from 'react';
import { Scissors, MessageCircle } from 'lucide-react';
import { useBarber } from '../context/BarberContext';

export default function Navbar({ onOpenBooking }) {
  const { profile, scheduleConfig } = useBarber();

  const isOpenNow = () => {
    if (scheduleConfig.vacationMode) return false;
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    
    if (day === 0) return false;
    if (day === 6) return hours >= 8 && hours < 13;
    return hours >= 13 && hours < 18;
  };

  const open = isOpenNow();

  // Divide o nome da barbearia se houver duas palavras (ex: BARBEARIA ANDRADE)
  const nameParts = (profile.name || 'Barbearia Andrade').split(' ');
  const firstName = nameParts[0] || 'BARBEARIA';
  const restName = nameParts.slice(1).join(' ') || '';

  return (
    <header className="sticky top-0 z-40 bg-dark-950/90 backdrop-blur-md border-b border-dark-800 transition-all">
      <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo & Nome */}
        <div className="flex items-center gap-2.5">
          {profile.logoImage ? (
            <img
              src={profile.logoImage}
              alt={profile.name}
              className="w-10 h-10 rounded-xl object-contain bg-dark-900 border border-dark-750 p-1"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl theme-gradient-accent flex items-center justify-center text-dark-950 theme-shadow-glow-sm">
              <Scissors className="w-5 h-5 -rotate-45 font-bold" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-wide text-white font-heading">
                {firstName}
              </span>
              {restName && (
                <span className="font-extrabold text-base tracking-wide theme-text-accent font-heading">
                  {restName}
                </span>
              )}
            </div>
            
            {/* Tag de Status */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className={`w-2 h-2 rounded-full ${
                scheduleConfig.vacationMode 
                  ? 'bg-rose-500' 
                  : open 
                  ? 'bg-emerald-500 animate-pulse' 
                  : 'bg-amber-500'
              }`} />
              <span className="text-neutral-300 font-medium">
                {scheduleConfig.vacationMode 
                  ? 'Em Férias' 
                  : open 
                  ? 'Aberto Agora' 
                  : `Abre às ${scheduleConfig.weekdaysStart || '13:00'}`}
              </span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-400 text-[10px] truncate max-w-[120px]">
                {profile.address ? profile.address.split(',')[0] : 'Tuntum - MA'}
              </span>
            </div>
          </div>
        </div>

        {/* Botão de WhatsApp */}
        <div className="flex items-center">
          <a
            href={`https://wa.me/${profile.whatsappNumber}?text=Olá%20${encodeURIComponent(profile.owner)}!%20Gostaria%20de%20tirar%20uma%20dúvida.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 text-xs font-bold transition-all shadow-sm"
            title="Falar no WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-emerald-400/20" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
}
