import {
  Language,
  Translator,
  TranslateQueryResult,
  TranslateError,
} from "@opentranslate/translator";
import { axios } from "./proxy";
import { OpenAIConfig } from "./types";

// 默认提示词模板
const DEFAULT_PROMPT = `You are a professional translator. Translate the following text to {to}. Only return the translated text without any explanation or additional information.

Text to translate:
{text}

Translation:`;

// 语言映射表 - 将 Language 映射为语言全名
const langMap: [Language, string][] = [
  ["auto", "auto-detect"],
  ["zh-CN", "Simplified Chinese"],
  ["zh-TW", "Traditional Chinese"],
  ["en", "English"],
  ["ja", "Japanese"],
  ["ko", "Korean"],
  ["fr", "French"],
  ["es", "Spanish"],
  ["ru", "Russian"],
  ["de", "German"],
  ["it", "Italian"],
  ["tr", "Turkish"],
  ["pt", "Portuguese"],
  ["vi", "Vietnamese"],
  ["id", "Indonesian"],
  ["th", "Thai"],
  ["ms", "Malay"],
  ["ar", "Arabic"],
  ["hi", "Hindi"],
  ["nl", "Dutch"],
  ["pl", "Polish"],
  ["sv", "Swedish"],
  ["no", "Norwegian"],
  ["da", "Danish"],
  ["fi", "Finnish"],
  ["cs", "Czech"],
  ["ro", "Romanian"],
  ["hu", "Hungarian"],
  ["el", "Greek"],
  ["uk", "Ukrainian"],
  ["bg", "Bulgarian"],
  ["hr", "Croatian"],
  ["sk", "Slovak"],
  ["sl", "Slovenian"],
  ["et", "Estonian"],
  ["lv", "Latvian"],
  ["lt", "Lithuanian"],
  ["sr", "Serbian"],
  ["he", "Hebrew"],
  ["fa", "Persian"],
  ["bn", "Bengali"],
  ["ta", "Tamil"],
  ["te", "Telugu"],
  ["mr", "Marathi"],
  ["ur", "Urdu"],
  ["gu", "Gujarati"],
  ["kn", "Kannada"],
  ["ml", "Malayalam"],
  ["pa", "Punjabi"],
  ["ne", "Nepali"],
  ["si", "Sinhala"],
  ["km", "Khmer"],
  ["lo", "Lao"],
  ["my", "Burmese"],
  ["ka", "Georgian"],
  ["hy", "Armenian"],
  ["az", "Azerbaijani"],
  ["kk", "Kazakh"],
  ["uz", "Uzbek"],
  ["ky", "Kyrgyz"],
  ["tg", "Tajik"],
  ["mn", "Mongolian"],
  ["am", "Amharic"],
  ["sw", "Swahili"],
  ["af", "Afrikaans"],
  ["sq", "Albanian"],
  ["be", "Belarusian"],
  ["bs", "Bosnian"],
  ["ca", "Catalan"],
  ["cy", "Welsh"],
  ["eo", "Esperanto"],
  ["eu", "Basque"],
  ["fil", "Filipino"],
  ["ga", "Irish"],
  ["gd", "Scottish Gaelic"],
  ["gl", "Galician"],
  ["ha", "Hausa"],
  ["haw", "Hawaiian"],
  ["hmn", "Hmong"],
  ["ht", "Haitian Creole"],
  ["ig", "Igbo"],
  ["is", "Icelandic"],
  ["jw", "Javanese"],
  ["ku", "Kurdish"],
  ["la", "Latin"],
  ["lb", "Luxembourgish"],
  ["mg", "Malagasy"],
  ["mi", "Maori"],
  ["mk", "Macedonian"],
  ["mt", "Maltese"],
  ["ny", "Chichewa"],
  ["ps", "Pashto"],
  ["sm", "Samoan"],
  ["sn", "Shona"],
  ["so", "Somali"],
  ["st", "Sesotho"],
  ["su", "Sundanese"],
  ["sd", "Sindhi"],
  ["xh", "Xhosa"],
  ["yi", "Yiddish"],
  ["yo", "Yoruba"],
  ["zu", "Zulu"],
];

