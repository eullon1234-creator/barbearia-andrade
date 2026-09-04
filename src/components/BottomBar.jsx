import React from 'react';
import { Calendar, MessageCircle, Scissors, MapPin } from 'lucide-react';
import { BARBERSHOP_DATA } from '../data/barberData';

export default function BottomBar({ onOpenBooking, activeTab }) {
  if (activeTab === 'barber') return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-dark-950/95 backdrop-blur-lg border-t border-dark-800">
      <div className="max-w-md mx-auto flex items-center gap-2.5">
        {/* Botão de WhatsApp Rápido */}
        <a
          href={`https://wa.me/${BARBERSHOP_DATA.whatsappNumber}?text=Olá%20Saymon!%20Gostaria%20de%20tirar%20uma%20dúvida.`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-700 text-emerald-400 flex items-center justify-center transition-all flex-shrink-0"
          title="Falar no WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
        </a>

        {/* Botão Principal de Agendamento */}
        <button
          onClick={() => onOpenBooking(null)}
          className="flex-1 py-3 px-4 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-gold-glow active:scale-[0.98] transition-all cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Agendar Horário Online</span>
        </button>
      </div>
    </div>
  );
}
