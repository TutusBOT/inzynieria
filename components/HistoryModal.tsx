"use client";

import { Chat } from "@/lib/chat-history";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { pl } from "date-fns/locale";

interface HistoryModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	chats: Chat[];
	onSelectChat: (chat: Chat) => void;
	onDeleteChat: (chatId: string) => void;
	currentChatId?: string;
}

export default function HistoryModal({
	open,
	onOpenChange,
	chats,
	onSelectChat,
	onDeleteChat,
	currentChatId,
}: HistoryModalProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[80vh]">
				<DialogHeader>
					<DialogTitle>Historia Konwersacji</DialogTitle>
				</DialogHeader>
				<div className="overflow-y-auto max-h-[60vh] space-y-2 pr-2">
					{chats.length === 0 ? (
						<div className="text-center py-8 text-zinc-500">
							<MessageSquare className="mx-auto mb-3 h-12 w-12 opacity-50" />
							<p>Brak zapisanych konwersacji</p>
						</div>
					) : (
						chats.map((chat) => (
							<div
								key={chat.id}
								className={`flex items-center gap-3 p-3 rounded-lg border transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
									currentChatId === chat.id
										? "bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700"
										: "border-zinc-200 dark:border-zinc-700"
								}`}
							>
								<button
									onClick={() => {
										onSelectChat(chat);
										onOpenChange(false);
									}}
									className="flex-1 text-left"
								>
									<div className="font-medium text-zinc-900 dark:text-zinc-100 mb-1">
										{chat.title}
									</div>
									<div className="text-sm text-zinc-500 dark:text-zinc-400">
										{chat.messages.length} wiadomości •{" "}
										{formatDistanceToNow(chat.updatedAt, {
											addSuffix: true,
											locale: pl,
										})}
									</div>
								</button>
								<Button
									variant="ghost"
									size="icon"
									onClick={(e) => {
										e.stopPropagation();
										if (confirm("Czy na pewno chcesz usunąć tę konwersację?")) {
											onDeleteChat(chat.id);
										}
									}}
									className="shrink-0 text-zinc-400 hover:text-red-600"
								>
									<Trash2 size={18} />
								</Button>
							</div>
						))
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
