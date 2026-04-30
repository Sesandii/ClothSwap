import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Search, Send } from 'lucide-react';
import { toast } from 'sonner';
import {
  getConversationWithUser,
  getMessageConversations,
  markMessagesReadFromUser,
  sendMessageToUser,
} from '../lib/api';
import { getAuthenticatedUser, getAvatarUrl } from '../lib/auth';

type UserSummary = {
  _id?: string;
  id?: string;
  name?: string;
  location?: string;
  profilePic?: string;
  avatar?: string;
};

type MessageRecord = {
  _id?: string;
  sender?: UserSummary | string;
  text: string;
  createdAt: string;
};

type ConversationRecord = {
  _id?: string;
  participantKey?: string;
  participants?: UserSummary[];
  otherParticipant?: UserSummary;
  messages?: MessageRecord[];
  lastMessage?: MessageRecord | null;
  lastMessageAt?: string;
  unreadCount?: number;
};

const getUserId = (user?: UserSummary) => String(user?._id || user?.id || '');

const getPartner = (conversation: ConversationRecord, currentUserId: string) => {
  if (conversation.otherParticipant) {
    return conversation.otherParticipant;
  }

  return conversation.participants?.find((participant) => getUserId(participant) !== currentUserId);
};

const getAvatar = (user?: UserSummary) => getAvatarUrl(user, '7da17d');

