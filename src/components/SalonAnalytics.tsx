import React, { useState, useMemo } from 'react';
import { ConsultationTicket, FaceShape } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { TrendingUp, Users, Calendar, Scissors, Sparkles, Filter } from 'lucide-react';

interface SalonAnalyticsProps {
  tickets: ConsultationTicket[];
}

export const SalonAnalytics: React.FC<SalonAnalyticsProps> = ({ tickets }) => {
  const [timeframe, setTimeframe] = useState<'30d' | '90d' | 'all'>('30d');

  // Synthetic benchmark history combined with live user tickets for rich analytics
  const allTickets = useMemo(() => {
    const historicalSeeds: Partial<ConsultationTicket>[] = [
      { ticketId: 'AUR-8101', faceShape: 'Oval', styleCategory: 'Precision Cut', rebookingWeeks: 6, timestamp: 'Sep 14, 2026' },
      { ticketId: 'AUR-8102', faceShape: 'Square', styleCategory: 'Taper / Fade', rebookingWeeks: 3, timestamp: 'Sep 18, 2026' },
      { ticketId: 'AUR-8103', faceShape: 'Heart', styleCategory: 'Textured Crown', rebookingWeeks: 4, timestamp: 'Sep 22, 2026' },
      { ticketId: 'AUR-8104', faceShape: 'Oval', styleCategory: 'Architectural Layers', rebookingWeeks: 8, timestamp: 'Sep 28, 2026' },
      { ticketId: 'AUR-8105', faceShape: 'Oblong', styleCategory: 'Lace Wig / Topper', rebookingWeeks: 5, timestamp: 'Oct 02, 2026' },
      { ticketId: 'AUR-8106', faceShape: 'Diamond', styleCategory: 'Precision Cut', rebookingWeeks: 4, timestamp: 'Oct 05, 2026' },
      { ticketId: 'AUR-8107', faceShape: 'Square', styleCategory: 'Taper / Fade', rebookingWeeks: 3, timestamp: 'Oct 08, 2026' },
      { ticketId: 'AUR-8108', faceShape: 'Round', styleCategory: 'Architectural Layers', rebookingWeeks: 6, timestamp: 'Oct 09, 2026' },
    ];

    return [...(tickets || []), ...(historicalSeeds as ConsultationTicket[])];
  }, [tickets]);

  // 1. Ticket Frequency Trend by Day / Week
  const frequencyData = useMemo(() => {
    // Days of the week aggregation
    const days = [
      { day: 'Mon', count: 4, note: 'Consultations' },
      { day: 'Tue', count: 6, note: 'Consultations' },
      { day: 'Wed', count: 8, note: 'Consultations' },
      { day: 'Thu', count: 11, note: 'Peak Studio' },
      { day: 'Fri', count: 15, note: 'Peak Studio' },
      { day: 'Sat', count: 18, note: 'Atelier Peak' },
      { day: 'Sun', count: 7, note: 'Private Bookings' },
    ];

    // Add extra weight from live tickets
    const dayIndex = new Date().getDay(); // 0 is Sunday
    const dayMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDayName = dayMap[dayIndex];
    return days.map((d) => ({
      ...d,
      count: d.day === currentDayName ? d.count + (tickets.length * 2) : d.count,
    }));
  }, [tickets]);

  // 2. Common Hair-Type & Texture Trends
  const hairTypeTrends = useMemo(() => {
    return [
      { type: 'Straight 1A-1C', count: 12, label: 'Fine / Coarse Sleek' },
      { type: 'Wavy 2A-2C', count: 19, label: 'Caramel Balayage Waves' },
      { type: 'Curly 3A-3C', count: 14, label: 'Hydrated Spiral Layers' },
      { type: 'Coily 4A-4C', count: 11, label: 'Geometric Sculpted Crowns' },
      { type: 'Swiss HD Lace / Toppers', count: 9, label: 'Medical & Fashion Units' },
    ];
  }, []);

  // 3. Face Shape Distribution
  const faceShapeDistribution = useMemo(() => {
    const counts: Record<string, number> = {
      Oval: 0,
      Square: 0,
      Heart: 0,
      Diamond: 0,
      Oblong: 0,
      Round: 0,
      Triangle: 0,
    };

    allTickets.forEach((t) => {
      if (t.faceShape && counts[t.faceShape] !== undefined) {
        counts[t.faceShape] += 1;
      }
    });

    return Object.entries(counts).map(([shape, count]) => ({
      shape,
      count: count || 1, // ensure visible baseline
    }));
  }, [allTickets]);

  // 4. Style Category Breakdown
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {
      'Precision Cut': 0,
      'Taper / Fade': 0,
      'Architectural Layers': 0,
      'Lace Wig / Topper': 0,
      'Textured Crown': 0,
    };

    allTickets.forEach((t) => {
      if (t.styleCategory && counts[t.styleCategory] !== undefined) {
        counts[t.styleCategory] += 1;
      }
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      count: count || 2,
    }));
  }, [allTickets]);

  // Metrics summary
  const totalConsultations = allTickets.length + 32;
  const avgRebooking = 4.2;

  const BAR_COLORS = ['#E0A99A', '#D4AF37', '#94A3B8', '#7E8B9B', '#475569'];

  return (
    <div className="flex flex-col gap-8">
      {/* Analytics KPI Header Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#E0A99A]">
            <Users className="w-3.5 h-3.5" />
            <span>Consultations Logged</span>
          </div>
          <div className="text-2xl font-mono font-semibold text-neutral-100 mt-1 tabular-nums">
            {totalConsultations}
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">
            +{tickets.length} live from this session
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#D4AF37]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Dominant Architecture</span>
          </div>
          <div className="text-2xl font-serif font-semibold text-neutral-100 mt-1">
            Oval & Square
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">
            58% of biometric clients
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#E0A99A]">
            <Scissors className="w-3.5 h-3.5" />
            <span>Top Request Trend</span>
          </div>
          <div className="text-2xl font-serif font-semibold text-neutral-100 mt-1 truncate">
            Butterfly Layers
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">
            +34% increase this quarter
          </div>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#D4AF37]">
            <Calendar className="w-3.5 h-3.5" />
            <span>Avg Rebooking Cadence</span>
          </div>
          <div className="text-2xl font-mono font-semibold text-neutral-100 mt-1 tabular-nums">
            {avgRebooking} Wks
          </div>
          <div className="text-[11px] text-neutral-500 mt-0.5">
            High retention frequency
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Ticket Frequency Trends by Day */}
        <div className="p-5 rounded-xl bg-neutral-900/50 border border-neutral-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#E0A99A]">
                Activity Frequency
              </div>
              <h3 className="text-lg font-serif font-semibold text-neutral-100 mt-0.5">
                Client Ticket Frequency by Weekday
              </h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-500">
              Peak: Fri · Sat
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262633" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#262633' }}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#262633' }}
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#0e0e12] border border-neutral-800 p-2.5 rounded-lg shadow-xl text-xs">
                          <div className="font-semibold text-neutral-200">{data.day}</div>
                          <div className="text-[#E0A99A] font-mono mt-0.5">
                            {data.count} Consultations
                          </div>
                          <div className="text-[10px] text-neutral-500">{data.note}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {frequencyData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 4 || index === 5 ? '#E0A99A' : '#333342'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-400">
            <span>High concentration on weekend bookings</span>
            <span className="font-mono text-[#E0A99A]">Weekly Volume: 79</span>
          </div>
        </div>

        {/* Chart 2: Common Hair-Type & Texture Trends */}
        <div className="p-5 rounded-xl bg-neutral-900/50 border border-neutral-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37]">
                Texture Diagnostics
              </div>
              <h3 className="text-lg font-serif font-semibold text-neutral-100 mt-0.5">
                Common Hair-Type & Fiber Trends
              </h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-500">
              5 Primary Profiles
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={hairTypeTrends}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#262633" horizontal={false} />
                <XAxis
                  type="number"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#262633' }}
                />
                <YAxis
                  dataKey="type"
                  type="category"
                  stroke="#94A3B8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#262633' }}
                  width={110}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#0e0e12] border border-neutral-800 p-2.5 rounded-lg shadow-xl text-xs">
                          <div className="font-semibold text-neutral-200">{data.type}</div>
                          <div className="text-[#D4AF37] font-mono mt-0.5">
                            {data.count} Diagnoses ({Math.round((data.count / 65) * 100)}%)
                          </div>
                          <div className="text-[10px] text-neutral-500">{data.label}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#D4AF37" radius={[0, 4, 4, 0]}>
                  {hairTypeTrends.map((_, index) => (
                    <Cell
                      key={`cell-texture-${index}`}
                      fill={BAR_COLORS[index % BAR_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-400">
            <span>Wavy 2A-2C remains the most prevalent texture pattern</span>
            <span className="font-mono text-[#D4AF37]">Top: 29.2%</span>
          </div>
        </div>
      </div>

      {/* Secondary Distribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Face Shape Biometric Breakdown */}
        <div className="p-5 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#E0A99A]">
                Cranial Architecture
              </div>
              <h3 className="text-lg font-serif font-semibold text-neutral-100 mt-0.5">
                Face Shape Classification Frequency
              </h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-500">
              Biometric Ratios
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={faceShapeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262633" vertical={false} />
                <XAxis
                  dataKey="shape"
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#262633' }}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#262633' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#0e0e12] border border-neutral-800 p-2.5 rounded-lg shadow-xl text-xs">
                          <div className="font-semibold text-neutral-200">{data.shape} Architecture</div>
                          <div className="text-[#E0A99A] font-mono mt-0.5">
                            {data.count} Clients Mapped
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#E0A99A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Service Category Allocation */}
        <div className="p-5 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#D4AF37]">
                Atelier Services
              </div>
              <h3 className="text-lg font-serif font-semibold text-neutral-100 mt-0.5">
                Selected Style Categories
              </h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-500">
              5 Core Disciplines
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#262633" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#94A3B8"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: '#262633' }}
                  interval={0}
                  tickFormatter={(val) => val.split(' ')[0]}
                />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#262633' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#0e0e12] border border-neutral-800 p-2.5 rounded-lg shadow-xl text-xs">
                          <div className="font-semibold text-neutral-200">{data.name}</div>
                          <div className="text-[#D4AF37] font-mono mt-0.5">
                            {data.count} Prescriptions Executed
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#D4AF37" radius={[4, 4, 0, 0]}>
                  {categoryData.map((_, index) => (
                    <Cell
                      key={`cat-cell-${index}`}
                      fill={BAR_COLORS[index % BAR_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
