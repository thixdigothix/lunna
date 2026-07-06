import { BirthdayData } from './types';

// ============================================================================
// GUIA: COMO ADICIONAR MAIS FOTOS NO FUTURO SEM ERROS NO VERCEL / VITE
// ============================================================================
// MÉTODO 1 (Recomendado via Código / Build):
// 1. Coloque o arquivo de imagem na pasta: /src/assets/images/
// 2. VERIFIQUE O NOME DO ARQUIVO: Certifique-se de que o nome é exatamente igual
//    ao que você está importando (sem -1, espaços ou caracteres especiais).
//    Exemplo: se o arquivo for "foto5_praia.jpg", importe assim:
//    import foto5Praia from './assets/images/foto5_praia.jpg';
// 3. Adicione a variável (ex: foto5Praia) no array "photos" abaixo.
//
// MÉTODO 2 (Via pasta public/ - Super prático para o Vercel):
// 1. Coloque sua imagem direto na pasta: /public/ (ex: /public/minha_foto.jpg)
// 2. No código ou no painel administrativo do site, basta usar o caminho direto com barra:
//    "/minha_foto.jpg" (não precisa usar o comando 'import' aqui no topo!).
// ============================================================================

import foto1Acai from './assets/images/foto1_acai.jpg';
import foto2Santos from './assets/images/foto2_santos.jpg';
import foto3Cabeca from './assets/images/foto3_cabeca_para_baixo.jpg';
import foto4Natureza from './assets/images/foto4_natureza.jpg';
import foto5Escola from './assets/images/foto5_escola.jpg';

import timeline2022 from './assets/images/timeline_2022.jpg';
import timeline2023 from './assets/images/timeline_2023.jpg';
import timeline2024 from './assets/images/timeline_2024.png';
import timeline2025 from './assets/images/timeline_2025.png';
import timeline2026 from './assets/images/timeline_2026.png';

