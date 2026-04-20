import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  X, 
  Maximize2, 
  Minimize2,
  Copy,
  Check,
  Wand2,
  FileText,
  MessageSquare,
  BarChart2,
  Calendar
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    try {
      // In APK builds without .env, process might be undefined or GEMINI_API_KEY missing
      const key = typeof process !== 'undefined' && process.env ? process.env.GEMINI_API_KEY : '';
      if (!key) {
        throw new Error("Clé API manquante");
      }
      aiInstance = new GoogleGenAI({ apiKey: key });
    } catch (e) {
      console.warn("L'IA n'a pas pu être initialisée. Clé API probablement manquante dans l'APK.");
      return null;
    }
  }
  return aiInstance;
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const AdminAssistant: React.FC = () => {
  // Detect if running inside a Capacitor/APK environment
  const isMobileApp = typeof window !== 'undefined' && (window as any).Capacitor;

  // If in APK, do not render the assistant at all
  if (isMobileApp) return null;

  const { 
    members, 
    announcements, 
    activities, 
    prayers, 
    testimonies,
    contributionRecords,
    contributionCategories
  } = useAppData();

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Bonjour ! Je suis votre assistant intelligent CBE Mpaka. Comment puis-je vous aider aujourd'hui ? Je peux vous aider à rédiger des annonces, analyser vos données de membres ou résumer des témoignages.",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [proposedAction, setProposedAction] = useState<any | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  
  const { addWeeklyTheme, addDailyVerse } = useAppData();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleOpenAssistant = (e: any) => {
      setIsOpen(true);
      setIsMinimized(false);
      if (e.detail?.prompt) {
        setInput(e.detail.prompt);
      }
    };

    window.addEventListener('open-assistant', handleOpenAssistant);
    return () => window.removeEventListener('open-assistant', handleOpenAssistant);
  }, []);

  const handleApplyAction = async () => {
    if (!proposedAction || isApplying) return;
    setIsApplying(true);

    try {
      if (proposedAction.type === 'program_weekly') {
        const themeId = await addWeeklyTheme(proposedAction.theme);
        if (themeId) {
          for (const verse of proposedAction.verses) {
            await addDailyVerse({ ...verse, themeId });
          }
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: "✅ La programmation du thème et des versets a été effectuée avec succès !",
            timestamp: new Date()
          }]);
        }
      }
      setProposedAction(null);
    } catch (error) {
      console.error("Error applying action:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "❌ Une erreur est survenue lors de la programmation. Veuillez vérifier les logs.",
        timestamp: new Date()
      }]);
    } finally {
      setIsApplying(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setProposedAction(null);

    try {
      // Prepare context for Gemini
      const today = new Date();
      const nextMonday = new Date();
      nextMonday.setDate(today.getDate() + ((7 - today.getDay()) % 7 + 1));
      
      const context = `
        Tu es l'assistant intelligent de l'administration de la Sous-section CBE Mpaka (Communauté Biblique Évangélique).
        Aujourd'hui nous sommes le : ${today.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.
        
        Voici les données actuelles de l'application pour t'aider à répondre :
        - Nombre de membres : ${members.length}
        - Annonces récentes : ${announcements.slice(0, 3).map(a => a.title).join(', ')}
        - Activités à venir : ${activities.slice(0, 3).map(a => a.title).join(', ')}
        - Témoignages en attente : ${testimonies.filter(t => t.status === 'pending').length}
        - Total des contributions : ${contributionRecords.reduce((sum, r) => sum + (Number(r.amount) || 0), 0)} FCFA
        
        CAPACITÉS SPÉCIALES :
        Tu peux aider l'administrateur à PROGRAMMER le thème de la semaine et les 7 versets quotidiens associés.
        Si l'administrateur te demande de "programmer" ou "préparer" la semaine prochaine (qui commence le lundi ${nextMonday.toLocaleDateString('fr-FR')}), propose un contenu spirituel cohérent.
        
        FORMAT DE RÉPONSE POUR LA PROGRAMMATION :
        Si tu proposes une programmation, termine TOUJOURS ta réponse par un bloc JSON valide entouré de balises \`\`\`json comme ceci :
        \`\`\`json
        {
          "type": "program_weekly",
          "theme": {
            "title": "Titre du thème",
            "reference": "Référence biblique",
            "text": "Texte principal",
            "description": "Brève exhortation pour la semaine",
            "startDate": "YYYY-MM-DD",
            "endDate": "YYYY-MM-DD"
          },
          "verses": [
            { "date": "YYYY-MM-DD", "reference": "Réf", "text": "Texte", "exhortation": "Bref mot" },
            ... (exactement 7 versets, un pour chaque jour du lundi au dimanche)
          ]
        }
        \`\`\`
        
        RÈGLE CRUCIALE : Tu n'as pas le droit de programmer sans l'ordre explicite de l'administrateur. 
        Si on te demande juste une idée, ne mets pas le bloc JSON. Mets-le seulement si on te demande de "programmer" ou si tu proposes de le faire et que l'admin accepte.
        
        Réponds de manière professionnelle, encourageante et concise en français.
      `;

      const ai = getAI();
      if (!ai) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "⚠️ **Erreur de Configuration AI** : L'assistant Google Gemini ne peut pas fonctionner en version APK car la clé API (GEMINI_API_KEY) n'est pas présente dans l'application compilée. Cette mesure de sécurité empêche le piratage de votre clé. Vous devez utiliser la version Web hébergée pour profiter de l'IA.",
          timestamp: new Date()
        }]);
        setIsLoading(false);
        return;
      }

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          { role: 'user', parts: [{ text: context }] },
          ...messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          })),
          { role: 'user', parts: [{ text: input }] }
        ]
      });

      const text = response.text || "Désolé, je n'ai pas pu générer de réponse.";
      
      // Check for JSON action
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
      let cleanText = text;
      if (jsonMatch) {
        try {
          const action = JSON.parse(jsonMatch[1]);
          setProposedAction(action);
          cleanText = text.replace(jsonMatch[0], '').trim();
        } catch (e) {
          console.error("Failed to parse AI action JSON", e);
        }
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: cleanText || "J'ai préparé la programmation pour vous.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Désolé, une erreur est survenue lors de la communication avec mon intelligence. Veuillez réessayer.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const quickActions = [
    { label: "Programmer la semaine", icon: <Calendar size={14} />, prompt: "Aide-moi à programmer le thème et les versets pour la semaine prochaine." },
    { label: "Rédiger une annonce", icon: <FileText size={14} />, prompt: "Aide-moi à rédiger une annonce pour un culte spécial dimanche prochain." },
    { label: "Analyse des membres", icon: <BarChart2 size={14} />, prompt: "Fais-moi une brève analyse de la croissance de nos membres." },
  ];

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#1E3A8A] text-white rounded-full shadow-2xl flex items-center justify-center z-40 active:scale-95 transition-all hover:bg-blue-700 group"
      >
        <Bot size={28} className="group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></div>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-24 right-6 z-50 transition-all duration-300 flex flex-col ${isMinimized ? 'h-14 w-64' : 'h-[500px] w-[350px] sm:w-[400px]'}`}>
      {/* Header */}
      <div className="bg-[#1E3A8A] text-white p-4 rounded-t-2xl flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <span className="font-bold text-sm">Assistant Intelligent</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/10 rounded transition-colors">
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div className="flex-1 bg-white dark:bg-slate-800 border-x border-slate-200 dark:border-slate-700 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm relative group ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}>
                  <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px]">
                    {msg.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                    <span>{msg.role === 'user' ? 'Vous' : 'Assistant'}</span>
                  </div>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  
                  {msg.role === 'assistant' && (
                    <button 
                      onClick={() => copyToClipboard(msg.content, idx)}
                      className="absolute top-2 right-2 p-1 bg-white/50 dark:bg-slate-600/50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copier le texte"
                    >
                      {copiedIndex === idx ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 dark:bg-slate-700 rounded-2xl rounded-tl-none p-3 flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-blue-600" />
                  <span className="text-xs text-slate-500">Réflexion en cours...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Proposed Action Card */}
          {proposedAction && (
            <div className="mx-4 mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl shadow-sm animate-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
                <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300">Action proposée par l'IA</h4>
              </div>
              
              {proposedAction.type === 'program_weekly' && (
                <div className="space-y-2 mb-4">
                  <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Thème : {proposedAction.theme.title}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                    {proposedAction.theme.reference}
                  </div>
                  <div className="text-[10px] bg-white/50 dark:bg-slate-800/50 p-2 rounded-lg border border-blue-100 dark:border-blue-900/50">
                    {proposedAction.verses.length} versets quotidiens seront programmés du {new Date(proposedAction.theme.startDate).toLocaleDateString('fr-FR')} au {new Date(proposedAction.theme.endDate).toLocaleDateString('fr-FR')}.
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button 
                  onClick={handleApplyAction}
                  disabled={isApplying}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all"
                >
                  {isApplying ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                  Appliquer la programmation
                </button>
                <button 
                  onClick={() => setProposedAction(null)}
                  disabled={isApplying}
                  className="px-3 bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold active:scale-95 transition-all"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 border-x border-slate-200 dark:border-slate-700 p-2 flex gap-2 overflow-x-auto scrollbar-hide">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => setInput(action.prompt)}
                className="whitespace-nowrap flex items-center gap-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-[10px] font-medium text-slate-600 dark:text-slate-400 hover:border-blue-500 transition-colors"
              >
                {action.icon}
                {action.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-b-2xl border-x border-b border-slate-200 dark:border-slate-700">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Posez votre question..."
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm outline-none focus:border-blue-500 dark:text-white transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center disabled:opacity-50 active:scale-95 transition-all"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[9px] text-center text-slate-400 mt-2">
              L'IA peut faire des erreurs. Gardez toujours le contrôle final.
            </p>
          </div>
        </>
      )}
    </div>
  );
};
