"use client";

export default function PreviewPanel() {
	return (
		<div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-900">
			{/* Header */}
			<div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
				<h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
					Podgląd Interfejsu
				</h2>
				<p className="text-sm text-zinc-600 dark:text-zinc-400">
					Wygenerowany interfejs pojawi się tutaj
				</p>
			</div>

			{/* Preview Area */}
			<div className="flex-1 overflow-auto p-8">
				<div className="h-full flex items-center justify-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-950">
					<div className="text-center">
						<div className="text-6xl mb-4">🎨</div>
						<p className="text-zinc-600 dark:text-zinc-400 text-lg font-medium">
							Miejsce na wygenerowany interfejs
						</p>
						<p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
							Rozpocznij konwersację aby zobaczyć podgląd
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
