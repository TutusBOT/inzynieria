"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Image as ImageIcon, X } from "lucide-react";

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	images?: string[];
}

interface ChatInterfaceProps {
	messages: Message[];
	setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function ChatInterface({
	messages,
	setMessages,
}: ChatInterfaceProps) {
	const [inputValue, setInputValue] = useState("");
	const [selectedImages, setSelectedImages] = useState<string[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const imagePromises = Array.from(files).map((file) => {
				return new Promise<string>((resolve) => {
					const reader = new FileReader();
					reader.onloadend = () => resolve(reader.result as string);
					reader.readAsDataURL(file);
				});
			});

			Promise.all(imagePromises).then((images) => {
				setSelectedImages((prev) => [...prev, ...images]);
			});
		}
	};

	const removeImage = (index: number) => {
		setSelectedImages((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSendMessage = () => {
		if (inputValue.trim() || selectedImages.length > 0) {
			const newMessage: Message = {
				id: Date.now().toString(),
				role: "user",
				content: inputValue,
				images: selectedImages.length > 0 ? selectedImages : undefined,
			};

			setMessages((prev) => [...prev, newMessage]);
			setInputValue("");
			setSelectedImages([]);

			// Symulacja odpowiedzi asystenta
			setTimeout(() => {
				const assistantMessage: Message = {
					id: (Date.now() + 1).toString(),
					role: "assistant",
					content: "Rozumiem Twoje żądanie. Generuję interfejs...",
				};
				setMessages((prev) => [...prev, assistantMessage]);
			}, 1000);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	return (
		<div className="flex flex-col h-full bg-white dark:bg-zinc-950">
			{/* Header */}
			<div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
				<h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
					Generator Interfejsów UI
				</h1>
				<p className="text-sm text-zinc-600 dark:text-zinc-400">
					Opisz interfejs, który chcesz stworzyć
				</p>
			</div>

			{/* Messages Area */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.length === 0 ? (
					<div className="flex items-center justify-center h-full text-center">
						<div>
							<div className="text-4xl mb-4">💬</div>
							<p className="text-zinc-600 dark:text-zinc-400">
								Rozpocznij konwersację aby wygenerować interfejs
							</p>
							<p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
								Możesz dodać tekst i/lub zdjęcia
							</p>
						</div>
					</div>
				) : (
					messages.map((message) => (
						<div
							key={message.id}
							className={`flex ${
								message.role === "user" ? "justify-end" : "justify-start"
							}`}
						>
							<div
								className={`max-w-[80%] rounded-lg p-3 ${
									message.role === "user"
										? "bg-blue-600 text-white"
										: "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
								}`}
							>
								{message.images && message.images.length > 0 && (
									<div className="grid grid-cols-2 gap-2 mb-2">
										{message.images.map((img, idx) => (
											<img
												key={idx}
												src={img}
												alt={`Uploaded ${idx + 1}`}
												className="rounded max-h-32 object-cover"
											/>
										))}
									</div>
								)}
								<p className="whitespace-pre-wrap">{message.content}</p>
							</div>
						</div>
					))
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* Input Area */}
			<div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
				{/* Image Preview */}
				{selectedImages.length > 0 && (
					<div className="mb-3 flex flex-wrap gap-2">
						{selectedImages.map((img, idx) => (
							<div key={idx} className="relative">
								<img
									src={img}
									alt={`Preview ${idx + 1}`}
									className="h-20 w-20 object-cover rounded border border-zinc-300 dark:border-zinc-700"
								/>
								<button
									onClick={() => removeImage(idx)}
									className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
								>
									<X size={12} />
								</button>
							</div>
						))}
					</div>
				)}

				{/* Input Field */}
				<div className="flex gap-2">
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						multiple
						onChange={handleImageSelect}
						className="hidden"
					/>
					<Button
						variant="outline"
						size="icon"
						onClick={() => fileInputRef.current?.click()}
						className="shrink-0"
					>
						<ImageIcon size={20} />
					</Button>
					<Input
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={handleKeyPress}
						placeholder="Opisz interfejs lub dodaj zdjęcie..."
						className="flex-1"
					/>
					<Button
						onClick={handleSendMessage}
						disabled={!inputValue.trim() && selectedImages.length === 0}
						className="shrink-0"
					>
						<Send size={20} />
					</Button>
				</div>
			</div>
		</div>
	);
}
