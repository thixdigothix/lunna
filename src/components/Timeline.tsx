import { TimelineEvent } from '../types';
import { Calendar, Heart } from 'lucide-react';

interface TimelineProps {
  events: TimelineEvent[];
  titlePill?: string;
  title?: string;
  subtitle?: string;
  onPhotoClick?: (url: string, caption?: string) => void;
}

export default function Timeline({ events, titlePill, title, subtitle, onPhotoClick }: TimelineProps) {
  return (
    <div id="timeline-section" className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-16">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#c9a66b]/40 text-[#c9a66b] rounded text-xs font-semibold uppercase tracking-wider mb-3 font-serif italic">
          {titlePill || "✨ Nossa Linha do Tempo"}
        </span>
        <h3 className="serif-title text-3xl sm:text-4xl text-zinc-900 dark:text-zinc-50 font-bold mb-4">
          {title || "Como Tudo Começou"}
        </h3>
        <p className="max-w-2xl mx-auto text-sm text-zinc-600 dark:text-zinc-400 font-serif italic">
          {subtitle || "Viaje no tempo e relembre os momentos mais marcantes que moldaram a nossa amizade ao longo de todos estes anos. Cada data guarda um segredo precioso!"}
        </p>
      </div>

      <div className="relative border-l-2 border-[#e5e1d8] dark:border-zinc-850 ml-4 md:ml-0 md:left-1/2 md:-translate-x-1/2 md:border-l-2">
        
        {events.map((event, index) => {
          const isEven = index % 2 === 0;

          return (
            <div 
              key={event.id}
              className={`relative mb-12 md:mb-16 md:w-1/2 ${isEven ? 'md:ml-auto md:pl-10 pl-6' : 'md:mr-auto md:pr-10 md:text-right pl-6 md:pl-0'}`}
            >
              {/* Central Junction Bubble */}
              <div 
                className="absolute left-0 md:left-auto md:right-0 top-1 w-5 h-5 bg-[#fdfbf7] dark:bg-zinc-950 border-4 border-[#c9a66b] rounded-full z-10 -translate-x-1/2 md:translate-x-1/2"
                style={{
                  boxShadow: '0 0 10px rgba(201, 166, 107, 0.4)'
                }}
              >
                {/* Micro heartbeat anchor */}
                <div className="w-full h-full rounded-full bg-[#c9a66b] animate-ping absolute inset-0 opacity-40"></div>
              </div>

              {/* Event Content Box */}
              <div 
                className="bg-[#fdfbf7] dark:bg-zinc-900/50 backdrop-blur-md rounded-none border border-[#e5e1d8] dark:border-zinc-800 p-5 md:p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:border-[#c9a66b] relative overflow-hidden"
              >
                {/* Mini background romantic shape */}
                <div className="absolute right-2 bottom-2 text-[#c9a66b]/10 dark:text-[#c9a66b]/5 pointer-events-none">
                  <Heart size={80} className="fill-current" />
                </div>

                {/* Event Date Block */}
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#c9a66b] dark:text-[#dfbc83] mb-2 font-serif italic">
                  <Calendar size={12} /> {event.date}
                </span>

                {/* Event Photo */}
                {event.photoUrl && (
                  <div 
                    onClick={() => onPhotoClick?.(event.photoUrl, event.title)}
                    className="my-3 overflow-hidden rounded-xl h-44 sm:h-52 w-full relative group cursor-zoom-in"
                  >
                    <img 
                      src={event.photoUrl} 
                      alt={event.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="px-3 py-1.5 bg-[#fdfbf7] dark:bg-zinc-950 text-xs text-zinc-900 dark:text-zinc-50 border border-[#c9a66b]/30 shadow-md font-serif italic flex items-center gap-1 scale-90 group-hover:scale-100 transition-all duration-300 uppercase tracking-wider">
                        🔍 Ampliar Foto
                      </span>
                    </div>
                  </div>
                )}

                <h4 className="serif-title text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  {event.title}
                </h4>

                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}
