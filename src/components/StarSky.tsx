import { useState } from 'react';
import { Star, Sparkles, X, Heart } from 'lucide-react';
import { SkyMessage } from '../types';
import { resolveImageUrl, getFallbackImageUrl } from '../imageResolver';

interface StarSkyProps {
  messages: SkyMessage[];
  titlePill?: string;
  title?: string;
  subtitle?: string;
  onPhotoClick?: (url: string, caption?: string) => void;
}

export default function StarSky({ messages, titlePill, title, subtitle, onPhotoClick }: StarSkyProps) {
  const [selectedMessage, setSelectedMessage] = useState<SkyMessage | null>(null);

  // Helper to dynamically set sizes for stars
  const getStarClass = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm': return 'w-3 h-3 text-amber-200/50 hover:scale-150 animate-pulse';
      case 'lg': return 'w-7 h-7 text-yellow-300 animate-[bounce_3s_infinite] hover:scale-150 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]';
      default: return 'w-5 h-5 text-yellow-200/80 hover:scale-150 animate-pulse drop-shadow-[0_0_5px_rgba(253,224,71,0.4)]';
    }
  };

  return (
    <div id="star-sky-section" className="w-full max-w-5xl mx-auto px-4 my-16">
      <div className="relative bg-gradient-to-b from-zinc-950 via-indigo-950 to-zinc-950 rounded-3xl p-8 sm:p-12 overflow-hidden border border-zinc-800 shadow-2xl min-h-[480px] flex flex-col justify-between">
        
        {/* Sky Background Effects */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-indigo-950/20 to-black/90 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=1200')] bg-cover opacity-10 bg-center mix-blend-screen pointer-events-none"></div>

        {/* Shoot star animation using custom CSS */}
        <div className="absolute top-10 left-10 w-[2px] h-[2px] bg-white rounded-full translate-x-0 opacity-0 animate-[drift-slow_12s_infinite] pointer-events-none"></div>
        
        {/* Title Block */}
        <div className="relative z-10 text-center max-w-md mx-auto mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400/10 text-yellow-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={12} /> {titlePill || "Interativo"}
          </span>
          <h3 className="serif-title text-2xl sm:text-3xl text-white font-semibold mb-2">
            {title || "Céu das Nossas Mensagens"}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400">
            {subtitle || "Cada estrela no céu representa um momento feliz ou uma lembrança querida nossa. Clique nelas para revelar e iluminar nossa constelação!"}
          </p>
        </div>

        {/* Constellation Canvas area */}
        <div className="relative flex-grow min-h-[280px] w-full border border-white/5 bg-black/30 rounded-2xl overflow-hidden">
          
          {/* Loop over stars */}
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => setSelectedMessage(msg)}
              className="absolute transition-all duration-300 hover:z-20 cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-black rounded-full"
              style={{
                left: `${msg.x}%`,
                top: `${msg.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="relative group">
                <Star className={`${getStarClass(msg.size)} fill-current`} />
                
                {/* Tiny ping helper ring */}
                <span className="absolute -inset-1 rounded-full border border-yellow-300/30 scale-75 animate-ping opacity-70 group-hover:scale-125"></span>
                
                {/* Micro tooltip label */}
                <span className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-zinc-900/90 border border-zinc-700 text-[10px] text-yellow-200 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                  Revelar Lembrança ✨
                </span>
              </div>
            </button>
          ))}

          {/* Prompt banner inside if nothing selected */}
          {!selectedMessage && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 text-center">
              <span className="text-zinc-500/80 text-xs sm:text-sm italic animate-pulse-slow">
                [ Toque em uma das estrelas douradas acima ]
              </span>
            </div>
          )}

        </div>

        {/* Floating message display overlay inside grandparent container (much roomier and beautifully diagrammed) */}
        {selectedMessage && (
          <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-md z-30 p-6 sm:p-10 flex flex-col items-center justify-center transition-all duration-300 animate-fadeIn">
            <div className="relative w-full max-w-2xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-indigo-950/40 border border-yellow-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(234,179,8,0.15)] flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-center">
              
              {/* Close Button */}
              <button
                onClick={() => setSelectedMessage(null)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-805 p-2 rounded-full transition-all duration-300 hover:rotate-90 z-40"
              >
                <X size={18} />
              </button>

              {selectedMessage.photoUrl ? (
                <>
                  {/* Photo Column */}
                  <div 
                    onClick={() => onPhotoClick?.(resolveImageUrl(selectedMessage.photoUrl!), selectedMessage.text)}
                    className="w-full md:w-1/2 aspect-square md:aspect-[4/5] rounded-xl overflow-hidden bg-black border border-yellow-500/20 shadow-xl flex items-center justify-center shrink-0 cursor-zoom-in group/photo relative"
                    title="Clique para ver em tamanho real"
                  >
                    <img 
                      src={resolveImageUrl(selectedMessage.photoUrl)} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/photo:scale-105"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        const fallback = getFallbackImageUrl(target.src);
                        if (target.src !== fallback && !target.src.endsWith(fallback) && !target.dataset.triedFallback) {
                          target.dataset.triedFallback = "true";
                          target.src = fallback;
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <span className="px-2.5 py-1 bg-zinc-900/90 text-[10px] text-yellow-300 border border-yellow-500/20 rounded shadow-md font-serif italic uppercase tracking-wider scale-90 group-hover/photo:scale-100 transition-all duration-300">
                        🔍 Ampliar Foto
                      </span>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="flex-1 flex flex-col justify-between space-y-4 text-center md:text-left h-full">
                    <div className="space-y-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-yellow-400/10 text-yellow-300 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        ✨ Lembrança Estelar
                      </span>
                      <p className="handwritten text-xl sm:text-2xl text-yellow-100 leading-relaxed font-serif">
                        {selectedMessage.text}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-zinc-800/60 flex items-center justify-center md:justify-start gap-2 text-[10px] uppercase tracking-widest text-zinc-500">
                      <Heart size={10} className="fill-current text-yellow-500/60" />
                      <span>Uma estrela brilha por você</span>
                    </div>
                  </div>
                </>
              ) : (
                /* No Photo Layout - Clean Centered Block */
                <div className="w-full text-center flex flex-col items-center justify-center space-y-5 py-4 max-w-md mx-auto">
                  <div className="w-14 h-14 bg-yellow-500/10 rounded-full flex items-center justify-center text-yellow-400 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                    <Sparkles size={24} className="fill-current animate-pulse text-yellow-400" />
                  </div>

                  <p className="handwritten text-2xl sm:text-3xl text-yellow-105 leading-relaxed max-w-md">
                    {selectedMessage.text}
                  </p>

                  <div className="w-10 h-0.5 bg-yellow-550/20 rounded-full"></div>

                  <div className="text-[10px] uppercase tracking-widest text-zinc-500">
                    Uma estrela brilha por você
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="relative z-10 text-center mt-6 text-[11px] text-zinc-500 border-t border-zinc-800/60 pt-4 flex items-center justify-center gap-2">
          <span>🌌 Total de estrelas ativas: {messages.length}</span>
          <span>•</span>
          <span>Inspirado na sua luz única</span>
        </div>
      </div>
    </div>
  );
}
