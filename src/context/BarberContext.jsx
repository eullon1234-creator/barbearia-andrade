import React, { createContext, useContext, useState, useEffect } from 'react';
import { BARBERSHOP_DATA } from '../data/barberData';

const BarberContext = createContext(null);

const STORAGE_KEYS = {
  SERVICES: 'andrade_services_v1',
  AMENITIES: 'andrade_amenities_v1',
  PROFILE: 'andrade_profile_v1',
  SCHEDULE: 'andrade_schedule_v1',
  APPOINTMENTS: 'andrade_appointments_v1',
};

export function BarberProvider({ children }) {
  // 1. Serviços & Cortes
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : BARBERSHOP_DATA.services;
    } catch (e) {
      return BARBERSHOP_DATA.services;
    }
  });

  // 2. Comodidades
  const defaultAmenities = [
    { id: 'ac', label: 'Ambiente Climatizado', icon: 'Snowflake', enabled: true },
    { id: 'wifi', label: 'Wi-Fi Liberado', icon: 'Wifi', enabled: true },
    { id: 'coffee', label: 'Café & Bebidas', icon: 'Coffee', enabled: true },
    { id: 'music', label: 'Música Ambiente', icon: 'Music', enabled: true },
    { id: 'parking', label: 'Estacionamento Fácil', icon: 'Car', enabled: true },
    { id: 'videogame', label: 'Videogame / TV', icon: 'Gamepad2', enabled: false },
  ];

  const [amenities, setAmenities] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AMENITIES);
      return saved ? JSON.parse(saved) : defaultAmenities;
    } catch (e) {
      return defaultAmenities;
    }
  });

  // 3. Perfil do Barbeiro e Barbearia
  const defaultProfile = {
    name: BARBERSHOP_DATA.name,
    owner: BARBERSHOP_DATA.owner,
    role: "Barbeiro Especialista & Visagista",
    phone: BARBERSHOP_DATA.phone,
    whatsappNumber: BARBERSHOP_DATA.whatsappNumber,
    instagram: BARBERSHOP_DATA.instagram,
    address: BARBERSHOP_DATA.address,
    mapsUrl: BARBERSHOP_DATA.mapsUrl,
    bio: "Atendimento exclusivo com Saymon Andrade. O melhor degradê e terapia de barba da região.",
    image: BARBERSHOP_DATA.images.barber,
    specialties: [
      'Degradê / Fade Navalhado',
      'Barba na Toalha Quente',
      'Cortes Sociais & Clássicos',
      'Pigmentação & Sobrancelha',
      'Platinado / Nevou',
    ],
  };

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : defaultProfile;
    } catch (e) {
      return defaultProfile;
    }
  });

  // 4. Configuração de Horários, Intervalos e Férias
  const defaultSchedule = {
    weekdaysStart: '13:00',
    weekdaysEnd: '18:00',
    saturdayStart: '08:00',
    saturdayEnd: '13:00',
    sundayClosed: true,
    slotInterval: 30, // minutos por atendimento padrão
    breakDuration: 30, // minutos da pausa rápida
    status: 'Disponível', // 'Disponível' | 'Em Pausa' | 'Férias'
    vacationMode: false,
    vacationMessage: 'Saymon Andrade está em período de recesso/férias. Em breve novos horários disponíveis!',
    currentPauseEndTime: null,
  };

  const [scheduleConfig, setScheduleConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
      return saved ? JSON.parse(saved) : defaultSchedule;
    } catch (e) {
      return defaultSchedule;
    }
  });

  // 5. Agendamentos
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : BARBERSHOP_DATA.mockBarberAppointments;
    } catch (e) {
      return BARBERSHOP_DATA.mockBarberAppointments;
    }
  });

  // Persistência automática em localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AMENITIES, JSON.stringify(amenities));
  }, [amenities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(scheduleConfig));
  }, [scheduleConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  // ====== Ações de Serviços ======
  const addService = (newService) => {
    const created = {
      id: 'svc-' + Date.now(),
      name: newService.name,
      category: newService.category || 'cabelo',
      duration: newService.duration || '30 min',
      price: parseFloat(newService.price) || 0,
      description: newService.description || '',
      image: newService.image || 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80',
      popular: !!newService.popular,
      badge: newService.badge || '',
    };
    setServices(prev => [created, ...prev]);
  };

  const updateService = (id, updatedFields) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updatedFields } : s));
  };

  const deleteService = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  // ====== Ações de Comodidades ======
  const toggleAmenity = (id) => {
    setAmenities(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const addAmenity = (label, icon = 'Sparkles') => {
    const newAm = {
      id: 'am-' + Date.now(),
      label,
      icon,
      enabled: true,
    };
    setAmenities(prev => [...prev, newAm]);
  };

  const deleteAmenity = (id) => {
    setAmenities(prev => prev.filter(a => a.id !== id));
  };

  // ====== Ações de Perfil & Especialidades ======
  const updateProfile = (fields) => {
    setProfile(prev => ({ ...prev, ...fields }));
  };

  const addSpecialty = (item) => {
    if (!item || !item.trim()) return;
    setProfile(prev => ({
      ...prev,
      specialties: [...prev.specialties, item.trim()]
    }));
  };

  const removeSpecialty = (indexToRemove) => {
    setProfile(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // ====== Ações de Horários & Intervalos ======
  const updateSchedule = (fields) => {
    setScheduleConfig(prev => ({ ...prev, ...fields }));
  };

  const triggerQuickPause = (minutes) => {
    const until = new Date();
    until.setMinutes(until.getMinutes() + minutes);
    const timeFormatted = `${until.getHours().toString().padStart(2, '0')}:${until.getMinutes().toString().padStart(2, '0')}`;
    
    setScheduleConfig(prev => ({
      ...prev,
      status: `Em Pausa (${minutes}m)`,
      currentPauseEndTime: timeFormatted,
    }));
  };

  const resumeStatus = () => {
    setScheduleConfig(prev => ({
      ...prev,
      status: 'Disponível',
      currentPauseEndTime: null,
      vacationMode: false,
    }));
  };

  const toggleVacationMode = () => {
    setScheduleConfig(prev => {
      const nextMode = !prev.vacationMode;
      return {
        ...prev,
        vacationMode: nextMode,
        status: nextMode ? 'Modo Férias' : 'Disponível',
      };
    });
  };

  // ====== Ações de Agendamentos ======
  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const addAppointment = (newApt) => {
    const created = {
      id: 'apt-' + Date.now(),
      ...newApt,
      status: newApt.status || 'Confirmado'
    };
    setAppointments(prev => [created, ...prev]);
  };

  const deleteAppointment = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
  };

  // ====== Reset Total para Dados Iniciais ======
  const resetToFactoryDefaults = () => {
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.AMENITIES);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULE);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);

    setServices(BARBERSHOP_DATA.services);
    setAmenities(defaultAmenities);
    setProfile(defaultProfile);
    setScheduleConfig(defaultSchedule);
    setAppointments(BARBERSHOP_DATA.mockBarberAppointments);
  };

  return (
    <BarberContext.Provider
      value={{
        services,
        addService,
        updateService,
        deleteService,

        amenities,
        toggleAmenity,
        addAmenity,
        deleteAmenity,

        profile,
        updateProfile,
        addSpecialty,
        removeSpecialty,

        scheduleConfig,
        updateSchedule,
        triggerQuickPause,
        resumeStatus,
        toggleVacationMode,

        appointments,
        updateAppointmentStatus,
        addAppointment,
        deleteAppointment,

        resetToFactoryDefaults,
      }}
    >
      {children}
    </BarberContext.Provider>
  );
}

export function useBarber() {
  const context = useContext(BarberContext);
  if (!context) {
    throw new Error('useBarber deve ser usado dentro de um BarberProvider');
  }
  return context;
}
