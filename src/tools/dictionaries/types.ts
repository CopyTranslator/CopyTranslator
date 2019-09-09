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

export interface DictResult {
  words: string;
  phonetics?: Array<Phonetic>;
  explains?: Array<Explain>;
  examples?: Array<Example>;
  suggests: Array<Suggest>;
  code: number;
  engine: string;
  url?: string;
}

export abstract class WordEngine {
  abstract query(words: string): Promise<DictResult>;
}
