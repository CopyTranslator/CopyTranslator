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
export type DictionaryType = typeof dictionaryTypes[number];
export interface DictResult {
  words: string;
  explains: Array<Explain>;
  phonetics?: Array<Phonetic>;
  examples?: Array<Example>;
  suggests?: Array<Suggest>;
  engine: DictionaryType;
  url?: string;
}

export abstract class WordEngine {
  abstract name: DictionaryType;
  abstract query(words: string): Promise<DictResult>;
}

export interface DictFail {
  words: string;
  valid: boolean;
}

export type DictSuccess = DictResult & { valid: boolean };

export type CopyDictResult = DictSuccess | DictFail;
