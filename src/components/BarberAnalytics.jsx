import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, DollarSign, Calendar, Users, Award, 
  Download, Printer, ArrowUpRight, Clock, CheckCircle2, 
  CreditCard, Banknote, QrCode, Filter, ChevronDown, FileText
} from 'lucide-react';
import { useBarber } from '../context/BarberContext';

export default function BarberAnalytics() {
  const { appointments, services, profile, theme } = useBarber();

  const [periodFilter, setPeriodFilter] = useState('mes'); // 'hoje' | 'semana' | 'mes' | 'todos'

  // Data atual de referência: 04/09/2026
  const todayStr = '2026-09-04';
  const currentMonth = '2026-09';

  // Filtra agendamentos baseado no período selecionado
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const aptDate = apt.date || todayStr;
      if (periodFilter === 'hoje') {
        return aptDate === todayStr;
      }
      if (periodFilter === 'semana') {
        // Exemplo simplificado: primeiros 7 dias de setembro
        return aptDate >= '2026-09-01' && aptDate <= '2026-09-07';
      }
      if (periodFilter === 'mes') {
        return aptDate.startsWith(currentMonth);
      }
      return true; // todos
    });
  }, [appointments, periodFilter]);

  // Cálculos Financeiros
  const completedList = useMemo(() => {
    return filteredAppointments.filter(a => a.status === 'Concluído');
  }, [filteredAppointments]);

  const futureList = useMemo(() => {
    return filteredAppointments.filter(a => a.status === 'Confirmado' || a.status === 'Em Atendimento');
  }, [filteredAppointments]);

  // 1. Faturamento Realizado (cortes já feitos e pagos)
  const realizedRevenue = useMemo(() => {
    return completedList.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0);
  }, [completedList]);

  // 2. Previsão de Faturamento Futuro (clientes agendados)
  const forecastRevenue = useMemo(() => {
    return futureList.reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0);
  }, [futureList]);

  // 3. Faturamento Total Projetado (Realizado + Previsto)
  const totalProjectedRevenue = realizedRevenue + forecastRevenue;

  // 4. Ticket Médio
  const averageTicket = completedList.length > 0 
    ? realizedRevenue / completedList.length 
    : 0;

  // 5. Ranking dos Cortes Mais Vendidos
  const serviceStats = useMemo(() => {
    const statsMap = {};

    filteredAppointments.forEach(apt => {
      const svcName = apt.service || 'Corte Padrão';
      const price = parseFloat(apt.price) || 0;

      if (!statsMap[svcName]) {
        statsMap[svcName] = { count: 0, revenue: 0, completedCount: 0 };
      }
      statsMap[svcName].count += 1;
      statsMap[svcName].revenue += price;
      if (apt.status === 'Concluído') {
        statsMap[svcName].completedCount += 1;
      }
    });

    const list = Object.entries(statsMap).map(([name, data]) => ({
      name,
      count: data.count,
      completedCount: data.completedCount,
      revenue: data.revenue,
    }));

    // Ordena do mais vendido para o menos vendido
    return list.sort((a, b) => b.count - a.count);
  }, [filteredAppointments]);

  const topService = serviceStats.length > 0 ? serviceStats[0] : null;

  // 6. Distribuição por Formas de Pagamento
  const paymentStats = useMemo(() => {
    let pix = 0;
    let card = 0;
    let cash = 0;

    filteredAppointments.forEach(apt => {
      const p = (apt.payment || '').toLowerCase();
      const val = parseFloat(apt.price) || 0;
      if (p.includes('pix')) pix += val;
      else if (p.includes('cart') || p.includes('crédito') || p.includes('débito')) card += val;
      else cash += val;
    });

    const total = pix + card + cash;
    return {
      pix: { total: pix, percent: total > 0 ? Math.round((pix / total) * 100) : 0 },
      card: { total: card, percent: total > 0 ? Math.round((card / total) * 100) : 0 },
      cash: { total: cash, percent: total > 0 ? Math.round((cash / total) * 100) : 0 },
      total,
    };
  }, [filteredAppointments]);

  // Exportar Relatório em CSV (Excel)
  const handleExportCSV = () => {
    let csv = 'Data,Horario,Cliente,Telefone,Servico,Valor,Pagamento,Status\n';
    filteredAppointments.forEach(a => {
      csv += `"${a.date || todayStr}","${a.time}","${a.client}","${a.phone}","${a.service}","R$ ${parseFloat(a.price).toFixed(2)}","${a.payment}","${a.status}"\n`;
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_${profile.name.toLowerCase().replace(/\s+/g, '_')}_${periodFilter}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Imprimir / Baixar Relatório em PDF
  const handlePrintReport = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório Financeiro - ${profile.name}</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #222; }
            h1 { margin: 0 0 5px 0; color: #111; font-size: 24px; }
            p { margin: 3px 0; color: #555; font-size: 13px; }
            .header { border-bottom: 2px solid #ddd; padding-bottom: 15px; margin-bottom: 20px; }
            .kpis { display: flex; gap: 20px; margin-bottom: 25px; }
            .kpi-card { flex: 1; border: 1px solid #ddd; padding: 12px; border-radius: 8px; background: #f9f9f9; }
            .kpi-title { font-size: 11px; text-transform: uppercase; color: #666; font-weight: bold; }
            .kpi-value { font-size: 20px; font-weight: bold; color: #111; margin-top: 4px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            th { background: #111; color: #fff; text-align: left; padding: 8px; font-size: 11px; text-transform: uppercase; }
            td { border-bottom: 1px solid #eee; padding: 8px; }
            .badge { display: inline-block; padding: 3px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; }
            .concluido { background: #dcfce7; color: #15803d; }
            .confirmado { background: #fef9c3; color: #854d0e; }
            .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #777; border-top: 1px solid #ddd; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${profile.name} — Relatório de Atendimentos & Faturamento</h1>
            <p><strong>Responsável:</strong> ${profile.owner} | <strong>Contato:</strong> ${profile.phone}</p>
            <p><strong>Período:</strong> ${periodFilter === 'mes' ? 'Mês Atual' : periodFilter === 'hoje' ? 'Hoje' : 'Geral'} | <strong>Emitido em:</strong> ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
          </div>

          <div class="kpis">
            <div class="kpi-card">
              <div class="kpi-title">Faturamento Realizado</div>
              <div class="kpi-value">R$ ${realizedRevenue.toFixed(2).replace('.', ',')}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Previsão Agendada</div>
              <div class="kpi-value">R$ ${forecastRevenue.toFixed(2).replace('.', ',')}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Total Projetado</div>
              <div class="kpi-value">R$ ${totalProjectedRevenue.toFixed(2).replace('.', ',')}</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-title">Cortes Realizados</div>
              <div class="kpi-value">${completedList.length} clientes</div>
            </div>
          </div>

          <h3>Discriminação de Clientes & Atendimentos</h3>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Telefone</th>
                <th>Serviço</th>
                <th>Valor</th>
                <th>Pagamento</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAppointments.map(a => `
                <tr>
                  <td>${a.date ? a.date.split('-').reverse().join('/') : '04/09/2026'}</td>
                  <td>${a.time}</td>
                  <td><strong>${a.client}</strong></td>
                  <td>${a.phone}</td>
                  <td>${a.service}</td>
                  <td>R$ ${parseFloat(a.price).toFixed(2).replace('.', ',')}</td>
                  <td>${a.payment}</td>
                  <td><span class="badge ${a.status === 'Concluído' ? 'concluido' : 'confirmado'}">${a.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Relatório gerado pelo sistema de gestão Barbearia Andrade — Criado por Eullon</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Top Bar de Filtro & Exportações */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-dark-800">
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 theme-text-accent" />
            <span>Painel Financeiro & Métricas</span>
          </h2>
          <p className="text-[11px] text-neutral-400">
            Acompanhe seu faturamento, previsões e serviços mais vendidos
          </p>
        </div>

        {/* Seletor de Período */}
        <div className="flex items-center gap-1.5">
          <div className="flex bg-dark-900 p-0.5 rounded-xl border border-dark-750 text-[11px] font-bold">
            {[
              { id: 'hoje', label: 'Hoje' },
              { id: 'semana', label: 'Semana' },
              { id: 'mes', label: 'Mês' },
              { id: 'todos', label: 'Tudo' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPeriodFilter(p.id)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  periodFilter === p.id 
                    ? 'theme-gradient-accent text-dark-950 font-black shadow-sm' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Botão Baixar Relatório */}
          <button
            onClick={handlePrintReport}
            className="p-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-neutral-200 border border-dark-700 flex items-center gap-1 text-[11px] font-bold transition-all cursor-pointer"
            title="Imprimir ou Salvar em PDF"
          >
            <Printer className="w-3.5 h-3.5 theme-text-accent" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="p-2 rounded-xl bg-dark-850 hover:bg-dark-800 text-neutral-200 border border-dark-700 flex items-center gap-1 text-[11px] font-bold transition-all cursor-pointer"
            title="Exportar Planilha Excel CSV"
          >
            <Download className="w-3.5 h-3.5 theme-text-accent" />
            <span className="hidden sm:inline">Excel</span>
          </button>
        </div>
      </div>

      {/* Grid de KPIs Financeiros */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Faturamento Realizado */}
        <div className="p-3.5 rounded-2xl bg-card-gradient border border-dark-750 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase font-bold text-neutral-400">
              Faturamento Realizado
            </span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 block">
            R$ {realizedRevenue.toFixed(2).replace('.', ',')}
          </span>
          <p className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>{completedList.length} cortes concluídos</span>
          </p>
        </div>

        {/* Previsão Futura com Agendamentos */}
        <div className="p-3.5 rounded-2xl bg-card-gradient border border-dark-750 relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase font-bold text-neutral-400">
              Previsão Agendada
            </span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <span className="text-xl sm:text-2xl font-black theme-text-accent block">
            R$ {forecastRevenue.toFixed(2).replace('.', ',')}
          </span>
          <p className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 theme-text-accent" />
            <span>{futureList.length} clientes na fila</span>
          </p>
        </div>

        {/* Total Projetado */}
        <div className="p-3.5 rounded-2xl bg-dark-900 border border-dark-800">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
            Total Projetado
          </span>
          <span className="text-lg font-black text-white block">
            R$ {totalProjectedRevenue.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-[10px] text-neutral-500">Realizado + Previsto</span>
        </div>

        {/* Ticket Médio */}
        <div className="p-3.5 rounded-2xl bg-dark-900 border border-dark-800">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
            Ticket Médio
          </span>
          <span className="text-lg font-black text-white block">
            R$ {averageTicket.toFixed(2).replace('.', ',')}
          </span>
          <span className="text-[10px] text-neutral-500">Média por atendimento</span>
        </div>
      </div>

      {/* Destaque: Corte Campeão de Vendas */}
      {topService && (
        <div className="p-4 rounded-2xl bg-card-gradient border border-gold-500/40 relative overflow-hidden theme-shadow-glow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl theme-gradient-accent flex items-center justify-center text-dark-950 font-black flex-shrink-0">
              <Award className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase font-black tracking-wider theme-text-accent">
                  Corte Mais Vendido do Mês
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-white truncate">
                {topService.name}
              </h3>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Realizado <strong className="text-white">{topService.count} vezes</strong> • Gerou <strong className="theme-text-accent">R$ {topService.revenue.toFixed(2).replace('.', ',')}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Ranking de Todos os Serviços */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-dark-800 space-y-3">
        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center justify-between">
          <span>Ranking de Cortes & Serviços</span>
          <span className="text-[10px] text-neutral-400">Por volume e faturamento</span>
        </h3>

        <div className="space-y-2.5">
          {serviceStats.map((svc, idx) => {
            const percentage = totalProjectedRevenue > 0 
              ? Math.round((svc.revenue / totalProjectedRevenue) * 100) 
              : 0;

            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <span className="text-[10px] w-4 text-neutral-500">#{idx + 1}</span>
                    <span>{svc.name}</span>
                  </span>
                  <div className="text-right">
                    <span className="font-extrabold theme-text-accent">
                      R$ {svc.revenue.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[10px] text-neutral-400 ml-1.5">
                      ({svc.count} cortes)
                    </span>
                  </div>
                </div>

                {/* Barra de Progresso */}
                <div className="w-full h-1.5 rounded-full bg-dark-800 overflow-hidden">
                  <div
                    className="h-full theme-gradient-accent rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(percentage, 8)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formas de Pagamento Arrecadadas */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-dark-800 space-y-3">
        <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">
          Divisão por Formas de Pagamento
        </h3>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-dark-850 border border-dark-750">
            <QrCode className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="text-[10px] text-neutral-400 uppercase font-bold block">Pix</span>
            <span className="font-bold text-white block">R$ {paymentStats.pix.total.toFixed(0)}</span>
            <span className="text-[10px] text-emerald-400 font-semibold">{paymentStats.pix.percent}%</span>
          </div>

          <div className="p-2.5 rounded-xl bg-dark-850 border border-dark-750">
            <CreditCard className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <span className="text-[10px] text-neutral-400 uppercase font-bold block">Cartão</span>
            <span className="font-bold text-white block">R$ {paymentStats.card.total.toFixed(0)}</span>
            <span className="text-[10px] text-blue-400 font-semibold">{paymentStats.card.percent}%</span>
          </div>

          <div className="p-2.5 rounded-xl bg-dark-850 border border-dark-750">
            <Banknote className="w-4 h-4 text-amber-400 mx-auto mb-1" />
            <span className="text-[10px] text-neutral-400 uppercase font-bold block">Dinheiro</span>
            <span className="font-bold text-white block">R$ {paymentStats.cash.total.toFixed(0)}</span>
            <span className="text-[10px] text-amber-400 font-semibold">{paymentStats.cash.percent}%</span>
          </div>
        </div>
      </div>

      {/* Botões de Ação Final do Relatório */}
      <div className="flex gap-2">
        <button
          onClick={handlePrintReport}
          className="flex-1 py-3 px-3 rounded-xl theme-gradient-accent text-dark-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 theme-shadow-glow cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir Relatório Mensal</span>
        </button>

        <button
          onClick={handleExportCSV}
          className="py-3 px-4 rounded-xl bg-dark-800 hover:bg-dark-750 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-dark-700 cursor-pointer"
        >
          <FileText className="w-4 h-4 theme-text-accent" />
          <span>Baixar CSV</span>
        </button>
      </div>

    </div>
  );
}
