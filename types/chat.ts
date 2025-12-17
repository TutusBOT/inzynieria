export interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	images?: string[];
	parsedTree?: any;
	parseError?: string;
}
