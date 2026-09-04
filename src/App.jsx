import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BarberCard from './components/BarberCard';
import ServicesSection from './components/ServicesSection';
import AmenitiesSection from './components/AmenitiesSection';
import GallerySection from './components/GallerySection';
import LocationSection from './components/LocationSection';
import Footer from './components/Footer';
import BottomBar from './components/BottomBar';
import BookingModal from './components/BookingModal';
import BarberDashboard from './components/BarberDashboard';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  // Verifica se a rota é do barbeiro via hash (#/barbeiro) ou query (?barbeiro=1)
  const isBarberUrl = () => {
    if (typeof window === 'undefined') return false;
    const hash = (window.location.hash || '').toLowerCase();
    const search = (window.location.search || '').toLowerCase();
    return hash.includes('barbeiro') || search.includes('barbeiro');
  };

  const [isBarberRoute, setIsBarberRoute] = useState(isBarberUrl());
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingService, setBookingService] = useState(null);
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  useEffect(() => {
    const handleUrlChange = () => {
      setIsBarberRoute(isBarberUrl());
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);

    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  const handleOpenBooking = (service = null) => {
    setBookingService(service);
    setIsBookingOpen(true);
  };

  const handleGoToClient = () => {
    window.location.hash = '';
    // Se havia query param, limpa também
    if (window.location.search.includes('barbeiro')) {
      const url = new URL(window.location);
      url.searchParams.delete('barbeiro');
      window.history.pushState({}, '', url.pathname);
    }
    setIsBarberRoute(false);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-neutral-100 flex flex-col items-center justify-start selection:bg-gold-500 selection:text-black">
      
      {/* Barra de Demonstração Superior para Computadores */}
      <div className="w-full bg-dark-900 border-b border-dark-800 py-2 px-4 hidden lg:flex items-center justify-between text-xs z-50">
        <div className="flex items-center gap-2 text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <span className="font-semibold text-white">Barbearia Andrade</span>
          <span className="text-neutral-500">•</span>
          <span className="text-gold-400 font-medium">
            {isBarberRoute ? 'Área Exclusiva do Barbeiro (Saymon)' : 'Área do Cliente (Agendamento Online)'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Alternar Moldura de Celular vs Tela Cheia */}
          <div className="flex items-center bg-dark-950 p-0.5 rounded-lg border border-dark-750">
            <button
              onClick={() => setIsPhoneFrame(true)}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all ${
                isPhoneFrame ? 'bg-gold-500 text-dark-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
              title="Visualizar em moldura de celular (Mobile View)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Modo Celular</span>
            </button>
            <button
              onClick={() => setIsPhoneFrame(false)}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all ${
                !isPhoneFrame ? 'bg-gold-500 text-dark-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
              title="Visualizar expandido em tela cheia"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Tela Cheia</span>
            </button>
          </div>
        </div>
      </div>

      {/* Container Principal do App */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[440px] my-0 lg:my-6 rounded-none lg:rounded-[40px] border-0 lg:border-[8px] lg:border-dark-800 lg:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden bg-dark-950 relative min-h-screen lg:min-h-[860px]'
            : 'max-w-2xl bg-dark-950 min-h-screen'
        }`}
      >
        {/* Notch / Speaker simulado no modo celular em desktop */}
        {isPhoneFrame && (
          <div className="hidden lg:flex justify-center pt-2 pb-1 bg-dark-950">
            <div className="w-24 h-4 bg-dark-900 rounded-full flex items-center justify-center gap-2">
              <div className="w-8 h-1 bg-dark-750 rounded-full"></div>
              <div className="w-2 h-2 rounded-full bg-dark-800"></div>
            </div>
          </div>
        )}

        {/* Renderização Condicional por Link */}
        {isBarberRoute ? (
          /* ================= LINK EXCLUSIVO DO BARBEIRO ================= */
          <main className="pb-8">
            <BarberDashboard onBackToClientView={handleGoToClient} />
          </main>
        ) : (
          /* ================= LINK PÚBLICO DO CLIENTE ================= */
          <>
            {/* Navbar sem botão de alternar */}
            <Navbar onOpenBooking={() => handleOpenBooking(null)} />

            {/* Conteúdo Principal do Cliente */}
            <main className="pb-8">
              {/* Hero Banner */}
              <Hero onOpenBooking={handleOpenBooking} />

              {/* Card do Barbeiro Saymon */}
              <BarberCard />

              {/* Catálogo de Serviços */}
              <ServicesSection onOpenBooking={handleOpenBooking} />

              {/* Comodidades da Barbearia */}
              <AmenitiesSection />

              {/* Galeria de Fotos do Espaço */}
              <GallerySection />

              {/* Endereço & Mapa */}
              <LocationSection />

              {/* Rodapé */}
              <Footer onOpenBooking={handleOpenBooking} />

              {/* Barra Flutuante de Agendamento Rápido */}
              <BottomBar onOpenBooking={handleOpenBooking} activeTab="client" />
            </main>
          </>
        )}
      </div>

      {/* Modal Interativo de Agendamento em 4 Passos */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialService={bookingService}
      />
    </div>
  );
}
