// Dados Oficiais da Barbearia Andrade (Saymon Andrade)
export const BARBERSHOP_DATA = {
  name: "Barbearia Andrade",
  tagline: "Estilo, elegância e precisão no Povoado Cigana",
  owner: "Saymon Andrade",
  phone: "(99) 99122-0211",
  whatsappNumber: "5599991220211",
  instagram: "saymon_andradeee",
  instagramUrl: "https://instagram.com/saymon_andradeee",
  address: "Rua Principal, Povoado Cigana, Tuntum - MA",
  cityState: "Povoado Cigana, Tuntum - MA",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Povoado+Cigana+Rua+Principal+Tuntum+MA",
  rating: 4.9,
  reviewsCount: 142,
  experienceYears: "5+ anos",
  
  // Imagens de demonstração de alta qualidade (placeholders)
  images: {
    hero: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80",
    barber: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80",
    logoBadge: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=400&q=80",
  },

  // Horários de Atendimento oficiais
  schedule: {
    weekdays: "Segunda a Sexta: 13:00 às 18:00",
    saturday: "Sábado: 08:00 às 13:00",
    sunday: "Domingo: Fechado",
  },

  // Comodidades
  amenities: [
    { id: 'ac', label: 'Ambiente Climatizado', icon: 'Snowflake' },
    { id: 'wifi', label: 'Wi-Fi de Alta Velocidade', icon: 'Wifi' },
    { id: 'coffee', label: 'Café & Bebidas', icon: 'Coffee' },
    { id: 'music', label: 'Música Ambiente', icon: 'Music' },
    { id: 'parking', label: 'Estacionamento Fácil', icon: 'Car' },
  ],

  // Catálogo de Serviços com Valores e Imagens
  services: [
    {
      id: 'corte-masculino',
      name: 'Corte Masculino / Degradê',
      category: 'cabelo',
      duration: '30 min',
      price: 30.00,
      description: 'Degradê na navalha ou máquina, fade limpo, corte social clássico ou moderno com finalização impecável.',
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80',
      popular: true,
    },
    {
      id: 'barba-alinhada',
      name: 'Barba Alinhada / Toalha Quente',
      category: 'barba',
      duration: '25 min',
      price: 25.00,
      description: 'Design e alinhamento de barba com terapia de toalha quente, hidratação profunda e lâmina descartável.',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80',
      popular: false,
    },
    {
      id: 'combo-andrade',
      name: 'Combo Andrade (Corte + Barba)',
      category: 'combo',
      duration: '50 min',
      price: 50.00,
      description: 'A experiência completa: corte degradê de alta definição + barboterapia completa com produtos premium.',
      image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80',
      popular: true,
      badge: 'Mais Pedido',
    },
    {
      id: 'sobrancelha',
      name: 'Sobrancelha / Acabamento',
      category: 'acabamento',
      duration: '15 min',
      price: 10.00,
      description: 'Alinhamento na navalha ou pinça para harmonizar o olhar e dar acabamento limpo ao visual.',
      image: 'https://images.unsplash.com/photo-1517832606589-7629c6ae9e44?auto=format&fit=crop&w=600&q=80',
      popular: false,
    },
    {
      id: 'platinado-luzes',
      name: 'Platinado / Luzes / Nevou',
      category: 'quimica',
      duration: '90 min',
      price: 80.00,
      description: 'Descoloração global com matização profissional sem agredir os fios, para quem busca estilo ousado.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
      popular: false,
    }
  ],

  // Agendamentos simulados para a demonstração da Área do Barbeiro e Métricas
  mockBarberAppointments: [
    // Atendimentos de Hoje
    {
      id: 'apt-1',
      client: 'Marcos Vinícius',
      phone: '(99) 98144-1234',
      service: 'Combo Andrade (Corte + Barba)',
      date: '2026-09-04',
      time: '13:30',
      price: 50.00,
      payment: 'Pix',
      status: 'Concluído',
    },
    {
      id: 'apt-2',
      client: 'Lucas Ribeiro',
      phone: '(99) 98210-9988',
      service: 'Corte Masculino / Degradê',
      date: '2026-09-04',
      time: '14:30',
      price: 30.00,
      payment: 'Cartão',
      status: 'Em Atendimento',
    },
    {
      id: 'apt-3',
      client: 'Gabriel Souza',
      phone: '(99) 99105-4321',
      service: 'Barba Alinhada / Toalha Quente',
      date: '2026-09-04',
      time: '15:30',
      price: 25.00,
      payment: 'Dinheiro',
      status: 'Confirmado',
    },
    {
      id: 'apt-4',
      client: 'Rodrigo Lima',
      phone: '(99) 98455-7711',
      service: 'Corte Masculino / Degradê',
      date: '2026-09-04',
      time: '16:30',
      price: 30.00,
      payment: 'Pix',
      status: 'Confirmado',
    },
    // Atendimentos Passados do Mês (Histórico Concluído)
    {
      id: 'apt-5',
      client: 'Felipe Santos',
      phone: '(99) 98112-4455',
      service: 'Combo Andrade (Corte + Barba)',
      date: '2026-09-03',
      time: '14:00',
      price: 50.00,
      payment: 'Pix',
      status: 'Concluído',
    },
    {
      id: 'apt-6',
      client: 'André Martins',
      phone: '(99) 99221-7788',
      service: 'Combo Andrade (Corte + Barba)',
      date: '2026-09-03',
      time: '15:00',
      price: 50.00,
      payment: 'Pix',
      status: 'Concluído',
    },
    {
      id: 'apt-7',
      client: 'Mateus Oliveira',
      phone: '(99) 98833-2211',
      service: 'Corte Masculino / Degradê',
      date: '2026-09-03',
      time: '16:00',
      price: 30.00,
      payment: 'Dinheiro',
      status: 'Concluído',
    },
    {
      id: 'apt-8',
      client: 'Eduardo Costa',
      phone: '(99) 99144-9900',
      service: 'Platinado / Luzes / Nevou',
      date: '2026-09-02',
      time: '14:00',
      price: 80.00,
      payment: 'Cartão',
      status: 'Concluído',
    },
    {
      id: 'apt-9',
      client: 'Rafael Barbosa',
      phone: '(99) 98199-6633',
      service: 'Combo Andrade (Corte + Barba)',
      date: '2026-09-02',
      time: '16:00',
      price: 50.00,
      payment: 'Pix',
      status: 'Concluído',
    },
    {
      id: 'apt-10',
      client: 'Gustavo Henrique',
      phone: '(99) 99200-3344',
      service: 'Corte Masculino / Degradê',
      date: '2026-09-01',
      time: '13:30',
      price: 30.00,
      payment: 'Pix',
      status: 'Concluído',
    },
    {
      id: 'apt-11',
      client: 'Thiago Nogueira',
      phone: '(99) 98155-2244',
      service: 'Barba Alinhada / Toalha Quente',
      date: '2026-09-01',
      time: '15:00',
      price: 25.00,
      payment: 'Dinheiro',
      status: 'Concluído',
    },
    {
      id: 'apt-12',
      client: 'Bruno Castro',
      phone: '(99) 99177-8899',
      service: 'Combo Andrade (Corte + Barba)',
      date: '2026-09-01',
      time: '16:30',
      price: 50.00,
      payment: 'Pix',
      status: 'Concluído',
    },
    // Agendamentos Futuros (Previsão de Faturamento)
    {
      id: 'apt-13',
      client: 'Vinícius Rocha',
      phone: '(99) 98233-1122',
      service: 'Combo Andrade (Corte + Barba)',
      date: '2026-09-05',
      time: '09:00',
      price: 50.00,
      payment: 'Pix',
      status: 'Confirmado',
    },
    {
      id: 'apt-14',
      client: 'Diego Alencar',
      phone: '(99) 98122-3377',
      service: 'Corte Masculino / Degradê',
      date: '2026-09-05',
      time: '10:00',
      price: 30.00,
      payment: 'Cartão',
      status: 'Confirmado',
    },
    {
      id: 'apt-15',
      client: 'Leonardo Ferreira',
      phone: '(99) 99244-5566',
      service: 'Combo Andrade (Corte + Barba)',
      date: '2026-09-05',
      time: '11:00',
      price: 50.00,
      payment: 'Pix',
      status: 'Confirmado',
    },
    {
      id: 'apt-16',
      client: 'Samuel Dias',
      phone: '(99) 98877-6655',
      service: 'Corte Masculino / Degradê',
      date: '2026-09-08',
      time: '14:00',
      price: 30.00,
      payment: 'Dinheiro',
      status: 'Confirmado',
    },
    {
      id: 'apt-17',
      client: 'Henrique Prado',
      phone: '(99) 99111-4477',
      service: 'Combo Andrade (Corte + Barba)',
      date: '2026-09-08',
      time: '15:30',
      price: 50.00,
      payment: 'Pix',
      status: 'Confirmado',
    },
    {
      id: 'apt-18',
      client: 'Caio Medeiros',
      phone: '(99) 98166-5544',
      service: 'Barba Alinhada / Toalha Quente',
      date: '2026-09-08',
      time: '17:00',
      price: 25.00,
      payment: 'Pix',
      status: 'Confirmado',
    }
  ]
};

