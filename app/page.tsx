"use client";

import { useState, useEffect } from "react";
import ChatInterface from "@/components/ChatInterface";
import PreviewPanel from "@/components/PreviewPanel";
import HistoryModal from "@/components/HistoryModal";
import { Message } from "@/types/chat";
import {
	loadChatHistory,
	saveChat,
	deleteChat,
	getChatTitle,
	Chat,
} from "@/lib/chat-history";

export default function Home() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [currentChatId, setCurrentChatId] = useState<string>("");
	const [chatHistory, setChatHistory] = useState<Chat[]>([]);
	const [historyModalOpen, setHistoryModalOpen] = useState(false);

	// Load chat history on mount
	useEffect(() => {
		const history = loadChatHistory();
		setChatHistory(history);

		// Start with a new chat
		const newChatId = `chat-${Date.now()}`;
		setCurrentChatId(newChatId);
	}, []);

	// Auto-save current chat whenever messages change
	useEffect(() => {
		if (messages.length > 0 && currentChatId) {
			const chat: Chat = {
				id: currentChatId,
				title: getChatTitle(messages),
				messages,
				createdAt: Date.now(),
				updatedAt: Date.now(),
			};
			saveChat(chat);

			// Refresh history
			const history = loadChatHistory();
			setChatHistory(history);
		}
	}, [messages, currentChatId]);

	const handleNewChat = () => {
		const newChatId = `chat-${Date.now()}`;
		setCurrentChatId(newChatId);
		setMessages([]);
	};

	const handleSelectChat = (chat: Chat) => {
		setCurrentChatId(chat.id);
		setMessages(chat.messages);
	};

	const handleDeleteChat = (chatId: string) => {
		deleteChat(chatId);
		const history = loadChatHistory();
		setChatHistory(history);

		// If deleted chat was current, start new chat
		if (chatId === currentChatId) {
			handleNewChat();
		}
	};

	const handleOpenHistory = () => {
		setHistoryModalOpen(true);
	};

	return (
		<>
			<div className="flex h-screen bg-zinc-100 dark:bg-zinc-900">
				{/* Chat Interface - Left Side */}
				<div className="w-1/2 border-r border-zinc-300 dark:border-zinc-700">
					<ChatInterface
						messages={messages}
						setMessages={setMessages}
						onNewChat={handleNewChat}
						onOpenHistory={handleOpenHistory}
					/>
				</div>

				{/* Preview Panel - Right Side */}
				<div className="w-1/2">
					<PreviewPanel messages={messages} />
				</div>
			</div>

			<HistoryModal
				open={historyModalOpen}
				onOpenChange={setHistoryModalOpen}
				chats={chatHistory}
				onSelectChat={handleSelectChat}
				onDeleteChat={handleDeleteChat}
				currentChatId={currentChatId}
			/>
		</>
	);
}
