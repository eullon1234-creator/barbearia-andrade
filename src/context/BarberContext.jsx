import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { BARBERSHOP_DATA } from '../data/barberData';
import { db as firestoreDb } from '../services/firebase';
import { collection, doc, setDoc, deleteDoc, updateDoc, onSnapshot, getDoc } from 'firebase/firestore';

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
  EXTRAS: 'andrade_extras_v1',
  CLIENT_SESSION: 'andrade_current_client_v1',
  CLIENTS_DB: 'andrade_clients_db_v1',
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
    pixKey: '99991220211',
    pixKeyType: 'Celular',
    pixReceiver: 'Saymon Andrade',
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

  // Sincronização em Tempo Real com Firebase Firestore
  const [cloudSyncStatus, setCloudSyncStatus] = useState('conectado');
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  const saveToFirestore = async (docId, rawData) => {
    try {
      const safeData = JSON.parse(JSON.stringify(rawData, (k, v) => (v === undefined ? null : v)));
      await setDoc(doc(firestoreDb, 'barbershop', docId), {
        data: safeData,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn(`[Firestore] Erro ao salvar ${docId}:`, err.message);
    }
  };

  useEffect(() => {
    const unsubs = [];
    let isMounted = true;

    // 1. Perfil da Barbearia (Foto de perfil, Capa, Logo, Bio, WhatsApp, etc.)
    try {
      const unsubProfile = onSnapshot(doc(firestoreDb, 'barbershop', 'profile'), (snap) => {
        if (!isMounted) return;
        if (snap.exists() && snap.data()?.data) {
          const cloudProfile = snap.data().data;
          setProfile(prev => ({ ...prev, ...cloudProfile }));
          localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(cloudProfile));
        } else {
          saveToFirestore('profile', profile);
        }
      }, (err) => console.warn('[Firestore] Erro no perfil:', err.message));
      unsubs.push(unsubProfile);
    } catch (e) {
      console.warn(e);
    }

    // 2. Serviços & Cortes
    try {
      const unsubServices = onSnapshot(doc(firestoreDb, 'barbershop', 'services'), (snap) => {
        if (!isMounted) return;
        if (snap.exists() && Array.isArray(snap.data()?.data) && snap.data().data.length > 0) {
          const cloudServices = snap.data().data;
          setServices(cloudServices);
          localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(cloudServices));
        } else {
          saveToFirestore('services', services);
        }
      }, (err) => console.warn('[Firestore] Erro em serviços:', err.message));
      unsubs.push(unsubServices);
    } catch (e) {
      console.warn(e);
    }

    // 3. Feed de Fotos (Lookbook Estilo Instagram)
    try {
      const unsubFeed = onSnapshot(doc(firestoreDb, 'barbershop', 'feed'), (snap) => {
        if (!isMounted) return;
        if (snap.exists() && Array.isArray(snap.data()?.data)) {
          const cloudFeed = snap.data().data;
          setFeedPosts(cloudFeed);
          localStorage.setItem(STORAGE_KEYS.FEED_POSTS, JSON.stringify(cloudFeed));
        } else {
          saveToFirestore('feed', feedPosts);
        }
      }, (err) => console.warn('[Firestore] Erro no feed:', err.message));
      unsubs.push(unsubFeed);
    } catch (e) {
      console.warn(e);
    }

    // 4. Galeria de Fotos
    try {
      const unsubGallery = onSnapshot(doc(firestoreDb, 'barbershop', 'gallery'), (snap) => {
        if (!isMounted) return;
        if (snap.exists() && Array.isArray(snap.data()?.data)) {
          const cloudGallery = snap.data().data;
          setGalleryImages(cloudGallery);
          localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(cloudGallery));
        } else {
          saveToFirestore('gallery', galleryImages);
        }
      }, (err) => console.warn('[Firestore] Erro na galeria:', err.message));
      unsubs.push(unsubGallery);
    } catch (e) {
      console.warn(e);
    }

    // 5. Horários & Pausas
    try {
      const unsubSchedule = onSnapshot(doc(firestoreDb, 'barbershop', 'schedule'), (snap) => {
        if (!isMounted) return;
        if (snap.exists() && snap.data()?.data) {
          const cloudSchedule = snap.data().data;
          setScheduleConfig(prev => ({ ...prev, ...cloudSchedule }));
          localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(cloudSchedule));
        } else {
          saveToFirestore('schedule', scheduleConfig);
        }
      }, (err) => console.warn('[Firestore] Erro nos horários:', err.message));
      unsubs.push(unsubSchedule);
    } catch (e) {
      console.warn(e);
    }

    // 6. Tema de Cores
    try {
      const unsubTheme = onSnapshot(doc(firestoreDb, 'barbershop', 'theme'), (snap) => {
        if (!isMounted) return;
        if (snap.exists() && snap.data()?.data) {
          const cloudTheme = snap.data().data;
          setTheme(cloudTheme);
          localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(cloudTheme));
        } else {
          saveToFirestore('theme', theme);
        }
      }, (err) => console.warn('[Firestore] Erro no tema:', err.message));
      unsubs.push(unsubTheme);
    } catch (e) {
      console.warn(e);
    }

    // 7. Agendamentos em Tempo Real
    try {
      const colRef = collection(firestoreDb, 'appointments');
      const unsubApts = onSnapshot(colRef, (snapshot) => {
        if (!isMounted) return;
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => ({
            id: d.id,
            ...d.data()
          }));
          list.sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return timeB - timeA;
          });
          setAppointments(list);
          localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(list));
        }
      }, (err) => {
        console.warn('[Firestore] Erro em agendamentos:', err.message);
      });
      unsubs.push(unsubApts);
    } catch (e) {
      console.warn(e);
    }

    return () => {
      isMounted = false;
      unsubs.forEach(u => typeof u === 'function' && u());
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEED_POSTS, JSON.stringify(feedPosts));
  }, [feedPosts]);

  // 9. Serviços Adicionais (Upsell)
  const [extras, setExtras] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXTRAS);
      return saved ? JSON.parse(saved) : (BARBERSHOP_DATA.extras || []);
    } catch (e) {
      return BARBERSHOP_DATA.extras || [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXTRAS, JSON.stringify(extras));
  }, [extras]);

  // 10. Sessão e Contas dos Clientes
  const [currentClient, setCurrentClient] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLIENT_SESSION);
      if (saved) return JSON.parse(saved);
      // Fallback para andrade_client_info_v1 se o cliente já tiver agendado antes
      const oldInfo = localStorage.getItem('andrade_client_info_v1');
      if (oldInfo) {
        const parsed = JSON.parse(oldInfo);
        if (parsed.name && parsed.phone) {
          const client = {
            name: parsed.name,
            phone: parsed.phone,
            cleanPhone: parsed.phone.replace(/\D/g, ''),
            createdAt: new Date().toISOString(),
          };
          localStorage.setItem(STORAGE_KEYS.CLIENT_SESSION, JSON.stringify(client));
          return client;
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const clientLogin = ({ name, phone }) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const clientData = {
      name: name.trim(),
      phone: phone.trim(),
      cleanPhone,
      createdAt: new Date().toISOString(),
    };

    setCurrentClient(clientData);
    try {
      localStorage.setItem(STORAGE_KEYS.CLIENT_SESSION, JSON.stringify(clientData));
      localStorage.setItem('andrade_client_info_v1', JSON.stringify({ name: clientData.name, phone: clientData.phone }));
      
      // Atualiza o banco geral de clientes
      const savedDb = localStorage.getItem(STORAGE_KEYS.CLIENTS_DB);
      const db = savedDb ? JSON.parse(savedDb) : {};
      db[cleanPhone] = {
        ...(db[cleanPhone] || {}),
        ...clientData,
        lastActive: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.CLIENTS_DB, JSON.stringify(db));
      window.dispatchEvent(new Event('andrade_client_auth_changed'));
    } catch (e) {
      console.error(e);
    }
    return clientData;
  };

  const clientLogout = () => {
    setCurrentClient(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.CLIENT_SESSION);
      window.dispatchEvent(new Event('andrade_client_auth_changed'));
    } catch (e) {
      console.error(e);
    }
  };

  const getClientAppointments = (phoneOrCleanPhone) => {
    if (!phoneOrCleanPhone) return [];
    const clean = phoneOrCleanPhone.replace(/\D/g, '');
    return appointments.filter(a => {
      const aClean = (a.phone || '').replace(/\D/g, '');
      return aClean === clean;
    });
  };

  const getClientStats = (phoneOrCleanPhone) => {
    const clientApts = getClientAppointments(phoneOrCleanPhone);
    const validCuts = clientApts.filter(a => a.status !== 'Cancelado');
    const totalCuts = validCuts.length;
    const totalSpent = validCuts.reduce((acc, a) => acc + (parseFloat(a.price) || 0), 0);

    // Serviço mais frequente
    const serviceCounts = {};
    validCuts.forEach(a => {
      const s = a.baseService || a.service || 'Corte Masculino';
      serviceCounts[s] = (serviceCounts[s] || 0) + 1;
    });
    let favoriteService = 'Corte Masculino';
    let maxCount = 0;
    Object.entries(serviceCounts).forEach(([srv, count]) => {
      if (count > maxCount) {
        maxCount = count;
        favoriteService = srv;
      }
    });

    // Cartão fidelidade: cortes para o próximo benefício (a cada 10 cortes)
    const cutsTowardsReward = totalCuts % 10;
    const cutsRemaining = 10 - cutsTowardsReward;

    return {
      totalCuts,
      totalSpent,
      favoriteService,
      cutsTowardsReward,
      cutsRemaining,
      appointments: clientApts,
    };
  };

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
    setServices(prev => {
      const updated = [created, ...prev];
      saveToFirestore('services', updated);
      return updated;
    });
  };

  const updateService = (id, updatedFields) => {
    setServices(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...updatedFields } : s);
      saveToFirestore('services', updated);
      return updated;
    });
  };

  const deleteService = (id) => {
    setServices(prev => {
      const updated = prev.filter(s => s.id !== id);
      saveToFirestore('services', updated);
      return updated;
    });
  };

  // Ações de Comodidades
  const toggleAmenity = (id) => {
    setAmenities(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a);
      saveToFirestore('amenities', updated);
      return updated;
    });
  };

  const addAmenity = (label, icon = 'Sparkles') => {
    const newAm = {
      id: 'am-' + Date.now(),
      label,
      icon,
      enabled: true,
    };
    setAmenities(prev => {
      const updated = [...prev, newAm];
      saveToFirestore('amenities', updated);
      return updated;
    });
  };

  const deleteAmenity = (id) => {
    setAmenities(prev => {
      const updated = prev.filter(a => a.id !== id);
      saveToFirestore('amenities', updated);
      return updated;
    });
  };

  // Ações de Galeria
  const addGalleryImage = (url) => {
    if (!url) return;
    setGalleryImages(prev => {
      const updated = [...prev, url];
      saveToFirestore('gallery', updated);
      return updated;
    });
  };

  const removeGalleryImage = (indexToRemove) => {
    setGalleryImages(prev => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      saveToFirestore('gallery', updated);
      return updated;
    });
  };

  // Ações de Perfil & Especialidades
  const updateProfile = (fields) => {
    setProfile(prev => {
      const updated = { ...prev, ...fields };
      saveToFirestore('profile', updated);
      return updated;
    });
  };

  const addSpecialty = (item) => {
    if (!item || !item.trim()) return;
    setProfile(prev => {
      const updated = {
        ...prev,
        specialties: [...prev.specialties, item.trim()]
      };
      saveToFirestore('profile', updated);
      return updated;
    });
  };

  const removeSpecialty = (indexToRemove) => {
    setProfile(prev => {
      const updated = {
        ...prev,
        specialties: prev.specialties.filter((_, idx) => idx !== indexToRemove)
      };
      saveToFirestore('profile', updated);
      return updated;
    });
  };

  // Ações de Horários & Intervalos
  const updateSchedule = (fields) => {
    setScheduleConfig(prev => {
      const updated = { ...prev, ...fields };
      saveToFirestore('schedule', updated);
      return updated;
    });
  };

  const triggerQuickPause = (minutes) => {
    const until = new Date();
    until.setMinutes(until.getMinutes() + minutes);
    const timeFormatted = `${until.getHours().toString().padStart(2, '0')}:${until.getMinutes().toString().padStart(2, '0')}`;
    
    setScheduleConfig(prev => {
      const updated = {
        ...prev,
        status: `Em Pausa (${minutes}m)`,
        currentPauseEndTime: timeFormatted,
      };
      saveToFirestore('schedule', updated);
      return updated;
    });
  };

  const resumeStatus = () => {
    setScheduleConfig(prev => {
      const updated = {
        ...prev,
        status: 'Disponível',
        currentPauseEndTime: null,
        vacationMode: false,
      };
      saveToFirestore('schedule', updated);
      return updated;
    });
  };

  const toggleVacationMode = () => {
    setScheduleConfig(prev => {
      const nextMode = !prev.vacationMode;
      const updated = {
        ...prev,
        vacationMode: nextMode,
        status: nextMode ? 'Modo Férias' : 'Disponível',
      };
      saveToFirestore('schedule', updated);
      return updated;
    });
  };

  // Ações de Agendamentos
  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    try {
      updateDoc(doc(firestoreDb, 'appointments', id), { status: newStatus }).catch(err => {
        console.warn('Não foi possível sincronizar status no Firestore:', err.message);
      });
    } catch (e) {
      console.warn('Erro ao chamar updateDoc no Firestore:', e);
    }
  };

  const addAppointment = (newApt) => {
    const created = {
      id: 'apt-' + Date.now(),
      ...newApt,
      status: newApt.status || 'Confirmado',
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [created, ...prev]);

    try {
      // Remove campos undefined para evitar erros no Firestore
      const safeData = JSON.parse(JSON.stringify(created, (k, v) => (v === undefined ? null : v)));
      setDoc(doc(firestoreDb, 'appointments', created.id), safeData).catch(err => {
        console.warn('Não foi possível salvar agendamento no Firestore:', err.message);
      });
    } catch (e) {
      console.warn('Erro ao chamar setDoc no Firestore:', e);
    }
  };

  const deleteAppointment = (id) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    try {
      deleteDoc(doc(firestoreDb, 'appointments', id)).catch(err => {
        console.warn('Não foi possível excluir no Firestore:', err.message);
      });
    } catch (e) {
      console.warn('Erro ao chamar deleteDoc no Firestore:', e);
    }
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
    setFeedPosts(prev => {
      const updated = [created, ...prev];
      saveToFirestore('feed', updated);
      return updated;
    });
  };

  const deleteFeedPost = (id) => {
    setFeedPosts(prev => {
      const updated = prev.filter(p => p.id !== id);
      saveToFirestore('feed', updated);
      return updated;
    });
  };

  const updateFeedPost = (id, updatedFields) => {
    setFeedPosts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updatedFields } : p);
      saveToFirestore('feed', updated);
      return updated;
    });
  };

  const toggleLikeFeedPost = (id) => {
    setFeedPosts(prev => {
      const updated = prev.map(p => {
        if (p.id === id) {
          const isLiked = !!p.isLiked;
          return {
            ...p,
            isLiked: !isLiked,
            likes: Math.max(0, (p.likes || 0) + (isLiked ? -1 : 1))
          };
        }
        return p;
      });
      saveToFirestore('feed', updated);
      return updated;
    });
  };

  const addCommentToFeedPost = (postId, comment) => {
    setFeedPosts(prev => {
      const updated = prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...(p.comments || []), { id: 'c-' + Date.now(), ...comment }]
          };
        }
        return p;
      });
      saveToFirestore('feed', updated);
      return updated;
    });
  };

  const syncLocalToCloud = async () => {
    setIsCloudSyncing(true);
    try {
      await Promise.all([
        saveToFirestore('profile', profile),
        saveToFirestore('services', services),
        saveToFirestore('amenities', amenities),
        saveToFirestore('gallery', galleryImages),
        saveToFirestore('schedule', scheduleConfig),
        saveToFirestore('feed', feedPosts),
        saveToFirestore('theme', theme),
      ]);
      return true;
    } catch (e) {
      console.warn('[Firestore] Erro ao sincronizar:', e);
      return false;
    } finally {
      setIsCloudSyncing(false);
    }
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

        extras,
        setExtras,

        currentClient,
        clientLogin,
        clientLogout,
        getClientAppointments,
        getClientStats,

        cloudSyncStatus,
        isCloudSyncing,
        syncLocalToCloud,

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
