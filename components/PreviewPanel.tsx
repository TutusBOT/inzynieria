"use client";

import { useEffect, useState } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";

type TreeNode =
	| { type: "text"; value: string }
	| { type: "fragment"; children?: TreeNode[] }
	| {
			type: "element";
			name: string;
			props?: Record<string, unknown>;
			children?: TreeNode[];
	  };

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	images?: string[];
	parsedTree?: TreeNode | null;
	parseError?: string | null;
	tree?: TreeNode | null;
}

interface PreviewPanelProps {
	messages: Message[];
}

export default function PreviewPanel({ messages }: PreviewPanelProps) {
	// no direct eval/iframe: render parsed tree provided by API
	const [parsedTree, setParsedTree] = useState<TreeNode | null>(null);
	const [parseError, setParseError] = useState<string | null>(null);

	useEffect(() => {
		const lastAssistant = [...messages]
			.reverse()
			.find(
				(m) =>
					m.role === "assistant" &&
					m.content &&
					!m.content.toLowerCase().includes("generuję interfejs")
			);

		if (!lastAssistant) {
			setParsedTree(null);
			setParseError(null);
			return;
		}

		const tree = lastAssistant.parsedTree ?? lastAssistant.tree ?? null;
		const err = lastAssistant.parseError ?? null;
		setParsedTree(tree ?? null);
		setParseError(err ?? null);
	}, [messages]);

	function renderNode(node: TreeNode | null): React.ReactNode {
		if (!node) return null;
		if (node.type === "text") return node.value;
		if (node.type === "fragment") {
			return (node.children || []).map((c, idx) => (
				<React.Fragment key={idx}>{renderNode(c)}</React.Fragment>
			));
		}
		if (node.type === "element") {
			const name = node.name;
			const props = (node.props || {}) as Record<string, unknown>;
			const children = (node.children || []) as TreeNode[];

			const compMap: Record<string, React.ElementType> = {
				Button,
				Input,
				Label,
				Checkbox,
				Tabs,
				"Tabs.List": TabsList,
				"Tabs.Trigger": TabsTrigger,
				"Tabs.Content": TabsContent,
				Accordion,
				"Accordion.Item": AccordionItem,
				"Accordion.Trigger": AccordionTrigger,
				"Accordion.Content": AccordionContent,
			};

			let tag: React.ElementType;
			if (compMap[name]) tag = compMap[name];
			else tag = name as unknown as React.ElementType;
			const renderedChildren: React.ReactNode[] = children.map((c) =>
				renderNode(c)
			);

			return React.createElement(
				tag,
				props as Record<string, unknown>,
				...(renderedChildren as React.ReactNode[])
			);
		}
		return null;
	}

	return (
		<div className="flex flex-col gap-4">
			{parseError && (
				<div className="rounded-md border bg-muted p-4 text-sm">
					{parseError}
				</div>
			)}
			{!parseError && parsedTree && renderNode(parsedTree)}
		</div>
	);
}
