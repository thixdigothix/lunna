import React, { useState } from 'react';
import { BirthdayData, TimelineEvent, MemoryItem, CuriosityItem, SkyMessage, PlaylistSong } from '../types';
import { 
  X, Settings, Edit3, Image, Calendar, Trash2, Plus, 
  RefreshCw, Copy, Check, FileInput, Video, Heart, HelpCircle, Sparkles
} from 'lucide-react';

interface EditorPanelProps {
  data: BirthdayData;
  onUpdate: (updatedData: BirthdayData) => void;
  onReset: () => void;
}

export default function EditorPanel({ data, onUpdate, onReset }: EditorPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'geral' | 'fotos' | 'linha' | 'curiosidades' | 'estrelas' | 'musicas' | 'letter' | 'raw'>('geral');
  const [copied, setCopied] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSavePermanently = async () => {
    setIsSaving(true);
    setSaveStatus('loading');
    try {
      const response = await fetch('/api/save-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setSaveStatus('success');
        // Clear local storage so it loads the updated defaultData.ts as the state
        localStorage.removeItem('birthday_tribute_data_v2');
        alert("🎉 Suas edições foram salvas com sucesso diretamente no servidor do site! Agora, qualquer pessoa (inclusive a Mariana) verá as suas alterações como a versão final oficial do site. Excelente trabalho!");
      } else {
        setSaveStatus('error');
        alert(`Erro ao salvar no servidor: ${result.error || 'Erro desconhecido'}`);
      }
    } catch (err: any) {
      setSaveStatus('error');
      alert(`Erro de conexão com o servidor: ${err.message || 'Erro de rede'}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus('idle'), 4000);
    }
  };

  // Local helper to update nested attributes
  const updateField = (field: keyof BirthdayData, value: any) => {
    onUpdate({
      ...data,
      [field]: value
    });
  };

  // Convert uploaded file to base64
  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>, 
    callback: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Ops! Por favor envie uma foto menor do que 2MB para garantir a performance de salvamento local.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // POLAROID IMAGE AND CAPTION ADJUSTMENTS
  const handlePolaroidChange = (index: number, base64: string) => {
    const nextPhotos = [...data.photos];
    nextPhotos[index] = base64;
    updateField('photos', nextPhotos);
  };

  const handlePolaroidCaptionChange = (index: number, caption: string) => {
    const nextCaptions = [...data.photoCaptions];
    nextCaptions[index] = caption;
    updateField('photoCaptions', nextCaptions);
  };

  const addNewPolaroid = () => {
    onUpdate({
      ...data,
      photos: [...data.photos, 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600'],
      photoCaptions: [...data.photoCaptions, 'Uma nova lembrança especial de nós duas.']
    });
  };

  const removePolaroid = (index: number) => {
    if (data.photos.length <= 1) {
      alert("Mantenha ao menos uma foto polaroid para a galeria!");
      return;
    }
    const nextPhotos = data.photos.filter((_, idx) => idx !== index);
    const nextCaptions = data.photoCaptions.filter((_, idx) => idx !== index);
    onUpdate({
      ...data,
      photos: nextPhotos,
      photoCaptions: nextCaptions
    });
  };

  // TIMELINE EVENT ADJUSTMENTS
  const handleTimelineChange = (id: string, updatedEvent: Partial<TimelineEvent>) => {
    const nextTimeline = data.timeline.map(ev => {
      if (ev.id === id) return { ...ev, ...updatedEvent };
      return ev;
    });
    updateField('timeline', nextTimeline);
  };

  const addTimelineEvent = () => {
    const newEvent: TimelineEvent = {
      id: `tl-new-${Date.now()}`,
      date: "Nova Data",
      title: "Título do Evento",
      description: "Escreva algo emocionante sobre o que aconteceu neste dia maravilhoso juntas.",
      photoUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=600"
    };
    updateField('timeline', [...data.timeline, newEvent]);
  };

  const removeTimelineEvent = (id: string) => {
    updateField('timeline', data.timeline.filter(ev => ev.id !== id));
  };

  // CURIOSITIES ADJUSTMENTS
  const handleCuriosityChange = (id: string, updatedCuriosity: Partial<CuriosityItem>) => {
    const nextCuriosities = data.curiosities.map(cur => {
      if (cur.id === id) return { ...cur, ...updatedCuriosity };
      return cur;
    });
    updateField('curiosities', nextCuriosities);
  };

  const addCuriosity = () => {
    const newItem: CuriosityItem = {
      id: `cur-new-${Date.now()}`,
      label: "Fato Divertido",
      value: "Valor do Fato Divertido",
      icon: "Sparkles"
    };
    updateField('curiosities', [...data.curiosities, newItem]);
  };

  const removeCuriosity = (id: string) => {
    updateField('curiosities', data.curiosities.filter(cur => cur.id !== id));
  };

  // STAR SKY ADJUSTMENTS
  const handleSkyMsgChange = (id: string, updatedFields: Partial<SkyMessage>) => {
    const nextSky = data.skyMessages.map(item => {
      if (item.id === id) return { ...item, ...updatedFields };
      return item;
    });
    updateField('skyMessages', nextSky);
  };

  const addSkyStar = () => {
    const newStar: SkyMessage = {
      id: `sky-new-${Date.now()}`,
      text: "Eu lembro com muito carinho daquele abraço apertado.",
      x: Math.floor(Math.random() * 70) + 15,
      y: Math.floor(Math.random() * 60) + 15,
      size: Math.random() > 0.5 ? 'lg' : 'md'
    };
    updateField('skyMessages', [...data.skyMessages, newStar]);
  };

  const removeSkyStar = (id: string) => {
    updateField('skyMessages', data.skyMessages.filter(item => item.id !== id));
  };

  // PLAYLIST SONGS ADJUSTMENTS
  const handlePlaylistSongChange = (id: string, updatedSong: Partial<PlaylistSong>) => {
    const nextSongs = (data.playlistSongs || []).map(song => {
      if (song.id === id) return { ...song, ...updatedSong };
      return song;
    });
    updateField('playlistSongs', nextSongs);
  };

  const addPlaylistSong = () => {
    const newSong: PlaylistSong = {
      id: `track-new-${Date.now()}`,
      trackId: "3XQI97bE5bL73QonmFezid",
      title: "Nova Música",
      description: "Escreva algo carinhoso sobre esta música."
    };
    updateField('playlistSongs', [...(data.playlistSongs || []), newSong]);
  };

  const removePlaylistSong = (id: string) => {
    updateField('playlistSongs', (data.playlistSongs || []).filter(song => song.id !== id));
  };

  // COPY JSON BLOCK TO CLIPBOARD
  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // IMPORT JSON BLOCK INTO APP
  const handleImportJson = () => {
    setImportError('');
    try {
      const parsed = JSON.parse(importText);
      if (!parsed.name || !parsed.timeline) {
        setImportError('O JSON importado está incompleto. Precisa conter nome e seções básicas.');
        return;
      }
      onUpdate(parsed);
      setImportText('');
      alert("Homenagem importada com extremo sucesso!");
    } catch (err: any) {
      setImportError('JSON inválido! Verifique a formatação do bloco de texto.');
    }
  };

  return (
    <>
      {/* Floating Gear Trigger Button */}
      <button
        id="editor-open-btn"
        onClick={() => setIsOpen(true)}
        className="fixed top-24 right-4 z-40 bg-[#c9a66b]/95 dark:bg-[#dfbc83]/95 text-zinc-950 dark:text-zinc-950 p-3 rounded-none shadow-2xl hover:bg-zinc-900 hover:text-white transition-all duration-300 hover:rotate-45 flex items-center justify-center border-2 border-double border-[#fdfbf7]"
        title="Personalizar esta Homenagem"
      >
        <Settings size={22} className="animate-[spin_8s_linear_infinite]" />
      </button>

      {/* Editor Sidebar Backing Modal and Drawer */}
      {isOpen && (
        <div id="editor-sidebar-container" className="fixed inset-0 z-55 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer Element */}
          <div className="relative w-full max-w-xl bg-[#fdfbf7] dark:bg-zinc-950 h-full shadow-2xl flex flex-col z-10 transition-transform animate-slideIn">
            
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#e5e1d8] dark:border-zinc-800 flex items-center justify-between bg-[#fdfbf7] dark:bg-zinc-900/60">
              <div className="flex items-center gap-2">
                <Edit3 className="text-[#c9a66b]" size={20} />
                <div>
                  <h2 className="font-serif font-semibold text-zinc-950 dark:text-zinc-50 text-base italic">Painel de Customização</h2>
                  <p className="text-[10px] text-[#c9a66b] dark:text-[#dfbc83] font-serif font-bold uppercase tracking-wider">Edite tudo em tempo real</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onReset}
                  className="px-2.5 py-1.5 text-xs text-zinc-900 dark:text-[#dfbc83] hover:bg-zinc-800 hover:text-white bg-transparent dark:bg-zinc-900/40 rounded-none flex items-center gap-1 transition-all font-medium border border-[#e5e1d8] dark:border-[#c9a66b]/30"
                  title="Restaurar dados padrões de exemplo para Mariana"
                >
                  <RefreshCw size={13} /> Reset
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-none transition-colors bg-zinc-150 dark:bg-zinc-900"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Quick tips label */}
            <div className="bg-[#fcf8f2] dark:bg-zinc-950 px-4 py-2 border-b border-[#e5e1d8] dark:border-rose-950/20 text-[11px] text-zinc-600 dark:text-zinc-300 flex items-center gap-2 shrink-0 font-serif italic">
              <HelpCircle size={14} className="text-[#c9a66b] shrink-0" />
              <span>Qualquer alteração atualiza a página de fundo instantaneamente! Sente-se livre para brincar.</span>
            </div>

            {/* Sub Tabs Selector */}
            <div className="flex items-center gap-1 border-b border-[#e5e1d8] dark:border-zinc-800 overflow-x-auto px-4 py-2 bg-[#fdfbf7] dark:bg-zinc-900/40 shrink-0 select-none">
              {[
                { id: 'geral', label: 'Geral' },
                { id: 'fotos', label: 'Fotos' },
                { id: 'linha', label: 'Timeline' },
                { id: 'curiosidades', label: 'Fatos' },
                { id: 'estrelas', label: 'Mensagens' },
                { id: 'musicas', label: 'Playlist' },
                { id: 'letter', label: 'Texto Final' },
                { id: 'raw', label: 'JSON' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-none text-xs font-semibold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-[#c9a66b] text-white shadow-sm font-serif italic' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-150 dark:hover:bg-zinc-800'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Drawer Body Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

              {/* TAB: GERAL */}
              {activeTab === 'geral' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-1.5">Informações Principais</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Nome da Aniversariante</label>
                      <input 
                        type="text" 
                        value={data.name} 
                        onChange={(e) => updateField('name', e.target.value)}
                        className="w-full text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 rounded-lg text-zinc-900 dark:text-zinc-100 focus:ring-rose-500 focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Idade a Celebrar</label>
                      <input 
                        type="number" 
                        value={data.age} 
                        onChange={(e) => updateField('age', Number(e.target.value))}
                        className="w-full text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 rounded-lg text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Data de Nascimento (Cálculos)</label>
                      <input 
                        type="date" 
                        value={data.birthDate} 
                        onChange={(e) => updateField('birthDate', e.target.value)}
                        className="w-full text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 rounded-lg text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Aniversário de Amizade (Contador)</label>
                      <input 
                        type="date" 
                        value={data.friendshipStartDate} 
                        onChange={(e) => updateField('friendshipStartDate', e.target.value)}
                        className="w-full text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 rounded-lg text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Frase Inicial do Spotlight</label>
                    <input 
                      type="text" 
                      value={data.heroSubtitle} 
                      onChange={(e) => updateField('heroSubtitle', e.target.value)}
                      className="w-full text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 rounded-lg text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Homenagem Rápida Secundária</label>
                    <textarea 
                      value={data.heroSecondaryText} 
                      onChange={(e) => updateField('heroSecondaryText', e.target.value)}
                      rows={3}
                      className="w-full text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 rounded-lg text-zinc-900 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Homenagem em Tempo Real (Efeito de Digitação)</label>
                    <textarea 
                      value={data.realTimeTributeText} 
                      onChange={(e) => updateField('realTimeTributeText', e.target.value)}
                      rows={4}
                      placeholder="Essa frase será mostrada simulando máquina de escrever quando a surpresa é revelada..."
                      className="w-full text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 rounded-lg text-zinc-900 dark:text-zinc-100 font-serif italic"
                    />
                  </div>

                  {/* CUSTOMIZABLE USER INTERFACE LABELS */}
                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mb-3 flex items-center gap-1.5">
                      <Sparkles size={16} className="text-yellow-500" /> Rótulos e Botões Customizados
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">Badge do Spotlight do Topo</label>
                        <input 
                          type="text" 
                          value={data.heroBadgeText || ''} 
                          placeholder="Hoje é um dia muito especial"
                          onChange={(e) => updateField('heroBadgeText', e.target.value)}
                          className="w-full text-xs border border-zinc-200 dark:border-zinc-800 p-2 rounded bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">Prefixo do Título Gigante</label>
                        <input 
                          type="text" 
                          value={data.heroTitlePrefix || ''} 
                          placeholder="Feliz Aniversário,"
                          onChange={(e) => updateField('heroTitlePrefix', e.target.value)}
                          className="w-full text-xs border border-zinc-200 dark:border-zinc-800 p-2 rounded bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">Texto do Botão Reitor</label>
                        <input 
                          type="text" 
                          value={data.heroBtnText || ''} 
                          placeholder="Abrir Surpresa"
                          onChange={(e) => updateField('heroBtnText', e.target.value)}
                          className="w-full text-xs border border-zinc-200 dark:border-zinc-800 p-2 rounded bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">Indicador ao Rolar Página</label>
                        <input 
                          type="text" 
                          value={data.heroScrollHelperText || ''} 
                          placeholder="Ver Homenagem"
                          onChange={(e) => updateField('heroScrollHelperText', e.target.value)}
                          className="w-full text-xs border border-zinc-200 dark:border-zinc-800 p-2 rounded bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-zinc-50 dark:bg-zinc-900/30 rounded-lg space-y-3 border border-zinc-150 dark:border-zinc-800">
                      <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-305 block">Tela de Bloqueio (Suspense Inicial)</span>
                      
                      <div>
                        <label className="block text-[9px] text-zinc-505 font-semibold uppercase mb-1">Título do Suspense</label>
                        <input 
                          type="text" 
                          value={data.gateLockedTitle || ''} 
                          placeholder="Surpresa Guardada com Chave de Ouro"
                          onChange={(e) => updateField('gateLockedTitle', e.target.value)}
                          className="w-full text-xs border border-zinc-200 dark:border-zinc-800 p-1.5 rounded bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] text-zinc-505 font-semibold uppercase mb-1">Roteiro de Ajuda</label>
                        <textarea 
                          value={data.gateLockedSubtitle || ''} 
                          placeholder="Toda a linha do tempo, galeria polaroid de lembranças..."
                          rows={2}
                          onChange={(e) => updateField('gateLockedSubtitle', e.target.value)}
                          className="w-full text-xs border border-zinc-200 dark:border-zinc-800 p-1.5 rounded bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] text-zinc-505 font-semibold uppercase mb-1">Texto do Botão Desbloqueio</label>
                        <input 
                          type="text" 
                          value={data.gateLockedBtn || ''} 
                          placeholder="Revelar Homenagem Agora ✨"
                          onChange={(e) => updateField('gateLockedBtn', e.target.value)}
                          className="w-full text-xs border border-zinc-200 dark:border-zinc-800 p-1.5 rounded bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">Rótulo da Máquina de Escrever</label>
                        <input 
                          type="text" 
                          value={data.realTimeTributeLabel || ''} 
                          placeholder="Homenagem em tempo real"
                          onChange={(e) => updateField('realTimeTributeLabel', e.target.value)}
                          className="w-full text-xs border border-zinc-200 dark:border-zinc-800 p-2 rounded bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">Selo da Carta Vintage</label>
                        <input 
                          type="text" 
                          value={data.finalLetterStamp || ''} 
                          placeholder="Amor Real"
                          onChange={(e) => updateField('finalLetterStamp', e.target.value)}
                          className="w-full text-xs border border-zinc-200 dark:border-zinc-800 p-2 rounded bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">Etiqueta Fitas Cassetes (Playlist)</label>
                        <input 
                          type="text" 
                          value={data.playlistLabel || ''} 
                          placeholder="Fitas cassete digitais"
                          onChange={(e) => updateField('playlistLabel', e.target.value)}
                          className="w-full text-xs border border-zinc-200 dark:border-zinc-800 p-2 rounded bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">Feito de amigo para amigo (Rodapé)</label>
                        <input 
                          type="text" 
                          value={data.footerBadgeText || ''} 
                          placeholder="Feito de amigo para amigo"
                          onChange={(e) => updateField('footerBadgeText', e.target.value)}
                          className="w-full text-xs border border-zinc-200 dark:border-zinc-800 p-2 rounded bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1">Texto Principal do Rodapé</label>
                      <textarea 
                        value={data.footerDescriptionText || ''} 
                        placeholder="Homenagem exclusiva de aniversário criada com carinho eterno..."
                        rows={2}
                        onChange={(e) => updateField('footerDescriptionText', e.target.value)}
                        className="w-full text-xs border border-zinc-200 dark:border-zinc-800 p-2 rounded bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mb-3 flex items-center gap-1.5"><Video size={16} className="text-rose-500" /> Incorporação de Vídeo</h3>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">URL de Incorporação do YouTube (Embed)</label>
                    <input 
                      type="text" 
                      value={data.videoUrl} 
                      onChange={(e) => updateField('videoUrl', e.target.value)}
                      placeholder="Ex: https://www.youtube.com/embed/XXXXXX"
                      className="w-full text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 rounded-lg text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                </div>
              )}

              {/* TAB: FOTOS POLAROID */}
              {activeTab === 'fotos' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Fotos Estilo Polaroid</h3>
                    <button
                      onClick={addNewPolaroid}
                      className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <Plus size={13} /> Nova Polaroid
                    </button>
                  </div>

                  {/* Section Title Customizers */}
                  <div className="bg-zinc-100/50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                    <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Títulos da Seção Polaroid</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-semibold mb-1">Rotulador/Pill</label>
                        <input 
                          type="text" 
                          value={data.polaroidTitlePill || ''} 
                          onChange={(e) => updateField('polaroidTitlePill', e.target.value)}
                          className="w-full text-xs p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded text-zinc-950 dark:text-zinc-50"
                          placeholder="Ex: 📸 Galeria de Sorrisos"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-semibold mb-1">Título da Seção</label>
                        <input 
                          type="text" 
                          value={data.polaroidTitle || ''} 
                          onChange={(e) => updateField('polaroidTitle', e.target.value)}
                          className="w-full text-xs p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded text-zinc-950 dark:text-zinc-50"
                          placeholder="Ex: Nossos Momentos Polaroid"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-500 font-semibold mb-1">Descrição/Subtítulo</label>
                      <textarea 
                        value={data.polaroidSubtitle || ''} 
                        onChange={(e) => updateField('polaroidSubtitle', e.target.value)}
                        rows={2}
                        className="w-full text-xs p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded text-zinc-950 dark:text-zinc-50"
                        placeholder="Ex: Algumas das nossas melhores versões..."
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-500">Envie suas próprias fotos de amizade! Elas serão salvas como URL de dados no seu navegador.</p>

                  <div className="space-y-4">
                    {data.photos.map((photo, idx) => (
                      <div key={idx} className="border border-rose-100 dark:border-zinc-800 p-3 rounded-2xl flex flex-col gap-3 bg-rose-50/20 dark:bg-zinc-900/30">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl border border-zinc-200 overflow-hidden shrink-0 relative group">
                            <img src={photo} alt="" className="w-full h-full object-cover" />
                          </div>

                          <div className="flex-grow space-y-2">
                            {/* Upload replacement button */}
                            <label className="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-700 select-none">
                              <Image size={13} /> Carregar Nova Foto
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handlePhotoUpload(e, (base64) => handlePolaroidChange(idx, base64))}
                                className="hidden" 
                              />
                            </label>
                            <input 
                              type="text" 
                              value={photo} 
                              onChange={(e) => handlePolaroidChange(idx, e.target.value)}
                              placeholder="Ou cole uma URL direta da internet"
                              className="w-full text-[11px] border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-1.5 rounded-md text-zinc-600 dark:text-zinc-400"
                            />
                          </div>

                          <button
                            onClick={() => removePolaroid(idx)}
                            className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                            title="Remover foto"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Legenda Polaroid</label>
                          <input 
                            type="text" 
                            value={data.photoCaptions[idx] || ''} 
                            onChange={(e) => handlePolaroidCaptionChange(idx, e.target.value)}
                            className="w-full text-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 rounded-lg text-zinc-950 dark:text-zinc-50"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: TIMELINE */}
              {activeTab === 'linha' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Eventos da História</h3>
                    <button
                      onClick={addTimelineEvent}
                      className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <Plus size={13} /> Adicionar Evento
                    </button>
                  </div>

                  {/* Section Title Customizers */}
                  <div className="bg-zinc-100/50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                    <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Títulos da Linha do Tempo</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-semibold mb-1">Rotulador/Pill</label>
                        <input 
                          type="text" 
                          value={data.timelineTitlePill || ''} 
                          onChange={(e) => updateField('timelineTitlePill', e.target.value)}
                          className="w-full text-xs p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded text-zinc-950 dark:text-zinc-50"
                          placeholder="Ex: ✨ Nossa Linha do Tempo"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-semibold mb-1">Título da Seção</label>
                        <input 
                          type="text" 
                          value={data.timelineTitle || ''} 
                          onChange={(e) => updateField('timelineTitle', e.target.value)}
                          className="w-full text-xs p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded text-zinc-950 dark:text-zinc-50"
                          placeholder="Ex: Como Tudo Começou"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-500 font-semibold mb-1">Descrição/Subtítulo</label>
                      <textarea 
                        value={data.timelineSubtitle || ''} 
                        onChange={(e) => updateField('timelineSubtitle', e.target.value)}
                        rows={2}
                        className="w-full text-xs p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded text-zinc-950 dark:text-zinc-50"
                        placeholder="Ex: Viaje no tempo e relembre os momentos..."
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {data.timeline.map((ev, idx) => (
                      <div key={ev.id} className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl space-y-3 bg-zinc-50/50 dark:bg-zinc-900/40 relative">
                        <button
                          onClick={() => removeTimelineEvent(ev.id)}
                          className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-red-500 transition-colors"
                          title="Remover evento"
                        >
                          <Trash2 size={16} />
                        </button>

                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-rose-500 text-white flex items-center justify-center rounded-full text-xs font-bold">{idx + 1}</span>
                          <span className="text-xs font-bold text-rose-500">Cartão de Memória</span>
                        </div>

                        {/* Event Photo picker */}
                        <div className="flex items-center gap-3">
                          <img src={ev.photoUrl} alt="" className="w-14 h-14 rounded-xl object-cover border border-zinc-200" />
                          <div className="flex-grow space-y-1.5">
                            <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg select-none">
                              <Image size={11} /> Alterar Imagem
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handlePhotoUpload(e, (base64) => handleTimelineChange(ev.id, { photoUrl: base64 }))}
                                className="hidden"
                              />
                            </label>
                            <input 
                              type="text"
                              value={ev.photoUrl}
                              onChange={(e) => handleTimelineChange(ev.id, { photoUrl: e.target.value })}
                              className="w-full text-[10px] p-1 border border-zinc-300 rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-700"
                              placeholder="Ou cole uma URL"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">Data/Estação</label>
                            <input 
                              type="text" 
                              value={ev.date} 
                              onChange={(e) => handleTimelineChange(ev.id, { date: e.target.value })}
                              className="w-full text-xs border border-zinc-300 p-2 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                              placeholder="Ex: Maio de 2019"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">Título do Evento</label>
                            <input 
                              type="text" 
                              value={ev.title} 
                              onChange={(e) => handleTimelineChange(ev.id, { title: e.target.value })}
                              className="w-full text-xs border border-zinc-300 p-2 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">História/Mensagem Completa</label>
                          <textarea 
                            value={ev.description} 
                            onChange={(e) => handleTimelineChange(ev.id, { description: e.target.value })}
                            rows={3}
                            className="w-full text-xs border border-zinc-300 p-2 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: CURIOSIDADES */}
              {activeTab === 'curiosidades' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Fatos & Curiosidades</h3>
                    <button
                      onClick={addCuriosity}
                      className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <Plus size={13} /> Adicionar Curiosidade
                    </button>
                  </div>

                  {/* Section Title Customizers */}
                  <div className="bg-zinc-100/50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                    <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Títulos da Seção de Curiosidades</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-semibold mb-1">Rotulador/Pill</label>
                        <input 
                          type="text" 
                          value={data.curiositiesTitlePill || ''} 
                          onChange={(e) => updateField('curiositiesTitlePill', e.target.value)}
                          className="w-full text-xs p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded text-zinc-950 dark:text-zinc-50"
                          placeholder="Ex: 🔍 Fatos Engraçados"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-semibold mb-1">Título da Seção</label>
                        <input 
                          type="text" 
                          value={data.curiositiesTitle || ''} 
                          onChange={(e) => updateField('curiositiesTitle', e.target.value)}
                          className="w-full text-xs p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded text-zinc-950 dark:text-zinc-50"
                          placeholder="Ex: Curiosidades Sobre Ela"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-500 font-semibold mb-1">Descrição/Subtítulo</label>
                      <textarea 
                        value={data.curiositiesSubtitle || ''} 
                        onChange={(e) => updateField('curiositiesSubtitle', e.target.value)}
                        rows={2}
                        className="w-full text-xs p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded text-zinc-950 dark:text-zinc-50"
                        placeholder="Ex: Porque conhecer e amar você rindo..."
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {data.curiosities.map((item) => (
                      <div key={item.id} className="p-3 border border-zinc-100 dark:border-zinc-800 rounded-xl space-y-2.5 relative bg-zinc-50/20 dark:bg-zinc-900/30">
                        <button
                          onClick={() => removeCuriosity(item.id)}
                          className="absolute top-2.5 right-2 text-zinc-400 hover:text-red-500 transition-colors"
                          title="Remover"
                        >
                          <Trash2 size={15} />
                        </button>

                        <div className="grid grid-cols-2 gap-3.5 pt-2">
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase">Categoria/Título</label>
                            <input 
                              type="text" 
                              value={item.label} 
                              onChange={(e) => handleCuriosityChange(item.id, { label: e.target.value })}
                              className="w-full text-xs border border-zinc-300 p-1.5 rounded-lg bg-white dark:bg-zinc-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase">Ícone</label>
                            <select
                              value={item.icon}
                              onChange={(e) => handleCuriosityChange(item.id, { icon: e.target.value })}
                              className="w-full text-xs border border-zinc-300 p-1.5 rounded-lg bg-white dark:bg-zinc-900 cursor-pointer"
                            >
                              <option value="Pizza">Aperitivos (Pizza/Sushi)</option>
                              <option value="Tv">Filmes/Séries (Tv)</option>
                              <option value="Heart">Qualidades (Coração)</option>
                              <option value="Smile">Mania Engraçada (Riso)</option>
                              <option value="Sparkles">Mágica/Sonho (Sparkles)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-zinc-500 uppercase">Descrição Opcional</label>
                          <input 
                            type="text" 
                            value={item.value} 
                            onChange={(e) => handleCuriosityChange(item.id, { value: e.target.value })}
                            className="w-full text-xs border border-zinc-300 p-2 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: ESTRELAS / SKY MESSAGES */}
              {activeTab === 'estrelas' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Lembranças do Céu</h3>
                    <button
                      onClick={addSkyStar}
                      className="px-2.5 py-1 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <Plus size={13} /> Adicionar Estrela
                    </button>
                  </div>

                  {/* Section Title Customizers for Sky */}
                  <div className="bg-zinc-100/50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                    <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Títulos do Céu de Estrelas</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-semibold mb-1">Rotulador/Pill</label>
                        <input 
                          type="text" 
                          value={data.starsTitlePill || ''} 
                          onChange={(e) => updateField('starsTitlePill', e.target.value)}
                          className="w-full text-xs p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded text-zinc-950 dark:text-zinc-50"
                          placeholder="Ex: 🌌 Céu de Recordações"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-semibold mb-1">Título da Seção</label>
                        <input 
                          type="text" 
                          value={data.starsTitle || ''} 
                          onChange={(e) => updateField('starsTitle', e.target.value)}
                          className="w-full text-xs p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded text-zinc-950 dark:text-zinc-50"
                          placeholder="Ex: Constelação de Desejos"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-500 font-semibold mb-1">Descrição/Subtítulo</label>
                      <textarea 
                        value={data.starsSubtitle || ''} 
                        onChange={(e) => updateField('starsSubtitle', e.target.value)}
                        rows={2}
                        className="w-full text-xs p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded text-zinc-950 dark:text-zinc-50"
                        placeholder="Ex: Passe o mouse ou toque..."
                      />
                    </div>
                  </div>

                  {/* Section Title Customizers for Secrets */}
                  <div className="bg-zinc-100/50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 mt-2">
                    <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Títulos do Baú de Segredos</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-semibold mb-1">Rotulador/Pill</label>
                        <input 
                          type="text" 
                          value={data.secretTitlePill || ''} 
                          onChange={(e) => updateField('secretTitlePill', e.target.value)}
                          className="w-full text-xs p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded text-zinc-950 dark:text-zinc-50"
                          placeholder="Ex: 🎁 Baú Misterioso"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-semibold mb-1">Título da Seção</label>
                        <input 
                          type="text" 
                          value={data.secretTitle || ''} 
                          onChange={(e) => updateField('secretTitle', e.target.value)}
                          className="w-full text-xs p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded text-zinc-950 dark:text-zinc-50"
                          placeholder="Ex: Mensagens Secretas"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-500 font-semibold mb-1">Descrição/Subtítulo</label>
                      <textarea 
                        value={data.secretSubtitle || ''} 
                        onChange={(e) => updateField('secretSubtitle', e.target.value)}
                        rows={2}
                        className="w-full text-xs p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded text-zinc-950 dark:text-zinc-50"
                        placeholder="Ex: Escondi pequenos bilhetes..."
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-500 mb-4">Cada estrela brilhante no painel exibe um bilhete com foto opcional ao ser clicada por ela!</p>

                  <div className="space-y-4">
                    {data.skyMessages.map((msg, idx) => (
                      <div key={msg.id} className="p-4 border border-yellow-250 dark:border-yellow-950/40 rounded-xl relative bg-yellow-50/10 dark:bg-yellow-950/5 space-y-3">
                        <div className="flex items-center justify-between border-b border-yellow-105/30 pb-2">
                          <span className="text-xs text-yellow-600 dark:text-yellow-400 font-bold flex items-center gap-1">🌟 Estrela #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => removeSkyStar(msg.id)}
                            className="p-1 text-zinc-400 hover:text-red-500 transition-colors shrink-0"
                            title="Remover estrela"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Mensagem Oculta</label>
                          <textarea
                            value={msg.text}
                            onChange={(e) => handleSkyMsgChange(msg.id, { text: e.target.value })}
                            rows={2}
                            placeholder="Mensagem revelada ao tocar na estrela..."
                            className="w-full text-xs border border-zinc-200 dark:border-zinc-805 p-1.5 rounded-lg bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Foto do Céu (Opcional)</label>
                          <div className="flex gap-3 items-center">
                            {msg.photoUrl ? (
                              <div className="w-12 h-12 rounded border border-zinc-200 dark:border-zinc-800 overflow-hidden shrink-0 bg-black relative group">
                                <img src={msg.photoUrl} alt="" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => handleSkyMsgChange(msg.id, { photoUrl: undefined })}
                                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-500 text-[10px] transition-opacity"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded border border-dashed border-zinc-300 dark:border-zinc-800 flex items-center justify-center text-zinc-400 text-xs shrink-0 bg-zinc-50 dark:bg-zinc-900">
                                🌌
                              </div>
                            )}
                            <div className="flex-grow space-y-1.5">
                              <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded transition-colors border border-zinc-200 dark:border-zinc-700 select-none">
                                <Image size={13} /> Carregar Foto
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={(e) => handlePhotoUpload(e, (base64) => handleSkyMsgChange(msg.id, { photoUrl: base64 }))}
                                  className="hidden" 
                                />
                              </label>
                              <input 
                                type="text"
                                value={msg.photoUrl || ''}
                                onChange={(e) => handleSkyMsgChange(msg.id, { photoUrl: e.target.value })}
                                placeholder="Ou cole a URL direta de uma foto"
                                className="w-full text-[10px] border border-zinc-200 dark:border-zinc-800 p-1.5 rounded bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3">
                    <button
                      type="button"
                      onClick={addSkyStar}
                      className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-zinc-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus size={14} /> Adicionar Nova Estrela
                    </button>
                  </div>

                  {/* SECRET MESSAGES */}
                  <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 mb-3 flex items-center gap-1"><Heart size={15} className="text-rose-500" /> Presentinhos Secretos</h3>
                    
                    <div className="space-y-2">
                      {data.secretMessages.map((text, idx) => (
                        <div key={idx} className="flex gap-2 items-start bg-rose-50/10 p-2.5 border border-rose-100 dark:border-rose-950/40 rounded-lg">
                          <span className="text-[11px] font-bold text-rose-500 pt-1 shrink-0">Presente {idx + 1}</span>
                          <textarea
                            value={text}
                            onChange={(e) => {
                              const nextSecrets = [...data.secretMessages];
                              nextSecrets[idx] = e.target.value;
                              updateField('secretMessages', nextSecrets);
                            }}
                            rows={2}
                            className="flex-grow text-xs border border-zinc-300 p-1.5 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PLAYLIST / MUSICAS */}
              {activeTab === 'musicas' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Sua Playlist do Core</h3>
                    <button
                      onClick={addPlaylistSong}
                      className="px-2.5 py-1 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <Plus size={13} /> Adicionar Música
                    </button>
                  </div>

                  {/* Section Title Customizers */}
                  <div className="bg-zinc-100/50 dark:bg-zinc-900/40 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3">
                    <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Títulos da Seção Trilha Sonora</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-semibold mb-1">Rotulador/Pill</label>
                        <input 
                          type="text" 
                          value={data.playlistTitlePill || ''} 
                          onChange={(e) => updateField('playlistTitlePill', e.target.value)}
                          className="w-full text-xs p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded text-zinc-950 dark:text-zinc-50"
                          placeholder="Ex: 🎵 Trilha Sonora Especial"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-500 font-semibold mb-1">Título da Seção</label>
                        <input 
                          type="text" 
                          value={data.playlistTitleText || ''} 
                          onChange={(e) => updateField('playlistTitleText', e.target.value)}
                          className="w-full text-xs p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded text-zinc-950 dark:text-zinc-50"
                          placeholder="Ex: Nossa Playlist do Core"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] text-zinc-500 font-semibold mb-1">Descrição/Subtítulo</label>
                      <textarea 
                        value={data.playlistDescription || ''} 
                        onChange={(e) => updateField('playlistDescription', e.target.value)}
                        rows={2}
                        className="w-full text-xs p-1.5 border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded text-zinc-950 dark:text-zinc-50"
                        placeholder="Ex: Músicas que embalaram nossos papos..."
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-500 leading-relaxed font-serif italic">
                    Personalize a trilha sonora do site! Você pode adicionar qualquer música do Spotify fornecendo o ID da faixa (copie o link no App do Spotify: "Compartilhar" -&gt; "Copiar link da faixa", e use o código de letras/números após "/track/").
                  </p>

                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-650 dark:text-zinc-400 mb-1">Título do Painel Musical</label>
                      <input 
                        type="text" 
                        value={data.playlistTitle || ''} 
                        onChange={(e) => updateField('playlistTitle', e.target.value)}
                        className="w-full text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 rounded-lg text-zinc-900 dark:text-zinc-100"
                        placeholder="Ex: Melodias Unidas pela Amizade"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-650 dark:text-zinc-400 mb-1">Subtítulo/Dedicatória Geral</label>
                      <textarea 
                        value={data.playlistSubtitle || ''} 
                        onChange={(e) => updateField('playlistSubtitle', e.target.value)}
                        rows={3}
                        className="w-full text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 rounded-lg text-zinc-900 dark:text-zinc-100"
                        placeholder="Escreva algo sobre por que essas músicas são especiais."
                      />
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-zinc-100 dark:border-zinc-800 pt-4">
                    <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest">Músicas Escolhidas ({ (data.playlistSongs || []).length })</h4>
                    
                    {(data.playlistSongs || []).map((song, idx) => (
                      <div key={song.id} className="border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl space-y-3 bg-zinc-50/50 dark:bg-zinc-900/40 relative">
                        <button
                          onClick={() => removePlaylistSong(song.id)}
                          className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-red-500 transition-colors"
                          title="Remover música"
                        >
                          <Trash2 size={15} />
                        </button>

                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-rose-500 text-white flex items-center justify-center rounded-full text-xs font-bold">{idx + 1}</span>
                          <span className="text-xs font-bold text-rose-500">Música</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-1">
                          <div>
                            <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">Título de Exibição</label>
                            <input 
                              type="text" 
                              value={song.title} 
                              onChange={(e) => handlePlaylistSongChange(song.id, { title: e.target.value })}
                              className="w-full text-xs border border-zinc-300 p-2 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                              placeholder="Ex: Count on Me - Bruno Mars"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">Spotify Track ID</label>
                            <input 
                              type="text" 
                              value={song.trackId} 
                              onChange={(e) => handlePlaylistSongChange(song.id, { trackId: e.target.value })}
                              className="w-full text-xs border border-zinc-300 p-2 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 font-mono"
                              placeholder="Ex: 37scS9Wv3Z3c0s69wO9G8b"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">Lembrança / Detalhes de Conexão</label>
                          <input 
                            type="text" 
                            value={song.description} 
                            onChange={(e) => handlePlaylistSongChange(song.id, { description: e.target.value })}
                            className="w-full text-xs border border-zinc-300 p-2 rounded-lg bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50"
                            placeholder="Ex: Relembra as risadas da viagem ao litoral."
                          />
                        </div>

                        {/* Miniature Preview of Spotify embed */}
                        {song.trackId && (
                          <div className="overflow-hidden rounded-lg h-[60px] border border-zinc-200 dark:border-zinc-800">
                            <iframe
                              src={`https://open.spotify.com/embed/track/${song.trackId}?utm_source=generator&theme=0`}
                              width="100%"
                              height="60"
                              frameBorder="0"
                              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: CARTA FINAL */}
              {activeTab === 'letter' && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800 pb-1.5">Carta Emocional Escrita à Mão</h3>
                  
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Título de Saudação</label>
                    <input 
                      type="text" 
                      value={data.finalLetterTitle} 
                      onChange={(e) => updateField('finalLetterTitle', e.target.value)}
                      className="w-full text-sm border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2 rounded-lg text-zinc-950 dark:text-zinc-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">Parágrafos da Carta (Um por linha)</label>
                    <textarea 
                      value={data.finalLetterBody.join('\n\n')} 
                      onChange={(e) => {
                        const paragraphs = e.target.value.split('\n\n').filter(p => p.trim() !== '');
                        updateField('finalLetterBody', paragraphs);
                      }}
                      rows={12}
                      placeholder="Separe cada parágrafo com DUAS quebras de linhas (pular linha vazia)"
                      className="w-full text-xs font-serif border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 rounded-lg text-zinc-950 dark:text-zinc-50 leading-relaxed font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 pb-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">Dedicatória / Saudação Final</label>
                      <input 
                        type="text" 
                        value={data.finalLetterSignOff || ''} 
                        onChange={(e) => updateField('finalLetterSignOff', e.target.value)}
                        className="w-full text-sm border border-zinc-300 p-2 rounded-lg bg-white dark:bg-zinc-900"
                        placeholder="Ex: Sua melhor amizade,"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-650 dark:text-zinc-400 mb-1">Assinatura Desenhada</label>
                      <input 
                        type="text" 
                        value={data.finalLetterSignature || ''} 
                        onChange={(e) => updateField('finalLetterSignature', e.target.value)}
                        className="w-full text-sm border border-zinc-300 p-2 rounded-lg bg-white dark:bg-zinc-900 font-serif italic"
                        placeholder="Ex: Com Carinho e Amor Infinito"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                    <h3 className="text-sm font-bold text-rose-500">Surpresa Final (Caixa de Presente)</h3>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 mb-1">Título da Confirmação</label>
                      <input 
                        type="text" 
                        value={data.surpriseBoxTitle} 
                        onChange={(e) => updateField('surpriseBoxTitle', e.target.value)}
                        className="w-full text-sm border border-zinc-300 p-2 rounded-lg bg-white dark:bg-zinc-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 mb-1">Grande Mensagem do Presente</label>
                      <textarea
                        value={data.surpriseBoxMessage} 
                        onChange={(e) => updateField('surpriseBoxMessage', e.target.value)}
                        className="w-full text-xs border border-zinc-300 p-2 rounded-lg bg-white dark:bg-zinc-900"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: RAW JSON COPY-PASTE */}
              {activeTab === 'raw' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-1.5">
                    <h3 className="text-sm font-bold text-zinc-950 dark:text-zinc-50">Código da Homenagem (JSON)</h3>
                    <button
                      onClick={copyJson}
                      className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      {copied ? <Check size={13} className="text-green-600" /> : <Copy size={13} />}
                      {copied ? 'Copiado!' : 'Copiar Tudo'}
                    </button>
                  </div>

                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Você pode copiar este código completo e guardá-lo como backup! Também pode colar uma versão salva anteriormente no campo abaixo para restaurar o site perfeitamente.
                  </p>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300">Área de Importação</label>
                    <textarea
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      placeholder="Cole aqui o código JSON copiado anteriormente para carregar"
                      className="w-full h-40 text-xs font-mono border border-zinc-300 bg-zinc-50 dark:bg-zinc-900 p-2 rounded-lg text-zinc-800 dark:text-zinc-200"
                    />
                    
                    {importError && (
                      <div className="text-xs text-red-500 font-semibold">{importError}</div>
                    )}

                    <button
                      onClick={handleImportJson}
                      disabled={!importText.trim()}
                      className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-950 disabled:opacity-40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <FileInput size={14} /> Importar Bloco JSON
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Panel footer controls */}
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex flex-col sm:flex-row gap-3 justify-between items-center shrink-0">
              <span className="text-[10px] text-zinc-400 font-mono">ID do App: {data.name} v1.0</span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSavePermanently}
                  disabled={isSaving}
                  className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                    saveStatus === 'success'
                      ? 'bg-green-600 text-white border-green-600'
                      : saveStatus === 'loading'
                      ? 'bg-zinc-200 text-zinc-500 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 cursor-not-allowed'
                      : 'bg-rose-500 hover:bg-rose-600 text-white border-rose-500 hover:shadow-md'
                  }`}
                  title="Salva as edições como a versão padrão do site para todas as pessoas"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw size={13} className="animate-spin" />
                      Gravando...
                    </>
                  ) : saveStatus === 'success' ? (
                    <>
                      <Check size={13} />
                      Salvo com Sucesso!
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} />
                      Salvar como Versão Final
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 sm:flex-initial px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:text-zinc-950 rounded-xl text-xs font-bold transition-all border border-transparent"
                >
                  Fechar ✕
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
