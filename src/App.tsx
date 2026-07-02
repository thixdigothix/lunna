/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, Sparkles, Gift, Sun, Moon, Maximize2, X, Music, 
  ChevronDown, BookOpen, Star, Zap, Pizza, Tv, Smile, Play, Eye
} from 'lucide-react';

import { BirthdayData } from './types';
import { defaultBirthdayData } from './defaultData';
import FriendshipTimer from './components/FriendshipTimer';
import StarSky from './components/StarSky';
import Timeline from './components/Timeline';
import SecretAdminPanel from './components/SecretAdminPanel';

function PolaroidImg({ src, index, isModal }: { src: string; index?: number; isModal?: boolean }) {
  const [error, setError] = useState(false);
  const isBrokenUrl = !src || src.includes("sites.google") || src.includes("googleusercontent") || src.includes("polaroid_");

  if (error || isBrokenUrl) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-[#f7f4ec] dark:bg-zinc-900 p-3 text-center border border-dashed border-[#c9a66b]/50 ${isModal ? 'py-16 min-h-[300px]' : ''}`}>
        <span className="text-3xl mb-1.5 animate-pulse">📷</span>
        <span className="text-xs font-serif italic text-zinc-700 dark:text-zinc-300 font-semibold">
          {isModal ? "Foto Original não encontrada" : `Foto #${(index ?? 0) + 1} original`}
        </span>
        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-1 max-w-[180px] leading-relaxed">
          Para exibir a foto real sem IA, envie seu arquivo para a pasta: <br />
          <code className="bg-zinc-200 dark:bg-zinc-800 px-1 py-0.5 rounded text-[#8c7b6c] dark:text-[#c9a66b] font-mono text-[9px] block mt-1.5 shadow-inner select-all">
            src/assets/images/foto{(index ?? 0) + 1}_...jpg
          </code>
          no menu esquerdo de arquivos.
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      referrerPolicy="no-referrer"
      onError={() => setError(true)}
      className={isModal ? "max-h-[70vh] max-w-full object-contain" : "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"}
    />
  );
}

