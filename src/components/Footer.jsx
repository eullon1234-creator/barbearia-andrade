import React from 'react';
import { Scissors, MessageCircle, MapPin } from 'lucide-react';
import { InstagramIcon } from './Icons';
import { BARBERSHOP_DATA } from '../data/barberData';

export default function Footer({ onOpenBooking }) {
  return (
    <footer className="mt-8 border-t border-dark-800 bg-dark-950 pb-24 pt-8 px-4 text-center">
      <div className="max-w-md mx-auto space-y-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center text-dark-950">
            <Scissors className="w-4 h-4 -rotate-45 font-bold" />
          </div>
          <span className="font-heading font-black text-lg text-white tracking-wider">
            BARBEARIA <span className="text-gold-400">ANDRADE</span>
          </span>
        </div>

        <p className="text-xs text-neutral-400 max-w-xs mx-auto">
          {BARBERSHOP_DATA.tagline}. Atendimento exclusivo e pontual por agendamento.
        </p>

        {/* Links de Redes e Contato */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <a
            href={`https://wa.me/${BARBERSHOP_DATA.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-dark-850 hover:bg-dark-800 border border-dark-750 flex items-center justify-center text-emerald-400 hover:scale-110 transition-all"
            title="WhatsApp Saymon Andrade"
          >
            <MessageCircle className="w-4 h-4" />
          </a>

          <a
            href={BARBERSHOP_DATA.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-dark-850 hover:bg-dark-800 border border-dark-750 flex items-center justify-center text-pink-400 hover:scale-110 transition-all"
            title="Instagram Barbearia Andrade"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>

          <a
            href={BARBERSHOP_DATA.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 rounded-full bg-dark-850 hover:bg-dark-800 border border-dark-750 flex items-center justify-center text-gold-400 hover:scale-110 transition-all"
            title="Localização Google Maps"
          >
            <MapPin className="w-4 h-4" />
          </a>
        </div>

        <div className="pt-4 border-t border-dark-850 text-xs text-neutral-400">
          <p className="font-semibold tracking-wide text-neutral-300">Criado por Eullon</p>
        </div>
      </div>
    </footer>
  );
}