const formatTime = (value?: string) => {
  if (!value) return '';

  return new Date(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getConversationTimestamp = (conversation: ConversationRecord) => {
  const lastMessage =
    conversation.lastMessage || conversation.messages?.[conversation.messages.length - 1];

  return new Date(
    lastMessage?.createdAt || conversation.lastMessageAt || 0
  ).getTime();
};

export function Chat() {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId?: string }>();
  const currentUser = getAuthenticatedUser();
  const currentUserId = String(currentUser?._id || currentUser?.id || '');

  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationRecord | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showListOnMobile, setShowListOnMobile] = useState(!userId);

  useEffect(() => {
    setShowListOnMobile(!userId);
  }, [userId]);

  const refreshConversations = async (selectedUserId?: string) => {
    const listResponse = await getMessageConversations();

    if (!listResponse.ok) {
      throw new Error('Failed to load messages');
    }

    const listData = (await listResponse.json()) as ConversationRecord[];
    setConversations(listData);

    if (selectedUserId) {
      const detailResponse = await getConversationWithUser(selectedUserId);

      if (!detailResponse.ok) {
        const errorData = await detailResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to load conversation');
      }

      const detailData = (await detailResponse.json()) as ConversationRecord;
      const readResponse = await markMessagesReadFromUser(selectedUserId);
      const updatedDetailData = {
        ...detailData,
        unreadCount: readResponse.ok ? 0 : detailData.unreadCount || 0,
      };

      setActiveConversation(updatedDetailData);

      if (readResponse.ok) {
        window.dispatchEvent(new Event('clothswap:messages-updated'));
        window.dispatchEvent(new Event('clothswap:notifications-updated'));
      }

      const selectedPartnerId = getUserId(getPartner(detailData, currentUserId));

      setConversations((current) => {
        const exists = current.some(
          (conversation) => getUserId(getPartner(conversation, currentUserId)) === selectedPartnerId
        );
        const next = exists
          ? current.map((conversation) =>
              getUserId(getPartner(conversation, currentUserId)) === selectedPartnerId
                ? updatedDetailData
                : conversation
            )
          : [...current, updatedDetailData];

        return next.sort((first, second) => {
          return getConversationTimestamp(second) - getConversationTimestamp(first);
        });
      });
      return;
    }

    setActiveConversation(null);
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setIsLoading(true);
        await refreshConversations(userId);
      } catch (error) {
        if (!mounted) return;
        toast.error(error instanceof Error ? error.message : 'Unable to load messages');
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  useEffect(() => {
    if (userId) {
      return;
    }

    const intervalId = window.setInterval(() => {
      void refreshConversations();
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [userId]);

  const filteredConversations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      const partner = getPartner(conversation, currentUserId);
      const lastMessage = conversation.lastMessage || conversation.messages?.[conversation.messages.length - 1];
      const haystack = [partner?.name, partner?.location, lastMessage?.text]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [conversations, currentUserId, searchTerm]);

  const handleOpenConversation = (conversation: ConversationRecord) => {
    const partner = getPartner(conversation, currentUserId);
    const partnerId = getUserId(partner);

    if (!partnerId) {
      return;
    }

    setActiveConversation(conversation);
    setShowListOnMobile(false);
    navigate(`/chat/${partnerId}`);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || !userId) {
      return;
    }

    try {
      setIsSending(true);
      const response = await sendMessageToUser(userId, messageInput.trim());

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send message');
      }

      const conversation = (await response.json()) as ConversationRecord;
      setActiveConversation(conversation);
      setMessageInput('');

      const partnerId = getUserId(getPartner(conversation, currentUserId));

      setConversations((current) => {
        const next = current.filter(
          (existing) => getUserId(getPartner(existing, currentUserId)) !== partnerId
        );

        return [conversation, ...next];
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const selectedPartner = activeConversation
    ? getPartner(activeConversation, currentUserId)
    : undefined;
  const threadMessages = activeConversation?.messages || [];

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 h-[calc(100vh-80px)]">
      <div className="bg-white rounded-2xl shadow-sm border border-warmGray-100 h-full flex overflow-hidden">
        <div
          className={`${!showListOnMobile ? 'hidden md:flex' : 'flex'} w-full md:w-80 border-r border-warmGray-100 flex-col h-full`}>
          <div className="p-4 border-b border-warmGray-100">
            <h2 className="text-xl font-serif font-bold text-warmGray-900 mb-4">
              Messages
            </h2>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-warmGray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 bg-warmGray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-sm text-warmGray-500">Loading conversations...</div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => {
                const partner = getPartner(conversation, currentUserId);
                const lastMessage = conversation.lastMessage || conversation.messages?.[conversation.messages.length - 1];
                const partnerId = getUserId(partner);
                const unreadCount = conversation.unreadCount || 0;
                const isUnread = unreadCount > 0;
                const isSelected = userId === partnerId;

                return (
                  <button
                    key={conversation._id || partnerId}
                    type="button"
                    onClick={() => handleOpenConversation(conversation)}
                    className={`w-full p-4 border-b transition-colors flex items-start gap-3 text-left ${
                      isSelected
                        ? 'bg-primary-50/70 border-primary-100'
                        : isUnread
                          ? 'bg-primary-50/40 border-primary-100 hover:bg-primary-50/70'
                          : 'border-warmGray-50 hover:bg-warmGray-50'
                    }`}>
                    <img
                      src={getAvatar(partner)}
                      alt={partner?.name || 'User'}
                      className={`w-12 h-12 rounded-full object-cover bg-warmGray-100 ${
                        isUnread ? 'ring-2 ring-primary-400 ring-offset-2' : ''
                      }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1 gap-2">
                        <h4 className={`${isUnread ? 'font-semibold text-warmGray-950' : 'font-medium text-warmGray-900'} truncate`}>
                          {partner?.name || 'Unknown User'}
                        </h4>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className={`text-xs ${isUnread ? 'font-semibold text-primary-600' : 'text-warmGray-400'}`}>
                            {formatTime(lastMessage?.createdAt || conversation.lastMessageAt)}
                          </span>
                          {isUnread && (
                            <span className="min-w-5 h-5 px-1 rounded-full bg-primary-500 text-[10px] font-semibold text-white flex items-center justify-center">
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className={`text-sm truncate ${isUnread ? 'font-semibold text-warmGray-800' : 'text-warmGray-500'}`}>
                        {lastMessage?.text || 'No messages yet'}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-sm text-warmGray-500">
                No conversations yet. Open a profile or item to start one.
              </div>
            )}
          </div>
        </div>

        <div
          className={`${showListOnMobile ? 'hidden md:flex' : 'flex'} flex-1 flex flex-col h-full bg-warmGray-50/30`}>
          {selectedPartner && activeConversation ? (
            <>
              <div className="p-4 bg-white border-b border-warmGray-100 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => {
                      setShowListOnMobile(true);
                      navigate('/chat');
                    }}
                    className="md:hidden p-2 -ml-2 text-warmGray-500">
                    <ArrowLeft size={20} />
                  </button>
                  <img
                    src={getAvatar(selectedPartner)}
                    alt={selectedPartner.name || 'User'}
                    className="w-10 h-10 rounded-full object-cover bg-warmGray-100" />
                  <div className="min-w-0">
                    <h3 className="font-medium text-warmGray-900 truncate">
                      {selectedPartner.name}
                    </h3>
                    <p className="text-xs text-warmGray-500 truncate">
                      {selectedPartner.location || 'Online'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {threadMessages.length > 0 ? (
                  threadMessages.map((message, index) => {
                    const senderId = typeof message.sender === 'string'
                      ? message.sender
                      : getUserId(message.sender);
                    const isMe = senderId === currentUserId;

                    return (
                      <div
                        key={message._id || `${message.createdAt}-${index}`}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2 ${isMe ? 'bg-primary-500 text-white rounded-tr-sm' : 'bg-white border border-warmGray-100 text-warmGray-900 rounded-tl-sm'}`}>
                          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                          <span
                            className={`text-[10px] mt-1 block ${isMe ? 'text-primary-100' : 'text-warmGray-400'}`}>
                            {formatTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center justify-center text-warmGray-400 text-sm">
                    No messages yet. Send the first one.
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-warmGray-100">
                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(event) => setMessageInput(event.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 bg-warmGray-50 border border-warmGray-200 rounded-full text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500" />
                  <button
                    type="submit"
                    disabled={!messageInput.trim() || isSending}
                    className="p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors disabled:opacity-50">
                    <Send size={18} className="ml-0.5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-warmGray-400 text-center px-6">
              <div>
                <p className="font-medium text-warmGray-700 mb-2">Select a conversation to start chatting</p>
                <p className="text-sm text-warmGray-500 mb-4">
                  Messages are saved per two-user thread and will show here when the conversation is opened.
                </p>
                <Link to="/browse" className="text-primary-600 hover:text-primary-700 font-medium">
                  Browse items
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
