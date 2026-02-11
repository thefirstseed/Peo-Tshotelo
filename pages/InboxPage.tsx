import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Conversation } from '../types';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { navigate } from '../router';
import { useInbox } from '../hooks/useInbox';

const ConversationItem: React.FC<{ convo: Conversation; currentUserId: string; }> = ({ convo, currentUserId }) => {
    const otherParticipantId = convo.participantIds.find(id => id !== currentUserId)!;
    const otherParticipant = convo.participants[otherParticipantId];
    const lastMessageFromMe = convo.lastMessage.senderId === currentUserId;

    return (
        <div 
            onClick={() => navigate(`/conversations/${convo.id}`)}
            className="flex items-start gap-4 p-4 hover:bg-neutral-50 rounded-lg cursor-pointer transition-colors"
        >
            <div className="relative flex-shrink-0">
                <img src={otherParticipant.avatar} alt={otherParticipant.name} className="w-12 h-12 rounded-full object-cover" />
                <img src={convo.productImage} alt={convo.productTitle} className="w-6 h-6 rounded-md object-cover absolute -bottom-1 -right-1 border-2 border-white" />
            </div>
            <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-neutral-800 truncate">{otherParticipant.name}</h3>
                    <p className="text-xs text-neutral-400 flex-shrink-0 ml-2">{new Date(convo.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <p className="text-sm text-neutral-500 truncate">{convo.productTitle}</p>
                <p className={`text-sm truncate ${convo.unread ? 'text-neutral-800 font-medium' : 'text-neutral-500'}`}>
                    {lastMessageFromMe && 'You: '}{convo.lastMessage.text}
                </p>
            </div>
            {convo.unread && <div className="w-2.5 h-2.5 bg-primary-500 rounded-full self-center flex-shrink-0"></div>}
        </div>
    );
};

export const InboxPage: React.FC = () => {
    const { user } = useAuth();
    const { conversations, isLoading } = useInbox();

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/')} className="p-2 hover:bg-neutral-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Inbox</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80">
                {isLoading ? (
                    <div className="text-center py-20 text-neutral-500">Loading conversations...</div>
                ) : conversations.length > 0 ? (
                    <div className="divide-y divide-neutral-100">
                        {conversations.map(convo => user && <ConversationItem key={convo.id} convo={convo} currentUserId={user.id} />)}
                    </div>
                ) : (
                    <div className="text-center py-20 flex flex-col items-center">
                        <MessageSquare className="w-12 h-12 text-neutral-300 mb-4" />
                        <h2 className="text-xl font-semibold text-neutral-800">No messages yet</h2>
                        <p className="text-neutral-500 mt-2">Your conversations with sellers will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};