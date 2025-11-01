import { GoogleGenAI, Type } from "@google/genai";
import { TaskType, Difficulty, ProblemSet, GradingResult } from '../types';

if (!import.meta.env.VITE_API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

const problemSchema = {
  type: Type.OBJECT,
  properties: {
    instructions: {
      type: Type.STRING,
      description: "A short, clear instruction for the user on what data to enter. (in Japanese)"
    },
    templateHeaders: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of strings representing the column headers for the input table."
    },
    sourceData: {
      type: Type.ARRAY,
      description: "The ground truth data as an array of arrays (rows). Each inner array represents a row of data. The order of values in each inner array MUST EXACTLY MATCH the order of headers in 'templateHeaders'. All values should be strings.",
      items: { 
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    },
    displayData: {
      type: Type.STRING,
      description: "A user-friendly, formatted string of the source data for the user to read and type from. Use newlines to separate records. DO NOT use markdown tables."
    }
  },
  required: ["instructions", "templateHeaders", "sourceData", "displayData"]
};

export const generateProblem = async (taskType: TaskType, difficulty: Difficulty): Promise<ProblemSet> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Generate a data entry practice problem set with the following specifications:
    - Task Type: ${taskType.replace('_', ' ')}
    - Difficulty: ${difficulty}

    The data must be realistic for a business context but completely fictional. 
    It must not contain any real personal information or company details.
    The number of records should reflect the difficulty: easy (5-8 records), medium (10-15 records), hard (15-20 records with more complex data).
    
    IMPORTANT:
    - The 'sourceData' field must be an array of arrays. Each inner array represents one row of data.
    - The order of elements in each inner array must perfectly match the order of the corresponding headers in the 'templateHeaders' array. All values must be strings.
    - For the 'displayData' field, you MUST format the output as a numbered list. Each record MUST start on a new line and be prefixed with its number, a period, and a space. For example:
      1. 顧客ID: C-001, 氏名: 田中 健太...
      2. 顧客ID: C-002, 氏名: 佐藤 美咲...
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: problemSchema
      }
    });

    const jsonString = response.text;
    const parsedData = JSON.parse(jsonString);

    // Basic validation
    if (!parsedData.instructions || !parsedData.templateHeaders || !parsedData.sourceData || !parsedData.displayData) {
        throw new Error("AI response is missing required fields.");
    }

    return parsedData as ProblemSet;
  } catch (error) {
    console.error("Error generating problem with Gemini API:", error);
    throw new Error("Failed to generate a new problem. Please try again.");
  }
};

export const generateFeedback = async (
    result: GradingResult, 
    taskType: TaskType, 
    difficulty: Difficulty
): Promise<string> => {
  const model = "gemini-2.5-flash";

  const errorSummary = result.errors.slice(0, 5).map(e => 
    `- 行 ${e.rowIndex + 1}, 項目 「${e.header}」: 入力「${e.userValue}」, 正解「${e.correctValue}」`
  ).join('\n');

  const prompt = `
    あなたは、データ入力のスキルを指導する専門家コーチです。ユーザーがデータ入力の練習問題を完了しました。
    以下のパフォーマンスデータを分析し、日本語で、短く（2〜4文程度）、励ましと建設的なフィードバックを組み合わせた文章を生成してください。

    ## 練習問題の詳細:
    - 業務の種類: ${taskType.replace('_', ' ')}
    - 難易度: ${difficulty}

    ## ユーザーのパフォーマンス:
    - 正答率: ${result.accuracy.toFixed(2)}%
    - 入力時間: ${result.time} 秒
    - 全項目数: ${result.totalEntries}
    - 正解項目数: ${result.correctEntries}
    - ミスした箇所の数: ${result.errors.length}
    ${result.errors.length > 0 ? `\n## ミスの例:\n${errorSummary}` : ''}

    ## 指示:
    - フィードバックは必ず日本語で生成してください。
    - パフォーマンスが悪くても、常にポジティブで励ますようなトーンを心がけてください。
    - 正答率が低い場合は、ダブルチェックなどの精度を上げるための具体的な方法を提案してください。
    - スピードが遅い場合は、キーボードのショートカットやテンキーの活用など、速度を上げるための具体的な方法を提案してください。
    - パフォーマンスが全体的に良い場合は、その点を褒め、より難しいレベルへの挑戦を促してください。
    - Markdownは使用せず、平易なテキストの一つの段落として回答を生成してください。
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating feedback with Gemini API:", error);
    throw new Error("Failed to generate AI feedback.");
  }
};

export const analyzeMistakes = async (result: GradingResult): Promise<string> => {
  if (result.errors.length === 0) {
    return "素晴らしいです！ミスはありませんでした。この調子で頑張りましょう。";
  }

  const model = "gemini-2.5-flash";
  const errorDetails = result.errors.map(e => 
    `{ row: ${e.rowIndex + 1}, field: "${e.header}", userInput: "${e.userValue}", correctAnswer: "${e.correctValue}" }`
  ).join(',\n');

  const localTime = new Date(result.timestamp).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

  const prompt = `
    あなたは、データ入力の専門アナリストです。
    ユーザーの入力ミスデータを分析し、ケアレスミスの傾向について日本語で具体的な洞察を提供してください。

    ## ユーザーのパフォーマンス:
    - 実施時刻: ${localTime}
    - ミスの詳細リスト (JSON-like format):
    [
      ${errorDetails}
    ]

    ## 指示:
    1.  **ミスの分析**: 上記のミスを分析し、単純な打ち間違い、表記ルールの見落とし（例：スペースの有無、大文字・小文字）、固有名詞の間違いなど、どのような種類のミスが多いか特定します。
    2.  **改善策の提案**: 特定したミスの傾向に基づいて、ユーザーが実践できる具体的な改善策を提案します。
    3.  **時間帯の考慮**: 実施時刻（${localTime}）を考慮し、「この時間帯は集中力が落ちやすいかもしれません」のような、時間に関連する気づきがあれば、一言付け加えてください。
    4.  **トーン**: 専門的でありながらも、ユーザーをサポートするような、前向きで丁寧な口調で記述してください。
    5.  **形式**: 以下の3つの見出しを必ず使用し、それぞれの内容を簡潔に記述してください。見出しは **太字** にするためにアスタリスクで囲んでください (例: **ミスの傾向**)。各項目の説明は平易なテキストで記述し、箇条書き（- や *）は使用しないでください。

    **ミスの傾向**
    (ここに分析したミスの傾向を記述)

    **考えられる要因**
    (ここに考えられる要因を記述)

    **今後の対策**
    (ここに今後の対策を記述)
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error analyzing mistakes with Gemini API:", error);
    throw new Error("Failed to generate mistake analysis.");
  }
};