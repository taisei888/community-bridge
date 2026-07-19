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

  const hasUploadedPhotos = body.hasUploadedPhotos || false;
  const uploadedPhotoDescriptions = body.uploadedPhotoDescriptions || "なし";

  const prompt = `あなたは、老人クラブ・自治会・地域シニア団体向けの会報を作成する、プロの編集者兼デザイナーです。

ユーザーが入力した短い情報をもとに、A4縦1ページの会報として使える文章・構成・レイアウト選択・イラスト指示・デザイン情報をJSONで作成してください。

目的は、老人クラブの役員が少ない文章を入力するだけで、読みやすく、明るく、参加したくなるPOPな会報を自動生成することです。

重要：
- 入力情報を最優先にしてください。
- 入力されていない固有名詞、人名、日付、参加人数は勝手に追加しないでください。
- ただし、入力内容が短い場合は、一般的な老人クラブ・地域活動・季節行事・健康づくり・交流活動の文脈を補足し、自然で温かい会報文に膨らませてください。
- 「世間では高齢者の交流機会や健康づくりが大切にされています」など、一般的な背景説明や地域活動の意義を自然に加えてください。
- 空白が目立たないように、各セクションに必要な文章量を補ってください。
- ただし、存在しない具体的な事実を断定しないでください。
- 入力に誤字がある場合は、自然な日本語に補正してください。
- A4縦1ページに収まるように、長すぎる文章は要約してください。
- 文字は高齢者にも読みやすいように、大きめに表示する前提で文章量を調整してください。
- 本文は短めの段落に分け、読みやすさを優先してください。
- 出力は必ずJSONのみ。説明文、補足、markdownは不要です。

会報の雰囲気：
- 明るい
- POP
- 親しみやすい
- 温かい
- 地域感がある
- 参加したくなる
- 高齢者にも読みやすい
- 固すぎない
- 楽しい行事感がある
- 家族が見ても安心できる

デザイン方針：
- A4縦1ページ
- 文字サイズは大きめ
- 見出しは太く、丸みがあり、目立つデザイン
- フォントは統一しすぎず、タイトル・見出し・本文で雰囲気を変える
- タイトルはPOPで大きく、少し遊びのある雰囲気
- 本文は読みやすいゴシック系
- 見出しは丸文字風・手書き風・太字などを組み合わせる
- 色は明るいパステル調
- 若草色、ピンク、オレンジ、水色、黄色をバランスよく使う
- 角丸カード、吹き出し、リボン、丸い日付バッジ、点線区切りを使う
- 空白が出すぎないように、装飾・イラスト・小さなコメント枠を自然に配置する
- 古臭い行政資料ではなく、明るいチラシ・地域新聞・かわいい会報のような印象にする

写真・イラスト方針：
- ユーザーが写真をアップロードしている場合は、その写真を使う前提のレイアウト指示を出してください。
- 写真がない場合は、写真枠を空白にせず、そこに入れるためのイラスト生成指示を必ず作成してください。
- 写真がない場合のイラストは、会報全体の雰囲気に合う、やさしく明るいタッチにしてください。
- 写真の代わりに使うイラストは、老人クラブ・地域交流・健康づくり・季節感・笑顔・やさしい雰囲気を感じられるものにしてください。
- 入力された活動内容に関連するイラストを優先してください。
- 入力内容に具体的な活動がない場合は、汎用的な「笑顔のシニア」「地域の交流」「季節の花や飾り」「カレンダー」「お知らせ掲示板」などのイラストを提案してください。
- ただし、入力にない具体的な活動を実施したかのようなイラスト説明は避けてください。
- イラストは、写真枠・見出し横・余白・下部装飾に自然に配置できるようにしてください。
- A4の空白が目立つ場合は、イラストや装飾を増やして紙面を埋める方向で提案してください。
- イラストはリアル写真風ではなく、POPでかわいいチラシ風・手描き風・やさしいフラットイラスト風にしてください。
- イラストには文字を入れないでください。文字はHTML/CSS側で表示します。

イラスト生成方針：
- 入力内容に合う、やさしいイラストを提案してください。
- 実写真がない場合でも、会報が寂しくならないようにイラスト指示を入れてください。
- 人物イラストは、笑顔のシニア、地域交流、健康づくり、季節行事などを想定してください。
- 季節に合わせた装飾も提案してください。
- ただし、入力にない具体的な活動を断定するイラスト指示は避けてください。
- 画像生成AIにそのまま渡せるように、illustrationPrompt や imagePrompt は具体的に書いてください。
- 背景に馴染みやすい、白背景または透過背景向きのイラストを想定してください。

文章補足方針：
- 入力が短い場合は、以下のような一般的な文脈を自然に追加してください。
  - 高齢者の健康づくり
  - 外出機会の大切さ
  - 地域でのつながり
  - 孤立防止
  - 役員や参加者への感謝
  - 季節の注意喚起
  - 無理なく楽しく参加する雰囲気
  - 初参加の方も参加しやすい呼びかけ
  - 家族や地域の方にも活動が伝わる安心感
- ただし「実施しました」「参加者が多く集まりました」など、入力にない事実は断定しないでください。
- 不明な場合は「予定しています」「呼びかけています」「大切にしていきます」など自然な表現にしてください。

文章量の目安：
- 今月の活動報告：1項目につき100〜160字程度
- 来月の予定：1項目につき30〜70字程度
- お知らせ：1項目につき50〜90字程度
- 会員のひとこと：1人あたり30〜60字程度
- 編集後記：100〜160字程度
- 空白が出そうな場合は「今月の一言」「季節の健康メモ」「参加の呼びかけ」などを extraBox に追加してもよい

レイアウト選択ルール：
- 入力内容や発行月、情報量に応じて、毎回最適な layoutPattern を選んでください。
- 同じ入力でも、デザインに変化を出せるように layoutVariant を 1〜3 の中から選んでください。
- 情報量が多い場合は、読みやすさを優先して simple_pop または magazine を選んでください。
- 行事やイベント告知が中心の場合は event を選んでください。
- 写真やイラストを大きく見せたい場合は cheerful を選んでください。
- 通常の会報らしさとPOP感を両立したい場合は pop を選んでください。
- 空白が多くなりそうな場合は、イラストや extraBox を活用しやすい layoutPattern を選んでください。
- layoutPattern と layoutVariant の組み合わせで、毎回違う紙面構成になるようにしてください。
- layoutReason には、そのレイアウトを選んだ理由を短く入れてください。

layoutPattern は以下から1つ選んでください。
- pop: 明るくカラフルなPOP会報
- cheerful: イラスト多めの楽しい会報
- magazine: 地域新聞・雑誌風
- event: 行事告知を強調した会報
- simple_pop: 読みやすさ重視のPOP会報

layoutVariant は以下から1つ選んでください。
- 1
- 2
- 3

seasonTheme は発行月に合わせて以下から1つ選んでください。
- spring
- summer
- autumn
- winter

fontDirection は以下のように指定してください。
- titleFont: POPで太め、丸みのあるフォント
- headingFont: 手書き風または丸ゴシック風
- bodyFont: 読みやすいゴシック系
- accentFont: 数字や日付を目立たせる太字フォント

写真・イラスト配置ルール：
- 各活動報告には、photoSlot を必ず作成してください。
- 写真がある場合は photoSlot.type を "photo" にしてください。
- 写真がない場合は photoSlot.type を "illustration" にしてください。
- photoSlot.illustrationPrompt には、その枠に入れるイラストの生成指示を具体的に書いてください。
- メインビジュアル枠がある場合も、写真がなければ mainVisual.type を "illustration" にしてください。
- 写真がない場合でも、mainVisual または activityReport の photoSlot のどちらかには必ずイラスト指示を入れてください。
- イラスト生成指示は、画像生成AIにそのまま渡せるようにしてください。
- ただし、文字入りイラストは避けてください。文字はHTML/CSS側で表示するため、イラストには文字を入れないでください。
- イラストは白背景または透過背景に合う、明るいPOPなフラットイラストにしてください。

出力JSON形式：
{
  "title": "",
  "subtitle": "",
  "issueLabel": "",
  "publishDate": "",
  "clubName": "",
  "layoutPattern": "",
  "layoutVariant": "",
  "layoutReason": "",
  "seasonTheme": "",
  "designMood": "",
  "themeColor": {
    "main": "",
    "sub": "",
    "accent": "",
    "background": "",
    "text": ""
  },
  "fontDirection": {
    "titleFont": "",
    "headingFont": "",
    "bodyFont": "",
    "accentFont": ""
  },
  "designDirection": "",
  "mainVisual": {
    "type": "",
    "position": "",
    "imagePrompt": "",
    "altText": ""
  },
  "illustrationDirection": {
    "mainIllustration": "",
    "smallDecorations": [],
    "sectionIcons": {
      "activityReport": "",
      "nextSchedule": "",
      "notices": "",
      "memberVoices": "",
      "editorNote": "",
      "extraBox": ""
    }
  },
  "sections": {
    "activityReport": {
      "title": "今月の活動報告",
      "summaryLead": "",
      "items": [
        {
          "date": "",
          "headline": "",
          "body": "",
          "photoSlot": {
            "type": "",
            "useUploadedPhoto": false,
            "illustrationPrompt": "",
            "altText": ""
          }
        }
      ]
    },
    "nextSchedule": {
      "title": "来月の予定",
      "items": [
        {
          "date": "",
          "event": "",
          "description": "",
          "iconPrompt": ""
        }
      ]
    },
    "notices": {
      "title": "お知らせ・連絡事項",
      "items": [
        {
          "headline": "",
          "body": "",
          "iconPrompt": ""
        }
      ]
    },
    "memberVoices": {
      "title": "会員のひとこと",
      "items": [
        {
          "name": "",
          "comment": "",
          "avatarPrompt": ""
        }
      ]
    },
    "extraBox": {
      "title": "",
      "body": "",
      "iconPrompt": ""
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
編集責任者：${editorName}
写真アップロード有無：${hasUploadedPhotos}
写真情報：${uploadedPhotoDescriptions}

最終ルール：
- JSON以外は返さない
- 入力にない固有名詞・人名・日付・参加人数は作らない
- 短い入力でも、一般的な地域活動の背景や意義を補って空白を減らす
- 高齢者にも読みやすいように、文章はやさしく、文字が大きく表示される前提で短く整える
- POPで明るい会報になるよう、イラスト指示・配色・フォント方向も必ず出力する
- 写真がない場合は、必ず写真枠の代わりになるイラスト生成指示を出す
- イラストには文字を入れない
- layoutPattern と layoutVariant を必ず出力する`;

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 4000,
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0]?.message?.content ?? "";

    const kaihoData = JSON.parse(text);

    // Normalize: ensure notices.items contains proper data
    if (kaihoData.sections?.notices?.items) {
      kaihoData.sections.notices.items = kaihoData.sections.notices.items.map(
        (item: unknown) => {
          if (typeof item === "string") return { headline: "", body: item, iconPrompt: "" };
          return item;
        }
      );
    }

    // Normalize: ensure all required nested objects exist
    const sec = kaihoData.sections || {};
    kaihoData.sections = {
      activityReport: sec.activityReport || { title: "今月の活動報告", summaryLead: "", items: [] },
      nextSchedule: sec.nextSchedule || { title: "来月の予定", items: [] },
      notices: sec.notices || { title: "お知らせ・連絡事項", items: [] },
      memberVoices: sec.memberVoices || { title: "会員のひとこと", items: [] },
      extraBox: sec.extraBox || null,
      editorNote: sec.editorNote || { title: "編集後記", body: "" },
      editor: sec.editor || { title: "編集責任者", name: editorName || "老人クラブ役員一同" },
    };

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
