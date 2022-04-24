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

export const dictionaryTypes = ["youdao", "bing"] as const;
export type DictionaryType = typeof dictionaryTypes[number];
interface DictResult {
  words: string;
  explains: Array<Explain>;
  phonetics?: Array<Phonetic>;
  examples?: Array<Example>;
  suggests?: Array<Suggest>;
  url?: string;
}

export type QueryDictResult = DictResult & {
  engine: DictionaryType;
};

export abstract class WordEngine {
  abstract name: DictionaryType;
  abstract query(words: string): Promise<QueryDictResult>;
}

export type SharedDictResult = DictResult & {
  engine: DictionaryType | "";
  valid: boolean;
};

export function emptyDictResult(): SharedDictResult {
  return {
    valid: false,
    phonetics: [],
    explains: [],
    examples: [],
    engine: "",
    url: "",
    words: "",
  };
}
