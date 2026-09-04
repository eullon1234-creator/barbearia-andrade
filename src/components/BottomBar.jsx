import React from 'react';
import { Home, Calendar, MessageCircle } from 'lucide-react';
import { useBarber } from '../context/BarberContext';
import { InstagramIcon } from './Icons';

export default function BottomBar({ onOpenBooking, clientTab = 'home', onSelectTab }) {
  const { profile } = useBarber();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-2 bg-dark-950/95 backdrop-blur-xl border-t border-dark-800 shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1.5 items-center">
        
        {/* Aba Início */}
        <button
          onClick={() => onSelectTab && onSelectTab('home')}
          className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
            clientTab === 'home'
              ? 'bg-dark-850 text-white font-bold border border-dark-700 theme-shadow-glow-sm'
              : 'text-neutral-400 hover:text-white hover:bg-dark-900'
          }`}
        >
          <Home className={`w-4 h-4 ${clientTab === 'home' ? 'theme-text-accent' : ''}`} />
          <span className="text-[10px] tracking-tight">Início</span>
        </button>

        {/* Aba Feed Instagram */}
        <button
          onClick={() => onSelectTab && onSelectTab('feed')}
          className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative ${
            clientTab === 'feed'
              ? 'bg-gradient-to-tr from-rose-500/20 via-pink-500/20 to-purple-500/20 border border-pink-500/40 text-white font-bold shadow-md shadow-pink-500/20'
              : 'text-neutral-400 hover:text-white hover:bg-dark-900'
          }`}
        >
          <div className="relative">
            <InstagramIcon className={`w-4 h-4 ${clientTab === 'feed' ? 'text-pink-400' : ''}`} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <span className="text-[10px] tracking-tight">Feed Insta</span>
        </button>

        {/* Botão de WhatsApp */}
        <a
          href={`https://wa.me/${profile.whatsappNumber}?text=Olá%20${encodeURIComponent(profile.owner)}!%20Gostaria%20de%20tirar%20uma%20dúvida.`}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 text-emerald-400 hover:text-emerald-300 hover:bg-dark-900 transition-all"
          title="Falar no WhatsApp"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-[10px] tracking-tight text-neutral-300">WhatsApp</span>
        </a>

        {/* Botão de Agendamento Rápido */}
        <button
          onClick={() => onOpenBooking(null)}
          className="py-2 px-1 rounded-xl theme-gradient-accent text-dark-950 font-black flex flex-col items-center justify-center gap-0.5 theme-shadow-glow active:scale-[0.96] transition-all cursor-pointer shadow-lg"
          title="Agendar horário online"
        >
          <Calendar className="w-4 h-4" />
          <span className="text-[10px] uppercase tracking-tighter">Agendar</span>
        </button>

      </div>
    </div>
  );
}
