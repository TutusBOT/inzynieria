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
import { Code2, Eye } from "lucide-react";

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
  const [rawCode, setRawCode] = useState<string>("");

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
      setRawCode("");
      return;
    }

    const tree = lastAssistant.parsedTree ?? lastAssistant.tree ?? null;
    const err = lastAssistant.parseError ?? null;
    setParsedTree(tree ?? null);
    setParseError(err ?? null);

    // Extract code from message content
    const content = lastAssistant.content || "";
    const codeMatch = content.match(
      /```(?:tsx|jsx|typescript|javascript)?\n([\s\S]*?)```/
    );
    setRawCode(codeMatch ? codeMatch[1].trim() : content);
  }, [messages]);

  function renderNode(
    node: TreeNode | null,
    index: number = 0
  ): React.ReactNode {
    if (!node) return null;
    if (node.type === "text") return node.value;
    if (node.type === "fragment") {
      return (node.children || []).map((c, idx) => (
        <React.Fragment key={idx}>{renderNode(c, idx)}</React.Fragment>
      ));
    }
    if (node.type === "element") {
      const name = node.name;
      const props = { ...(node.props || {}) } as Record<string, unknown>;
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

      // Add key to props if not present
      if (!props.key) {
        props.key = `node-${index}`;
      }

      const renderedChildren: React.ReactNode[] = children.map((c, idx) =>
        renderNode(c, idx)
      );

      return React.createElement(tag, props, ...renderedChildren);
    }
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
      {/* Header */}
      <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Podgląd
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Wygenerowany interfejs użytkownika
        </p>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {!parsedTree && !parseError && !rawCode ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <div className="text-4xl mb-4">👁️</div>
              <p className="text-zinc-600 dark:text-zinc-400">
                Podgląd wygenerowanego UI pojawi się tutaj
              </p>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye size={16} />
                Podgląd
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code2 size={16} />
                Kod
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-4">
              {parseError ? (
                <div className="rounded-md border bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 p-4 text-sm text-red-800 dark:text-red-200">
                  <p className="font-semibold mb-2">Błąd parsowania:</p>
                  <pre className="whitespace-pre-wrap">{parseError}</pre>
                </div>
              ) : parsedTree ? (
                <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-6 bg-white dark:bg-zinc-900 min-h-[200px]">
                  <div className="w-full">{renderNode(parsedTree)}</div>
                </div>
              ) : (
                <div className="text-zinc-500 dark:text-zinc-400 text-sm">
                  Brak podglądu do wyświetlenia
                </div>
              )}
            </TabsContent>

            <TabsContent value="code" className="space-y-4">
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-900 p-4 overflow-x-auto">
                <pre className="text-sm text-zinc-100">
                  <code>{rawCode || "Brak kodu do wyświetlenia"}</code>
                </pre>
              </div>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(rawCode);
                }}
                variant="outline"
                className="w-full"
                disabled={!rawCode}
              >
                Kopiuj kod
              </Button>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
