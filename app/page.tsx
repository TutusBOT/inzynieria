"use client";

import { useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import PreviewPanel from "@/components/PreviewPanel";

export default function Home() {
	const [messages, setMessages] = useState<
		Array<{
			id: string;
			role: "user" | "assistant";
			content: string;
			images?: string[];
		}>
	>([]);

	return (
		<div className="flex h-screen bg-zinc-100 dark:bg-zinc-900">
			{/* Chat Interface - Left Side */}
			<div className="w-1/2 border-r border-zinc-300 dark:border-zinc-700">
				<ChatInterface messages={messages} setMessages={setMessages} />
			</div>

			{/* Preview Panel - Right Side */}
			<div className="w-1/2">
				<PreviewPanel />
			</div>
		</div>
	);
}
