import React, { createContext, useContext, useState, useEffect } from 'react';
import { BARBERSHOP_DATA } from '../data/barberData';

const BarberContext = createContext(null);

const STORAGE_KEYS = {
  SERVICES: 'andrade_services_v2',
  AMENITIES: 'andrade_amenities_v2',
  PROFILE: 'andrade_profile_v2',
  SCHEDULE: 'andrade_schedule_v2',
  APPOINTMENTS: 'andrade_appointments_v2',
  THEME: 'andrade_theme_v2',
  GALLERY: 'andrade_gallery_v2',
  FEED_POSTS: 'andrade_feed_posts_v1',
};

// Paletas de cores pré-configuradas para qualquer estilo de barbearia
export const THEME_PRESETS = {
  gold: {
    id: 'gold',
    name: 'Dourado Real',
    primary: '#D4AF37',
    light: '#F9E79F',
    dark: '#997514',
    glow: 'rgba(212, 175, 55, 0.4)',
    badgeBg: 'bg-amber-400',
  },
  silver: {
    id: 'silver',
    name: 'Prata & Titânio',
    primary: '#CBD5E1',
    light: '#F8FAFC',
    dark: '#64748B',
    glow: 'rgba(203, 213, 225, 0.4)',
    badgeBg: 'bg-slate-300',
  },
  emerald: {
    id: 'emerald',
    name: 'Verde Esmeralda',
    primary: '#10B981',
    light: '#A7F3D0',
    dark: '#047857',
    glow: 'rgba(16, 185, 129, 0.4)',
    badgeBg: 'bg-emerald-500',
  },
  amber: {
    id: 'amber',
    name: 'Âmbar Whisky',
    primary: '#F59E0B',
    light: '#FDE68A',
    dark: '#B45309',
    glow: 'rgba(245, 158, 11, 0.4)',
    badgeBg: 'bg-amber-500',
  },
  crimson: {
    id: 'crimson',
    name: 'Rubi Nobre',
    primary: '#EF4444',
    light: '#FECACA',
    dark: '#991B1B',
    glow: 'rgba(239, 68, 68, 0.4)',
    badgeBg: 'bg-rose-500',
  },
  sapphire: {
    id: 'sapphire',
    name: 'Azul Safira',
    primary: '#3B82F6',
    light: '#BFDBFE',
    dark: '#1D4ED8',
    glow: 'rgba(59, 130, 246, 0.4)',
    badgeBg: 'bg-blue-500',
  },
  purple: {
    id: 'purple',
    name: 'Roxo Royal',
    primary: '#A855F7',
    light: '#E9D5FF',
    dark: '#6B21A8',
    glow: 'rgba(168, 85, 247, 0.4)',
    badgeBg: 'bg-purple-500',
  }
};

