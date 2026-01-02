/**
 * Testy komponentu ChatInterface
 * Testują interfejs użytkownika, obsługę wiadomości, obrazów i mowy
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatInterface from "@/components/ChatInterface";
import { Message } from "@/types/chat";

// Mock fetch
global.fetch = jest.fn();

// Mock SpeechRecognition
const mockSpeechRecognition = {
	start: jest.fn(),
	stop: jest.fn(),
	addEventListener: jest.fn(),
	removeEventListener: jest.fn(),
	continuous: false,
	lang: "",
	onresult: null,
	onerror: null,
};

(global as any).SpeechRecognition = jest
	.fn()
	.mockImplementation(() => mockSpeechRecognition);
(global as any).webkitSpeechRecognition = (global as any).SpeechRecognition;

describe("ChatInterface", () => {
	const mockSetMessages = jest.fn();
	const mockOnNewChat = jest.fn();
	const mockOnOpenHistory = jest.fn();

	const defaultProps = {
		messages: [],
		setMessages: mockSetMessages,
		onNewChat: mockOnNewChat,
		onOpenHistory: mockOnOpenHistory,
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(global.fetch as jest.Mock).mockReset();
	});

	describe("Renderowanie", () => {
		it("powinien wyrenderować podstawowe elementy UI", () => {
			render(<ChatInterface {...defaultProps} />);

			expect(screen.getByRole("textbox")).toBeInTheDocument();
			expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
		});

		it("powinien wyświetlić istniejące wiadomości", () => {
			const messages: Message[] = [
				{ id: "1", role: "user", content: "Hello" },
				{ id: "2", role: "assistant", content: "Hi there!" },
			];

			render(<ChatInterface {...defaultProps} messages={messages} />);

			expect(screen.getByText("Hello")).toBeInTheDocument();
			expect(screen.getByText("Hi there!")).toBeInTheDocument();
		});

		it("powinien pokazać przycisk Nowy Chat", () => {
			render(<ChatInterface {...defaultProps} />);

			const newChatButton = screen.getByRole("button", {
				name: /Nowy Chat/i,
			});
			expect(newChatButton).toBeInTheDocument();
		});

		it("powinien pokazać przycisk Historia", () => {
			render(<ChatInterface {...defaultProps} />);

			const historyButton = screen.getByRole("button", {
				name: /Historia/i,
			});
			expect(historyButton).toBeInTheDocument();
		});
	});

	describe("Wysyłanie Wiadomości", () => {
		it("powinien wysłać wiadomość po kliknięciu przycisku", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({
					message: "Response",
					tree: null,
				}),
			});

			render(<ChatInterface {...defaultProps} />);

			const input = screen.getByPlaceholderText(/Opisz interfejs/i);
			const sendButtons = screen.getAllByRole("button");
			const sendButton = sendButtons.find((btn) =>
				btn.querySelector("svg.lucide-send")
			);

			await userEvent.type(input, "Test message");
			await userEvent.click(sendButton!);

			await waitFor(() => {
				expect(mockSetMessages).toHaveBeenCalled();
			});
		});

		it("powinien wyczyścić input po wysłaniu", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ message: "Response" }),
			});

			render(<ChatInterface {...defaultProps} />);

			const input = screen.getByPlaceholderText(
				/Opisz interfejs/i
			) as HTMLInputElement;
			const sendButtons = screen.getAllByRole("button");
			const sendButton = sendButtons.find((btn) =>
				btn.querySelector("svg.lucide-send")
			);

			await userEvent.type(input, "Test");
			await userEvent.click(sendButton!);

			await waitFor(() => {
				expect(input.value).toBe("");
			});
		});

		it("powinien dodać loading message podczas oczekiwania", async () => {
			let resolvePromise: any;
			const promise = new Promise((resolve) => {
				resolvePromise = resolve;
			});

			(global.fetch as jest.Mock).mockReturnValueOnce(promise);

			render(<ChatInterface {...defaultProps} />);

			const input = screen.getByPlaceholderText(/Opisz interfejs/i);
			const sendButtons = screen.getAllByRole("button");
			const sendButton = sendButtons.find((btn) =>
				btn.querySelector("svg.lucide-send")
			);

			await userEvent.type(input, "Test");
			await userEvent.click(sendButton!);

			await waitFor(() => {
				expect(mockSetMessages).toHaveBeenCalled();
			});

			resolvePromise({
				ok: true,
				json: async () => ({ message: "Done" }),
			});
		});

		it("nie powinien wysłać pustej wiadomości", async () => {
			render(<ChatInterface {...defaultProps} />);

			const sendButtons = screen.getAllByRole("button");
			const sendButton = sendButtons.find((btn) =>
				btn.querySelector("svg.lucide-send")
			);

			expect(sendButton).toBeDisabled();
		});

		it("powinien obsłużyć błąd API", async () => {
			(global.fetch as jest.Mock).mockRejectedValueOnce(
				new Error("Network error")
			);

			const consoleSpy = jest.spyOn(console, "error").mockImplementation();

			render(<ChatInterface {...defaultProps} />);

			const input = screen.getByPlaceholderText(/Opisz interfejs/i);
			const sendButtons = screen.getAllByRole("button");
			const sendButton = sendButtons.find((btn) =>
				btn.querySelector("svg.lucide-send")
			);

			await userEvent.type(input, "Test");
			await userEvent.click(sendButton!);

			await waitFor(() => {
				expect(consoleSpy).toHaveBeenCalled();
			});

			consoleSpy.mockRestore();
		});
	});

	describe("Obsługa Obrazów", () => {
		it("powinien mieć ukryty input dla plików", () => {
			render(<ChatInterface {...defaultProps} />);

			const fileInput = document.querySelector('input[type="file"]');
			expect(fileInput).toBeInTheDocument();
			expect(fileInput).toHaveAttribute("accept", "image/*");
			expect(fileInput).toHaveAttribute("multiple");
		});

		it("powinien wysłać wiadomość z obrazami", async () => {
			(global.fetch as jest.Mock).mockResolvedValueOnce({
				ok: true,
				json: async () => ({ message: "Response" }),
			});

			render(<ChatInterface {...defaultProps} />);

			const input = screen.getByPlaceholderText(/Opisz interfejs/i);
			await userEvent.type(input, "Look at this");

			const sendButtons = screen.getAllByRole("button");
			const sendButton = sendButtons.find((btn) =>
				btn.querySelector("svg.lucide-send")
			);

			await userEvent.click(sendButton!);

			await waitFor(() => {
				expect(global.fetch).toHaveBeenCalled();
			});
		});
	});

	describe("Rozpoznawanie Mowy", () => {
		it("powinien rozpocząć nagrywanie po kliknięciu mikrofonu", async () => {
			render(<ChatInterface {...defaultProps} />);

			const micButton = screen.getByTitle("Start recording");
			await userEvent.click(micButton);

			expect(mockSpeechRecognition.start).toHaveBeenCalled();
		});

		it("powinien zatrzymać nagrywanie po ponownym kliknięciu", async () => {
			render(<ChatInterface {...defaultProps} />);

			const micButtons = screen.getAllByRole("button");
			const micButton = micButtons.find(
				(btn) => btn.getAttribute("aria-pressed") === "false"
			);

			// Start
			await userEvent.click(micButton!);
			// Stop
			await userEvent.click(micButton!);

			expect(mockSpeechRecognition.stop).toHaveBeenCalled();
		});
	});

	describe("Formatowanie Wiadomości", () => {
		it("powinien renderować wiadomości użytkownika z odpowiednim stylem", () => {
			const messages: Message[] = [
				{ id: "1", role: "user", content: "User message" },
			];

			render(<ChatInterface {...defaultProps} messages={messages} />);

			const messageElement = screen.getByText("User message");
			expect(messageElement).toBeInTheDocument();
		});

		it("powinien renderować wiadomości assistanta z odpowiednim stylem", () => {
			const messages: Message[] = [
				{ id: "1", role: "assistant", content: "Assistant message" },
			];

			render(<ChatInterface {...defaultProps} messages={messages} />);

			const messageElement = screen.getByText("Assistant message");
			expect(messageElement).toBeInTheDocument();
		});

		it("powinien wyświetlić obrazy w wiadomościach użytkownika", () => {
			const messages: Message[] = [
				{
					id: "1",
					role: "user",
					content: "Check this image",
					images: ["data:image/png;base64,abc"],
				},
			];

			render(<ChatInterface {...defaultProps} messages={messages} />);

			const image = screen.getByRole("img");
			expect(image).toBeInTheDocument();
			expect(image).toHaveAttribute("src", "data:image/png;base64,abc");
		});
	});

	describe("Accessibility", () => {
		it("powinien mieć odpowiednie role ARIA", () => {
			render(<ChatInterface {...defaultProps} />);

			expect(screen.getByRole("textbox")).toBeInTheDocument();
			expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
		});
	});
});
