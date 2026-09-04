import { Calendar, MessageCircle, MapPin, Star, Award, Sparkles, Clock } from 'lucide-react';
import { InstagramIcon } from './Icons';
import { BARBERSHOP_DATA } from '../data/barberData';

export default function Hero({ onOpenBooking }) {
  return (
    <section className="relative overflow-hidden pt-2 pb-6 px-4">
      {/* Card Principal com Imagem de Fundo Premium */}
      <div className="relative rounded-2xl overflow-hidden border border-gold-500/20 shadow-2xl bg-dark-900">
        {/* Imagem de Fundo com Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={BARBERSHOP_DATA.images.hero}
            alt="Ambiente Barbearia Andrade"
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.45] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-900/70 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-dark-950/40 to-dark-950/90" />
        </div>

        {/* Conteúdo do Hero */}
        <div className="relative z-10 p-5 sm:p-6 flex flex-col justify-end min-h-[360px]">
          {/* Badge de Destaque */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-300 text-xs font-semibold backdrop-blur-md self-start mb-3 shadow-gold-glow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-spin-slow" />
            <span>Padrão Premium de Barbearia</span>
          </div>

          {/* Título & Slogan */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
            Corte Alinhado & <br />
            <span className="gold-text-gradient font-black">Barba Impecável</span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 mb-4 max-w-[90%] leading-relaxed">
            Atendimento exclusivo com <strong className="text-gold-300 font-semibold">{BARBERSHOP_DATA.owner}</strong>. O melhor degradê e terapia de barba da região.
          </p>

          {/* Mini-Badges de Confiança */}
          <div className="flex items-center gap-3 mb-5 text-[11px] text-neutral-300 flex-wrap">
            <div className="flex items-center gap-1 bg-dark-800/80 px-2.5 py-1 rounded-md border border-neutral-700/50 backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
              <span className="font-bold text-white">5.0</span>
              <span className="text-neutral-400">({BARBERSHOP_DATA.reviewsCount})</span>
            </div>
            <div className="flex items-center gap-1 bg-dark-800/80 px-2.5 py-1 rounded-md border border-neutral-700/50 backdrop-blur-sm">
              <Award className="w-3.5 h-3.5 text-gold-400" />
              <span>{BARBERSHOP_DATA.experienceYears} Exp.</span>
            </div>
            <div className="flex items-center gap-1 bg-dark-800/80 px-2.5 py-1 rounded-md border border-neutral-700/50 backdrop-blur-sm">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              <span>Horário Marcado</span>
            </div>
          </div>

          {/* Botão de Ação Principal (CTA) */}
          <button
            onClick={() => onOpenBooking(null)}
            className="w-full py-3.5 px-6 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-gold-glow active:scale-[0.98] transition-all duration-200 uppercase tracking-wide cursor-pointer"
          >
            <Calendar className="w-5 h-5 font-bold" />
            <span>Agendar Meu Horário</span>
          </button>
        </div>
      </div>

      {/* Atalhos Rápidos (WhatsApp, Instagram, Localização) */}
      <div className="grid grid-cols-3 gap-2 mt-3">
        <a
          href={`https://wa.me/${BARBERSHOP_DATA.whatsappNumber}?text=Olá%20Saymon!%20Gostaria%20de%20tirar%20uma%20dúvida%20sobre%20a%20Barbearia%20Andrade.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-700/80 hover:border-emerald-500/40 text-neutral-300 hover:text-emerald-400 transition-all text-xs font-medium"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          <span>WhatsApp</span>
        </a>

        <a
          href={BARBERSHOP_DATA.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-700/80 hover:border-pink-500/40 text-neutral-300 hover:text-pink-400 transition-all text-xs font-medium"
        >
          <InstagramIcon className="w-4 h-4 text-pink-400" />
          <span>Instagram</span>
        </a>

        <a
          href={BARBERSHOP_DATA.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-700/80 hover:border-gold-500/40 text-neutral-300 hover:text-gold-400 transition-all text-xs font-medium"
        >
          <MapPin className="w-4 h-4 text-gold-400" />
          <span>Como Chegar</span>
        </a>
      </div>
    </section>
  );
}