export function BarberProvider({ children }) {
  // 1. Tema & Paleta de Cores
  const defaultTheme = {
    preset: 'gold',
    primary: '#D4AF37',
    light: '#F9E79F',
    dark: '#997514',
    glow: 'rgba(212, 175, 55, 0.4)',
  };

  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      return saved ? JSON.parse(saved) : defaultTheme;
    } catch (e) {
      return defaultTheme;
    }
  });

  // Atualiza as variáveis CSS globais no HTML sempre que o tema mudar
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-accent', theme.primary);
    document.documentElement.style.setProperty('--primary-accent-light', theme.light);
    document.documentElement.style.setProperty('--primary-accent-dark', theme.dark);
    document.documentElement.style.setProperty('--primary-accent-glow', theme.glow);
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme));
  }, [theme]);

  const selectThemePreset = (presetKey) => {
    const p = THEME_PRESETS[presetKey];
    if (p) {
      setTheme({
        preset: presetKey,
        primary: p.primary,
        light: p.light,
        dark: p.dark,
        glow: p.glow,
      });
    }
  };

  const setCustomColor = (hex) => {
    setTheme({
      preset: 'custom',
      primary: hex,
      light: hex,
      dark: hex,
      glow: `${hex}66`,
    });
  };

  // 2. Serviços & Cortes
  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : BARBERSHOP_DATA.services;
    } catch (e) {
      return BARBERSHOP_DATA.services;
    }
  });

  // 3. Comodidades
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

  // 4. Perfil & Identidade da Barbearia (Totalmente customizável para qualquer barbearia)
  const defaultProfile = {
    name: BARBERSHOP_DATA.name,
    tagline: BARBERSHOP_DATA.tagline,
    owner: BARBERSHOP_DATA.owner,
    role: "Barbeiro Especialista & Visagista",
    experienceYears: "5+ anos",
    reviewsCount: "140+",
    phone: BARBERSHOP_DATA.phone,
    whatsappNumber: BARBERSHOP_DATA.whatsappNumber,
    instagram: BARBERSHOP_DATA.instagram,
    address: BARBERSHOP_DATA.address,
    cityState: BARBERSHOP_DATA.cityState || "Povoado Cigana, Tuntum - MA",
    lat: null,
    lng: null,
    mapsUrl: BARBERSHOP_DATA.mapsUrl,
    bio: "Atendimento exclusivo com Saymon Andrade. O melhor degradê e terapia de barba da região.",
    image: BARBERSHOP_DATA.images.barber,
    coverImage: BARBERSHOP_DATA.images.hero,
    logoImage: '',
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

  // 5. Galeria de Fotos do Espaço / Fachada
  const defaultGallery = [
    'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80',
  ];

  const [galleryImages, setGalleryImages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
      return saved ? JSON.parse(saved) : defaultGallery;
    } catch (e) {
      return defaultGallery;
    }
  });

  // 6. Horários, Intervalos e Férias
  const defaultSchedule = {
    weekdaysStart: '13:00',
    weekdaysEnd: '18:00',
    saturdayStart: '08:00',
    saturdayEnd: '13:00',
    sundayClosed: true,
    slotInterval: 30,
    breakDuration: 30,
    status: 'Disponível',
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

  // 7. Agendamentos
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : BARBERSHOP_DATA.mockBarberAppointments;
    } catch (e) {
      return BARBERSHOP_DATA.mockBarberAppointments;
    }
  });

  // 8. Feed do Instagram & Lookbook de Cortes
  const defaultFeedPosts = [
    {
      id: 'post-1',
      serviceName: 'Combo Andrade (Corte + Barba)',
      clientName: 'Marcos Vinícius',
      clientInstagram: '@marcos_vini99',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
      caption: 'Alinhamento completo no padrão Andrade: Degradê navalhado + barba desenhada com toalha quente. Sextou do melhor jeito! 💈🔥',
      likes: 84,
      timeAgo: 'Hoje',
      comments: [
        { id: 'c-1', user: 'Marcos Vinícius', text: 'Ficou impecável irmão! Parabéns pelo trampo.' },
        { id: 'c-2', user: 'Gabriel Souza', text: 'Amanhã às 15h é a minha vez na cadeira 🔥' }
      ]
    },
    {
      id: 'post-2',
      serviceName: 'Corte Masculino / Degradê',
      clientName: 'Lucas Ribeiro',
      clientInstagram: '@lucas_ribeiroo',
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
      caption: 'Fade médio bem trabalhado na régua. Precisão em cada detalhe para valorizar o formato do rosto! ✂️⚡',
      likes: 112,
      timeAgo: 'Ontem',
      comments: [
        { id: 'c-3', user: 'Lucas Ribeiro', text: 'O melhor degradê do Povoado Cigana sem dúvidas!' }
      ]
    },
    {
      id: 'post-3',
      serviceName: 'Platinado / Luzes / Nevou',
      clientName: 'Eduardo Costa',
      clientInstagram: '@dudu_costa10',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
      caption: 'Nevou por aqui! ❄️ Platinado global com hidratação profunda e acabamento navalhado. Quem tem coragem de lançar esse estilo?',
      likes: 147,
      timeAgo: 'Há 3 dias',
      comments: [
        { id: 'c-4', user: 'Thiago N.', text: 'Ficou muito style! No fim de ano vou lançar o meu.' },
        { id: 'c-5', user: 'Eduardo Costa', text: 'Sensacional, trabalho de mestre 👏' }
      ]
    },
    {
      id: 'post-4',
      serviceName: 'Barba Alinhada / Toalha Quente',
      clientName: 'Rafael Barbosa',
      clientInstagram: '@rafa_barbosa',
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
      caption: 'Terapia de barba com toalha quente, óleos essenciais e massagem facial. Mais que um corte, uma experiência de relaxamento! 🧖‍♂️✨',
      likes: 96,
      timeAgo: 'Há 5 dias',
      comments: [
        { id: 'c-6', user: 'Rafael Barbosa', text: 'Essa toalha quente relaxa demais, recomendo muito!' }
      ]
    }
  ];

  const [feedPosts, setFeedPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FEED_POSTS);
      return saved ? JSON.parse(saved) : defaultFeedPosts;
    } catch (e) {
      return defaultFeedPosts;
    }
  });

  // Persistência
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
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(galleryImages));
  }, [galleryImages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(scheduleConfig));
  }, [scheduleConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEED_POSTS, JSON.stringify(feedPosts));
  }, [feedPosts]);

  // Ações de Serviços
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

  // Ações de Comodidades
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

  // Ações de Galeria
  const addGalleryImage = (url) => {
    if (!url) return;
    setGalleryImages(prev => [...prev, url]);
  };

  const removeGalleryImage = (indexToRemove) => {
    setGalleryImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Ações de Perfil & Especialidades
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

  // Ações de Horários & Intervalos
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

  // Ações de Agendamentos
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

  // Ações do Feed do Instagram & Lookbook
  const addFeedPost = (newPost) => {
    const created = {
      id: 'post-' + Date.now(),
      likes: 1,
      timeAgo: 'Hoje',
      comments: [],
      ...newPost,
    };
    setFeedPosts(prev => [created, ...prev]);
  };

  const deleteFeedPost = (id) => {
    setFeedPosts(prev => prev.filter(p => p.id !== id));
  };

  const updateFeedPost = (id, updatedFields) => {
    setFeedPosts(prev => prev.map(p => p.id === id ? { ...p, ...updatedFields } : p));
  };

  const toggleLikeFeedPost = (id) => {
    setFeedPosts(prev => prev.map(p => {
      if (p.id === id) {
        const isLiked = !!p.isLiked;
        return {
          ...p,
          isLiked: !isLiked,
          likes: Math.max(0, (p.likes || 0) + (isLiked ? -1 : 1))
        };
      }
      return p;
    }));
  };

  const addCommentToFeedPost = (postId, comment) => {
    setFeedPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...(p.comments || []), { id: 'c-' + Date.now(), ...comment }]
        };
      }
      return p;
    }));
  };

  // Exportar / Importar Configuração Completa (Backup / Whitelabel)
  const exportConfiguration = () => {
    const config = {
      theme,
      profile,
      services,
      amenities,
      galleryImages,
      scheduleConfig,
      feedPosts,
    };
    const jsonStr = JSON.stringify(config, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `config_${profile.name.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importConfiguration = (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.theme) setTheme(data.theme);
      if (data.profile) setProfile(data.profile);
      if (data.services) setServices(data.services);
      if (data.amenities) setAmenities(data.amenities);
      if (data.galleryImages) setGalleryImages(data.galleryImages);
      if (data.scheduleConfig) setScheduleConfig(data.scheduleConfig);
      if (data.feedPosts) setFeedPosts(data.feedPosts);
      return true;
    } catch (e) {
      alert('Arquivo JSON inválido.');
      return false;
    }
  };

  // Reset Total para Dados Iniciais
  const resetToFactoryDefaults = () => {
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.AMENITIES);
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULE);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.THEME);
    localStorage.removeItem(STORAGE_KEYS.GALLERY);

    setTheme(defaultTheme);
    setServices(BARBERSHOP_DATA.services);
    setAmenities(defaultAmenities);
    setProfile(defaultProfile);
    setGalleryImages(defaultGallery);
    setScheduleConfig(defaultSchedule);
    setAppointments(BARBERSHOP_DATA.mockBarberAppointments);
  };

  return (
    <BarberContext.Provider
      value={{
        theme,
        selectThemePreset,
        setCustomColor,

        services,
        addService,
        updateService,
        deleteService,

        amenities,
        toggleAmenity,
        addAmenity,
        deleteAmenity,

        galleryImages,
        addGalleryImage,
        removeGalleryImage,

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

        feedPosts,
        addFeedPost,
        updateFeedPost,
        deleteFeedPost,
        toggleLikeFeedPost,
        addCommentToFeedPost,

        exportConfiguration,
        importConfiguration,
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
