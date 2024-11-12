import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { useDashboardStore } from '../../store';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { getAIResponse } from '../../lib/openai';
import { Message } from '../../types/chat';
import { mockFinanceData, mockSalesData, mockProductData } from '../../data/mockData';

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { selectedUnit, unitData } = useDashboardStore();

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          id: 'welcome',
          type: 'system',
          content: "Hello! I'm your AI assistant powered by OpenAI. I'm analyzing your dashboard data in real-time. How can I help you?",
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedUnit) {
      handleUnitSelection();
    }
  }, [selectedUnit]);

  const getContextData = () => ({
    selectedUnit,
    unitData,
    financeData: mockFinanceData,
    salesData: mockSalesData,
    productData: mockProductData,
    recentEvents: messages
      .slice(-5)
      .map(msg => ({
        type: msg.type,
        description: msg.content,
        timestamp: msg.timestamp.toISOString()
      }))
  });

  const handleUnitSelection = async () => {
    if (!selectedUnit) return;

    try {
      setIsLoading(true);
      const response = await getAIResponse(
        `Analyze the current state of the ${selectedUnit} unit and provide key insights.`,
        getContextData()
      );

      setMessages(prev => [...prev, {
        id: `unit-${Date.now()}`,
        type: 'system',
        content: response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      setIsLoading(true);
      const response = await getAIResponse(content, getContextData());

      setMessages(prev => [...prev, {
        id: `system-${Date.now()}`,
        type: 'system',
        content: response,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        type: 'system',
        content: "I apologize, but I encountered an error while processing your request. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <motion.button
          className="fixed bottom-4 right-4 w-12 h-12 rounded-full bg-[#4488ff] text-white flex items-center justify-center shadow-lg hover:bg-[#4488ff]/90 transition-colors z-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare size={20} />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? 'auto' : '400px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed right-4 bottom-4 w-80 bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl z-50 ${
              isMinimized ? 'h-auto' : 'h-[400px]'
            }`}
          >
            <ChatHeader
              isMinimized={isMinimized}
              isLoading={isLoading}
              onMinimize={() => setIsMinimized(!isMinimized)}
              onClose={() => setIsOpen(false)}
            />

            {!isMinimized && (
              <>
                <ChatMessages messages={messages} isLoading={isLoading} />
                <ChatInput onSend={handleSend} disabled={isLoading} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}