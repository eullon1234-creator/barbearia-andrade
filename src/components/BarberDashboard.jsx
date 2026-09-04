import React, { useState } from 'react';
import { 
  Calendar, Clock, CheckCircle2, AlertCircle, Coffee, 
  Palmtree, DollarSign, User, Plus, Edit2, ShieldAlert, ArrowLeft,
  ChevronRight, Phone, Scissors, Sparkles
} from 'lucide-react';
import { BARBERSHOP_DATA } from '../data/barberData';

export default function BarberDashboard({ onBackToClientView }) {
  const [status, setStatus] = useState('Disponível'); // 'Disponível', 'Em Pausa (Café)', 'Modo Férias'
  const [appointments, setAppointments] = useState(BARBERSHOP_DATA.mockBarberAppointments);
  const [services, setServices] = useState(BARBERSHOP_DATA.services);
  const [editingPriceId, setEditingPriceId] = useState(null);
  const [tempPrice, setTempPrice] = useState('');

  // Total faturamento estimado do dia
  const totalBilling = appointments.reduce((acc, curr) => acc + curr.price, 0);

  const handleToggleStatus = (newStatus) => {
    setStatus(newStatus);
  };

  const handleUpdateAppointmentStatus = (id, newStatus) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const handleStartEditPrice = (svc) => {
    setEditingPriceId(svc.id);
    setTempPrice(svc.price.toString());
  };

  const handleSavePrice = (id) => {
    const val = parseFloat(tempPrice);
    if (!isNaN(val) && val > 0) {
      setServices(services.map(s => s.id === id ? { ...s, price: val } : s));
    }
    setEditingPriceId(null);
  };

  return (
    <div className="p-4 space-y-4 animate-in fade-in duration-300">
      {/* Top Banner de Navegação de volta para o cliente */}
      <div className="flex items-center justify-between pb-3 border-b border-dark-800">
        <button
          onClick={onBackToClientView}
          className="flex items-center gap-1.5 text-xs text-gold-400 font-bold hover:text-gold-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Visão do Cliente</span>
        </button>

        <span className="px-2 py-0.5 rounded-full bg-gold-500/15 border border-gold-500/30 text-[10px] text-gold-300 font-bold uppercase tracking-wider">
          Painel de Gestão
        </span>
      </div>

      {/* Perfil & Status Rápido do Saymon */}
      <div className="p-4 rounded-2xl bg-card-gradient border border-dark-700/80 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              src={BARBERSHOP_DATA.images.barber}
              alt={BARBERSHOP_DATA.owner}
              className="w-12 h-12 rounded-full object-cover border-2 border-gold-500"
            />
            <div>
              <h2 className="text-base font-extrabold text-white">{BARBERSHOP_DATA.owner}</h2>
              <p className="text-xs text-neutral-400">Barbearia Andrade • Administrador</p>
            </div>
          </div>

          {/* Badge de Status Atual */}
          <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
            status === 'Disponível'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : status === 'Em Pausa (Café)'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
          }`}>
            <span className="w-2 h-2 rounded-full bg-current animate-ping" />
            <span>{status}</span>
          </div>
        </div>

        {/* Botões de Ação Rápida de Disponibilidade */}
        <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-dark-800 text-[11px] font-bold">
          <button
            onClick={() => handleToggleStatus('Disponível')}
            className={`p-2 rounded-xl border text-center transition-all ${
              status === 'Disponível'
                ? 'bg-emerald-500 text-dark-950 border-emerald-400'
                : 'bg-dark-850 text-neutral-300 border-dark-750 hover:border-neutral-600'
            }`}
          >
            Disponível
          </button>
          <button
            onClick={() => handleToggleStatus('Em Pausa (Café)')}
            className={`p-2 rounded-xl border text-center flex items-center justify-center gap-1 transition-all ${
              status === 'Em Pausa (Café)'
                ? 'bg-amber-500 text-dark-950 border-amber-400'
                : 'bg-dark-850 text-neutral-300 border-dark-750 hover:border-neutral-600'
            }`}
          >
            <Coffee className="w-3 h-3" />
            <span>Pausar 30m</span>
          </button>
          <button
            onClick={() => handleToggleStatus('Modo Férias')}
            className={`p-2 rounded-xl border text-center flex items-center justify-center gap-1 transition-all ${
              status === 'Modo Férias'
                ? 'bg-rose-500 text-white border-rose-400'
                : 'bg-dark-850 text-neutral-300 border-dark-750 hover:border-neutral-600'
            }`}
          >
            <Palmtree className="w-3 h-3" />
            <span>Modo Férias</span>
          </button>
        </div>
      </div>

      {/* Cards de Métricas do Dia */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-dark-900 border border-dark-800">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block mb-1">
            Agendamentos Hoje
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-white">{appointments.length}</span>
            <span className="text-xs text-neutral-400">clientes</span>
          </div>
          <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Próximo: 14:30
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-dark-900 border border-dark-800">
          <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block mb-1">
            Faturamento Previsto
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-gold-400">
              R$ {totalBilling.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <p className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-gold-400" /> Pix e Dinheiro
          </p>
        </div>
      </div>

      {/* Agenda do Dia */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gold-400" />
            <span>Agenda de Hoje (Ordem Cronológica)</span>
          </h3>
          <span className="text-[11px] text-neutral-400">13:00 - 18:00</span>
        </div>

        <div className="space-y-2">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="p-3 rounded-2xl bg-card-gradient border border-dark-750 flex flex-col justify-between gap-2"
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
                    <p className="text-[11px] text-gold-400">{apt.service}</p>
                    <p className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                      <Phone className="w-2.5 h-2.5" /> {apt.phone} • {apt.payment}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold text-white">
                  R$ {apt.price.toFixed(2).replace('.', ',')}
                </span>
              </div>

              {/* Status do Atendimento & Ações */}
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

                <div className="flex items-center gap-1.5">
                  {apt.status !== 'Concluído' && (
                    <button
                      onClick={() => handleUpdateAppointmentStatus(apt.id, 'Concluído')}
                      className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Concluir</span>
                    </button>
                  )}
                  {apt.status === 'Confirmado' && (
                    <button
                      onClick={() => handleUpdateAppointmentStatus(apt.id, 'Em Atendimento')}
                      className="px-2 py-1 rounded-lg bg-gold-500 text-dark-950 text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Iniciar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gestão Rápida de Serviços e Preços */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-dark-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-wider text-neutral-300 font-extrabold flex items-center gap-1.5">
            <Scissors className="w-3.5 h-3.5 text-gold-400" />
            <span>Editar Preços & Cortes</span>
          </h3>
          <span className="text-[10px] text-neutral-400">Autonomia Total</span>
        </div>

        <div className="space-y-2">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="p-2.5 rounded-xl bg-dark-850 border border-dark-750 flex items-center justify-between text-xs"
            >
              <div>
                <p className="font-bold text-white">{svc.name}</p>
                <span className="text-[10px] text-neutral-400">{svc.duration}</span>
              </div>

              <div className="flex items-center gap-2">
                {editingPriceId === svc.id ? (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gold-400 font-bold">R$</span>
                    <input
                      type="number"
                      value={tempPrice}
                      onChange={(e) => setTempPrice(e.target.value)}
                      className="w-16 p-1 rounded bg-dark-950 border border-gold-500 text-white text-xs font-bold"
                    />
                    <button
                      onClick={() => handleSavePrice(svc.id)}
                      className="p-1 rounded bg-gold-500 text-dark-950 font-bold text-[10px]"
                    >
                      Salvar
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="font-extrabold text-gold-400">
                      R$ {svc.price.toFixed(2).replace('.', ',')}
                    </span>
                    <button
                      onClick={() => handleStartEditPrice(svc)}
                      className="p-1 rounded text-neutral-400 hover:text-gold-400 hover:bg-dark-800"
                      title="Alterar valor"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
