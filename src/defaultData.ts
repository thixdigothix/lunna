import { BirthdayData } from './types';
import foto1Acai from './assets/images/foto1_acai.jpg';
import foto2Santos from './assets/images/foto2_santos.jpg';
import foto3Cabeca from './assets/images/foto3_cabeca_para_baixo.jpg';
import foto4Natureza from './assets/images/foto4_natureza.jpg';

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
    foto4Natureza
  ],
  photoCaptions: [
    "A primeira de muitas, nossa primeira foto com açaí!",
    "Talvez nossa melhor foto até hoje.",
    "Não sei, me traz uma vibe boa essa aqui.",
    "Essa é só engraçada, mas eu acho muito boa kkkkk"
  ],
  timeline: [
    {
      id: "tl-1",
      date: "Faculdade, Fevereiro de 2018",
      title: "O Ponto de Partida",
      description: "Nos conhecemos naquele corredor lotado de materiais por conta de um livro de cálculo emprestado. Quem diria que ali, entre risadas tímidas e ansiedade de calouros, nasceria uma amizade eterna e inseparável?",
      photoUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "tl-2",
      date: "Verão de 2020",
      title: "Primeira Viagem de Aventuras",
      description: "Aquela ida impulsiva para o litoral norte. O carro antigo que resolveu dar problema na subida da serra, o pneu furado sob a chuva... e nós no acostamento tirando fotos e rindo alto. A prova definitiva de que qualquer tormenta vira festa com você!",
      photoUrl: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "tl-3",
      date: "Novembro de 2022",
      title: "Apoio Inabalável",
      description: "No momento mais cinza do meu ano, quando tudo parecia desmoronar, você apareceu sem avisar. Trouxe um pote gigante de sorvete de pistache, o abraço mais apertado do mundo e me fez ver que tudo aquilo passaria. Guardado no peito.",
      photoUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: "tl-4",
      date: "Maio de 2025",
      title: "Conquistas de Mãos Dadas",
      description: "Ver você subir naquele palco para receber o seu diploma foi um dos momentos em que meu peito mais explodiu de orgulho. Comemorar cada vitória e passo na sua carreira sempre foi e sempre será tão alegre quanto comemorar as minhas próprias.",
      photoUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600"
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
      label: "Comida Favorita",
      value: "Sushi caprichado e hambúrguer artesanal às sextas-feiras.",
      icon: "Pizza"
    },
    {
      id: "cur-2",
      label: "Série do Coração",
      value: "Friends e Gilmore Girls (assiste em loop infinito).",
      icon: "Tv"
    },
    {
      id: "cur-3",
      label: "Melhor Qualidade",
      value: "Lealdade feroz e uma empatia rara capaz de curar corações.",
      icon: "Heart"
    },
    {
      id: "cur-4",
      label: "Mania Engraçada",
      value: "Dar uma dancinha de vitória inexplicável quando come algo incrível.",
      icon: "Smile"
    },
    {
      id: "cur-5",
      label: "Símbolo dos Sonhos",
      value: "Viajar o mundo inteiro munida de uma boa câmera e rindo alto.",
      icon: "Sparkles"
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

  polaroidTitlePill: "📸 Galeria de Sorrisos",
  polaroidTitle: "Nossos Momentos Polaroid",
  polaroidSubtitle: "Algumas das nossas melhores versões congeladas no tempo. Clique em qualquer foto abaixo para ampliar em tela cheia com legenda!",
  
  timelineTitlePill: "✨ Nossa Linha do Tempo",
  timelineTitle: "Como Tudo Começou",
  timelineSubtitle: "Viaje no tempo e relembre os momentos mais marcantes que moldaram a nossa amizade ao longo de todos estes anos. Cada data guarda um segredo precioso!",

  secretTitlePill: "🎁 Baú Misterioso",
  secretTitle: "Mensagens Secretas",
  secretSubtitle: "Escondi pequenos bilhetes cheios de afeto para você. Toque em qualquer um dos presentes embrulhados abaixo para ler!",

  curiositiesTitlePill: "🔍 Fatos Engraçados",
  curiositiesTitle: "Curiosidades Sobre Ela",
  curiositiesSubtitle: "Porque conhecer e amar você rindo dessas pequenas manias e características incríveis!",

  playlistTitlePill: "🎵 Trilha Sonora Especial",
  playlistTitleText: "Nossa Playlist do Core",
  playlistDescription: "Músicas que embalaram nossos papos, viagens de carro ou que me fazem lembrar do seu abraço instantaneamente.",

  starsTitlePill: "🌌 Céu de Recordações",
  starsTitle: "Constelação de Desejos",
  starsSubtitle: "Passe o mouse ou toque nas estrelas cintilantes do céu noturno para revelar votos de felicidade ocultos!",

  // Default values for customizable text properties
  heroBadgeText: "PARABÉNS!!!",
  heroTitlePrefix: "Feliz Aniversário,",
  heroBtnText: "Abrir Surpresa",
  heroScrollHelperText: "Ver Homenagem",
  gateLockedTitle: "Surpresa Guardada com Chave de Ouro",
  gateLockedSubtitle: "Toda a linha do tempo, galeria polaroid de lembranças, curiosidades divertidas e a trilha sonora especial estão escondidas atrás do baú.",
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
