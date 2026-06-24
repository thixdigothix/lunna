import { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface FriendshipTimerProps {
  startDateStr: string;
}

export default function FriendshipTimer({ startDateStr }: FriendshipTimerProps) {
  const [timePassed, setTimePassed] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(startDateStr);
      // Validate date
      if (isNaN(start.getTime())) {
        return;
      }
      
      const now = new Date();
      
      let years = now.getFullYear() - start.getFullYear();
      let months = now.getMonth() - start.getMonth();
      let days = now.getDate() - start.getDate();
      
      // Adjust negative days
      if (days < 0) {
        // Get last day of previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }
      
      // Adjust negative months
      if (months < 0) {
        months += 12;
        years--;
      }

      // If friendship hasn't started yet / future date
      if (years < 0) {
        setTimePassed({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      setTimePassed({
        years,
        months,
        days,
        hours,
        minutes,
        seconds
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [startDateStr]);

  const timeBlocks = [
    { label: 'Anos', value: timePassed.years },
    { label: 'Meses', value: timePassed.months },
    { label: 'Dias', value: timePassed.days },
    { label: 'Horas', value: timePassed.hours },
    { label: 'Minutos', value: timePassed.minutes },
    { label: 'Segundos', value: timePassed.seconds }
  ];

  // Format date for display (e.g. 15 de Fevereiro de 2018)
  const formatStartDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div id="friendship-timer" className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-[#fdfbf7] dark:bg-zinc-900/95 backdrop-blur-md p-6 sm:p-10 rounded-none border-4 border-double border-[#c9a66b]/40 shadow-xl relative overflow-hidden">
        
        {/* Artistic background accents */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#c9a66b]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#c9a66b]/10 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-8 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#c9a66b]/40 text-[#c9a66b] rounded text-xs font-semibold uppercase tracking-wider mb-3 font-serif italic">
            <Clock size={12} /> Marcador do Tempo
          </span>
          <h3 className="serif-title text-2xl sm:text-3xl text-zinc-950 dark:text-zinc-50 font-semibold mb-2">
            Nossa Jornada Juntas
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-serif italic">
            A cada segundo, nossa amizade se fortalece. Estamos colecionando sorrisos desde: <span className="font-semibold text-[#c9a66b]">{formatStartDate(startDateStr)}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 relative z-10">
          {timeBlocks.map((block, idx) => (
            <div 
              key={idx}
              className="bg-[#fdfbf7] dark:bg-zinc-950/60 border border-[#e5e1d8] dark:border-zinc-800 rounded-none p-4 text-center transition-all duration-300 hover:scale-105 hover:bg-[#c9a66b]/5 shadow-sm"
            >
              <div className="serif-title text-3xl sm:text-4xl md:text-5xl font-semibold text-[#c9a66b] dark:text-[#dfbc83] tracking-tight">
                {String(block.value).padStart(2, '0')}
              </div>
              <div className="text-xs font-serif italic text-zinc-500 dark:text-zinc-400 mt-2 uppercase tracking-wide">
                {block.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-4 justify-center items-center text-xs text-zinc-500 dark:text-zinc-400 relative z-10 border-t border-[#e5e1d8] dark:border-zinc-800/80 pt-6">
          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-[#c9a66b]" />
            Parceria Inabalável
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1 font-serif italic">
            ✨ {timePassed.years * 365 + timePassed.months * 30 + timePassed.days} Dias de pura cumplicidade
          </span>
        </div>
      </div>
    </div>
  );
}