export default function App() {
  // Persistence state
  const [data, setData] = useState<BirthdayData>(() => {
    const saved = localStorage.getItem('birthday_tribute_data_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name === "Mariana") {
          localStorage.removeItem('birthday_tribute_data_v5');
          return defaultBirthdayData;
        }
        return { ...defaultBirthdayData, ...parsed };
      } catch {
        return defaultBirthdayData;
      }
    }
    return defaultBirthdayData;
  });

  // Locked to Dark Mode for the starry sky and premium night effect
  const darkMode = true;

  // Interaction controls
  const [surpriseUnlocked, setSurpriseUnlocked] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedPhotoCaption, setSelectedPhotoCaption] = useState<string | null>(null);
  const [openedSecret, setOpenedSecret] = useState<number | null>(null);
  const [finalGiftOpened, setFinalGiftOpened] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{id: number, left: number, size: number, delay: number, duration: number}[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Secret admin keyboard shortcut (Alt+E or F2)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'e') || e.key === 'F2') {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Typing state for long message
  const [typedMessage, setTypedMessage] = useState("");
  const letterRef = useRef<HTMLDivElement | null>(null);

  // Sync state to local storage
  const handleUpdateData = (newData: BirthdayData) => {
    setData(newData);
    localStorage.setItem('birthday_tribute_data_v5', JSON.stringify(newData));
  };

  const handleResetData = () => {
    if (window.confirm("Deseja realmente voltar aos dados padrões de exemplo para a Lunna? Isso limpará suas edições personalizadas atuais.")) {
      setData(defaultBirthdayData);
      localStorage.setItem('birthday_tribute_data_v5', JSON.stringify(defaultBirthdayData));
    }
  };

  // Ensure Dark class is always on root element
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');
    localStorage.setItem('birthday_theme_v2', 'dark');
  }, []);

  // Occasional heart generators for a sweet physical presence
  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now() + Math.random();
      const newHeart = {
        id,
        left: Math.random() * 95, // horizontal position percentage
        size: Math.random() * 20 + 12, // size in px
        delay: Math.random() * 2,
        duration: Math.random() * 6 + 6 // duration in seconds
      };
      
      setFloatingHearts(prev => [...prev.slice(-15), newHeart]);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // Soft progressive typewriter trigger on scroll or unlock
  useEffect(() => {
    if (surpriseUnlocked) {
      let currentIdx = 0;
      const fullText = data.realTimeTributeText || "";
      
      const interval = setInterval(() => {
        setTypedMessage(fullText.slice(0, currentIdx));
        currentIdx++;
        if (currentIdx > fullText.length) {
          clearInterval(interval);
        }
      }, 40);
      return () => clearInterval(interval);
    }
  }, [surpriseUnlocked, data.realTimeTributeText]);

  // Main Open trigger
  const handleOpenSurprise = () => {
    setSurpriseUnlocked(true);
    
    // Smooth scroll down to main content 350ms after unlocking
    setTimeout(() => {
      const target = document.getElementById('main-memorial-anchor');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 350);

    // Initial warm sparks
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#f43f5e', '#fb7185', '#fbcfe8', '#fef08a']
    });
  };

  // Final mega present trigger
  const handleOpenFinalGift = () => {
    setFinalGiftOpened(true);
    
    // Shoot continuous festive fireworks
    const duration = 5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ec4899', '#f43f5e', '#e11d48', '#fbbf24']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ec4899', '#f43f5e', '#e11d48', '#fbbf24']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  // Icon dynamic mapper for curvatures
  const renderCuriosityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Pizza':
        return <Pizza className="text-orange-500" size={24} />;
      case 'Tv':
        return <Tv className="text-sky-500" size={24} />;
      case 'Heart':
        return <Heart className="text-rose-500 fill-current animate-pulse-slow" size={24} />;
      case 'Smile':
        return <Smile className="text-amber-500" size={24} />;
      default:
        return <Sparkles className="text-purple-500" size={24} />;
    }
  };

  return (
    <div className={`min-h-screen bg-[#fdfbf7] text-zinc-900 transition-colors duration-500 dark:bg-[#121211] dark:text-zinc-100 selection:bg-[#c9a66b]/30 dark:selection:bg-zinc-800 pb-20 overflow-hidden relative`}>
      
      {/* BACKGROUND FLOATING HEARTS EFFECT */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        {floatingHearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute bottom-[-50px] text-[#c9a66b]/35 dark:text-[#dfbc83]/20 select-none pointer-events-none animate-float"
            style={{
              left: `${heart.left}%`,
              fontSize: `${heart.size}px`,
              animationDelay: `${heart.delay}s`,
              animationDuration: `${heart.duration}s`
            }}
          >
            ❤
          </div>
        ))}
      </div>

      {/* FIXED FLOATING CONTROLS PANEL */}
      <div className="fixed top-6 left-6 z-40 flex items-center gap-3">
        {/* Display Status Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-[#fdfbf7]/95 dark:bg-zinc-900/95 border border-[#c9a66b]/30 dark:border-zinc-800 rounded-none text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest pointer-events-none shadow-sm font-serif italic">
          <span className="w-2 h-2 rounded-full bg-[#c9a66b] animate-pulse"></span>
          Modo Homenagem Ativo
        </div>
      </div>

      {/* ----- HERO SECTION ----- */}
      <section 
        id="hero-section" 
        className="min-h-screen relative flex flex-col justify-between items-center px-4 py-16 overflow-hidden bg-[#fdfbf7] dark:bg-[#121211] border-b-4 border-double border-[#c9a66b]/30"
      >
        {/* Decorative Spotlight & Glowing particles backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-[#c9a66b]/5 dark:bg-[#c9a66b]/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-[20%] left-[10%] w-[120px] h-[120px] bg-[#c9a66b]/10 dark:bg-[#c9a66b]/5 rounded-full blur-[40px] pointer-events-none animate-pulse-slow"></div>

        {/* Top Spacer */}
        <div></div>

        {/* Main Content Area */}
        <div className="text-center max-w-3xl mx-auto z-10 space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#c9a66b]/40 text-[#c9a66b] rounded text-xs font-semibold uppercase tracking-widest shadow-sm font-serif italic">
            <Sparkles size={12} className="animate-spin text-[#c9a66b]" /> {data.heroBadgeText || "Hoje é um dia muito especial"}
          </span>

          {/* Large Title Spotlight */}
          <h1 className="serif-title text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
            {data.heroTitlePrefix !== undefined ? data.heroTitlePrefix : "Feliz Aniversário,"}<br />
            <span className="text-[#c9a66b] dark:text-[#dfbc83] font-serif font-semibold italic tracking-tight uppercase">
              {data.name} ✨
            </span>
          </h1>

          {/* Customizable Subtitles */}
          <p className="text-lg sm:text-xl font-medium text-zinc-850 dark:text-zinc-200 max-w-xl mx-auto italic font-serif leading-relaxed">
            {data.heroSubtitle}
          </p>
          
          <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed font-serif italic">
            {data.heroSecondaryText}
          </p>

          {/* "Open Surprise" Button */}
          <div className="pt-6">
            <button
              id="hero-action-btn"
              onClick={handleOpenSurprise}
              className="relative inline-flex items-center gap-2 group px-8 py-4 bg-[#2c2c2c] hover:bg-[#8c7b6c] dark:bg-[#c9a66b] dark:hover:bg-[#dfbc83] text-white dark:text-zinc-950 font-bold rounded-none text-sm sm:text-base cursor-pointer shadow-lg hover:shadow-[#c9a66b]/30 transition-all duration-300 hover:scale-105 active:scale-95 border-b-2 border-stone-850 dark:border-stone-250 select-none font-serif italic"
            >
              <Gift size={20} className="text-[#c9a66b] dark:text-zinc-950" />
              <span>{data.heroBtnText || "Abrir Surpresa"}</span>
              <span className="absolute -inset-1 rounded-none border border-[#c9a66b]/30 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"></span>
            </button>
          </div>
        </div>

        {/* Scroll helper anchor indicator */}
        <div className="flex flex-col items-center gap-1.5 opacity-70 animate-bounce cursor-pointer" onClick={handleOpenSurprise}>
          <span className="text-xs uppercase tracking-widest font-semibold text-zinc-400 font-serif">{data.heroScrollHelperText || "Ver Homenagem"}</span>
          <ChevronDown size={18} className="text-[#c9a66b]" />
        </div>
      </section>


      {/* CENTRAL EXPERIENCE GATE */}
      <div id="main-memorial-anchor" className="relative">
        
        {/* If the user hasn't clicked "Open Surprise" yet, we keep the lower sections atmosphericly dimmed or previewable with an unlock prompt overlay! This is extremely elegant and creates great suspense */}
        {!surpriseUnlocked && (
          <div className="absolute inset-0 z-25 bg-[#fdfbf7]/90 dark:bg-[#121211]/90 backdrop-blur-md flex flex-col justify-center items-center py-20 min-h-[500px] text-center px-4 border-t-4 border-double border-[#c9a66b]/30">
            <span className="w-16 h-16 bg-[#fdfbf7] dark:bg-zinc-900 flex items-center justify-center border-2 border-double border-[#c9a66b]/30 text-[#c9a66b] animate-pulse mb-4 rounded-none">
              <Eye size={28} />
            </span>
            <h3 className="serif-title text-xl sm:text-2xl font-bold text-zinc-850 dark:text-zinc-200">{data.gateLockedTitle || "Surpresa Guardada com Chave de Ouro"}</h3>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mt-1.5 mb-5 font-serif italic">
              {data.gateLockedSubtitle || "Toda a linha do tempo, galeria polaroid de lembranças, curiosidades divertidas e a trilha sonora especial estão escondidas atrás do baú."}
            </p>
            <button
              onClick={handleOpenSurprise}
              className="px-6 py-2.5 bg-[#2c2c2c] hover:bg-[#8c7b6c] dark:bg-[#c9a66b] dark:hover:bg-[#dfbc83] text-[#fdfbf7] dark:text-zinc-950 rounded-none text-xs font-semibold border-b border-stone-850 font-serif italic shadow-md transition-all uppercase tracking-wider select-none shrink-0"
            >
              {data.gateLockedBtn || "Revelar Homenagem Agora ✨"}
            </button>
          </div>
        )}

        {/* Core content wrapping with appropriate conditional entry classes */}
        <div className={`transition-all duration-700 ${surpriseUnlocked ? 'opacity-100 translate-y-0 filter-none' : 'opacity-20 translate-y-8 filter blur-lg pointer-events-none select-none'}`}>
          <section className="py-16 bg-[#fdfbf7]/50 dark:bg-[#121211]/50 relative border-b border-[#e5e1d8] dark:border-zinc-800">
            <div className="max-w-3xl mx-auto px-4">
              
              {/* Typewriter message card */}
              {surpriseUnlocked && (
                <div className="bg-[#fdfbf7] dark:bg-zinc-900/90 border-4 border-double border-[#c9a66b]/30 p-6 sm:p-8 rounded-none text-center relative overflow-hidden backdrop-blur-md shadow-sm">
                  {/* Decorative quote signs */}
                  <span className="absolute top-1 left-2 text-7xl font-serif text-[#c9a66b]/20 select-none">“</span>
                  <span className="absolute bottom-[-20px] right-2 text-7xl font-serif text-[#c9a66b]/20 select-none">”</span>

                  <div className="flex justify-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#c9a66b]/10 flex items-center justify-center text-[#c9a66b]">
                      <Heart size={18} className="fill-current animate-pulse text-[#c9a66b]" />
                    </div>
                  </div>

                  <p className="text-base sm:text-lg leading-relaxed text-zinc-850 dark:text-zinc-200 font-serif font-medium h-auto min-h-[96px] max-w-xl mx-auto italic">
                    {typedMessage}
                    <span className="inline-block w-1.5 h-4 bg-[#c9a66b] ml-1 animate-pulse" />
                  </p>
                  
                  <div className="text-[10px] uppercase font-bold text-zinc-400 mt-4 tracking-widest font-serif italic">
                    {data.realTimeTributeLabel || "Homenagem em tempo real"}
                  </div>
                </div>
              )}

            </div>
          </section>


          {/* ----- SECTION 3: FRIENDSHIP CONGREGATOR LIVE TICKER ----- */}
          <section className="py-8">
            <FriendshipTimer startDateStr={data.friendshipStartDate} />
          </section>


          {/* ----- SECTION 4: PHOTOS POLAROID GALLERY ----- */}
          <section id="polaroid-gallery" className="py-16 bg-[#fdfbf7] dark:bg-[#121211] border-t border-b border-[#e5e1d8] dark:border-zinc-800/80">
            <div className="max-w-6xl mx-auto px-4">
              
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#c9a66b]/40 text-[#c9a66b] rounded text-xs font-semibold uppercase tracking-wider mb-3 font-serif italic">
                  {data.polaroidTitlePill || "📸 Galeria de Sorrisos"}
                </span>
                <h2 className="serif-title text-3xl sm:text-4xl text-zinc-900 dark:text-zinc-100 font-bold mb-3">
                  {data.polaroidTitle || "Nossos Momentos Polaroid"}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto font-serif italic">
                  {data.polaroidSubtitle || "Algumas das nossas melhores versões congeladas no tempo. Clique em qualquer foto abaixo para ampliar em tela cheia com legenda!"}
                </p>
              </div>

              {/* Grid Layout of Polaroid Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 justify-center">
                {data.photos.map((photoUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedPhoto(photoUrl);
                      setSelectedPhotoCaption(data.photoCaptions[idx] || "");
                    }}
                    className="bg-[#fdfbf7] dark:bg-zinc-900 p-4 pb-6 rounded-none shadow-lg border border-[#e5e1d8] dark:border-zinc-800/80 transition-all duration-300 hover:scale-105 hover:rotate-2 hover:shadow-2xl cursor-zoom-in group shrink-0"
                    style={{
                      // Slight alternating angles for vintage look
                      transform: `rotate(${idx % 2 === 0 ? '-1.5' : '1.5'}deg)`
                    }}
                  >
                    {/* Image space wrapper */}
                    <div className="aspect-square w-full overflow-hidden bg-zinc-150 dark:bg-zinc-950 rounded-none relative">
                      <PolaroidImg src={photoUrl} index={idx} />
                      {/* Hover tint overlay */}
                      <div className="absolute inset-0 bg-[#c9a66b]/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 bg-zinc-950/85 backdrop-blur-xs text-[10px] uppercase font-bold tracking-widest text-[#fdfbf7] rounded-none border border-[#c9a66b]/30">Ampliar</span>
                      </div>
                    </div>

                    {/* Handwriting style label caption */}
                    <div className="mt-4 text-center">
                      <p className="handwritten text-xl sm:text-2xl text-zinc-750 dark:text-[#dfbc83] leading-tight">
                        {data.photoCaptions[idx] || "Nossos sorrisos favoritos..."}
                      </p>
                      <span className="text-[10px] font-serif italic text-zinc-400 mt-2 block">
                        Momentos Especiais #{idx + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>


          {/* ----- SECTION 5: INTERACTIVE TIMELINE ----- */}
          <section className="py-16 relative bg-[#fdfbf7] dark:bg-[#121211] border-b border-[#e5e1d8] dark:border-zinc-800">
            <Timeline 
              events={data.timeline} 
              titlePill={data.timelineTitlePill}
              title={data.timelineTitle}
              subtitle={data.timelineSubtitle}
              onPhotoClick={(url, caption) => {
                setSelectedPhoto(url);
                setSelectedPhotoCaption(caption || null);
              }}
            />
          </section>


          {/* ----- SECTION 6: STAR SKY - CEU DE MENSAGENS ----- */}
          <section className="py-12 bg-zinc-950 text-white">
            <StarSky 
              messages={data.skyMessages} 
              titlePill={data.starsTitlePill}
              title={data.starsTitle}
              subtitle={data.starsSubtitle}
              onPhotoClick={(url, caption) => {
                setSelectedPhoto(url);
                setSelectedPhotoCaption(caption || null);
              }}
            />
          </section>


          {/* ----- SECTION 7: SECRET MESSAGES (CLICK TO OPEN) ----- */}
          <section className="py-16 bg-[#fdfbf7] dark:bg-[#121211] border-b border-[#e5e1d8] dark:border-zinc-800 relative">
            <div className="max-w-4xl mx-auto px-4">
              
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#c9a66b]/40 text-[#c9a66b] rounded text-xs font-semibold uppercase tracking-wider mb-3 font-serif italic">
                  {data.secretTitlePill || "🎁 Baú Misterioso"}
                </span>
                <h2 className="serif-title text-3xl sm:text-4xl text-zinc-900 dark:text-zinc-50 font-bold mb-3">
                  {data.secretTitle || "Mensagens Secretas"}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto font-serif italic">
                  {data.secretSubtitle || "Escondi pequenos bilhetes cheios de afeto para você. Toque em qualquer um dos presentes embrulhados abaixo para ler!"}
                </p>
              </div>

              {/* Wrapped gifts container */}
              <div className="flex flex-wrap items-center justify-center gap-6">
                {data.secretMessages.map((text, idx) => (
                  <button
                    key={idx}
                    onClick={() => setOpenedSecret(openedSecret === idx ? null : idx)}
                    className={`p-6 bg-[#fdfbf7] dark:bg-zinc-900/80 rounded-none border border-[#e5e1d8] dark:border-zinc-800 shadow-md relative overflow-hidden transition-all duration-300 cursor-pointer focus:ring-2 focus:ring-[#c9a66b] text-left ${openedSecret === idx ? 'w-full max-w-xl scale-100 border-4 border-double border-[#c9a66b]' : 'w-44 h-44 flex flex-col justify-center items-center text-center hover:scale-105 active:scale-95'}`}
                  >
                    {openedSecret === idx ? (
                      <div className="space-y-3 relative">
                        {/* Opened layout */}
                        <div className="flex justify-between items-center border-b border-[#e5e1d8] dark:border-zinc-805 pb-2">
                          <span className="text-xs font-bold text-[#c9a66b] flex items-center gap-1 font-serif">
                            <Sparkles size={12} className="text-[#c9a66b]" /> Bilhete Secreto #{idx + 1} Aberto!
                          </span>
                          <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold font-serif italic">Fechar ✕</span>
                        </div>
                        <p className="handwritten text-2xl text-[#c9a66b] dark:text-[#dfbc83] leading-relaxed py-1">
                          {text}
                        </p>
                        <div className="text-[10px] text-zinc-400 font-serif italic">
                          Escrito do fundo do coração para iluminar o seu dia!
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 select-none">
                        {/* Closed layout with colorful packages */}
                        <div className={`w-14 h-14 bg-gradient-to-br from-[#c9a66b] to-[#8c7b6c] rounded-none flex items-center justify-center text-white shadow-md animate-bounce`}>
                          <Gift size={26} className="text-[#fdfbf7]" />
                        </div>
                        <span className="text-xs font-serif font-semibold text-zinc-700 dark:text-zinc-250 mt-2 block">Presente #{idx + 1}</span>
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#c9a66b] mt-1 font-serif italic">Clique para ler</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

            </div>
          </section>


          {/* ----- SECTION 8: CURIOCIDADES SOBRE ELA ----- */}
          <section className="py-16 bg-[#fdfbf7] dark:bg-[#121211] border-b border-[#e5e1d8] dark:border-zinc-800">
            <div className="max-w-4xl mx-auto px-4">
              
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#c9a66b]/40 text-[#c9a66b] rounded text-xs font-semibold uppercase tracking-wider mb-3 font-serif italic">
                  {data.curiositiesTitlePill || "🔍 Fatos Engraçados"}
                </span>
                <h2 className="serif-title text-3xl sm:text-4xl text-zinc-900 dark:text-zinc-50 font-bold mb-3">
                  {data.curiositiesTitle || "Curiosidades Sobre Ela"}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-serif italic">
                  {data.curiositiesSubtitle || "Porque conhecer e amar você rindo dessas pequenas manias e características incríveis!"}
                </p>
              </div>

              {/* Bento Grid layout of features */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {data.curiosities.map((item, index) => {
                  // Span pattern: first & last span 3, middle span 2
                  const colSpanClass = index % 3 === 0 ? 'md:col-span-3' : 'md:col-span-2';
                  
                  return (
                    <div 
                      key={item.id}
                      className={`${colSpanClass} bg-[#fdfbf7] dark:bg-zinc-900/60 border border-[#e5e1d8] dark:border-zinc-800 p-6 rounded-none flex items-start gap-4 hover:scale-[1.01] hover:border-[#c9a66b] transition-all shadow-md relative overflow-hidden`}
                    >
                      {/* Circle Graphic background decoration */}
                      <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-[#c9a66b]/5 rounded-full blur-xl pointer-events-none"></div>

                      <div className="p-3 bg-[#fdfbf7] dark:bg-zinc-800/80 rounded-none border border-[#c9a66b]/35 shrink-0">
                        {renderCuriosityIcon(item.icon)}
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs uppercase font-bold tracking-widest text-[#c9a66b] dark:text-[#dfbc83] font-serif italic">
                          {item.label}
                        </h4>
                        <p className="text-sm sm:text-base font-semibold text-zinc-850 dark:text-zinc-200 leading-snug font-serif">
                          {item.value || "Lembrança carinhosa em construção..."}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </section>


          {/* ----- SECTION 9: PLAYLIST ESPECIAL INTERACTIVE ----- */}
          <section className="py-16 bg-[#fdfbf7] dark:bg-[#121211]/50 border-b border-[#e5e1d8] dark:border-zinc-800">
            <div className="max-w-4xl mx-auto px-4">
              
              <div className="text-center mb-12">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#c9a66b]/40 text-[#c9a66b] rounded text-xs font-semibold uppercase tracking-wider mb-3 font-serif italic">
                  {data.playlistTitlePill || "🎵 Trilha Sonora Especial"}
                </span>
                <h2 className="serif-title text-3xl sm:text-4xl text-zinc-900 dark:text-zinc-50 font-bold mb-3">
                  {data.playlistTitleText || "Nossa Playlist do Core"}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto font-serif italic">
                  {data.playlistDescription || "Músicas que embalaram nossos papos, viagens de carro ou que me fazem lembrar do seu abraço instantaneamente."}
                </p>
              </div>

              {/* Spotify Track list and players */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Traditional Static description of songs */}
                <div className="bg-[#fdfbf7] dark:bg-zinc-900/40 border border-[#e5e1d8] dark:border-zinc-800 rounded-none p-6 sm:p-8 space-y-4">
                  <div className="flex items-center gap-2 text-[#c9a66b] font-semibold text-xs uppercase tracking-wider font-serif italic">
                    <Music size={14} className="text-[#c9a66b]" /> {data.playlistLabel || "Fitas cassete digitais"}
                  </div>
                  <h4 className="serif-title text-xl font-bold dark:text-white">{data.playlistTitle || "Melodias Unidas pela Amizade"}</h4>
                  <p className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-300 leading-relaxed font-serif italic">
                    {data.playlistSubtitle || "A música tem o dom extraordinário de guardar momentos. Sempre que ouço essas notas, lembro de algum momento feliz que passamos lado a lado."}
                  </p>
                  
                  {/* Song descriptive items */}
                  <div className="space-y-3 pt-3">
                    {(data.playlistSongs || []).map((song, i) => (
                      <div key={song.id || i} className="flex gap-2 items-center bg-[#fdfbf7] dark:bg-zinc-950/25 p-2.5 rounded-none border border-[#c9a66b]/20 dark:border-zinc-800">
                        <span className="text-xs font-bold text-[#c9a66b] font-serif italic">{String(i + 1).padStart(2, '0')}</span>
                        <div className="text-xs font-serif">
                          <strong className="block text-zinc-850 dark:text-zinc-200">{song.title}</strong>
                          <span className="text-zinc-400 font-serif italic">{song.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Spotify embedding frames for the list of Track IDs */}
                <div className="space-y-4">
                  {(data.playlistSongs || []).map((song, i) => (
                    <div key={song.id || i} className="rounded-none overflow-hidden shadow-md border border-[#c9a66b]/30 dark:border-zinc-800 h-[80px]">
                      <iframe
                        src={`https://open.spotify.com/embed/track/${song.trackId}?utm_source=generator&theme=0`}
                        width="100%"
                        height="80"
                        frameBorder="0"
                        allowFullScreen={false}
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="bg-transparent"
                      />
                    </div>
                  ))}
                  
                  {/* Video block representation */}
                  {data.videoUrl && (
                    <div className="rounded-none overflow-hidden shadow-lg border border-[#c9a66b]/30 dark:border-zinc-800 aspect-video w-full mt-4 bg-black relative">
                      <iframe
                        src={data.videoUrl}
                        title="Homenagem Vídeo"
                        width="100%"
                        height="100%"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>

            </div>
          </section>


          {/* ----- SECTION 10: VINTAGE CARTA FINAL ----- */}
          <section className="py-16 bg-[#fdfbf7] dark:bg-[#121211]">
            <div className="max-w-3xl mx-auto px-4">
              
              {/* Paper parchment styled box */}
              <div 
                ref={letterRef}
                className="bg-[#fdfbf7] dark:bg-zinc-900/40 text-rose-950 dark:text-zinc-100 p-8 sm:p-12 rounded-none border-4 border-double border-[#c9a66b]/30 shadow-2xl relative overflow-hidden"
                style={{
                  backgroundImage: 'radial-gradient(rgba(201,166,107,0.15) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              >
                {/* Vintage stamp wax element representation */}
                <div className="absolute top-6 right-6 w-16 h-16 bg-[#c9a66b]/10 dark:bg-[#dfbc83]/15 rounded-none border-2 border-double border-[#c9a66b]/40 flex items-center justify-center pointer-events-none uppercase text-[8px] font-bold text-[#c9a66b] tracking-wider font-mono">
                  {data.finalLetterStamp || "Amor Real"}
                </div>

                {/* Red heart wax seal center */}
                <div className="absolute top-9 right-9 w-10 h-10 bg-[#c9a66b] rounded-none flex items-center justify-center text-zinc-950 dark:text-zinc-50 scale-75 rotate-12 pointer-events-none shadow-md">
                  ❤
                </div>

                {/* Letter Header */}
                <h3 className="serif-title text-4xl sm:text-5xl font-semibold mb-6 text-zinc-900 dark:text-zinc-50 border-b border-amber-200/50 dark:border-zinc-800/80 pb-4">
                  {data.finalLetterTitle}
                </h3>

                {/* Letter Body Paragraphs */}
                <div className="space-y-6 text-base sm:text-lg handwritten leading-relaxed text-zinc-700 dark:text-zinc-200">
                  {data.finalLetterBody.map((paragraph, idx) => (
                    <p key={idx} className="indent-6">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Letter sign-off signature */}
                <div className="mt-12 text-right border-t border-amber-200/40 dark:border-zinc-800/60 pt-6">
                  <span className="text-zinc-400 font-serif italic text-xs uppercase tracking-widest block">{data.finalLetterSignOff || "Sua melhor amizade,"}</span>
                  <span className="handwritten text-4xl text-[#c9a66b] dark:text-[#dfbc83] font-bold block mt-1">{data.finalLetterSignature || "Com Carinho e Amor Infinito"}</span>
                </div>
              </div>

            </div>
          </section>


          {/* ----- SECTION 11: FINAL CELEBRATION PRESENT BOX SURPRISE ----- */}
          <section className="py-20 bg-[#fdfbf7] dark:bg-[#121211] border-t border-[#e5e1d8] dark:border-zinc-800">
            <div className="max-w-md mx-auto px-4 text-center">
              
              <div className="relative group inline-block">
                
                {/* Pulsing ring aura */}
                <span className="absolute -inset-4 rounded-none bg-[#c9a66b]/20 blur-xl scale-75 group-hover:scale-125 animate-pulse transition-transform pointer-events-none"></span>

                {/* GIFT CONTAINER SHAKING */}
                <button
                  id="final-surprise-gift-box"
                  disabled={finalGiftOpened}
                  onClick={handleOpenFinalGift}
                  className={`relative cursor-pointer select-none bg-[#2c2c2c] hover:bg-[#8c7b6c] dark:bg-[#c9a66b] dark:hover:bg-[#dfbc83] p-8 rounded-none border-2 border-double border-[#c9a66b] shadow-2xl flex items-center justify-center transition-all duration-300 ${finalGiftOpened ? 'opacity-80 scale-95 cursor-default' : 'animate-bounce hover:scale-110 active:scale-95'}`}
                  title="Abra para a Surpresa Final com Confetes!"
                >
                  <Gift size={44} className="text-[#fdfbf7] dark:text-zinc-950 drop-shadow-md" />
                </button>
              </div>

              <h3 className="serif-title text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mt-6 mb-2">
                {finalGiftOpened ? (data.surpriseBoxTitle || 'Sua Festa Foi Revelada!') : (data.finalGiftSectionTitle || 'Um Último Abraço Surpresa')}
              </h3>
              
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm mx-auto font-serif italic">
                {finalGiftOpened ? (data.finalGiftOpenedSubtitle || 'Obrigado por celebrar esse dia tão caloroso! Compartilhe o amor.') : (data.finalGiftSectionSubtitle || 'Clique no presente acima para abrir seu abraço final e desencadear a constelação de confetes!')}
              </p>

              {/* CELEBRATORY FULLSCREEN OVERLAY MODAL */}
              {finalGiftOpened && (
                <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
                  <div className="bg-zinc-950 border-4 border-double border-[#c9a66b] rounded-none p-8 sm:p-12 text-center max-w-md w-full relative shadow-2xl text-[#fdfbf7]">
                    
                    <button
                      onClick={() => setFinalGiftOpened(false)}
                      className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-none border border-[#c9a66b]/35 bg-zinc-900 transition-colors"
                    >
                      ✕
                    </button>

                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 bg-zinc-800 rounded-none flex items-center justify-center text-[#c9a66b] border border-[#c9a66b]/35 shadow-lg">
                        <Heart size={32} className="fill-current animate-[wiggle_1s_ease-in-out_infinite] text-[#c9a66b]" />
                      </div>
                    </div>

                    <h2 className="serif-title text-3xl sm:text-4xl font-extrabold text-[#dfbc83] dark:text-[#dfbc83] tracking-tight leading-tight mb-4">
                      {data.surpriseBoxTitle}
                    </h2>

                    <p className="text-sm sm:text-base text-zinc-200 leading-relaxed font-medium mb-6">
                      {data.surpriseBoxMessage}
                    </p>

                    <div className="space-y-4 pt-4 border-t border-zinc-800">
                      <button
                        onClick={handleOpenFinalGift}
                        className="w-full py-3 bg-[#2c2c2c] hover:bg-[#8c7b6c] dark:bg-[#c9a66b] dark:hover:bg-[#dfbc83] text-[#fdfbf7] dark:text-zinc-950 font-bold rounded-none text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-transform focus:outline-none focus:ring-2 focus:ring-[#c9a66b] active:scale-95 font-serif italic border border-[#c9a66b]/30"
                      >
                        {data.finalGiftBtnText || "🎉 Jogar Mais Confetes!"}
                      </button>

                      <button
                        onClick={() => setFinalGiftOpened(false)}
                        className="w-full py-2 bg-zinc-850 hover:bg-zinc-800 text-zinc-300 rounded-none text-xs font-semibold transition-all border border-zinc-750"
                      >
                        {data.finalGiftCloseModalText || "Fechar Janela"}
                      </button>
                    </div>

                    <div className="text-[9px] uppercase font-bold text-[#c9a66b]/80 mt-6 tracking-widest font-serif italic">
                      Uma alma solar completa mais um ano!
                    </div>
                  </div>
                </div>
              )}

            </div>
          </section>

        </div>
      </div>


      {/* ----- POLAROID PHOTO LIGHTBOX MODAL ----- */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
        >
          <div className="absolute top-4 right-4 text-white bg-zinc-800/60 p-2 rounded-none cursor-pointer hover:bg-zinc-800 transition-colors border border-[#c9a66b]/20">
            <X size={20} />
          </div>

          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-[#fdfbf7] dark:bg-zinc-950 p-4 pb-8 rounded-none max-w-lg w-full shadow-2xl relative border-4 border-double border-[#c9a66b]/30 animate-slideIn"
          >
            <div className="max-h-[70vh] w-full rounded-none overflow-hidden bg-zinc-150 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
              <PolaroidImg src={selectedPhoto} index={0} isModal={true} />
            </div>
            
            {selectedPhotoCaption && (
              <div className="mt-5 text-center">
                <p className="handwritten text-2xl sm:text-3xl text-zinc-800 dark:text-[#dfbc83] leading-snug px-2">
                  {selectedPhotoCaption}
                </p>
                <div className="w-12 h-0.5 bg-[#c9a66b]/60 mx-auto mt-4 rounded-none"></div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* ----- FOOTER SIGNATURE BLOCK ----- */}
      <footer className="text-center py-10 border-t-4 border-double border-[#c9a66b]/30 bg-[#fdfbf7]/50 dark:bg-[#121211]/30 relative z-30">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <div className="flex items-center justify-center gap-1.5 text-[#c9a66b]">
            <Heart size={14} className="fill-current animate-pulse text-[#c9a66b]" />
            <span className="text-xs uppercase tracking-widest font-bold font-serif italic">{data.footerBadgeText || "Feito de amigo para amigo"}</span>
            <Heart size={14} className="fill-current animate-pulse text-[#c9a66b]" />
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-serif italic">
            {data.footerDescriptionText || "Homenagem exclusiva de aniversário criada com carinho eterno e felicidade. Todos os direitos de amizade reservados ©"} {new Date().getFullYear()}.
          </p>
          <div className="text-[9px] text-zinc-400 font-mono">
            {data.name} & Co. Constellation Inc.
          </div>
          <div className="pt-2">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#c9a66b]/10 hover:bg-[#c9a66b] text-[#c9a66b] hover:text-black border border-[#c9a66b]/40 text-[10px] uppercase font-bold tracking-widest transition-all rounded-none"
            >
              <Sparkles className="w-3 h-3" /> Abrir Painel Secreto de Edição (Alt+E)
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Secret Admin Panel Button */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        <button
          onClick={() => setIsAdminOpen(true)}
          className="group flex items-center gap-2 bg-zinc-900/95 dark:bg-zinc-950/95 hover:bg-[#c9a66b] text-[#c9a66b] hover:text-black border-2 border-[#c9a66b] px-3.5 py-2.5 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105"
          title="Abrir Painel Secreto de Edição (Alt+E ou F2)"
        >
          <Sparkles className="w-4 h-4 animate-spin-slow group-hover:text-black text-[#c9a66b]" />
          <span className="text-xs font-serif font-bold uppercase tracking-wider">Painel Secreto de Edição</span>
        </button>
      </div>

      {/* Secret Admin Panel Modal */}
      <SecretAdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        data={data}
        onUpdate={handleUpdateData}
        onReset={handleResetData}
      />

    </div>
  );
}