export const defaultBirthdayData: BirthdayData = {
  name: "Lunna",
  age: 19,
  birthDate: "2007-07-12",
  friendshipStartDate: "2022-04-13",
  heroSubtitle: "Um presente bobo de uma pessoa boba pra uma pessoa incrível.",
  heroSecondaryText: "Página criada com o objetivo de te presentear sem que você reclame",
  realTimeTributeText: "Lunna, você é de longe a pessoa mais incrível que eu tive a oportunidade de conhecer. Sou muito grato por tudo e quis fazer esse site contando um pouco da nossa história.",
  photos: [
    foto1Acai,
    foto2Santos,
    foto3Cabeca,
    foto4Natureza,
    foto5Escola
  ],
  photoCaptions: [
    "A primeira de muitas, nossa primeira foto com açaí!",
    "Talvez nossa melhor foto até hoje.",
    "Não sei, me traz uma vibe boa essa aqui.",
    "Essa é só engraçada, mas eu acho muito boa kkkkk",
    "Muitas risadas, conversas e momentos inesquecíveis!"
  ],
  timeline: [
    {
      id: "tl-1",
      date: "2022 - O Ponto de Partida",
      title: "O Início de Tudo",
      description: "O começo da nossa amizade. Quem diria que ali, entre risadas, conversas e o dia a dia, nasceria uma parceria tão incrível e inseparável?",
      photoUrl: timeline2022
    },
    {
      id: "tl-2",
      date: "2023 - Aventuras",
      title: "Parceria Inabalável",
      description: "Um ano de muita sintonia e momentos inesquecíveis. Cada rolê, cada conversa e cada risada provaram que qualquer momento simples vira uma grande festa quando estamos juntos!",
      photoUrl: timeline2023
    },
    {
      id: "tl-3",
      date: "2024 - Sempre Juntos",
      title: "Sempre Fechados",
      description: "Em todos os momentos, bons ou difíceis, o apoio sempre esteve ali sem precisar pedir. Compartilhando açaí, sorvete e as conversas mais sinceras da vida.",
      photoUrl: timeline2024
    },
    {
      id: "tl-4",
      date: "2025 - Conquistas",
      title: "Lado a Lado",
      description: "Comemorar cada vitória e cada passo na sua trajetória sempre foi tão alegre quanto comemorar as minhas próprias. Uma amizade para se orgulhar todos os dias!",
      photoUrl: timeline2025
    },
    {
      id: "tl-5",
      date: "2026 - Ano Atual",
      title: "Sintonia Contínua",
      description: "Mesmo com o passar do tempo, nossa amizade continua leve, engraçada e cheia de novas histórias. E que continuemos construindo muito mais recordes e memórias!",
      photoUrl: timeline2026
    }
  ],
  memories: [
    {
      id: "mem-1",
      title: "Madrugadas sem fim",
      description: "Aquelas conversas profundas sobre o universo às 3 da manhã regadas a deliveries suspeitos e segredos guardados a sete chaves.",
      photoUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "mem-2",
      title: "Cantar fora do tom",
      description: "Cantar pulmão adentro nossa música favorita no meio daquele show inesquecível, sem ligar para quem estava do lado.",
      photoUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "mem-3",
      title: "O café sagrado de sábado",
      description: "Nosso ritual reconfortante para fofocar, alinhar os chakras e colocar os dramas da rotina em perspectiva com muito doce envolvido.",
      photoUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600"
    }
  ],
  curiosities: [
    {
      id: "cur-1",
      label: "Total de Mensagens",
      stat: "128,9 mil",
      value: "mensagens trocadas entre nós desde seu antigo número",
      icon: "MessageSquare"
    },
    {
      id: "cur-2",
      label: "Minhas Mensagens",
      stat: "70,6 mil",
      value: "Mensagens que eu mandei",
      icon: "Send"
    },
    {
      id: "cur-3",
      label: "Mensagens Suas",
      stat: "58,3 mil",
      value: "Mensagens que tu mandou",
      icon: "MessageCircle"
    },
    {
      id: "cur-4",
      label: "Maior Streak nossa",
      stat: "153 Dias",
      value: "Mandamos mensagens de 18/12/2022 até 19/05/2023",
      icon: "PlusCircle"
    },
    {
      id: "cur-5",
      label: "Primeira mensagem",
      stat: "'oi thiagao, boa noite'",
      value: "Essa foi a primeira mensagem entre nós, e thiagão?",
      icon: "BarChart2"
    }
  ],
  secretMessages: [
    "Você é, sem sombra de dúvidas, a irmã generosa que o destino me permitiu escolher nesta vida curta.",
    "Obrigada por nunca desistir das minhas chatices e por me lembrar quem eu sou sempre que eu mesma esqueço.",
    "O planeta Terra é um lugar infinitamente mais seguro, alegre e brilhante por causa da sua existência amorosa.",
    "Mal posso esperar por todas as próximas aventuras, risadas escandalosas e planos mirabolantes que ainda vamos criar juntas!",
    "Com você ao lado, os dias cinzentos são apenas uma desculpa para comprarmos doces e fazermos piada de tudo. Te amo d+!",
    "Você tem o superpoder de transformar qualquer conversa comum em um refúgio de paz. Obrigado por ser meu porto seguro."
  ],
  playlistTracks: [
    "3XQI97bE5bL73QonmFezid", // Best friend vibe / lovely instrumental tracks or happy vibes
    "37scS9Wv3Z3c0s69wO9G8b",
    "7Ar4DJ9CHvl6zbK6eunclS"
  ],
  playlistSongs: [
    {
      id: "track-1",
      trackId: "3XQI97bE5bL73QonmFezid",
      title: "You've Got a Friend in Me",
      description: "O hino supremo da nossa lealdade."
    },
    {
      id: "track-2",
      trackId: "37scS9Wv3Z3c0s69wO9G8b",
      title: "Count on Me - Bruno Mars",
      description: "Para lembrar que estou sempre a 1, 2, 3 de distância."
    }
  ],
  playlistTitle: "Melodias Unidas pela Amizade",
  playlistSubtitle: "A música tem o dom extraordinário de guardar momentos. Sempre que ouço essas notas, lembro de algum momento feliz que passamos lado a lado.",
  skyMessages: [
    { id: "sky-1", text: "Obrigado por iluminar meus dias mais difíceis!", x: 15, y: 30, size: "md" },
    { id: "sky-2", text: "Você é uma amiga verdadeiramente rara!", x: 42, y: 15, size: "lg" },
    { id: "sky-3", text: "Lembro com carinho de cada pôr do sol compartilhado.", x: 78, y: 25, size: "md" },
    { id: "sky-4", text: "Que todos os seus maiores sonhos se tornem realidade nesta nova fase!", x: 28, y: 65, size: "lg" },
    { id: "sky-5", text: "Sempre estarei aqui por você, não importa a distância.", x: 60, y: 50, size: "sm" },
    { id: "sky-6", text: "A nossa amizade é o meu tesouro mais precioso.", x: 84, y: 70, size: "md" }
  ],
  videoUrl: "https://www.youtube.com/embed/8vKAtshbIao", // Atmospheric lo-fi / birthday instrumental track
  finalLetterTitle: "Minha Querida Amiga",
  finalLetterBody: [
    "Parece que foi ontem que a gente dividia piadas bobas no corredor, mas olhando para trás, vejo o quanto crescemos juntas. Você testemunhou minhas quedas, vibrou genuinamente com as minhas conquistas e construiu comigo um refúgio onde eu posso ser eu mesmo sem qualquer timidez ou máscara.",
    "Nesse seu dia especial, quero que você entenda, do fundo da minha alma, o quão gigante é o valor da sua amizade. Você traz poesia para a rotina cansativa, calma onde reside o caos e uma leveza que poucas pessoas no mundo têm a sorte de carregar.",
    "Desejo que esse novo ano da sua vida chegue repleto de gargalhadas espontâneas, saúde inabalável, sonhos realizados e viagens espontâneas. Estarei bem aqui, na primeira fileira, torcendo, protegendo e aplaudindo de pé cada novo passo seu.",
    "Feliz Aniversário para a melhor pessoa que eu conheço! Que você se sinta infinitamente amada hoje e sempre. ❤️"
  ],
  finalLetterSignOff: "Sua melhor amizade,",
  finalLetterSignature: "Com Carinho e Amor Infinito",
  surpriseBoxTitle: "Seu Presente Está Pronto!",
  surpriseBoxMessage: "Lunna, você é uma verdadeira joia na vida de todos que te cercam. Hoje celebramos você por inteiro! Que esta nova primavera traga o triplo da alegria que você espalha por aqui. Continue brilhando forte!",

  polaroidTitlePill: "📸 Álbum de fotos",
  polaroidTitle: "Melhores momentos",
  polaroidSubtitle: "Algumas das nossas melhores fotos de todos os tempos. Clica em qualquer foto abaixo e dá pra ampliar pra ver melhor",
  
  timelineTitlePill: "✨ Nossa Linha do Tempo",
  timelineTitle: "Como Tudo Começou",
  timelineSubtitle: "Lembre nossas primeiras fotos de cada ano!",

  secretTitlePill: "🎁 Baú Misterioso",
  secretTitle: "Mensagens Secretas",
  secretSubtitle: "Escondi pequenos bilhetes cheios de afeto para você. Toque em qualquer um dos presentes embrulhados abaixo para ler!",

  curiositiesTitlePill: "🔍 Fatos das Mensagens",
  curiositiesTitle: "Curiosidades sobre nós",
  curiositiesSubtitle: "Algumas coisas que vi em sites duvidosos e acredito ser verdade (atualizado junho 2026).",

  playlistTitlePill: "🎵 Trilha Sonora",
  playlistTitleText: "Playlist",
  playlistDescription: "Algumas poucas músicas que por diferentes razões, me lembram você.",

  starsTitlePill: "🌌 Céu de meiguices e amores",
  starsTitle: "Gêmeos e Câncer?",
  starsSubtitle: "Passe o mouse ou toque nas estrelas para revelar coisas ocultas!",

  // Default values for customizable text properties
  heroBadgeText: "PARABÉNS!!!",
  heroTitlePrefix: "Feliz Aniversário,",
  heroBtnText: "Abrir Surpresa",
  heroScrollHelperText: "Ver Homenagem",
  gateLockedTitle: "Surpresa Guardada com Chave de Ouro",
  gateLockedSubtitle: "Toda a linha do tempo, álbum de fotos, curiosidades divertidas e a trilha sonora especial estão escondidas atrás do baú.",
  gateLockedBtn: "Revelar Homenagem Agora ✨",
  realTimeTributeLabel: "Homenagem em tempo real",
  playlistLabel: "Fitas cassete digitais",
  finalLetterStamp: "Amor Real",
  finalGiftSectionTitle: "Um Último Abraço Surpresa",
  finalGiftSectionSubtitle: "Clique no presente acima para abrir seu abraço final e desencadear a constelação de confetes!",
  finalGiftOpenedSubtitle: "Obrigado por celebrar esse dia tão caloroso! Compartilhe o amor.",
  finalGiftBtnText: "🎉 Jogar Mais Confetes!",
  finalGiftCloseModalText: "Fechar Janela",
  footerBadgeText: "Feito de amigo para amigo",
  footerDescriptionText: "Homenagem exclusiva de aniversário criada com carinho eterno e felicidade. Todos os direitos de amizade reservados ©"
};
