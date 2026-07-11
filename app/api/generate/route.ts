import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

  const prompt = `あなたは、地域の老人クラブ・シニア団体向けの会報を作成する編集者です。

以下の入力情報のみを根拠に、A4縦1ページに収まる老人クラブ会報の文章データを作成してください。

重要：
- 入力されていない固有名詞、人名、日付、参加人数、活動名は追加しないでください。
- 過去の例文、サンプル文章、以前の生成結果を使用しないでください。
- 入力内容が少ない場合でも、存在しない具体的な活動や人物を作らないでください。
- 入力文に誤字がある場合は、自然な日本語に補正してください。
- 文章は会報らしく、温かく、読みやすく、親しみやすい表現に整えてください。
- 高齢者にも読みやすいように、文章は短めにしてください。
- A4縦1ページに収まる文章量を最優先にしてください。

会報の雰囲気：
- 明るく、やさしく、温かい雰囲気
- 地域のつながり、健康、交流、生きがいを感じる内容
- 堅すぎず、親しみのある文章
- 季節感を少し入れる
- 文字を詰め込みすぎない

デザイン方針：
- A4縦の会報レイアウト
- 柔らかいクリーム色の背景
- 若草色、淡いオレンジ、やさしい水色、薄いピンクを使う
- 丸みのある見出し帯
- セクションごとのカード型レイアウト
- 写真がない場合は、具体的な写真を作らず、イラスト風の装飾のみを想定する
- 入力内容にない活動を連想させる写真・イラスト指示は出さない

文章量の目安：
- 今月の活動報告：1項目80〜120字程度
- 来月の予定：1項目20〜50字程度
- お知らせ：1項目40〜70字程度
- 会員のひとこと：1人あたり30〜50字程度
- 編集後記：80字以内

出力は必ずJSONのみで返してください。
説明文、補足、markdownは不要です。

JSON形式：
{
  "title": "",
  "subtitle": "",
  "issueLabel": "",
  "publishDate": "",
  "clubName": "",
  "themeColor": {
    "main": "",
    "sub": "",
    "accent": "",
    "background": ""
  },
  "designDirection": "",
  "sections": {
    "activityReport": {
      "title": "今月の活動報告",
      "items": [
        {
          "date": "",
          "headline": "",
          "body": "",
          "photoSuggestion": "",
          "iconSuggestion": ""
        }
      ]
    },
    "nextSchedule": {
      "title": "来月の予定",
      "items": [
        {
          "date": "",
          "event": "",
          "description": ""
        }
      ]
    },
    "notices": {
      "title": "お知らせ・連絡事項",
      "items": []
    },
    "memberVoices": {
      "title": "会員のひとこと",
      "items": [
        {
          "name": "",
          "comment": ""
        }
      ]
    },
    "editorNote": {
      "title": "編集後記",
      "body": ""
    },
    "editor": {
      "title": "編集責任者",
      "name": ""
    }
  }
}

入力情報：
クラブ名：${clubName}
発行日：${issueDate}
発行号：${issueDate}
今月の活動報告：${activityReport}
来月の予定：${nextSchedule}
お知らせ：${announcements}
会員のひとこと：${memberVoice}
編集責任者：${editorName}`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 2500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0]?.message?.content ?? "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: "生成に失敗しました" }, { status: 500 });
    }

    const kaihoData = JSON.parse(jsonMatch[0]);
    return Response.json(kaihoData);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "不明なエラー";
    console.error("AI generation error:", message);
    return Response.json(
      { error: `AI生成エラー: ${message}` },
      { status: 500 }
    );
  }
}
