/**
 * Testy jednostkowe dla modułu chat-history
 * Testują funkcjonalności zarządzania historią konwersacji
 */

import {
	loadChatHistory,
	saveChatHistory,
	saveChat,
	deleteChat,
	getChatTitle,
	Chat,
} from "@/lib/chat-history";
import { Message } from "@/types/chat";

// Mock localStorage
const localStorageMock = (() => {
	let store: Record<string, string> = {};

	return {
		getItem: (key: string) => store[key] || null,
		setItem: (key: string, value: string) => {
			store[key] = value;
		},
		removeItem: (key: string) => {
			delete store[key];
		},
		clear: () => {
			store = {};
		},
	};
})();

Object.defineProperty(window, "localStorage", {
	value: localStorageMock,
});

describe("chat-history", () => {
	beforeEach(() => {
		localStorageMock.clear();
	});

	describe("loadChatHistory", () => {
		it("powinien zwrócić pustą tablicę gdy brak danych w localStorage", () => {
			const result = loadChatHistory();
			expect(result).toEqual([]);
		});

		it("powinien poprawnie załadować historię z localStorage", () => {
			const mockChats: Chat[] = [
				{
					id: "chat-1",
					title: "Test Chat",
					messages: [],
					createdAt: Date.now(),
					updatedAt: Date.now(),
				},
			];

			localStorage.setItem("chat-history", JSON.stringify(mockChats));
			const result = loadChatHistory();
			expect(result).toEqual(mockChats);
		});

		it("powinien zwrócić pustą tablicę przy błędzie parsowania JSON", () => {
			localStorage.setItem("chat-history", "invalid-json");
			const consoleSpy = jest.spyOn(console, "error").mockImplementation();

			const result = loadChatHistory();
			expect(result).toEqual([]);
			expect(consoleSpy).toHaveBeenCalled();

			consoleSpy.mockRestore();
		});
	});

	describe("saveChatHistory", () => {
		it("powinien zapisać historię do localStorage", () => {
			const mockChats: Chat[] = [
				{
					id: "chat-1",
					title: "Test Chat",
					messages: [],
					createdAt: Date.now(),
					updatedAt: Date.now(),
				},
			];

			saveChatHistory(mockChats);
			const stored = localStorage.getItem("chat-history");
			expect(JSON.parse(stored!)).toEqual(mockChats);
		});
	});

	describe("saveChat", () => {
		it("powinien dodać nowy czat na początek listy", () => {
			const existingChats: Chat[] = [
				{
					id: "chat-1",
					title: "Old Chat",
					messages: [],
					createdAt: 1000,
					updatedAt: 1000,
				},
			];

			localStorage.setItem("chat-history", JSON.stringify(existingChats));

			const newChat: Chat = {
				id: "chat-2",
				title: "New Chat",
				messages: [],
				createdAt: 2000,
				updatedAt: 2000,
			};

			saveChat(newChat);

			const stored = loadChatHistory();
			expect(stored).toHaveLength(2);
			expect(stored[0].id).toBe("chat-2");
		});

		it("powinien zaktualizować istniejący czat", () => {
			const existingChat: Chat = {
				id: "chat-1",
				title: "Old Title",
				messages: [],
				createdAt: 1000,
				updatedAt: 1000,
			};

			localStorage.setItem("chat-history", JSON.stringify([existingChat]));

			const updatedChat: Chat = {
				...existingChat,
				title: "Updated Title",
				messages: [{ id: "1", role: "user", content: "Hi" }],
			};

			saveChat(updatedChat);

			const stored = loadChatHistory();
			expect(stored).toHaveLength(1);
			expect(stored[0].title).toBe("Updated Title");
			expect(stored[0].messages).toHaveLength(1);
		});
	});

	describe("deleteChat", () => {
		it("powinien usunąć czat o danym ID", () => {
			const chats: Chat[] = [
				{
					id: "chat-1",
					title: "Chat 1",
					messages: [],
					createdAt: 1000,
					updatedAt: 1000,
				},
				{
					id: "chat-2",
					title: "Chat 2",
					messages: [],
					createdAt: 2000,
					updatedAt: 2000,
				},
			];

			localStorage.setItem("chat-history", JSON.stringify(chats));

			deleteChat("chat-1");

			const stored = loadChatHistory();
			expect(stored).toHaveLength(1);
			expect(stored[0].id).toBe("chat-2");
		});

		it("nie powinien zmienić listy gdy czat nie istnieje", () => {
			const chats: Chat[] = [
				{
					id: "chat-1",
					title: "Chat 1",
					messages: [],
					createdAt: 1000,
					updatedAt: 1000,
				},
			];

			localStorage.setItem("chat-history", JSON.stringify(chats));

			deleteChat("non-existent");

			const stored = loadChatHistory();
			expect(stored).toHaveLength(1);
		});
	});

	describe("getChatTitle", () => {
		it("powinien wygenerować tytuł z pierwszej wiadomości użytkownika", () => {
			const messages: Message[] = [
				{ id: "1", role: "user", content: "Hello, how are you?" },
				{ id: "2", role: "assistant", content: "I'm fine!" },
			];

			const title = getChatTitle(messages);
			expect(title).toBe("Hello, how are you?");
		});

		it("powinien obciąć długi tytuł do 50 znaków", () => {
			const longContent = "a".repeat(100);
			const messages: Message[] = [
				{ id: "1", role: "user", content: longContent },
			];

			const title = getChatTitle(messages);
			expect(title).toHaveLength(53); // 50 + "..."
			expect(title.endsWith("...")).toBe(true);
		});

		it("powinien zwrócić domyślny tytuł gdy brak wiadomości użytkownika", () => {
			const messages: Message[] = [
				{ id: "1", role: "assistant", content: "Hello!" },
			];

			const title = getChatTitle(messages);
			expect(title).toBe("Nowa konwersacja");
		});

		it("powinien zwrócić domyślny tytuł dla pustej tablicy", () => {
			const messages: Message[] = [];

			const title = getChatTitle(messages);
			expect(title).toBe("Nowa konwersacja");
		});
	});
});
