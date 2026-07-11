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

  const prompt = `あなたは、地域の老人クラブ・シニア団体向けの会報を作成するプロの編集者兼デザイナーです。

入力された情報をもとに、温かく、読みやすく、親しみやすい老人クラブ会報を作成してください。

目的は、単なる文章生成ではなく、地域の高齢者が読んで「楽しそう」「参加したい」「安心する」と感じる会報に仕上げることです。

以下の条件を必ず守ってください。

【会報の雰囲気】
- 明るく、やさしく、温かい雰囲気
- 地域のつながり、健康、交流、生きがいを感じる内容
- 高齢者にも読みやすい、丁寧で自然な日本語
- 堅すぎず、少し親しみのある文章
- 行事の楽しさや参加者の様子が伝わる表現
- 季節感を入れる
- 誤字があっても自然に補正し、会報としてきれいな文章に整える

【デザインイメージ】
- A4縦の会報レイアウト
- 生成される会報は、柔らかいクリーム色の背景
- アクセントカラーは、若草色、淡いオレンジ、やさしい水色、薄いピンク
- 見出しには丸みのある帯やラベルを使う
- セクションごとに白または淡色のカードで区切る
- 余白を広めに取り、文字を詰め込みすぎない
- 花、葉っぱ、ひまわり、風鈴、バス、グラウンドゴルフ、体操、カラオケなどの小さなイラストが似合う雰囲気
- 写真を入れる場合は「健康体操の写真」「地域清掃の写真」「グラウンドゴルフの写真」など、どんな写真を入れるべきかも提案する

【文章構成】
以下のセクションを作成してください。

1. タイトル
例：東浦老人クラブ 会報

2. サブタイトル
例：〜つながり・支えあい・生きがいづくり〜

3. 発行情報
発行日、発行号、クラブ名

4. 今月の活動報告
入力された活動内容を、読みやすい会報文に整えてください。
活動ごとに見出しを付け、参加人数や雰囲気が伝わるようにしてください。

5. 来月の予定
日付ごとに整理し、見やすい予定表としてまとめてください。

6. お知らせ・連絡事項
重要な連絡を、やさしく分かりやすい文章に整えてください。

7. 会員のひとこと
入力された内容を自然なコメントに整えてください。
複数ある場合は、名前ごとに短く温かいコメントにしてください。

8. 編集後記
季節感と感謝が伝わる短い文章を作成してください。

9. 編集責任者
入力がある場合はその名前を使ってください。
ない場合は「老人クラブ役員一同」としてください。

【出力形式】
必ず以下のJSON形式だけで返してください。
説明文や補足は不要です。

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

【入力情報】
クラブ名：${clubName}
発行日：${issueDate}
今月の活動報告：${activityReport}
来月の予定：${nextSchedule}
お知らせ：${announcements}
会員のひとこと：${memberVoice}
編集責任者：${editorName}

デザインは、自治会・老人クラブ・地域会報らしい温かさを重視してください。
ただし古臭くなりすぎず、今風のやわらかいカード型レイアウトにしてください。
生成結果は、淡い色の見出し帯、丸角カード、季節のワンポイントイラスト、写真枠が自然に入るような構成にしてください。`;

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
