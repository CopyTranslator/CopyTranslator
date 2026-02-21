import { YoudaoEngine, BingEngine } from "./easy";
import { WordEngine, DictionaryType } from "./types";

const dictionaryCreators: Record<string, () => WordEngine> = {
  bing: () => new BingEngine(),
  youdao: () => new YoudaoEngine(),
};

export const dictionaries = new Map<string, WordEngine>();

export function getDictionary(dictType: DictionaryType): WordEngine {
  if (!dictionaries.has(dictType)) {
    const creator = dictionaryCreators[dictType];
    if (creator) {
      dictionaries.set(dictType, creator());
    }
  }
  return <WordEngine>dictionaries.get(dictType);
}
