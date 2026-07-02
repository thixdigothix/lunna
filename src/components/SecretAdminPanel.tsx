import React, { useState, useRef } from 'react';
import { 
  X, Image as ImageIcon, Calendar, MessageSquare, Music, Settings, 
  Upload, Plus, Trash2, Save, RotateCcw, Download, Eye, Sparkles, HelpCircle, Lock, Unlock, FileText
} from 'lucide-react';
import { BirthdayData, TimelineEvent, MemoryItem, CuriosityItem } from '../types';

interface SecretAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: BirthdayData;
  onUpdate: (newData: BirthdayData) => void;
  onReset: () => void;
}

export default function SecretAdminPanel({
  isOpen,
  onClose,
  data,
  onUpdate,
  onReset
}: SecretAdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'polaroids' | 'timeline' | 'texts' | 'extras' | 'settings'>('polaroids');
  const [saveNotification, setSaveNotification] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetImageField, setTargetImageField] = useState<{ type: 'polaroid' | 'timeline' | 'memory', index: number } | null>(null);

  if (!isOpen) return null;

  const handleSaveNotify = () => {
    setSaveNotification(true);
    setTimeout(() => setSaveNotification(false), 2500);
  };

  // Handle local file upload & convert to Base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetImageField) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      if (!base64Url) return;

      const newData = { ...data };
      if (targetImageField.type === 'polaroid') {
        const newPhotos = [...newData.photos];
        newPhotos[targetImageField.index] = base64Url;
        newData.photos = newPhotos;
      } else if (targetImageField.type === 'timeline') {
        const newTimeline = [...newData.timeline];
        newTimeline[targetImageField.index].photoUrl = base64Url;
        newData.timeline = newTimeline;
      } else if (targetImageField.type === 'memory') {
        const newMemories = [...newData.memories];
        newMemories[targetImageField.index].photoUrl = base64Url;
        newData.memories = newMemories;
      }

      onUpdate(newData);
      handleSaveNotify();
    };
    reader.readAsDataURL(file);
  };

  const triggerUploadFor = (type: 'polaroid' | 'timeline' | 'memory', index: number) => {
    setTargetImageField({ type, index });
    fileInputRef.current?.click();
  };

  // Export JSON
  const handleExportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `backup_homenagem_${data.name.toLowerCase()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onUpdate(parsed);
        alert('Dados importados com sucesso!');
      } catch (err) {
        alert('Erro ao ler arquivo JSON de backup.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fadeIn overflow-hidden">
      {/* Hidden File Input for Base64 Upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Modal Box */}
      <div className="bg-[#fdfbf7] dark:bg-zinc-950 border-2 border-[#c9a66b]/40 w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#f4ebd0] dark:bg-zinc-900 border-b border-[#c9a66b]/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#c9a66b]/20 text-[#8c7b6c] dark:text-[#c9a66b] border border-[#c9a66b]/30">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-zinc-900 dark:text-[#fdfbf7] tracking-wide flex items-center gap-2">
                PAINEL SECRETO DE EDIÇÃO
                <span className="text-[10px] font-mono bg-[#c9a66b] text-black px-2 py-0.5 font-semibold">ADM</span>
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Personalize fotos, textos, momentos e configurações em tempo real.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {saveNotification && (
              <span className="text-xs bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-3 py-1 font-mono flex items-center gap-1 animate-pulse">
                ✓ Salvo no navegador
              </span>
            )}
            <button
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Fechar Painel"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-[#c9a66b]/20 bg-zinc-100 dark:bg-zinc-900/60 px-4 gap-1 no-scrollbar">
          <button
            onClick={() => setActiveTab('polaroids')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold tracking-wider uppercase transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'polaroids'
                ? 'border-[#c9a66b] text-[#8c7b6c] dark:text-[#c9a66b] bg-white dark:bg-zinc-950'
                : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Fotos & Polaroids
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold tracking-wider uppercase transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'border-[#c9a66b] text-[#8c7b6c] dark:text-[#c9a66b] bg-white dark:bg-zinc-950'
                : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Linha do Tempo
          </button>

          <button
            onClick={() => setActiveTab('texts')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold tracking-wider uppercase transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'texts'
                ? 'border-[#c9a66b] text-[#8c7b6c] dark:text-[#c9a66b] bg-white dark:bg-zinc-950'
                : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Textos & Cartas
          </button>

          <button
            onClick={() => setActiveTab('extras')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold tracking-wider uppercase transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'extras'
                ? 'border-[#c9a66b] text-[#8c7b6c] dark:text-[#c9a66b] bg-white dark:bg-zinc-950'
                : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Curiosidades & Segredos
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold tracking-wider uppercase transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-[#c9a66b] text-[#8c7b6c] dark:text-[#c9a66b] bg-white dark:bg-zinc-950'
                : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            Configurações & Backup
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: POLAROIDS */}
          {activeTab === 'polaroids' && (
            <div className="space-y-6">
              <div className="bg-[#f4ebd0]/50 dark:bg-zinc-900/80 p-4 border border-[#c9a66b]/30">
                <h3 className="text-sm font-bold uppercase font-serif text-zinc-900 dark:text-[#fdfbf7] flex items-center gap-2 mb-1">
                  <Upload className="w-4 h-4 text-[#c9a66b]" />
                  Como adicionar suas fotos reais?
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  <strong>Opção 1 (Recomendada e Fácil):</strong> Clique no botão <span className="text-[#8c7b6c] dark:text-[#c9a66b] font-semibold">"Carregar do PC"</span> abaixo da foto. Ela será convertida automaticamente para o site e salva de imediato!
                  <br />
                  <strong>Opção 2 (Menu Arquivos):</strong> No painel esquerdo do AI Studio, arraste suas fotos para a pasta <code>src/assets/images/</code> e digite o caminho no campo abaixo (ex: <code>/src/assets/images/minha_foto.jpg</code>).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.photos.map((photo, index) => (
                  <div key={index} className="bg-white dark:bg-zinc-900 p-4 border border-[#c9a66b]/30 flex flex-col sm:flex-row gap-4 shadow-sm">
                    {/* Preview */}
                    <div className="w-28 h-28 shrink-0 bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 overflow-hidden flex items-center justify-center relative group">
                      {photo ? (
                        <img src={photo} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">📷</span>
                      )}
                    </div>

                    {/* Inputs */}
                    <div className="flex-1 space-y-3 flex flex-col justify-between">
                      <div>
                        <label className="text-[11px] font-bold uppercase font-mono text-[#8c7b6c] dark:text-[#c9a66b] block mb-1">
                          Polaroid #{index + 1} - URL ou Caminho
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={photo}
                            onChange={(e) => {
                              const newPhotos = [...data.photos];
                              newPhotos[index] = e.target.value;
                              onUpdate({ ...data, photos: newPhotos });
                            }}
                            placeholder="/src/assets/images/foto1.jpg ou https://..."
                            className="w-full text-xs p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#c9a66b]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold uppercase font-mono text-zinc-500 block mb-1">
                          Legenda da Foto
                        </label>
                        <input
                          type="text"
                          value={data.photoCaptions[index] || ''}
                          onChange={(e) => {
                            const newCaptions = [...data.photoCaptions];
                            newCaptions[index] = e.target.value;
                            onUpdate({ ...data, photoCaptions: newCaptions });
                          }}
                          placeholder="Digite a legenda..."
                          className="w-full text-xs p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#c9a66b]"
                        />
                      </div>

                      <div className="pt-1 flex gap-2">
                        <button
                          type="button"
                          onClick={() => triggerUploadFor('polaroid', index)}
                          className="flex-1 py-1.5 px-3 bg-[#c9a66b] hover:bg-[#b8955a] text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Carregar do PC
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="text-sm font-bold uppercase font-serif text-zinc-900 dark:text-[#fdfbf7]">
                  Momentos da Linha do Tempo ({data.timeline.length})
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    const newEvt: TimelineEvent = {
                      id: `time-${Date.now()}`,
                      date: "2024 - Novo Momento",
                      title: "Título do Momento",
                      description: "Descrição especial sobre o que aconteceu neste dia incrível...",
                      photoUrl: "/src/assets/images/foto1_acai.jpg"
                    };
                    onUpdate({ ...data, timeline: [newEvt, ...data.timeline] });
                  }}
                  className="px-4 py-2 bg-[#c9a66b] text-black font-bold text-xs uppercase flex items-center gap-1.5 hover:bg-[#b8955a]"
                >
                  <Plus className="w-4 h-4" /> Adicionar Momento
                </button>
              </div>

              <div className="space-y-4">
                {data.timeline.map((item, idx) => (
                  <div key={item.id} className="bg-white dark:bg-zinc-900 p-4 border border-[#c9a66b]/30 flex flex-col md:flex-row gap-4 relative">
                    <button
                      type="button"
                      onClick={() => {
                        const newTime = data.timeline.filter((_, i) => i !== idx);
                        onUpdate({ ...data, timeline: newTime });
                      }}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1"
                      title="Excluir momento"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="w-24 h-24 shrink-0 bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 overflow-hidden flex items-center justify-center">
                      {item.photoUrl ? (
                        <img src={item.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">📅</span>
                      )}
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 pr-6">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#8c7b6c] dark:text-[#c9a66b] block">Data / Ano / Mês</label>
                        <input
                          type="text"
                          value={item.date}
                          onChange={(e) => {
                            const newTime = [...data.timeline];
                            newTime[idx] = { ...item, date: e.target.value };
                            onUpdate({ ...data, timeline: newTime });
                          }}
                          className="w-full text-xs p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold uppercase text-[#8c7b6c] dark:text-[#c9a66b] block">Título do Evento</label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const newTime = [...data.timeline];
                            newTime[idx] = { ...item, title: e.target.value };
                            onUpdate({ ...data, timeline: newTime });
                          }}
                          className="w-full text-xs p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 mt-1"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold uppercase text-[#8c7b6c] dark:text-[#c9a66b] block">Descrição</label>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => {
                            const newTime = [...data.timeline];
                            newTime[idx] = { ...item, description: e.target.value };
                            onUpdate({ ...data, timeline: newTime });
                          }}
                          className="w-full text-xs p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 mt-1"
                        />
                      </div>

                      <div className="md:col-span-2 flex items-center gap-2">
                        <input
                          type="text"
                          value={item.photoUrl}
                          onChange={(e) => {
                            const newTime = [...data.timeline];
                            newTime[idx] = { ...item, photoUrl: e.target.value };
                            onUpdate({ ...data, timeline: newTime });
                          }}
                          placeholder="/src/assets/images/...jpg"
                          className="flex-1 text-xs p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                        />
                        <button
                          type="button"
                          onClick={() => triggerUploadFor('timeline', idx)}
                          className="px-3 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-[#c9a66b] hover:text-black text-xs font-bold flex items-center gap-1 transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" /> Upload Foto
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: TEXTS */}
          {activeTab === 'texts' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900 p-5 border border-[#c9a66b]/30 space-y-4">
                <h3 className="text-sm font-bold uppercase font-serif text-[#8c7b6c] dark:text-[#c9a66b]">
                  Textos da Página Inicial (Hero & Máquina de Escrever)
                </h3>
                
                <div>
                  <label className="text-xs font-bold uppercase block mb-1">Título / Subtítulo Hero</label>
                  <input
                    type="text"
                    value={data.heroSubtitle}
                    onChange={(e) => onUpdate({ ...data, heroSubtitle: e.target.value })}
                    className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase block mb-1">Texto Secundário Hero</label>
                  <input
                    type="text"
                    value={data.heroSecondaryText}
                    onChange={(e) => onUpdate({ ...data, heroSecondaryText: e.target.value })}
                    className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase block mb-1">Homenagem Em Tempo Real (Efeito Máquina de Escrever)</label>
                  <textarea
                    rows={3}
                    value={data.realTimeTributeText}
                    onChange={(e) => onUpdate({ ...data, realTimeTributeText: e.target.value })}
                    className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 leading-relaxed"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-5 border border-[#c9a66b]/30 space-y-4">
                <h3 className="text-sm font-bold uppercase font-serif text-[#8c7b6c] dark:text-[#c9a66b]">
                  Carta Final ao Abrir o Presente
                </h3>

                <div>
                  <label className="text-xs font-bold uppercase block mb-1">Título da Carta</label>
                  <input
                    type="text"
                    value={data.finalLetterTitle}
                    onChange={(e) => onUpdate({ ...data, finalLetterTitle: e.target.value })}
                    className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase block mb-1">
                    Parágrafos da Carta (Um parágrafo por linha)
                  </label>
                  <textarea
                    rows={6}
                    value={data.finalLetterBody.join('\n\n')}
                    onChange={(e) => {
                      const paragraphs = e.target.value.split('\n\n').filter(Boolean);
                      onUpdate({ ...data, finalLetterBody: paragraphs });
                    }}
                    className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 leading-relaxed"
                    placeholder="Separe os parágrafos com duas quebras de linha..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">Despedida (Ex: Com Carinho,)</label>
                    <input
                      type="text"
                      value={data.finalLetterSignOff}
                      onChange={(e) => onUpdate({ ...data, finalLetterSignOff: e.target.value })}
                      className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">Assinatura</label>
                    <input
                      type="text"
                      value={data.finalLetterSignature}
                      onChange={(e) => onUpdate({ ...data, finalLetterSignature: e.target.value })}
                      className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXTRAS */}
          {activeTab === 'extras' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900 p-5 border border-[#c9a66b]/30 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase font-serif text-[#8c7b6c] dark:text-[#c9a66b]">
                    Curiosidades & Fatos ({data.curiosities.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newCur: CuriosityItem = {
                        id: `cur-${Date.now()}`,
                        label: "Nova Curiosidade",
                        value: "Mais de 1000 horas",
                        icon: "Sparkles"
                      };
                      onUpdate({ ...data, curiosities: [...data.curiosities, newCur] });
                    }}
                    className="px-3 py-1 bg-[#c9a66b] text-black text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.curiosities.map((item, idx) => (
                    <div key={item.id} className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex gap-3 items-center relative">
                      <button
                        type="button"
                        onClick={() => {
                          const newCur = data.curiosities.filter((_, i) => i !== idx);
                          onUpdate({ ...data, curiosities: newCur });
                        }}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex-1 space-y-1">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const newCur = [...data.curiosities];
                            newCur[idx] = { ...item, label: e.target.value };
                            onUpdate({ ...data, curiosities: newCur });
                          }}
                          className="w-full text-[11px] font-bold p-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800"
                          placeholder="Título..."
                        />
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => {
                            const newCur = [...data.curiosities];
                            newCur[idx] = { ...item, value: e.target.value };
                            onUpdate({ ...data, curiosities: newCur });
                          }}
                          className="w-full text-xs p-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800"
                          placeholder="Valor..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 p-5 border border-[#c9a66b]/30 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold uppercase font-serif text-[#8c7b6c] dark:text-[#c9a66b]">
                    Segredos Interativos ({data.secretMessages.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdate({ ...data, secretMessages: [...data.secretMessages, "Novo segredo especial..."] });
                    }}
                    className="px-3 py-1 bg-[#c9a66b] text-black text-xs font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Adicionar
                  </button>
                </div>

                <div className="space-y-2">
                  {data.secretMessages.map((msg, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={msg}
                        onChange={(e) => {
                          const newSec = [...data.secretMessages];
                          newSec[idx] = e.target.value;
                          onUpdate({ ...data, secretMessages: newSec });
                        }}
                        className="flex-1 text-xs p-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newSec = data.secretMessages.filter((_, i) => i !== idx);
                          onUpdate({ ...data, secretMessages: newSec });
                        }}
                        className="p-2 text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900 p-5 border border-[#c9a66b]/30 space-y-4">
                <h3 className="text-sm font-bold uppercase font-serif text-[#8c7b6c] dark:text-[#c9a66b]">
                  Configurações Principais do Homenageado
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">Nome</label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={(e) => onUpdate({ ...data, name: e.target.value })}
                      className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 font-bold text-base text-[#c9a66b]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">Idade</label>
                    <input
                      type="number"
                      value={data.age}
                      onChange={(e) => onUpdate({ ...data, age: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">Data do Aniversário (YYYY-MM-DD)</label>
                    <input
                      type="date"
                      value={data.birthDate}
                      onChange={(e) => onUpdate({ ...data, birthDate: e.target.value })}
                      className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase block mb-1">Início da Amizade (YYYY-MM-DD)</label>
                    <input
                      type="date"
                      value={data.friendshipStartDate}
                      onChange={(e) => onUpdate({ ...data, friendshipStartDate: e.target.value })}
                      className="w-full text-xs p-2.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#f4ebd0]/40 dark:bg-zinc-900/50 p-5 border border-[#c9a66b]/30 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h4 className="text-sm font-bold uppercase text-zinc-900 dark:text-[#fdfbf7] flex items-center gap-2">
                    <Download className="w-4 h-4 text-[#c9a66b]" /> Backup / Exportar Dados
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                    Baixe o arquivo JSON com todas as suas fotos e textos para salvar para sempre ou transferir para outro PC.
                  </p>
                </div>
                <div className="flex gap-3">
                  <label className="px-4 py-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-xs font-bold uppercase cursor-pointer transition-colors flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Importar Backup
                    <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="px-4 py-2 bg-[#c9a66b] hover:bg-[#b8955a] text-black text-xs font-bold uppercase transition-colors flex items-center gap-1.5 shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" /> Baixar JSON
                  </button>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 p-5 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold uppercase text-red-600 dark:text-red-400">Restaurar Padrões</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Cuidado: Isso apagará suas modificações e voltará ao modelo inicial.</p>
                </div>
                <button
                  type="button"
                  onClick={onReset}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Resetar Tudo
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#f4ebd0] dark:bg-zinc-900 border-t border-[#c9a66b]/30 flex justify-between items-center">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
            💡 Dica: Todas as alterações são salvas automaticamente em tempo real no seu navegador!
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#c9a66b] hover:bg-[#b8955a] text-black font-bold font-serif uppercase tracking-wider text-xs shadow-md transition-transform hover:scale-105"
          >
            CONCLUIR E VER SITE
          </button>
        </div>

      </div>
    </div>
  );
}
