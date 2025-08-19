import { NextRequest, NextResponse } from "next/server";

const OPENAI_API_KEY = "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";

export async function POST(req: NextRequest) {
  try {

    const { messages } = await req.json();
    const openaiRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages,
          max_tokens: 256,
          temperature: 0.7,
        }),
      }
    );
    if (!openaiRes.ok) {
      const error = await openaiRes.text();
      console.error("OpenAI API error:", error);
      return NextResponse.json(
        { error: "OpenAI API error", details: error },
        { status: 500 }
      );
    }
    const data = await openaiRes.json();
    const result = data.choices?.[0]?.message?.content || "";
    return NextResponse.json({ result });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
