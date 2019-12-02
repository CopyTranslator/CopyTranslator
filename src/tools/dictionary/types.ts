interface Phonetic {
  type: string;
  value: string;
}

interface Explain {
  type: string;
  trans: string;
}

interface Example {
  from: string;
  to: string;
}

export interface Suggest {
  word: string;
  translate: string;
}

export const dictionaryTypes = ["google", "youdao", "bing"] as const;
export type DictionaryType = (typeof dictionaryTypes)[number];
export interface DictResult {
  words: string;
  phonetics?: Array<Phonetic>;
  explains?: Array<Explain>;
  examples?: Array<Example>;
  suggests?: Array<Suggest>;
  engine: DictionaryType;
  url?: string;
}

export abstract class WordEngine {
  abstract name: DictionaryType;
  abstract query(words: string): Promise<DictResult>;
}