export interface OpenAIChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenAIChatRequest {
  model: string;
  messages: OpenAIChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface OpenAIChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: OpenAIChatMessage;
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenAI extends Translator<OpenAIConfig> {
  readonly name: string = "openai";

  /** Translator lang to language name */
  private static readonly langMap = new Map(langMap);

  /** Language name to translator lang */
  private static readonly langMapReverse = new Map(
    langMap.map(([translatorLang, lang]) => [lang, translatorLang])
  );

  config: OpenAIConfig = {
    apiBase: "https://api.openai.com/v1",
    apiKey: "",
    model: "gpt-3.5-turbo",
    prompt: DEFAULT_PROMPT,
    temperature: 0.3,
    maxTokens: 2000,
  };

  constructor(options: { axios: any; config: any }) {
    super(options.axios);
    
    // 处理从配置系统传来的配置，字符串值需要转换
    if (options.config) {
      this.config.apiBase = options.config.apiBase || this.config.apiBase;
      this.config.apiKey = options.config.apiKey || "";
      this.config.model = options.config.model || this.config.model;
      
      // 如果用户提供了自定义提示词，使用它；"default" 表示使用默认提示词
      if (options.config.prompt && options.config.prompt !== "default") {
        this.config.prompt = options.config.prompt;
      }
      
      // 将字符串转换为数字
      if (options.config.temperature) {
        const temp = parseFloat(options.config.temperature);
        this.config.temperature = isNaN(temp) ? 0.3 : temp;
      }
      
      if (options.config.maxTokens) {
        const maxTokens = parseInt(options.config.maxTokens);
        this.config.maxTokens = isNaN(maxTokens) ? 2000 : maxTokens;
      }
    }
  }

  /**
   * 构建提示词
   */
  private buildPrompt(text: string, from: Language, to: Language): string {
    const fromLang = OpenAI.langMap.get(from) || from;
    const toLang = OpenAI.langMap.get(to) || to;
    const prompt = this.config.prompt || DEFAULT_PROMPT;

    // 如果源语言是 auto，就不在提示词中指定源语言，让 LLM 自动识别
    const actualPrompt = from === "auto" 
      ? prompt.replace(/from {from} /g, "")
      : prompt;

    return actualPrompt
      .replace(/{from}/g, fromLang)
      .replace(/{to}/g, toLang)
      .replace(/{text}/g, text);
  }

  /**
   * 调用 OpenAI 兼容 API
   */
  private async callOpenAI(
    messages: OpenAIChatMessage[],
    config: OpenAIConfig
  ): Promise<OpenAIChatResponse> {
    const apiUrl = config.apiBase.endsWith("/")
      ? `${config.apiBase}chat/completions`
      : `${config.apiBase}/chat/completions`;

    const requestData: OpenAIChatRequest = {
      model: config.model || "gpt-3.5-turbo",
      messages: messages,
      temperature: config.temperature !== undefined ? config.temperature : 0.3,
      max_tokens: config.maxTokens !== undefined ? config.maxTokens : 2000,
      stream: false,
    };

    try {
      const response = await this.axios.post<OpenAIChatResponse>(
        apiUrl,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("OpenAI API 调用失败:", error);
      if (error && typeof error === 'object' && 'response' in error) {
        console.error("错误响应:", (error as any).response.data);
        throw new TranslateError("API_SERVER_ERROR");
      }
      throw new TranslateError("NETWORK_ERROR");
    }
  }

  /**
   * 执行翻译查询
   */
  protected async query(
    text: string,
    from: Language,
    to: Language,
    config: OpenAIConfig
  ): Promise<TranslateQueryResult> {
    // 检查 API 密钥是否配置
    if (!config.apiKey) {
      console.error("OpenAI API 密钥未配置");
      throw new TranslateError("API_SERVER_ERROR");
    }

    // 构建提示词
    const prompt = this.buildPrompt(text, from, to);

    // 调用 OpenAI API
    const messages: OpenAIChatMessage[] = [
      {
        role: "user",
        content: prompt,
      },
    ];

    const response = await this.callOpenAI(messages, config);

    if (
      !response.choices ||
      response.choices.length === 0 ||
      !response.choices[0].message
    ) {
      console.error("OpenAI API 响应格式异常:", response);
      throw new TranslateError("API_SERVER_ERROR");
    }

    const translatedText = response.choices[0].message.content.trim();

    return {
      text: text,
      from: from, // LLM 会自动识别源语言，直接使用传入的值
      to,
      origin: {
        paragraphs: text.split(/\n+/),
        tts: (await this.textToSpeech(text, from)) || "",
      },
      trans: {
        paragraphs: translatedText.split(/\n+/),
        tts: (await this.textToSpeech(translatedText, to)) || "",
      },
    };
  }

  /**
   * 获取支持的语言列表
   */
  getSupportLanguages(): Language[] {
    return [...OpenAI.langMap.keys()];
  }

  /**
   * 语言检测 - LLM 会在翻译时自动识别，无需单独检测
   */
  async detect(text: string): Promise<Language> {
    return "auto";
  }
}

export default OpenAI;
