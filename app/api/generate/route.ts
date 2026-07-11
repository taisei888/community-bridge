import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request: Request) {
  const body = await request.json();

  const {
    clubName,
    issueDate,
    activityReport,
    nextSchedule,
    announcements,
    memberVoice,
    editorName,
  } = body;

  const prompt = `あなたは老人クラブの会報編集のプロです。以下の情報をもとに、A4用紙1枚に収まる会報（月刊ニュースレター）のコンテンツを生成してください。

【入力情報】
- クラブ名: ${clubName}
- 発行号: ${issueDate}
- 今月の活動報告: ${activityReport}
- 来月の予定: ${nextSchedule}
- お知らせ・連絡事項: ${announcements}
- 会員のひとこと: ${memberVoice}
- 編集責任者: ${editorName}

【出力ルール】
以下のJSON形式で出力してください。余計な説明は不要です。JSONのみ出力してください。

{
  "title": "会報のタイトル（クラブ名 + 号数など）",
  "subtitle": "サブタイトルやキャッチコピー（季節感のあるもの）",
  "sections": [
    {
      "heading": "セクション見出し",
      "body": "本文（改行は\\nで表現）"
    }
  ],
  "footer": "発行元情報（クラブ名・編集者名・発行日）"
}

【注意点】
- sectionsは4〜6個程度
- 各セクションの本文は簡潔に（1セクション100文字以内目安）
- 高齢者が読みやすい、温かみのある文章にする
- 季節の挨拶を冒頭セクションに含める
- 入力が空欄の項目はスキップして構いません
- 必ず有効なJSONのみを返してください`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: "生成に失敗しました" }, { status: 500 });
    }

    const kaihoData = JSON.parse(jsonMatch[0]);
    return Response.json(kaihoData);
  } catch (error) {
    console.error("AI generation error:", error);
    return Response.json(
      { error: "AI生成中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
