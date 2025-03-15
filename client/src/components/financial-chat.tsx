import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendIcon, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface Message {
  id: number;
  userId: number;
  messageId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function FinancialChat() {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Using a fixed user ID for demo purposes - in a real app this would come from authentication
  const userId = 1;

  // Fetch chat messages
  const { data: messages, isLoading } = useQuery({
    queryKey: [`/api/chat/${userId}`],
    refetchOnWindowFocus: false,
  });

  // Send message mutation
  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest('POST', '/api/chat', { message, userId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/chat/${userId}`] });
      setInput("");
      setIsTyping(false);
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message || "Could not send your message. Please try again.",
        variant: "destructive",
      });
      setIsTyping(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setIsTyping(true);
    sendMessage(input);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  // Format message content with line breaks
  const formatMessage = (content: string) => {
    return content.split('\n').map((line, i) => (
      <p key={i}>{line || <br />}</p>
    ));
  };

  return (
    <Card>
      <CardHeader className="border-b border-[#EBECF0]">
        <CardTitle className="text-base font-medium">Ask for financial advice</CardTitle>
        <CardDescription>Our AI-powered assistant can help answer your questions.</CardDescription>
      </CardHeader>
      
      <div className="h-96 flex flex-col">
        <CardContent className="flex-1 p-4 overflow-y-auto space-y-4" style={{ scrollBehavior: "smooth" }}>
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))
          ) : (
            <>
              {messages?.map((message: Message) => (
                <div 
                  key={message.messageId}
                  className={cn(
                    "flex",
                    message.role === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  <div 
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      message.role === "user" 
                        ? "bg-[#EBECF0] ml-2" 
                        : "bg-[#0052CC] text-white mr-2"
                    )}
                  >
                    {message.role === "user" ? (
                      <User className="h-4 w-4 text-gray-600" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div 
                    className={cn(
                      "rounded-lg p-3 max-w-[85%]",
                      message.role === "user" 
                        ? "bg-[#0052CC] text-white" 
                        : "bg-[#F4F5F7]"
                    )}
                  >
                    {formatMessage(message.content)}
                  </div>
                </div>
              ))}
              
              {isPending && (
                <div className="flex">
                  <div className="w-8 h-8 rounded-full bg-[#0052CC] text-white flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-[#F4F5F7] rounded-lg p-3 flex space-x-1 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={endOfMessagesRef} />
        </CardContent>
        
        <form onSubmit={handleSubmit} className="p-4 border-t border-[#EBECF0]">
          <div className="flex">
            <Input
              type="text"
              className="flex-1 border border-[#DFE1E6] rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0052CC]"
              placeholder="Type your financial question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isPending}
            />
            <Button 
              type="submit" 
              className="bg-[#0052CC] text-white px-4 py-2 rounded-r-lg hover:bg-[#0747A6] focus:outline-none focus:ring-2 focus:ring-[#0052CC] focus:ring-offset-2"
              disabled={isPending || !input.trim()}
            >
              <SendIcon className="h-5 w-5" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
}
