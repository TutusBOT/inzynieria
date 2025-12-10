import { NextRequest, NextResponse } from "next/server";
import { parse } from "@babel/parser";

function getJSXName(node: any): string {
  if (!node) return "";
  if (node.type === "JSXIdentifier") return node.name;
  if (node.type === "JSXMemberExpression") {
    return getJSXName(node.object) + "." + getJSXName(node.property);
  }
  return "";
}

function literalFromNode(node: any) {
  if (!node) return undefined;
  if (node.type === "StringLiteral") return node.value;
  if (node.type === "NumericLiteral") return node.value;
  if (node.type === "BooleanLiteral") return node.value;
  if (node.type === "NullLiteral") return null;
  if (node.type === "TemplateLiteral" && node.quasis.length === 1)
    return node.quasis[0].value.cooked;
  return undefined;
}

function jsxToTree(node: any): any {
  if (!node) return null;
  if (node.type === "JSXElement") {
    const opening = node.openingElement;
    const name = getJSXName(opening.name);
    const props: Record<string, any> = {};
    for (const attr of opening.attributes) {
      if (attr.type === "JSXAttribute") {
        const propName = attr.name.name;
        if (!attr.value) {
          props[propName] = true;
          continue;
        }
        if (attr.value.type === "StringLiteral") {
          props[propName] = attr.value.value;
        } else if (attr.value.type === "JSXExpressionContainer") {
          const lit = literalFromNode(attr.value.expression);
          if (lit !== undefined) props[propName] = lit;
          // else skip non-literal props
        }
      }
    }
    const children: any[] = [];
    for (const ch of node.children) {
      if (ch.type === "JSXText") {
        const txt = ch.value.replace(/\s+/g, " ").trim();
        if (txt) children.push({ type: "text", value: txt });
      } else if (ch.type === "JSXElement") {
        children.push(jsxToTree(ch));
      } else if (ch.type === "JSXExpressionContainer") {
        const lit = literalFromNode(ch.expression);
        if (lit !== undefined)
          children.push({ type: "text", value: String(lit) });
      }
    }
    return { type: "element", name, props, children };
  }
  if (node.type === "JSXFragment") {
    const children: any[] = [];
    for (const ch of node.children) {
      if (ch.type === "JSXText") {
        const txt = ch.value.replace(/\s+/g, " ").trim();
        if (txt) children.push({ type: "text", value: txt });
      } else if (ch.type === "JSXElement") {
        children.push(jsxToTree(ch));
      } else if (ch.type === "JSXExpressionContainer") {
        const lit = literalFromNode(ch.expression);
        if (lit !== undefined)
          children.push({ type: "text", value: String(lit) });
      }
    }
    return { type: "fragment", children };
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Build messages for Groq API with system prompt
    const groqMessages = [
      {
        role: "system",
        content: `You are a UI/UX expert assistant that generates React components using shadcn/ui library and Tailwind CSS.

Available shadcn/ui components:
- Accordion, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Chart, Checkbox, Dialog
- Form, Input, Label, Pagination, Popover, Progress, Separator, Skeleton, Spinner
- Table, Tabs, Tooltip

RESPONSE FORMAT (REQUIRED):
Always respond in this exact format:
1. First, write a brief, friendly explanation of what you created/changed (1-3 sentences)
2. Then, include a code block with the JSX

Example:
"I've created a login form with email and password fields. The button has a nice blue color that should look great!"

\`\`\`tsx
// JSX only — no imports/exports
<div className="flex flex-col gap-4 max-w-md p-6">
  <Label>Email</Label>
  <Input type="email" placeholder="Enter your email" />
  <Label>Password</Label>
  <Input type="password" placeholder="Enter password" />
  <Button className="bg-blue-600">Login</Button>
</div>
\`\`\`

IMPORTANT RULES:
- ALWAYS include both text explanation AND code block
- Text should be conversational and friendly
- Code must be JSX only — DO NOT include any import or export statements
- The preview environment provides all components at runtime, so just reference them directly
- Use shadcn/ui component names: Accordion, Avatar, Badge, Breadcrumb, Button, Calendar, Card, Chart, Checkbox, Dialog, Form, Input, Label, Pagination, Popover, Progress, Separator, Skeleton, Spinner, Table, Tabs, Tooltip
- Use Tailwind CSS for styling
- Make components responsive and accessible
- Keep code clean and well-structured

Be creative and provide beautiful, functional UIs!`,
      },
      ...messages.map((msg: any) => {
        // Handle images in the message
        if (msg.images && msg.images.length > 0) {
          return {
            role: msg.role,
            content: [
              {
                type: "text",
                text:
                  msg.content ||
                  "Analyze this image and create a UI component based on it.",
              },
              ...msg.images.map((img: string) => ({
                type: "image_url",
                image_url: {
                  url: img,
                },
              })),
            ],
          };
        }
        return {
          role: msg.role,
          content: msg.content,
        };
      }),
    ];

    // Call Groq API
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-maverick-17b-128e-instruct",
          messages: groqMessages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Groq API error:", errorData);
      return NextResponse.json(
        { error: "Failed to get response from Groq API", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Groq API response data:", data);
    for (const choice of data.choices) {
      console.log("Choice message content:", JSON.stringify(choice.message));
    }

    // Helper to extract readable content from various Groq response shapes
    const parseMessageContent = (msg: any) => {
      if (!msg) return "";
      const content = msg.content ?? msg;
      if (!content && typeof content !== "number") return "";

      if (typeof content === "string") return content;

      if (Array.isArray(content)) {
        // content can be an array mixing text blocks and image_url objects
        return content
          .map((c: any) => {
            if (!c) return "";
            if (typeof c === "string") return c;
            if (c.type === "text") return c.text ?? "";
            if (c.type === "image_url") return c.image_url?.url ?? "";
            if (c.content && typeof c.content === "string") return c.content;
            return JSON.stringify(c);
          })
          .join("\n");
      }

      if (typeof content === "object") {
        if (content.text) return content.text;
        return JSON.stringify(content);
      }

      return String(content);
    };

    let assistantMessage = parseMessageContent(data.choices?.[0]?.message);
    let parsedTree = null;
    let parseError = null;

    // Attempt to parse assistantMessage as TSX/JSX and extract a safe tree
    try {
      if (assistantMessage && assistantMessage.trim()) {
        // Strip fenced code block markers if present
        const fencedMatch = /```(?:tsx?|jsx)?\n([\s\S]*?)```/.exec(
          assistantMessage
        );
        const code = fencedMatch ? fencedMatch[1] : assistantMessage;
        // Try parsing as a module first
        let ast;
        try {
          ast = parse(code, {
            sourceType: "module",
            plugins: ["typescript", "jsx"],
          });
        } catch (e) {
          // Try parsing as an expression by wrapping
          ast = parse(`const __x = (${code})`, {
            sourceType: "module",
            plugins: ["typescript", "jsx"],
          });
        }

        // Find first JSX element or fragment in AST
        let jsxNode: any = null;
        for (const node of ast.program.body) {
          if (
            node.type === "ExpressionStatement" &&
            (node.expression.type === "JSXElement" ||
              node.expression.type === "JSXFragment")
          ) {
            jsxNode = node.expression;
            break;
          }
          if (node.type === "VariableDeclaration") {
            for (const decl of node.declarations) {
              if (
                decl.init &&
                (decl.init.type === "JSXElement" ||
                  decl.init.type === "JSXFragment")
              ) {
                jsxNode = decl.init;
                break;
              }
              if (
                decl.init &&
                decl.init.type === "ArrowFunctionExpression" &&
                decl.init.body &&
                (decl.init.body.type === "JSXElement" ||
                  decl.init.body.type === "JSXFragment")
              ) {
                jsxNode = decl.init.body;
                break;
              }
            }
          }
          if (node.type === "FunctionDeclaration" && node.body) {
            for (const stmt of node.body.body) {
              if (
                stmt.type === "ReturnStatement" &&
                stmt.argument &&
                (stmt.argument.type === "JSXElement" ||
                  stmt.argument.type === "JSXFragment")
              ) {
                jsxNode = stmt.argument;
                break;
              }
            }
          }
        }

        if (jsxNode) {
          parsedTree = jsxToTree(jsxNode);
        }
      }
    } catch (err: any) {
      console.error("JSX parse error", err);
      parseError = err instanceof Error ? err.message : String(err);
    }

    // If the guard responded with a simple 'safe' label, retry once with a fallback model
    if (assistantMessage && assistantMessage.trim().toLowerCase() === "safe") {
      console.warn(
        "Groq returned a guard/safety response. Retrying with fallback model..."
      );
      const fallbackModel =
        process.env.GROQ_FALLBACK_MODEL || "meta-llama/llama-2-13b-chat";
      try {
        const retryResp = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: fallbackModel,
              messages: groqMessages,
              temperature: 0.7,
              max_tokens: 1024,
            }),
          }
        );

        if (retryResp.ok) {
          const data2 = await retryResp.json();
          console.log("Groq fallback response data:", data2);
          assistantMessage =
            parseMessageContent(data2.choices?.[0]?.message) ||
            assistantMessage;
        } else {
          console.error(
            "Fallback model request failed",
            await retryResp.text()
          );
        }
      } catch (err) {
        console.error("Fallback request error", err);
      }
    }

    return NextResponse.json({
      message: assistantMessage,
      tree: parsedTree,
      parseError,
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
