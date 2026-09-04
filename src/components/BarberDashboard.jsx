import React, { useState, useRef } from 'react';
import { 
  Calendar, Clock, CheckCircle2, Coffee, 
  Palmtree, DollarSign, Edit2, Trash2, Plus, 
  Phone, Scissors, Share2, Check, ExternalLink, 
  ShieldCheck, Sparkles, AlertCircle, Settings, 
  Building2, X, RotateCcw, ChevronRight, User, Eye, EyeOff,
  Upload, Camera, Loader2
} from 'lucide-react';
import { useBarber } from '../context/BarberContext';
import { uploadImageToCloudinary } from '../services/cloudinary';

export default function BarberDashboard({ onBackToClientView }) {
  const {
    services, addService, updateService, deleteService,
    amenities, toggleAmenity, addAmenity, deleteAmenity,
    profile, updateProfile, addSpecialty, removeSpecialty,
    scheduleConfig, updateSchedule, triggerQuickPause, resumeStatus, toggleVacationMode,
    appointments, updateAppointmentStatus, addAppointment, deleteAppointment,
    resetToFactoryDefaults
  } = useBarber();

  const [activeSubTab, setActiveSubTab] = useState('agenda'); // 'agenda' | 'servicos' | 'horarios' | 'perfil'
  const [copiedLink, setCopiedLink] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Estados de formulários / modais
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: '', category: 'cabelo', duration: '30 min', price: '', description: '', badge: '', image: ''
  });

  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    client: '', phone: '', service: '', time: '14:00', price: '', payment: 'Pix'
  });

  const [newSpecialtyText, setNewSpecialtyText] = useState('');
  const [newAmenityText, setNewAmenityText] = useState('');
  const [isUploadingServiceImage, setIsUploadingServiceImage] = useState(false);
  const [isUploadingProfileImage, setIsUploadingProfileImage] = useState(false);
  const serviceFileInputRef = useRef(null);
  const profileFileInputRef = useRef(null);

  const handleServiceFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingServiceImage(true);
      showToast('Enviando foto para o Cloudinary...');
      const imageUrl = await uploadImageToCloudinary(file);
      setServiceForm(prev => ({ ...prev, image: imageUrl }));
      showToast('Foto do corte enviada com sucesso!');
    } catch (err) {
      alert('Erro ao enviar imagem: ' + (err.message || 'Erro no upload'));
    } finally {
      setIsUploadingServiceImage(false);
    }
  };

  const handleProfileFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingProfileImage(true);
      showToast('Enviando sua foto para o Cloudinary...');
      const imageUrl = await uploadImageToCloudinary(file);
      updateProfile({ image: imageUrl });
      showToast('Foto de perfil atualizada com sucesso!');
    } catch (err) {
      alert('Erro ao enviar imagem: ' + (err.message || 'Erro no upload'));
    } finally {
      setIsUploadingProfileImage(false);
    }
  };

  const showToast = (msg) => {
    setNotificationMessage(msg);
    setTimeout(() => setNotificationMessage(''), 3000);
  };

  const handleCopyClientLink = () => {
    const clientUrl = window.location.origin + window.location.pathname;
    navigator.clipboard.writeText(clientUrl).then(() => {
      setCopiedLink(true);
      showToast('Link do cliente copiado!');
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  // Cálculo financeiro
  const totalBilling = appointments.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0);
  const completedAppointments = appointments.filter(a => a.status === 'Concluído').length;

  // Handlers de Serviços
  const handleOpenNewServiceModal = () => {
    setEditingService(null);
    setServiceForm({
      name: '', category: 'cabelo', duration: '30 min', price: '', description: '', badge: '',
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80'
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditServiceModal = (svc) => {
    setEditingService(svc);
    setServiceForm({
      name: svc.name,
      category: svc.category,
      duration: svc.duration,
      price: svc.price.toString(),
      description: svc.description || '',
      badge: svc.badge || '',
      image: svc.image || '',
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveServiceForm = (e) => {
    e.preventDefault();
    if (!serviceForm.name.trim() || !serviceForm.price) {
      alert('Preencha pelo menos o Nome e o Preço do serviço.');
      return;
    }

    if (editingService) {
      updateService(editingService.id, {
        name: serviceForm.name,
        category: serviceForm.category,
        duration: serviceForm.duration,
        price: parseFloat(serviceForm.price),
        description: serviceForm.description,
        badge: serviceForm.badge,
        image: serviceForm.image || editingService.image,
      });
      showToast('Serviço atualizado com sucesso!');
    } else {
      addService({
        name: serviceForm.name,
        category: serviceForm.category,
        duration: serviceForm.duration,
        price: parseFloat(serviceForm.price),
        description: serviceForm.description,
        badge: serviceForm.badge,
        image: serviceForm.image,
      });
      showToast('Novo corte/pacote cadastrado!');
    }
    setIsServiceModalOpen(false);
  };

  // Handlers de Agendamento Manual
  const handleSaveAppointmentForm = (e) => {
    e.preventDefault();
    if (!appointmentForm.client.trim() || !appointmentForm.service) {
      alert('Preencha o nome do cliente e o serviço.');
      return;
    }
    const selectedSvc = services.find(s => s.name === appointmentForm.service);
    const finalPrice = appointmentForm.price ? parseFloat(appointmentForm.price) : (selectedSvc ? selectedSvc.price : 30);

    addAppointment({
      client: appointmentForm.client,
      phone: appointmentForm.phone || '(99) 99999-9999',
      service: appointmentForm.service,
      time: appointmentForm.time,
      price: finalPrice,
      payment: appointmentForm.payment,
      status: 'Confirmado',
    });

    showToast('Agendamento manual adicionado!');
    setIsAppointmentModalOpen(false);
    setAppointmentForm({ client: '', phone: '', service: '', time: '14:00', price: '', payment: 'Pix' });
  };

  return (
    <div className="p-3 sm:p-4 space-y-4 animate-in fade-in duration-300">
      
      {/* Toast de Notificação */}
      {notificationMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-gold-500 text-dark-950 text-xs font-black shadow-gold-glow flex items-center gap-2 animate-in slide-in-from-top-3">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{notificationMessage}</span>
        </div>
      )}

      {/* Top Header do Painel */}
      <div className="p-3.5 rounded-2xl bg-card-gradient border border-dark-750 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full p-0.5 bg-gradient-to-tr from-gold-400 to-amber-200 shadow-gold-glow-sm">
              <img
                src={profile.image}
                alt={profile.owner}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-extrabold text-white">
                  {profile.owner}
                </h1>
                <ShieldCheck className="w-4 h-4 text-gold-400" />
              </div>
              <p className="text-[11px] text-neutral-400">{profile.name} • Tuntum - MA</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopyClientLink}
              className="px-2.5 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-gold-400 border border-gold-500/30 text-[11px] font-bold flex items-center gap-1 transition-all"
              title="Copiar link para enviar aos clientes"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copiado!' : 'Link Cliente'}</span>
            </button>
          </div>
        </div>

        {/* Status Atual & Controle Rápido de Pausas */}
        <div className="pt-2 border-t border-dark-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-400 font-medium">Status:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1.5 ${
              scheduleConfig.vacationMode
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                : scheduleConfig.status.includes('Pausa')
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {scheduleConfig.vacationMode ? 'Férias Ativada' : scheduleConfig.status}
            </span>
          </div>

          {/* Botões rápidos de status */}
          <div className="flex items-center gap-1 text-[10px]">
            {scheduleConfig.status !== 'Disponível' || scheduleConfig.vacationMode ? (
              <button
                onClick={() => { resumeStatus(); showToast('Status: Disponível'); }}
                className="px-2 py-1 rounded-lg bg-emerald-500 text-dark-950 font-bold hover:bg-emerald-400 transition-all cursor-pointer"
              >
                Ficar Disponível
              </button>
            ) : (
              <>
                <button
                  onClick={() => { triggerQuickPause(scheduleConfig.breakDuration || 30); showToast(`Pausa de ${scheduleConfig.breakDuration || 30}m iniciada`); }}
                  className="px-2 py-1 rounded-lg bg-dark-800 hover:bg-dark-750 text-neutral-300 border border-dark-700 flex items-center gap-1 cursor-pointer"
                >
                  <Coffee className="w-3 h-3 text-amber-400" />
                  <span>Pausar {scheduleConfig.breakDuration || 30}m</span>
                </button>

                <button
                  onClick={() => { toggleVacationMode(); showToast(scheduleConfig.vacationMode ? 'Férias desativadas' : 'Modo Férias ativado!'); }}
                  className="px-2 py-1 rounded-lg bg-dark-800 hover:bg-dark-750 text-neutral-300 border border-dark-700 flex items-center gap-1 cursor-pointer"
                >
                  <Palmtree className="w-3 h-3 text-rose-400" />
                  <span>Férias</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navegação entre Abas do Painel */}
      <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-dark-900 border border-dark-800 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('agenda')}
          className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
            activeSubTab === 'agenda' ? 'bg-gold-500 text-dark-950 shadow-gold-glow-sm' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Agenda</span>
        </button>

        <button
          onClick={() => setActiveSubTab('servicos')}
          className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
            activeSubTab === 'servicos' ? 'bg-gold-500 text-dark-950 shadow-gold-glow-sm' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Scissors className="w-3.5 h-3.5" />
          <span>Cortes ({services.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('horarios')}
          className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
            activeSubTab === 'horarios' ? 'bg-gold-500 text-dark-950 shadow-gold-glow-sm' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Horários</span>
        </button>

        <button
          onClick={() => setActiveSubTab('perfil')}
          className={`py-2 px-1 rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
            activeSubTab === 'perfil' ? 'bg-gold-500 text-dark-950 shadow-gold-glow-sm' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Barbearia</span>
        </button>
      </div>

      {/* =========================================================================
          ABA 1: AGENDA DE ATENDIMENTOS DO DIA
      ========================================================================= */}
      {activeSubTab === 'agenda' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {/* Métricas Rápidas */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bg-dark-900 border border-dark-800">
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">Hoje</span>
              <span className="text-xl font-black text-white">{appointments.length}</span>
              <span className="text-[10px] text-neutral-500 block">agendamentos</span>
            </div>

            <div className="p-3 rounded-xl bg-dark-900 border border-dark-800">
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">Concluídos</span>
              <span className="text-xl font-black text-emerald-400">{completedAppointments}</span>
              <span className="text-[10px] text-neutral-500 block">atendidos</span>
            </div>

            <div className="p-3 rounded-xl bg-dark-900 border border-dark-800">
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">Previsão</span>
              <span className="text-lg font-black text-gold-400">R$ {totalBilling.toFixed(0)}</span>
              <span className="text-[10px] text-neutral-500 block">faturamento</span>
            </div>
          </div>

          {/* Botão Novo Agendamento */}
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-neutral-300">
              Clientes Agendados
            </h3>
            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-dark-950 font-bold text-xs flex items-center gap-1 shadow-gold-glow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Agendar Cliente</span>
            </button>
          </div>

          {/* Lista de Atendimentos */}
          <div className="space-y-2">
            {appointments.length === 0 ? (
              <div className="p-6 rounded-2xl bg-dark-900 border border-dark-800 text-center text-neutral-400 text-xs">
                Nenhum agendamento para hoje ainda.
              </div>
            ) : (
              appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-3 rounded-2xl bg-card-gradient border border-dark-750 flex flex-col gap-2.5 hover:border-gold-500/40 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-dark-800 border border-dark-700 flex flex-col items-center justify-center text-gold-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-black">{apt.time}</span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{apt.client}</span>
                        </h4>
                        <p className="text-[11px] text-gold-400 font-medium">{apt.service}</p>
                        <p className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                          <Phone className="w-2.5 h-2.5" /> {apt.phone} • {apt.payment}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-extrabold text-white block">
                        R$ {parseFloat(apt.price).toFixed(2).replace('.', ',')}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm(`Remover agendamento de ${apt.client}?`)) {
                            deleteAppointment(apt.id);
                            showToast('Agendamento removido.');
                          }
                        }}
                        className="text-neutral-500 hover:text-rose-400 p-1 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Status & Botões de Mudança de Estado */}
                  <div className="pt-2 border-t border-dark-800 flex items-center justify-between">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                      apt.status === 'Concluído'
                        ? 'bg-neutral-800 text-neutral-400'
                        : apt.status === 'Em Atendimento'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {apt.status}
                    </span>

                    <div className="flex items-center gap-1.5 text-[11px]">
                      {apt.status !== 'Concluído' && (
                        <button
                          onClick={() => {
                            updateAppointmentStatus(apt.id, 'Concluído');
                            showToast(`Corte de ${apt.client} concluído!`);
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Concluir</span>
                        </button>
                      )}
                      {apt.status === 'Confirmado' && (
                        <button
                          onClick={() => {
                            updateAppointmentStatus(apt.id, 'Em Atendimento');
                            showToast(`Atendimento iniciado.`);
                          }}
                          className="px-2 py-1 rounded-lg bg-gold-500 text-dark-950 font-bold transition-all cursor-pointer"
                        >
                          Iniciar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 2: GESTÃO DE CORTES, PACOTES E PREÇOS
      ========================================================================= */}
      {activeSubTab === 'servicos' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-300">
                Catálogo de Serviços ({services.length})
              </h3>
              <p className="text-[10px] text-neutral-400">Adicione, altere preços ou exclua serviços</p>
            </div>

            <button
              onClick={handleOpenNewServiceModal}
              className="px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-dark-950 font-black text-xs flex items-center gap-1.5 shadow-gold-glow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Novo Corte</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="p-3 rounded-2xl bg-card-gradient border border-dark-750 hover:border-gold-500/40 transition-all flex flex-col gap-2 relative overflow-hidden"
              >
                {svc.badge && (
                  <span className="absolute top-0 right-0 px-2.5 py-0.5 bg-gold-gradient text-dark-950 text-[9px] font-black uppercase tracking-wider rounded-bl-lg">
                    {svc.badge}
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <img
                    src={svc.image}
                    alt={svc.name}
                    className="w-14 h-14 rounded-xl object-cover border border-dark-700 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                      {svc.name}
                    </h4>
                    <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                      {svc.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-400">
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3 text-gold-400" />
                        {svc.duration}
                      </span>
                      <span>•</span>
                      <span className="uppercase text-gold-300 font-semibold">{svc.category}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-extrabold text-gold-400 block">
                      R$ {parseFloat(svc.price).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Botões de Ação para o Corte */}
                <div className="pt-2 border-t border-dark-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditServiceModal(svc)}
                    className="px-2.5 py-1 rounded-lg bg-dark-800 hover:bg-dark-700 text-neutral-200 text-xs font-semibold flex items-center gap-1 border border-dark-700 transition-colors"
                  >
                    <Edit2 className="w-3 h-3 text-gold-400" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Tem certeza que deseja excluir o serviço "${svc.name}"?`)) {
                        deleteService(svc.id);
                        showToast(`Serviço "${svc.name}" excluído.`);
                      }
                    }}
                    className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Excluir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 3: GESTÃO DE HORÁRIOS, INTERVALOS E FÉRIAS
      ========================================================================= */}
      {activeSubTab === 'horarios' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Card de Férias / Indisponibilidade */}
          <div className="p-4 rounded-2xl bg-dark-900 border border-dark-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palmtree className="w-5 h-5 text-rose-400" />
                <div>
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider">
                    Modo Férias / Folga Coletiva
                  </h4>
                  <p className="text-[10px] text-neutral-400">
                    Trava novos agendamentos e avisa os clientes
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => {
                  toggleVacationMode();
                  showToast(scheduleConfig.vacationMode ? 'Férias desativadas' : 'Modo Férias ativado!');
                }}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                  scheduleConfig.vacationMode ? 'bg-rose-500' : 'bg-dark-800'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  scheduleConfig.vacationMode ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {scheduleConfig.vacationMode && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2">
                <p className="font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Barbearia pausada no momento para os clientes.
                </p>
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    Mensagem exibida para os clientes:
                  </label>
                  <input
                    type="text"
                    value={scheduleConfig.vacationMessage}
                    onChange={(e) => updateSchedule({ vacationMessage: e.target.value })}
                    className="w-full p-2 rounded-lg bg-dark-950 border border-dark-700 text-xs text-white"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Configuração de Intervalos e Pausas */}
          <div className="p-4 rounded-2xl bg-dark-900 border border-dark-800 space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>Intervalo de Atendimento & Pausas Rápidas</span>
            </h4>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                  Tempo por Corte (Slots):
                </label>
                <select
                  value={scheduleConfig.slotInterval || 30}
                  onChange={(e) => {
                    updateSchedule({ slotInterval: parseInt(e.target.value) });
                    showToast('Intervalo de slots atualizado!');
                  }}
                  className="w-full p-2 rounded-xl bg-dark-850 border border-dark-700 text-white text-xs font-semibold"
                >
                  <option value={20}>20 em 20 minutos</option>
                  <option value={30}>30 em 30 minutos (Padrão)</option>
                  <option value={45}>45 em 45 minutos</option>
                  <option value={60}>60 minutos (1 hora)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                  Duração da Pausa Rápida:
                </label>
                <select
                  value={scheduleConfig.breakDuration || 30}
                  onChange={(e) => {
                    updateSchedule({ breakDuration: parseInt(e.target.value) });
                    showToast('Tempo de pausa atualizado!');
                  }}
                  className="w-full p-2 rounded-xl bg-dark-850 border border-dark-700 text-white text-xs font-semibold"
                >
                  <option value={15}>15 minutos (Café rápido)</option>
                  <option value={30}>30 minutos (Lanche)</option>
                  <option value={45}>45 minutos</option>
                  <option value={60}>60 minutos (Almoço)</option>
                </select>
              </div>
            </div>

            {/* Ação de Pausa em 1 Clique */}
            <div className="pt-2 border-t border-dark-800 flex items-center justify-between">
              <span className="text-xs text-neutral-300">
                Precisa sair para um café ou imprevisto agora?
              </span>
              <button
                onClick={() => {
                  triggerQuickPause(scheduleConfig.breakDuration || 30);
                  showToast(`Pausa de ${scheduleConfig.breakDuration || 30}m ativada!`);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-dark-950 text-xs font-bold transition-all cursor-pointer"
              >
                Pausar Agora
              </button>
            </div>
          </div>

          {/* Horários Gerais de Atendimento */}
          <div className="p-4 rounded-2xl bg-dark-900 border border-dark-800 space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gold-400" />
              <span>Horários de Funcionamento</span>
            </h4>

            <div className="space-y-3 text-xs">
              {/* Segunda a Sexta */}
              <div className="p-3 rounded-xl bg-dark-850 border border-dark-750 space-y-2">
                <span className="font-bold text-white block">Segunda a Sexta-feira</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-neutral-400 block mb-0.5">Início:</span>
                    <input
                      type="time"
                      value={scheduleConfig.weekdaysStart}
                      onChange={(e) => updateSchedule({ weekdaysStart: e.target.value })}
                      className="w-full p-1.5 rounded-lg bg-dark-950 border border-dark-700 text-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block mb-0.5">Fechamento:</span>
                    <input
                      type="time"
                      value={scheduleConfig.weekdaysEnd}
                      onChange={(e) => updateSchedule({ weekdaysEnd: e.target.value })}
                      className="w-full p-1.5 rounded-lg bg-dark-950 border border-dark-700 text-white text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Sábado */}
              <div className="p-3 rounded-xl bg-dark-850 border border-dark-750 space-y-2">
                <span className="font-bold text-white block">Sábado</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-neutral-400 block mb-0.5">Início:</span>
                    <input
                      type="time"
                      value={scheduleConfig.saturdayStart}
                      onChange={(e) => updateSchedule({ saturdayStart: e.target.value })}
                      className="w-full p-1.5 rounded-lg bg-dark-950 border border-dark-700 text-white text-xs font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-400 block mb-0.5">Fechamento:</span>
                    <input
                      type="time"
                      value={scheduleConfig.saturdayEnd}
                      onChange={(e) => updateSchedule({ saturdayEnd: e.target.value })}
                      className="w-full p-1.5 rounded-lg bg-dark-950 border border-dark-700 text-white text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Domingo */}
              <div className="p-3 rounded-xl bg-dark-850 border border-dark-750 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Domingo</span>
                  <span className="text-[10px] text-neutral-400">Barbearia Fechada</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                  Fechado
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 4: BARBEARIA, COMODIDADES E ESPECIALIDADES
      ========================================================================= */}
      {activeSubTab === 'perfil' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* Dados do Barbeiro */}
          <div className="p-4 rounded-2xl bg-dark-900 border border-dark-800 space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-gold-400" />
              <span>Dados do Barbeiro</span>
            </h4>

            {/* Upload da Foto de Perfil via Cloudinary */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-dark-850 border border-dark-750">
              <div className="relative">
                <img
                  src={profile.image}
                  alt={profile.owner}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gold-500 shadow-gold-glow-sm"
                />
                <button
                  type="button"
                  disabled={isUploadingProfileImage}
                  onClick={() => profileFileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-gold-500 text-dark-950 hover:bg-gold-400 transition-all shadow-md cursor-pointer"
                  title="Trocar foto pelo Cloudinary"
                >
                  {isUploadingProfileImage ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5 stroke-[2.5]" />}
                </button>
              </div>

              <div className="flex-1">
                <p className="text-xs font-bold text-white">Sua Foto de Perfil</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  Foto exibida nos cards para os clientes.
                </p>
                <input
                  ref={profileFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfileFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  disabled={isUploadingProfileImage}
                  onClick={() => profileFileInputRef.current?.click()}
                  className="mt-2 px-3 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-gold-400 border border-gold-500/30 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {isUploadingProfileImage ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Enviando para nuvem...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3 h-3" />
                      <span>Carregar da Galeria/Câmera</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                  Nome do Profissional:
                </label>
                <input
                  type="text"
                  value={profile.owner}
                  onChange={(e) => updateProfile({ owner: e.target.value })}
                  className="w-full p-2 rounded-xl bg-dark-850 border border-dark-700 text-white font-bold text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    WhatsApp:
                  </label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => updateProfile({ phone: e.target.value })}
                    className="w-full p-2 rounded-xl bg-dark-850 border border-dark-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                    Instagram:
                  </label>
                  <input
                    type="text"
                    value={profile.instagram}
                    onChange={(e) => updateProfile({ instagram: e.target.value })}
                    className="w-full p-2 rounded-xl bg-dark-850 border border-dark-700 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                  Endereço Completo:
                </label>
                <input
                  type="text"
                  value={profile.address}
                  onChange={(e) => updateProfile({ address: e.target.value })}
                  className="w-full p-2 rounded-xl bg-dark-850 border border-dark-700 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
                  Biografia de Apresentação:
                </label>
                <textarea
                  rows={2}
                  value={profile.bio}
                  onChange={(e) => updateProfile({ bio: e.target.value })}
                  className="w-full p-2 rounded-xl bg-dark-850 border border-dark-700 text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Especialidades do Barbeiro */}
          <div className="p-4 rounded-2xl bg-dark-900 border border-dark-800 space-y-3">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Minhas Especialidades ({profile.specialties.length})</span>
            </h4>
            <p className="text-[10px] text-neutral-400">
              Essas tags aparecem destacadas no seu card para os clientes.
            </p>

            {/* Tags Atuais */}
            <div className="flex flex-wrap gap-1.5">
              {profile.specialties.map((esp, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-1 rounded-lg bg-dark-800 border border-dark-700 text-neutral-200 flex items-center gap-1.5"
                >
                  <span>{esp}</span>
                  <button
                    onClick={() => {
                      removeSpecialty(idx);
                      showToast(`Especialidade removida.`);
                    }}
                    className="text-neutral-500 hover:text-rose-400"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Adicionar Nova Especialidade */}
            <div className="flex gap-2 pt-2 border-t border-dark-800">
              <input
                type="text"
                placeholder="Ex: Barboterapia, Nevou, Freestyle..."
                value={newSpecialtyText}
                onChange={(e) => setNewSpecialtyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newSpecialtyText.trim()) {
                      addSpecialty(newSpecialtyText);
                      setNewSpecialtyText('');
                      showToast('Especialidade adicionada!');
                    }
                  }
                }}
                className="flex-1 p-2 rounded-xl bg-dark-850 border border-dark-700 text-xs text-white"
              />
              <button
                onClick={() => {
                  if (newSpecialtyText.trim()) {
                    addSpecialty(newSpecialtyText);
                    setNewSpecialtyText('');
                    showToast('Especialidade adicionada!');
                  }
                }}
                className="px-3 py-2 rounded-xl bg-gold-500 text-dark-950 font-bold text-xs cursor-pointer"
              >
                Adicionar
              </button>
            </div>
          </div>

          {/* Comodidades da Barbearia (Ativar / Desativar) */}
          <div className="p-4 rounded-2xl bg-dark-900 border border-dark-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-gold-400" />
                <span>Comodidades da Barbearia</span>
              </h4>
              <span className="text-[10px] text-neutral-400">Ative ou desative na hora</span>
            </div>

            <p className="text-[10px] text-neutral-400">
              O que estiver marcado aqui aparecerá imediatamente para os clientes no aplicativo.
            </p>

            <div className="space-y-2">
              {amenities.map((am) => (
                <div
                  key={am.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                    am.enabled
                      ? 'bg-dark-850 border-gold-500/40 text-white'
                      : 'bg-dark-950 border-dark-800 text-neutral-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold">{am.label}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        toggleAmenity(am.id);
                        showToast(`Comodidade ${am.enabled ? 'desativada' : 'ativada'}!`);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        am.enabled
                          ? 'bg-emerald-500 text-dark-950 shadow-sm'
                          : 'bg-dark-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {am.enabled ? 'Ativo' : 'Desativado'}
                    </button>

                    <button
                      onClick={() => {
                        deleteAmenity(am.id);
                        showToast('Comodidade excluída.');
                      }}
                      className="p-1 text-neutral-600 hover:text-rose-400 transition-colors"
                      title="Excluir comodidade"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Adicionar Nova Comodidade */}
            <div className="flex gap-2 pt-2 border-t border-dark-800">
              <input
                type="text"
                placeholder="Nova comodidade (ex: Sinuca, Cerveja gelada...)"
                value={newAmenityText}
                onChange={(e) => setNewAmenityText(e.target.value)}
                className="flex-1 p-2 rounded-xl bg-dark-850 border border-dark-700 text-xs text-white"
              />
              <button
                onClick={() => {
                  if (newAmenityText.trim()) {
                    addAmenity(newAmenityText.trim());
                    setNewAmenityText('');
                    showToast('Nova comodidade criada!');
                  }
                }}
                className="px-3 py-2 rounded-xl bg-gold-500 text-dark-950 font-bold text-xs cursor-pointer"
              >
                Cadastrar
              </button>
            </div>
          </div>

          {/* Resetar Configurações */}
          <div className="p-3.5 rounded-xl bg-dark-900 border border-dark-800 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-neutral-300">Restaurar Dados Iniciais</p>
              <span className="text-[10px] text-neutral-500">Recarrega o questionário original</span>
            </div>
            <button
              onClick={() => {
                if (confirm('Deseja restaurar todos os serviços e dados para o padrão original?')) {
                  resetToFactoryDefaults();
                  showToast('Dados restaurados!');
                }
              }}
              className="px-2.5 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-750 text-neutral-400 hover:text-white border border-dark-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Resetar</span>
            </button>
          </div>
        </div>
      )}

      {/* Atalho para Abrir Visão do Cliente */}
      {onBackToClientView && (
        <div className="pt-2 pb-6 text-center">
          <button
            onClick={onBackToClientView}
            className="text-xs text-neutral-400 hover:text-gold-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-gold-400" />
            <span>Abrir e testar o aplicativo como cliente</span>
          </button>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADICIONAR / EDITAR SERVIÇO
      ========================================================================= */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-dark-900 border border-dark-700 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Scissors className="w-4 h-4 text-gold-400" />
                <span>{editingService ? 'Editar Serviço' : 'Novo Corte ou Pacote'}</span>
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(false)}
                className="p-1.5 rounded-full bg-dark-800 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveServiceForm} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-300 mb-1">
                  Nome do Serviço / Pacote:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Corte Degradê Navalhado"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-dark-850 border border-dark-700 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-300 mb-1">
                    Preço (R$):
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    required
                    placeholder="Ex: 35.00"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-dark-850 border border-dark-700 text-gold-400 font-extrabold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-300 mb-1">
                    Duração Estimada:
                  </label>
                  <select
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-dark-850 border border-dark-700 text-white font-semibold"
                  >
                    <option value="15 min">15 min</option>
                    <option value="20 min">20 min</option>
                    <option value="25 min">25 min</option>
                    <option value="30 min">30 min</option>
                    <option value="40 min">40 min</option>
                    <option value="50 min">50 min</option>
                    <option value="60 min">60 min (1h)</option>
                    <option value="90 min">90 min (1h30)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-300 mb-1">
                    Categoria:
                  </label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-dark-850 border border-dark-700 text-white"
                  >
                    <option value="cabelo">Cortes de Cabelo</option>
                    <option value="barba">Barba / Terapia</option>
                    <option value="combo">Combos / Pacotes</option>
                    <option value="acabamento">Sobrancelha / Acabamento</option>
                    <option value="quimica">Platinado / Química</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-300 mb-1">
                    Selo / Destaque (opcional):
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Mais Pedido, VIP..."
                    value={serviceForm.badge}
                    onChange={(e) => setServiceForm({ ...serviceForm, badge: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-dark-850 border border-dark-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-300 mb-1">
                  Descrição dos Benefícios:
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Inclui lavagem, navalha e finalização com pomada modeladora."
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-dark-850 border border-dark-700 text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-300 mb-1.5">
                  Foto do Corte / Pacote:
                </label>

                <div className="p-3 rounded-2xl bg-dark-850 border border-dark-750 space-y-2.5">
                  <div className="flex items-center gap-3">
                    {serviceForm.image ? (
                      <img
                        src={serviceForm.image}
                        alt="Preview"
                        className="w-16 h-16 rounded-xl object-cover border border-gold-500/50 shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-dark-900 border border-dark-700 flex items-center justify-center text-neutral-500">
                        <Scissors className="w-6 h-6" />
                      </div>
                    )}

                    <div className="flex-1">
                      <input
                        ref={serviceFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleServiceFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={isUploadingServiceImage}
                        onClick={() => serviceFileInputRef.current?.click()}
                        className="w-full py-2 px-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-dark-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-gold-glow-sm cursor-pointer"
                      >
                        {isUploadingServiceImage ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Enviando para Cloudinary...</span>
                          </>
                        ) : (
                          <>
                            <Camera className="w-3.5 h-3.5" />
                            <span>Escolher da Galeria / Câmera</span>
                          </>
                        )}
                      </button>
                      <span className="text-[10px] text-neutral-400 block mt-1 text-center">
                        Upload automático na nuvem Cloudinary
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-dark-800">
                    <span className="text-[9px] uppercase font-bold text-neutral-500 block mb-0.5">
                      Ou cole o link direto da imagem:
                    </span>
                    <input
                      type="url"
                      placeholder="https://res.cloudinary.com/..."
                      value={serviceForm.image}
                      onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })}
                      className="w-full p-2 rounded-lg bg-dark-950 border border-dark-700 text-neutral-300 text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-dark-800 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-dark-800 text-neutral-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-dark-950 font-black shadow-gold-glow-sm"
                >
                  {editingService ? 'Salvar Alterações' : 'Cadastrar Serviço'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: NOVO AGENDAMENTO MANUAL
      ========================================================================= */}
      {isAppointmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-dark-900 border border-dark-700 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dark-800">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gold-400" />
                <span>Agendar Cliente no Balcão</span>
              </h3>
              <button
                onClick={() => setIsAppointmentModalOpen(false)}
                className="p-1.5 rounded-full bg-dark-800 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAppointmentForm} className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-300 mb-1">
                  Nome do Cliente:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo"
                  value={appointmentForm.client}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, client: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-dark-850 border border-dark-700 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-300 mb-1">
                    WhatsApp:
                  </label>
                  <input
                    type="text"
                    placeholder="(99) 99999-9999"
                    value={appointmentForm.phone}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-dark-850 border border-dark-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-300 mb-1">
                    Horário:
                  </label>
                  <input
                    type="time"
                    required
                    value={appointmentForm.time}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-dark-850 border border-dark-700 text-gold-400 font-extrabold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-neutral-300 mb-1">
                  Serviço Desejado:
                </label>
                <select
                  required
                  value={appointmentForm.service}
                  onChange={(e) => {
                    const svc = services.find(s => s.name === e.target.value);
                    setAppointmentForm({
                      ...appointmentForm,
                      service: e.target.value,
                      price: svc ? svc.price : ''
                    });
                  }}
                  className="w-full p-2.5 rounded-xl bg-dark-850 border border-dark-700 text-white font-semibold"
                >
                  <option value="">Selecione um corte...</option>
                  {services.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name} — R$ {parseFloat(s.price).toFixed(2).replace('.', ',')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-300 mb-1">
                    Valor (R$):
                  </label>
                  <input
                    type="number"
                    value={appointmentForm.price}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, price: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-dark-850 border border-dark-700 text-gold-400 font-extrabold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-neutral-300 mb-1">
                    Pagamento:
                  </label>
                  <select
                    value={appointmentForm.payment}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, payment: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-dark-850 border border-dark-700 text-white"
                  >
                    <option value="Pix">Pix</option>
                    <option value="Cartão">Cartão</option>
                    <option value="Dinheiro">Dinheiro</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-dark-800 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAppointmentModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-dark-800 text-neutral-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-dark-950 font-black shadow-gold-glow-sm"
                >
                  Salvar Horário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
