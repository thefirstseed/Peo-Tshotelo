import React, { useState, useEffect, useRef } from 'react';
import { useParams, navigate } from '../router';
import { useAuth } from '../hooks/useAuth';
import { useInbox } from '../hooks/useInbox';
import { fetchMessages, sendMessage, fetchConversation } from '../api/api';
import { Message, Conversation } from '../types';
import { ArrowLeft, Send, Tag } from 'lucide-react';

const MessageBubble: React.FC<{ message: Message; isMe: boolean; }> = ({ message, isMe }) => {
    const bubbleClasses = isMe
        ? "bg-primary-500 text-white self-end"
        : "bg-neutral-200 text-neutral-800 self-start";
    
    return (
        <div className={`max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl ${bubbleClasses}`}>
            <p className="text-sm leading-relaxed">{message.text}</p>
        </div>
    );
};

export const ConversationPage: React.FC = () => {
    const { id: conversationId } = useParams();
    const { user } = useAuth();
    const { markConversationAsRead } = useInbox();
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversation, setConversation] = useState<Conversation | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (conversationId) {
            markConversationAsRead(conversationId);
            setIsLoading(true);
            Promise.all([
                fetchMessages(conversationId),
                fetchConversation(conversationId)
            ]).then(([msgs, convo]) => {
                setMessages(msgs);
                setConversation(convo || null);
            }).finally(() => setIsLoading(false));
        }
    }, [conversationId, markConversationAsRead]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !user || !conversationId) return;

        const sentMessage = await sendMessage(conversationId, newMessage.trim(), user.id);
        setMessages(prev => [...prev, sentMessage]);
        setNewMessage('');
    };

    const otherParticipant = user && conversation 
        ? conversation.participants[conversation.participantIds.find(id => id !== user.id)!] 
        : null;

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto bg-white border-x border-neutral-200/80">
            {/* Header */}
            <header className="flex-shrink-0 flex items-center gap-4 p-3 border-b border-neutral-200">
                <button onClick={() => navigate('/inbox')} className="p-2 hover:bg-neutral-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 overflow-hidden">
                    <img src={otherParticipant?.avatar || 'https://i.pravatar.cc/150'} alt={otherParticipant?.name} className="w-10 h-10 rounded-full bg-neutral-200 object-cover" />
                    <div className="flex-1 overflow-hidden">
                        <h2 className="font-semibold truncate">{otherParticipant?.name || 'Loading...'}</h2>
                        <p onClick={() => conversation && navigate(`/products/${conversation.productId}`)} className="text-xs text-neutral-500 truncate cursor-pointer hover:underline">{conversation?.productTitle || '...'}</p>
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex flex-col gap-3">
                    {isLoading ? (
                        <p className="text-center text-neutral-500">Loading messages...</p>
                    ) : (
                        messages.map(msg => user && <MessageBubble key={msg.id} message={msg} isMe={msg.senderId === user.id} />)
                    )}
                     <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="flex-shrink-0 p-3 border-t border-neutral-200 bg-neutral-50">
                <div className="flex gap-2 items-center">
                     <button className="p-3 text-neutral-500 hover:bg-neutral-200 rounded-full">
                        <Tag className="w-5 h-5" />
                     </button>
                     <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="w-full pl-4 pr-12 py-3 bg-white border border-neutral-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                         <button type="submit" className="absolute right-1.5 p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors">
                            <Send className="w-5 h-5" />
                         </button>
                     </form>
                </div>
            </div>
        </div>
    );
};