// Gerador de Slots de Horários com base no dia da semana
export function getAvailableTimeSlots(dateString) {
  if (!dateString) return [];
  
  // Date format: YYYY-MM-DD
  const parts = dateString.split('-');
  const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const dayOfWeek = dateObj.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado

  // Domingo fechado
  if (dayOfWeek === 0) {
    return [];
  }

  // Sábado: 08:00 às 13:00 (slots a cada 30 min)
  if (dayOfWeek === 6) {
    return [
      { time: '08:00', available: true },
      { time: '08:30', available: true },
      { time: '09:00', available: false }, // Simulado como ocupado para realismo
      { time: '09:30', available: true },
      { time: '10:00', available: true },
      { time: '10:30', available: true },
      { time: '11:00', available: false },
      { time: '11:30', available: true },
      { time: '12:00', available: true },
      { time: '12:30', available: true },
    ];
  }

  // Segunda a Sexta: 13:00 às 18:00 (slots a cada 30 min)
  return [
    { time: '13:00', available: true },
    { time: '13:30', available: false }, // Simulado como ocupado
    { time: '14:00', available: true },
    { time: '14:30', available: true },
    { time: '15:00', available: true },
    { time: '15:30', available: false }, // Simulado como ocupado
    { time: '16:00', available: true },
    { time: '16:30', available: true },
    { time: '17:00', available: true },
    { time: '17:30', available: true },
  ];
}
