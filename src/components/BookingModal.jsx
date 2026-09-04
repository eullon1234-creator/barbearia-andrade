import React, { useState, useEffect } from 'react';
import { 
  X, Check, Clock, User, Phone, CreditCard, 
  ChevronRight, ChevronLeft, Scissors, AlertCircle, Palmtree, MessageCircle,
  Calendar, Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBarber } from '../context/BarberContext';
import { getGoogleCalendarUrl, downloadIcsFile } from '../utils/calendarUtils';

export default function BookingModal({ isOpen, onClose, initialService }) {
  const { services, profile, scheduleConfig, appointments, addAppointment } = useBarber();

  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(initialService || (services.length > 0 ? services[0] : null));
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Pix');
  const [errors, setErrors] = useState({});

  const [availableDays, setAvailableDays] = useState([]);

  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
    } else if (services.length > 0 && !selectedService) {
      setSelectedService(services[0]);
    }
  }, [initialService, services]);

  useEffect(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 12; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      
      const dayOfWeek = d.getDay(); // 0 = Dom, 6 = Sáb
      const isSunday = dayOfWeek === 0;

      const dateStr = d.toISOString().split('T')[0];
      const dayNumber = d.getDate().toString().padStart(2, '0');
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const monthName = monthNames[d.getMonth()];
      
      const weekNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
      const weekName = weekNames[dayOfWeek];

      days.push({
        dateStr,
        label: i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : `${weekName}, ${dayNumber}/${monthName}`,
        weekName,
        dayNumber,
        isSunday,
      });
    }

    setAvailableDays(days);
    const firstValid = days.find(d => !d.isSunday);
    if (firstValid && !selectedDate) {
      setSelectedDate(firstValid.dateStr);
    }
  }, []);

  // Geração dinâmica de slots de horários baseados no scheduleConfig do barbeiro
  const generateTimeSlots = (dateString) => {
    if (!dateString) return [];
    const parts = dateString.split('-');
    const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    const dayOfWeek = dateObj.getDay();

    if (dayOfWeek === 0) return []; // Domingo fechado

    const isSat = dayOfWeek === 6;
    const startStr = isSat ? (scheduleConfig.saturdayStart || '08:00') : (scheduleConfig.weekdaysStart || '13:00');
    const endStr = isSat ? (scheduleConfig.saturdayEnd || '13:00') : (scheduleConfig.weekdaysEnd || '18:00');
    const interval = scheduleConfig.slotInterval || 30;

    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);

    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    const slots = [];
    for (let m = startMinutes; m < endMinutes; m += interval) {
      const h = Math.floor(m / 60);
      const min = m % 60;
      const timeFormatted = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      
      // Verifica se já está agendado na lista de agendamentos
      const isBooked = appointments.some(a => a.time === timeFormatted);

      slots.push({
        time: timeFormatted,
        available: !isBooked,
      });
    }

    return slots;
  };

  const timeSlots = generateTimeSlots(selectedDate);

  // Máscara automática de telefone (99) 99999-9999
  const handlePhoneChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 11) val = val.slice(0, 11);

    if (val.length > 6) {
      val = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
    } else if (val.length > 2) {
      val = `(${val.slice(0, 2)}) ${val.slice(2)}`;
    } else if (val.length > 0) {
      val = `(${val}`;
    }
    setClientPhone(val);
  };

  const handleNextToSummary = () => {
    const errs = {};
    if (!clientName.trim()) {
      errs.clientName = 'Por favor, informe seu nome completo.';
    }
    const cleanPhone = clientPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      errs.clientPhone = 'Informe um WhatsApp válido com DDD.';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setStep(4);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F5E396', '#ffffff']
      });
    } catch (e) {
      // ignore
    }
  };

  const handleConfirmWhatsApp = () => {
    const formattedDate = selectedDate.split('-').reverse().join('/');
    
    // Registra no banco de agendamentos para alimentar o painel e faturamento
    addAppointment({
      client: clientName,
      phone: clientPhone,
      service: selectedService ? selectedService.name : 'Corte Masculino',
      date: selectedDate,
      time: selectedTime,
      price: selectedService ? selectedService.price : 30,
      payment: paymentMethod,
      status: 'Confirmado',
    });

    const message = `Olá Saymon! Gostaria de confirmar meu agendamento na Barbearia Andrade:\n\n` +
      `💈 *Serviço:* ${selectedService ? selectedService.name : 'Corte'}\n` +
      `👤 *Profissional:* ${profile.owner}\n` +
      `📅 *Data:* ${formattedDate}\n` +
      `⏰ *Horário:* ${selectedTime}\n` +
      `💰 *Valor:* R$ ${selectedService ? parseFloat(selectedService.price).toFixed(2).replace('.', ',') : '0,00'}\n` +
      `💳 *Pagamento:* ${paymentMethod}\n\n` +
      `👤 *Cliente:* ${clientName}\n` +
      `📱 *Contato:* ${clientPhone}\n` +
      `📍 *Local:* ${profile.address}\n\n` +
      `Pode confirmar este horário para mim?`;

    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${profile.whatsappNumber}?text=${encodedMessage}`;
    window.open(waUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 transition-all">
      <div className="w-full sm:max-w-md bg-dark-900 border border-dark-700 sm:rounded-3xl rounded-t-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
        
        {/* Cabeçalho do Modal */}
        <div className="p-4 border-b border-dark-800 flex items-center justify-between bg-dark-950/80">
          <div>
            <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider">
              Passo {step} de 4
            </span>
            <h3 className="text-base font-extrabold text-white">
              {step === 1 && 'Confirmar Serviço'}
              {step === 2 && 'Escolher Data & Horário'}
              {step === 3 && 'Seus Dados'}
              {step === 4 && 'Agendamento Pronto!'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-white bg-dark-800 hover:bg-dark-700 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Alerta se o barbeiro ativou Modo Férias */}
        {scheduleConfig.vacationMode && (
          <div className="p-3 bg-rose-500/20 border-b border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <Palmtree className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{scheduleConfig.vacationMessage}</span>
          </div>
        )}

        {/* Barra de Progresso */}
        <div className="grid grid-cols-4 gap-1 px-4 pt-2 pb-1 bg-dark-950">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= step ? 'bg-gradient-to-r from-gold-500 to-amber-300' : 'bg-dark-800'
              }`}
            />
          ))}
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-neutral-200">

          {/* ================= PASSO 1: SERVIÇO & BARBEIRO ================= */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Card do Barbeiro */}
              <div className="p-3 rounded-2xl bg-dark-850 border border-dark-750 flex items-center gap-3">
                <img
                  src={profile.image}
                  alt={profile.owner}
                  className="w-12 h-12 rounded-full object-cover border border-gold-500/40"
                />
                <div>
                  <span className="text-[10px] text-gold-400 font-bold uppercase tracking-wider">Profissional Responsável</span>
                  <h4 className="text-sm font-extrabold text-white">{profile.owner}</h4>
                  <p className="text-[11px] text-neutral-400">{profile.role}</p>
                </div>
              </div>

              {/* Lista para Escolher / Trocar Serviço */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                  Selecione o Serviço:
                </label>
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {services.map((svc) => (
                    <div
                      key={svc.id}
                      onClick={() => setSelectedService(svc)}
                      className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedService && selectedService.id === svc.id
                          ? 'bg-gold-500/10 border-gold-500 text-white shadow-gold-glow-sm'
                          : 'bg-dark-850 border-dark-750 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedService && selectedService.id === svc.id ? 'border-gold-500 bg-gold-500' : 'border-neutral-500'
                        }`}>
                          {selectedService && selectedService.id === svc.id && <Check className="w-2.5 h-2.5 text-dark-950 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{svc.name}</p>
                          <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gold-400" /> {svc.duration}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-gold-400">
                        R$ {parseFloat(svc.price).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= PASSO 2: DATA & HORÁRIO ================= */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                  1. Escolha o Dia:
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {availableDays.map((day) => (
                    <button
                      key={day.dateStr}
                      disabled={day.isSunday}
                      onClick={() => {
                        setSelectedDate(day.dateStr);
                        setSelectedTime('');
                      }}
                      className={`min-w-[70px] p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        day.isSunday
                          ? 'opacity-40 bg-dark-900 border-dark-800 cursor-not-allowed'
                          : selectedDate === day.dateStr
                          ? 'bg-gold-500 text-dark-950 border-gold-400 shadow-gold-glow-sm font-bold'
                          : 'bg-dark-850 border-dark-750 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-semibold">{day.weekName}</span>
                      <span className="text-base font-black my-0.5">{day.dayNumber}</span>
                      <span className="text-[9px] opacity-80">{day.isSunday ? 'Fechado' : 'Aberto'}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                    2. Escolha o Horário:
                  </label>
                  <span className="text-[11px] text-neutral-400">
                    Slots de {scheduleConfig.slotInterval || 30} min
                  </span>
                </div>

                {timeSlots.length === 0 ? (
                  <div className="p-4 rounded-xl bg-dark-850 border border-dark-750 text-center">
                    <AlertCircle className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                    <p className="text-xs text-neutral-300">Barbearia fechada neste dia.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[220px] overflow-y-auto pr-1">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                          !slot.available
                            ? 'bg-dark-950 text-neutral-600 border-dark-800 line-through cursor-not-allowed'
                            : selectedTime === slot.time
                            ? 'bg-gold-500 text-dark-950 border-gold-400 shadow-gold-glow-sm'
                            : 'bg-dark-850 text-neutral-200 border-dark-750 hover:border-gold-500/40'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= PASSO 3: DADOS DO CLIENTE & PAGAMENTO ================= */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gold-400" />
                  <span>Seu Nome Completo:</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: João da Silva"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className={`w-full p-3 rounded-xl bg-dark-850 border ${
                    errors.clientName ? 'border-rose-500' : 'border-dark-700'
                  } text-white text-sm focus:outline-none focus:border-gold-500 transition-colors`}
                />
                {errors.clientName && (
                  <p className="text-rose-400 text-[11px] mt-1">{errors.clientName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gold-400" />
                  <span>WhatsApp para Confirmação:</span>
                </label>
                <input
                  type="tel"
                  placeholder="(99) 99999-9999"
                  value={clientPhone}
                  onChange={handlePhoneChange}
                  maxLength={15}
                  className={`w-full p-3 rounded-xl bg-dark-850 border ${
                    errors.clientPhone ? 'border-rose-500' : 'border-dark-700'
                  } text-white text-sm focus:outline-none focus:border-gold-500 transition-colors`}
                />
                {errors.clientPhone && (
                  <p className="text-rose-400 text-[11px] mt-1">{errors.clientPhone}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-2 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-gold-400" />
                  <span>Forma de Pagamento Preferida:</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Pix', label: 'Pix', badge: 'Rápido' },
                    { id: 'Cartão', label: 'Cartão', badge: 'Débito/Crédito' },
                    { id: 'Dinheiro', label: 'Dinheiro', badge: 'Espécie' },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        paymentMethod === pm.id
                          ? 'bg-gold-500 text-dark-950 border-gold-400 font-bold shadow-gold-glow-sm'
                          : 'bg-dark-850 border-dark-750 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <span className="text-xs">{pm.label}</span>
                      <span className="text-[9px] opacity-75">{pm.badge}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= PASSO 4: RESUMO & TICKET VIP ================= */}
          {step === 4 && selectedService && (
            <div className="space-y-4 animate-in zoom-in-95 duration-200">
              <div className="relative rounded-2xl bg-card-gradient border border-gold-500/50 p-4 shadow-gold-glow overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-gold-gradient text-dark-950 text-[10px] font-black uppercase tracking-wider rounded-bl-xl shadow">
                  Resumo VIP
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">{profile.name}</h4>
                    <p className="text-[10px] text-neutral-400">{profile.owner} • Povoado Cigana</p>
                  </div>
                </div>

                <div className="border-t border-dashed border-dark-700 my-3" />

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Serviço:</span>
                    <span className="font-bold text-white text-right">{selectedService.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Data:</span>
                    <span className="font-bold text-white">
                      {selectedDate.split('-').reverse().join('/')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Horário:</span>
                    <span className="font-bold text-gold-400 text-sm">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Cliente:</span>
                    <span className="font-medium text-white">{clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Pagamento:</span>
                    <span className="font-medium text-neutral-300">{paymentMethod}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-dark-700 my-3" />

                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase font-bold text-neutral-400">Total a pagar:</span>
                  <span className="text-lg font-black text-gold-400">
                    R$ {parseFloat(selectedService.price).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <p className="text-center text-xs text-neutral-400">
                Toque no botão abaixo para enviar o comprovante com a mensagem pronta no WhatsApp do Saymon!
              </p>
            </div>
          )}
        </div>

        {/* Rodapé de Ações do Modal */}
        <div className="p-4 border-t border-dark-800 bg-dark-950 flex items-center justify-between gap-3">
          {step > 1 && step < 4 && (
            <button
              onClick={() => setStep(step - 1)}
              className="py-3 px-4 rounded-xl bg-dark-850 hover:bg-dark-800 text-neutral-300 text-xs font-bold flex items-center gap-1 border border-dark-750 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          )}

          {step === 1 && (
            <button
              onClick={() => setStep(2)}
              className="w-full py-3 px-5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-gold-glow cursor-pointer"
            >
              <span>Continuar (Data e Horário)</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          {step === 2 && (
            <button
              disabled={!selectedTime}
              onClick={() => setStep(3)}
              className={`flex-1 py-3 px-5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                !selectedTime
                  ? 'bg-dark-800 text-neutral-500 border border-dark-700 cursor-not-allowed'
                  : 'bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 shadow-gold-glow'
              }`}
            >
              <span>Prosseguir para Meus Dados</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleNextToSummary}
              className="flex-1 py-3 px-5 rounded-xl bg-gold-gradient hover:bg-gold-gradient-hover text-dark-950 font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-gold-glow cursor-pointer"
            >
              <span>Ver Resumo do Agendamento</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          {step === 4 && (
            <div className="w-full space-y-2.5">
              <button
                onClick={handleConfirmWhatsApp}
                className="w-full py-3.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 cursor-pointer animate-bounce"
              >
                <MessageCircle className="w-5 h-5 fill-dark-950" />
                <span>Confirmar via WhatsApp</span>
              </button>

              {/* Botões de Lembrete no Calendário */}
              <div className="pt-1 border-t border-dark-800">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block text-center mb-1.5">
                  Salvar na Sua Agenda:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={getGoogleCalendarUrl({
                      title: `Corte: ${selectedService ? selectedService.name : 'Barbearia Andrade'}`,
                      description: `Agendamento com ${profile.owner} (${profile.name}). Pagamento: ${paymentMethod}`,
                      location: profile.address || 'Povoado Cigana, Tuntum - MA',
                      date: selectedDate,
                      time: selectedTime,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-dark-850 hover:bg-dark-800 text-neutral-200 border border-dark-700 flex items-center justify-center gap-1.5 text-xs font-bold transition-all text-center"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Google Agenda</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => downloadIcsFile({
                      title: `Corte: ${selectedService ? selectedService.name : 'Barbearia Andrade'}`,
                      description: `Agendamento com ${profile.owner} (${profile.name}). Pagamento: ${paymentMethod}`,
                      location: profile.address || 'Povoado Cigana, Tuntum - MA',
                      date: selectedDate,
                      time: selectedTime,
                    })}
                    className="py-2.5 px-3 rounded-xl bg-dark-850 hover:bg-dark-800 text-neutral-200 border border-dark-700 flex items-center justify-center gap-1.5 text-xs font-bold transition-all text-center cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>Apple / Celular</span>
                  </button>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-full py-1.5 text-center text-xs text-neutral-400 hover:text-white cursor-pointer"
              >
                Concluir e Fechar
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
