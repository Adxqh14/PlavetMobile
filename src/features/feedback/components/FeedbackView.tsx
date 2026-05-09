import { useState, useEffect } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import {
  MessageSquare,
  Search,
  TrendingUp,
  Clock,
  AlertCircle,
  Lightbulb,
} from "lucide-react";
import { FeedbackCard } from "./FeedbackCard";
import { FeedbackForm } from "./FeedbackForm";
import { ReplyModal } from "./ReplyModal";

export function FeedbackView() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<{
    id: string;
    title: string;
    description: string;
    category: string;
    author: string;
    date: Date;
    status: string;
    votes: number;
    replies: Array<{
      id: string;
      author: string;
      message: string;
      date: Date;
    }>;
  } | null>(null);

  const [feedbacks, setFeedbacks] = useState<Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    author: string;
    date: Date;
    status: string;
    votes: number;
    replies: Array<{
      id: string;
      author: string;
      message: string;
      date: Date;
    }>;
    userVote?: 'up' | 'down';
    upvotes?: number;
    downvotes?: number;
  }>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('plavet_feedbacks');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return parsed.map((f: any) => ({
            ...f,
            date: new Date(f.date),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            replies: f.replies.map((r: any) => ({ ...r, date: new Date(r.date) }))
          }));
        } catch (e) {
          console.error('Error loading feedbacks from local storage', e);
        }
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('plavet_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  const categories = [
    { value: 'all', label: 'Todas', icon: MessageSquare },
    { value: 'mejora', label: 'Mejoras', icon: TrendingUp },
    { value: 'error', label: 'Errores', icon: AlertCircle },
    { value: 'sugerencia', label: 'Sugerencias', icon: Lightbulb },
  ];

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesCategory = selectedCategory === 'all' || feedback.category === selectedCategory;
    const matchesSearch = feedback.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleVote = (feedbackId: string, voteType: 'up' | 'down') => {
    setFeedbacks(prev => prev.map(feedback => {
      if (feedback.id !== feedbackId) return feedback;
      
      let newUpvotes = feedback.upvotes !== undefined ? feedback.upvotes : feedback.votes;
      let newDownvotes = feedback.downvotes || 0;
      let newUserVote: 'up' | 'down' | undefined = voteType;

      if (feedback.userVote === voteType) {
        if (voteType === 'up') newUpvotes--;
        if (voteType === 'down') newDownvotes--;
        newUserVote = undefined;
      } else {
        if (voteType === 'up') {
          newUpvotes++;
          if (feedback.userVote === 'down') newDownvotes--;
        } else {
          newDownvotes++;
          if (feedback.userVote === 'up') newUpvotes--;
        }
      }

      return {
        ...feedback,
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        votes: newUpvotes - newDownvotes,
        userVote: newUserVote
      };
    }));
  };

  const handleReply = (feedbackId: string) => {
    const feedback = feedbacks.find(f => f.id === feedbackId);
    if (feedback) {
      setSelectedFeedback(feedback);
    }
  };

  const handleDelete = (feedbackId: string) => {
    setFeedbacks(prev => prev.filter(f => f.id !== feedbackId));
  };

  const handleSubmitReply = (feedbackId: string, replyMessage: string) => {
    const newReply = {
      id: Date.now().toString(),
      author: 'Usuario Anónimo',
      message: replyMessage,
      date: new Date()
    };

    setFeedbacks(prev => prev.map(feedback => 
      feedback.id === feedbackId 
        ? { ...feedback, replies: [...feedback.replies, newReply] }
        : feedback
    ));
  };

  return (
    <>
      {/* ======== SECCIÓN DE BÚSQUEDA Y FILTROS ======== */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            
            {/* Barra de búsqueda con icono de lupa */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar feedback..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              />
            </div>
            
            {/* Botones de filtro por categoría */}
            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background hover:bg-muted'
                  }`}
                >
                  <category.icon className="h-4 w-4" />
                  <span className="text-sm">{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======== SECCIÓN: LISTA DE FEEDBACKS ======== */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {/* Encabezado con contador y última actualización */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              Feedback Reciente ({filteredFeedbacks.length})
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Última actualización: hace 2 horas</span>
            </div>
          </div>

          {/* Lista de tarjetas de feedback */}
          <div className="space-y-6">
            {filteredFeedbacks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No se encontró feedback</h3>
                  <p className="text-muted-foreground text-center">
                    No hay feedback que coincida con tu búsqueda. Intenta con otros filtros.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredFeedbacks.map(feedback => (
                <FeedbackCard
                  key={feedback.id}
                  feedback={feedback}
                  categories={categories}
                  onVote={handleVote}
                  onReply={handleReply}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ======== SECCIÓN: FORMULARIO PARA ENVIAR NUEVO FEEDBACK ======== */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Comparte tu <span className="text-primary">feedback</span>
              </h2>
              <p className="text-lg">
                Ayúdanos a mejorar compartiendo tu experiencia y sugerencias
              </p>
            </div>

            <FeedbackForm 
              onSubmit={(feedback) => {
                console.log('New feedback:', feedback);

                const newFeedback = {
                  ...feedback,
                  id: Date.now().toString(),
                  author: feedback.name || 'Usuario Anónimo',
                  date: new Date(),
                  status: 'en-revisión' as const,
                  votes: 1,
                  upvotes: 1,
                  downvotes: 0,
                  replies: [],
                  category: feedback.type
                };

                setFeedbacks(prev => [newFeedback, ...prev]);
              }}
            />
          </div>
        </div>
      </section>

      {/* ======== MODAL DE RESPUESTA ======== */}
      <ReplyModal
        feedback={selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
        onSubmit={handleSubmitReply}
      />
    </>
  );
}
