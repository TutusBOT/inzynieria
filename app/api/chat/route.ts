import { NextRequest, NextResponse } from "next/server";

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
- Button, Input, Label, Checkbox, Tabs, Accordion

When user describes a UI or provides a sketch/image:
1. Analyze the request carefully
2. Generate clean, modern React/TypeScript code using shadcn/ui components
3. Use Tailwind CSS for styling
4. Provide complete, ready-to-use component code
5. Include necessary imports from @/components/ui
6. Make components responsive and accessible
7. Follow React best practices

Format your response as:
\`\`\`tsx
// Component code here
\`\`\`

Be creative and provide beautiful, functional UIs based on the user's description or sketch.`,
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
          model: "meta-llama/llama-guard-4-12b",
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
    const assistantMessage =
      data.choices[0]?.message?.content || "No response generated.";

    return NextResponse.json({
      message: assistantMessage,
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
