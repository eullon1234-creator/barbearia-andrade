import React, { useState, useEffect } from 'react';
import { 
  Heart, MessageCircle, Share2, Bookmark, Scissors, 
  Sparkles, CheckCircle2, ShieldCheck, Send, ExternalLink,
  ChevronRight, User
} from 'lucide-react';
import { useBarber } from '../context/BarberContext';
import { InstagramIcon } from './Icons';

export default function FeedInstagramLookbook({ onOpenBooking }) {
  const { profile, services, theme } = useBarber();

  const STORAGE_KEY_LIKES = 'barbearia_feed_likes_v1';
  const STORAGE_KEY_COMMENTS = 'barbearia_feed_comments_v1';

  // Posts do feed baseados nos cortes reais
  const initialPosts = [
    {
      id: 'post-1',
      serviceName: 'Combo Andrade (Corte + Barba)',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80',
      caption: 'Alinhamento completo no padrão Andrade: Degradê navalhado + barba desenhada com toalha quente. Sextou do melhor jeito! 💈🔥',
      initialLikes: 84,
      timeAgo: 'Hoje',
      initialComments: [
        { id: 'c-1', user: 'Marcos V.', text: 'Ficou impecável irmão! Parabéns pelo trampo.' },
        { id: 'c-2', user: 'Gabriel S.', text: 'Amanhã às 15h é a minha vez na cadeira 🔥' }
      ]
    },
    {
      id: 'post-2',
      serviceName: 'Corte Masculino / Degradê',
      image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80',
      caption: 'Fade médio bem trabalhado na régua. Precisão em cada detalhe para valorizar o formato do rosto! ✂️⚡',
      initialLikes: 112,
      timeAgo: 'Ontem',
      initialComments: [
        { id: 'c-3', user: 'Lucas R.', text: 'O melhor degradê do Povoado Cigana sem dúvidas!' }
      ]
    },
    {
      id: 'post-3',
      serviceName: 'Platinado / Luzes / Nevou',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
      caption: 'Nevou por aqui! ❄️ Platinado global com hidratação profunda e acabamento navalhado. Quem tem coragem de lançar esse estilo?',
      initialLikes: 147,
      timeAgo: 'Há 3 dias',
      initialComments: [
        { id: 'c-4', user: 'Thiago N.', text: 'Ficou muito style! No fim de ano vou lançar o meu.' },
        { id: 'c-5', user: 'Eduardo C.', text: 'Sensacional, trabalho de mestre 👏' }
      ]
    },
    {
      id: 'post-4',
      serviceName: 'Barba Alinhada / Toalha Quente',
      image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80',
      caption: 'Terapia de barba com toalha quente, óleos essenciais e massagem facial. Mais que um corte, uma experiência de relaxamento! 🧖‍♂️✨',
      initialLikes: 96,
      timeAgo: 'Há 5 dias',
      initialComments: [
        { id: 'c-6', user: 'Rafael B.', text: 'Essa toalha quente relaxa demais, recomendo muito!' }
      ]
    }
  ];

  // Estado de curtidas (id do post -> boolean)
  const [likedPosts, setLikedPosts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LIKES);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Estado de contagem de likes (id do post -> número)
  const [likeCounts, setLikeCounts] = useState(() => {
    const counts = {};
    initialPosts.forEach(p => {
      counts[p.id] = p.initialLikes;
    });
    return counts;
  });

  // Estado de comentários (id do post -> lista)
  const [commentsMap, setCommentsMap] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    const map = {};
    initialPosts.forEach(p => {
      map[p.id] = p.initialComments;
    });
    return map;
  });

  // Post com comentários abertos (accordion)
  const [openCommentsPostId, setOpenCommentsPostId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [heartAnimPostId, setHeartAnimPostId] = useState(null);

  // Salva curtidas no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LIKES, JSON.stringify(likedPosts));
    } catch (e) {}
  }, [likedPosts]);

  // Salva comentários no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(commentsMap));
    } catch (e) {}
  }, [commentsMap]);

  // Handler de Curtir
  const handleToggleLike = (postId) => {
    const isCurrentlyLiked = !!likedPosts[postId];
    setLikedPosts(prev => ({ ...prev, [postId]: !isCurrentlyLiked }));
    setLikeCounts(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) + (isCurrentlyLiked ? -1 : 1)
    }));
  };

  // Duplo clique na foto (Double-tap heart)
  const handleDoubleTap = (postId) => {
    if (!likedPosts[postId]) {
      handleToggleLike(postId);
    }
    setHeartAnimPostId(postId);
    setTimeout(() => setHeartAnimPostId(null), 850);
  };

  // Enviar novo comentário
  const handleAddComment = (postId, e) => {
    e.preventDefault();
    const text = (commentInputs[postId] || '').trim();
    if (!text) return;

    const newComment = {
      id: 'c-' + Date.now(),
      user: 'Cliente VIP',
      text
    };

    setCommentsMap(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  // Agendar este corte
  const handleBookCut = (serviceName) => {
    const foundSvc = services.find(s => s.name.toLowerCase().includes(serviceName.toLowerCase().slice(0, 10)));
    onOpenBooking(foundSvc || services[0]);
  };

  return (
    <section className="px-4 py-6" id="feed-cortes">
      <div className="space-y-4">
        
        {/* Cabeçalho Estilo Instagram */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-md">
                <img
                  src={profile.image}
                  alt={profile.owner}
                  className="w-full h-full rounded-full object-cover border-2 border-dark-950"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-dark-950" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-black text-white">{profile.owner}</h3>
                <ShieldCheck className="w-4 h-4 theme-text-accent" />
              </div>
              <p className="text-[11px] text-neutral-400">@{profile.instagram || 'saymon_andradeee'}</p>
            </div>
          </div>

          <a
            href={`https://instagram.com/${profile.instagram || 'saymon_andradeee'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-all"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>Seguir</span>
          </a>
        </div>

        {/* Título da Seção */}
        <div className="flex items-center justify-between pt-1">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
              <span>Feed de Cortes & Inspirações</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full theme-gradient-accent text-dark-950 font-black">
                FEED
              </span>
            </h2>
            <p className="text-xs text-neutral-400">Veja os trabalhos recentes e escolha o seu</p>
          </div>
        </div>

        {/* Lista de Posts do Feed */}
        <div className="space-y-4">
          {initialPosts.map((post) => {
            const isLiked = !!likedPosts[post.id];
            const currentLikes = likeCounts[post.id] || post.initialLikes;
            const comments = commentsMap[post.id] || [];
            const isCommentsOpen = openCommentsPostId === post.id;

            return (
              <div 
                key={post.id}
                className="rounded-3xl bg-dark-900 border border-dark-750 overflow-hidden shadow-xl"
              >
                {/* Header do Post */}
                <div className="p-3 px-3.5 flex items-center justify-between border-b border-dark-800/80 bg-dark-950/40">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full p-0.5 theme-gradient-accent">
                      <img
                        src={profile.image}
                        alt={profile.owner}
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-white">{profile.owner}</span>
                        <CheckCircle2 className="w-3 h-3 theme-text-accent" />
                      </div>
                      <span className="text-[10px] text-neutral-400">{profile.address ? profile.address.split(',')[0] : 'Tuntum - MA'}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-neutral-500 font-medium">
                    {post.timeAgo}
                  </span>
                </div>

                {/* Imagem do Post com Double-Tap Heart */}
                <div 
                  className="relative aspect-square w-full bg-dark-950 select-none cursor-pointer overflow-hidden group"
                  onDoubleClick={() => handleDoubleTap(post.id)}
                >
                  <img
                    src={post.image}
                    alt={post.serviceName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Coração Animado ao Dar Dois Toques */}
                  {heartAnimPostId === post.id && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 animate-in zoom-in-50 fade-in duration-200">
                      <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl animate-bounce" />
                    </div>
                  )}

                  {/* Tag do Serviço na foto */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-dark-950/80 backdrop-blur-md border border-dark-700 text-[10px] font-bold text-white flex items-center gap-1 shadow-md">
                    <Scissors className="w-3 h-3 theme-text-accent" />
                    <span>{post.serviceName}</span>
                  </div>
                </div>

                {/* Barra de Ações (Curtir, Comentar, Agendar) */}
                <div className="p-3.5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Botão Curtir */}
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center gap-1.5 text-xs font-extrabold transition-all cursor-pointer ${
                          isLiked ? 'text-rose-500' : 'text-neutral-300 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-5 h-5 transition-transform active:scale-125 ${isLiked ? 'fill-rose-500 stroke-rose-500' : ''}`} />
                        <span>{currentLikes}</span>
                      </button>

                      {/* Botão Comentários */}
                      <button
                        onClick={() => setOpenCommentsPostId(isCommentsOpen ? null : post.id)}
                        className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 hover:text-white transition-all cursor-pointer"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>{comments.length}</span>
                      </button>
                    </div>

                    {/* Botão "Quero Esse Corte" */}
                    <button
                      onClick={() => handleBookCut(post.serviceName)}
                      className="py-1.5 px-3 rounded-xl theme-gradient-accent text-dark-950 text-[11px] font-black flex items-center gap-1 shadow-sm hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <Scissors className="w-3 h-3 stroke-[3]" />
                      <span>Quero Esse Corte</span>
                    </button>
                  </div>

                  {/* Legenda do Post */}
                  <div className="text-xs text-neutral-200">
                    <span className="font-bold text-white mr-1.5">{profile.owner}</span>
                    <span className="leading-relaxed">{post.caption}</span>
                  </div>

                  {/* Comentários Expandíveis */}
                  <div className="pt-2 border-t border-dark-800 space-y-2">
                    {comments.length > 0 && (
                      <button
                        onClick={() => setOpenCommentsPostId(isCommentsOpen ? null : post.id)}
                        className="text-[11px] text-neutral-400 hover:text-white block cursor-pointer"
                      >
                        {isCommentsOpen 
                          ? 'Ocultar comentários' 
                          : `Ver todos os ${comments.length} comentários...`}
                      </button>
                    )}

                    {isCommentsOpen && (
                      <div className="space-y-1.5 pt-1 pl-1">
                        {comments.map((c) => (
                          <div key={c.id} className="text-xs flex items-start gap-1.5">
                            <span className="font-bold text-neutral-300 text-[11px]">{c.user}:</span>
                            <span className="text-neutral-300 text-[11px]">{c.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Input para Adicionar Comentário */}
                    <form 
                      onSubmit={(e) => handleAddComment(post.id, e)}
                      className="flex items-center gap-2 pt-1"
                    >
                      <input
                        type="text"
                        placeholder="Deixe seu elogio ou comentário..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        className="flex-1 p-2 rounded-xl bg-dark-850 border border-dark-700/80 text-white text-xs placeholder:text-neutral-500 focus:outline-none focus:border-amber-400/60"
                      />
                      <button
                        type="submit"
                        disabled={!(commentInputs[post.id] || '').trim()}
                        className="p-2 rounded-xl theme-gradient-accent text-dark-950 font-black disabled:opacity-40 transition-all cursor-pointer"
                        title="Enviar comentário"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
