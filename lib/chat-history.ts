import { Message } from "@/types/chat";

export interface Chat {
	id: string;
	title: string;
	messages: Message[];
	createdAt: number;
	updatedAt: number;
}

const STORAGE_KEY = "chat-history";

export function loadChatHistory(): Chat[] {
	if (typeof window === "undefined") return [];

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return [];
		return JSON.parse(stored);
	} catch (error) {
		console.error("Failed to load chat history:", error);
		return [];
	}
}

export function saveChatHistory(chats: Chat[]): void {
	if (typeof window === "undefined") return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
	} catch (error) {
		console.error("Failed to save chat history:", error);
	}
}

export function saveChat(chat: Chat): void {
	const chats = loadChatHistory();
	const existingIndex = chats.findIndex((c) => c.id === chat.id);

	if (existingIndex >= 0) {
		chats[existingIndex] = { ...chat, updatedAt: Date.now() };
	} else {
		chats.unshift(chat);
	}

	saveChatHistory(chats);
}

export function deleteChat(chatId: string): void {
	const chats = loadChatHistory();
	const filtered = chats.filter((c) => c.id !== chatId);
	saveChatHistory(filtered);
}

export function getChatTitle(messages: Message[]): string {
	const firstUserMessage = messages.find((m) => m.role === "user" && m.content);
	if (!firstUserMessage) return "Nowa konwersacja";

	const content = firstUserMessage.content.trim();
	return content.length > 50 ? content.substring(0, 50) + "..." : content;
}
