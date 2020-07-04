import { GoogleEngine, YoudaoEngine, BingEngine } from "./easy";
import { WordEngine, DictionaryType } from "./types";

const dictionaryMap: [DictionaryType, WordEngine][] = [
  ["bing", new BingEngine()],
  ["youdao", new YoudaoEngine()],
  ["google", new GoogleEngine()],
];

export const dictionaries = new Map(dictionaryMap);
export function getDictionary(dictType: DictionaryType): WordEngine {
  return <WordEngine>dictionaries.get(dictType);
}
