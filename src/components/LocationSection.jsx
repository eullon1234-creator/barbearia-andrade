import React from 'react';
import { MapPin, Navigation, Clock, Calendar, ExternalLink } from 'lucide-react';
import { BARBERSHOP_DATA } from '../data/barberData';

export default function LocationSection() {
  return (
    <section className="px-4 py-4" id="localizacao">
      <div className="rounded-2xl bg-card-gradient border border-dark-700/80 p-4 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-xl bg-gold-500/10 text-gold-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">
              Endereço & Atendimento
            </h3>
            <p className="text-xs text-neutral-400">Localização de fácil acesso</p>
          </div>
        </div>

        {/* Card do Endereço */}
        <div className="p-3 rounded-xl bg-dark-850/90 border border-dark-700/60 mb-3.5">
          <p className="text-xs font-semibold text-neutral-200 mb-1">
            {BARBERSHOP_DATA.address}
          </p>
          <p className="text-[11px] text-gold-400 font-medium">
            Próximo aos principais pontos do Povoado Cigana
          </p>

          <a
            href={BARBERSHOP_DATA.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full py-2.5 px-3 rounded-lg bg-dark-800 hover:bg-dark-750 text-gold-400 hover:text-gold-300 border border-gold-500/30 flex items-center justify-center gap-2 text-xs font-bold transition-all"
          >
            <Navigation className="w-4 h-4 text-gold-400" />
            <span>Traçar Rota no Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>

        {/* Horários de Funcionamento */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-dark-800">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              Segunda a Sexta
            </span>
            <span className="text-white font-semibold">13:00 às 18:00</span>
          </div>

          <div className="flex items-center justify-between py-1.5 border-b border-dark-800">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              Sábado
            </span>
            <span className="text-white font-semibold">08:00 às 13:00</span>
          </div>

          <div className="flex items-center justify-between py-1.5">
            <span className="text-neutral-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-neutral-500" />
              Domingo
            </span>
            <span className="text-rose-400/90 font-medium">Fechado</span>
          </div>
        </div>
      </div>
    </section>
  );
}
