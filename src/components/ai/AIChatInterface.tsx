'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles,
  MessageSquare,
  TrendingUp,
  Users,
  Calendar,
  Newspaper
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  context?: Record<string, unknown> | undefined;
}

interface QuickAction {
  id: string;
  label: string;
  prompt: string;
  icon: React.ReactNode;
  category: string;
}

export function AIChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [context] = useState<Record<string, unknown> | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasInitialized = useRef(false);

  const quickActions: QuickAction[] = [
    {
      id: '1',
      label: 'Analiziraj borca',
      prompt: 'Analiziraj mi borca Jon Jones-a i njegove šanse u sledećoj borbi',
      icon: <Users className="h-4 w-4" />,
      category: 'Fighters'
    },
    {
      id: '2',
      label: 'Predvidi događaj',
      prompt: 'Predvidi rezultate UFC 300 i glavne borbe',
      icon: <Calendar className="h-4 w-4" />,
      category: 'Events'
    },
    {
      id: '3',
      label: 'MMA tehnike',
      prompt: 'Objasni mi razlike između različitih MMA tehnika i kada se koriste',
      icon: <TrendingUp className="h-4 w-4" />,
      category: 'Techniques'
    },
    {
      id: '4',
      label: 'Poslednje vesti',
      prompt: 'Sažmi mi poslednje MMA vesti i njihov značaj',
      icon: <Newspaper className="h-4 w-4" />,
      category: 'News'
    },
    {
      id: '5',
      label: 'Istorija MMA',
      prompt: 'Pričaj mi o istoriji MMA sporta i najvažnijim trenucima',
      icon: <MessageSquare className="h-4 w-4" />,
      category: 'History'
    },
    {
      id: '6',
      label: 'Treniranje',
      prompt: 'Daj mi savete za MMA trening i pripremu za borbu',
      icon: <TrendingUp className="h-4 w-4" />,
      category: 'Training'
    }
  ];

  useEffect(() => {
    // Add welcome message
    if (!hasInitialized.current) {
      addMessage('ai', 'Zdravo! Ja sam vaš AI asistent za MMA Balkan platformu. Kako mogu da vam pomognem danas?');
      hasInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (type: 'user' | 'ai', content: string, messageContext?: Record<string, unknown>) => {
    const message: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      context: messageContext
    };
    setMessages(prev => [...prev, message]);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);

    setIsLoading(true);
    try {
      // Simulate AI response (replace with actual AI service call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse = await generateAIResponse(userMessage, context);
      addMessage('ai', aiResponse);
    } catch (error) {
      console.error('Error generating AI response:', error);
      addMessage('ai', 'Izvinjavam se, došlo je do greške. Molimo pokušajte ponovo.');
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const generateAIResponse = async (_message: string, _context: Record<string, unknown> | null): Promise<string> => {
    // This would be replaced with actual AI service call
    const responses = [
      "To je odlično pitanje! Na osnovu trenutnih podataka, mogu da vam dam detaljnu analizu...",
      "Interesantno! Evo šta mislim o tome...",
      "Odličan uvid! Na osnovu moje analize...",
      "To je važna tema u MMA svetu. Evo moje perspektive...",
      "Hvala vam na pitanju! Evo detaljnog objašnjenja...",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           " (Ovo je simulirana AI odgovor - stvarna AI integracija će biti implementirana u sledećoj verziji)";
  };

  const handleQuickAction = (action: QuickAction) => {
    setInput(action.prompt);
    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('sr-RS', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const groupedActions = quickActions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = [];
    }
    acc[action.category]!.push(action);
    return acc;
  }, {} as Record<string, QuickAction[]>);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-blue-600" />
          AI MMA Asistent
        </h1>
        <p className="text-gray-600">
          Postavite pitanja o borcima, događajima, tehnikama i svemu što vas zanima u MMA svetu
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Razgovor
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea ref={scrollAreaRef} className="flex-1 px-6">
                <div className="space-y-4 pb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.type === 'ai' && (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-blue-600" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      {message.type === 'user' && (
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="bg-gray-100 rounded-lg px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-gray-600">AI razmišlja...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <div className="p-6 border-t">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Postavite pitanje o MMA..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSend} 
                    disabled={!input.trim() || isLoading}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Brze akcije</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(groupedActions).map(([category, actions]) => (
                <div key={category}>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
                  <div className="space-y-2">
                    {actions.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickAction(action)}
                        className="w-full justify-start text-left h-auto p-3"
                      >
                        <div className="flex items-center gap-2">
                          {action.icon}
                          <span className="text-sm">{action.label}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Funkcije</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Analiza boraca</Badge>
                <span className="text-xs text-gray-500">Dostupno</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Predviđanje događaja</Badge>
                <span className="text-xs text-gray-500">Dostupno</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Analiza vesti</Badge>
                <span className="text-xs text-gray-500">Dostupno</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Generisanje sadržaja</Badge>
                <span className="text-xs text-gray-500">U razvoju</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
