import { GoogleEngine, YoudaoEngine, BingEngine } from "./easy";
import { WordEngine } from "./types";
export const dictionaryTypes = ["Bing", "Google", "Youdao"] as const;
export type DictionaryType = (typeof dictionaryTypes)[number];

const dictionaryMap: [DictionaryType, WordEngine][] = [
  ["Bing", new BingEngine()],
  ["Youdao", new YoudaoEngine()],
  ["Google", new GoogleEngine()]
];

const dictionaries = new Map(dictionaryMap);
export function getDictionary(dictType: DictionaryType): WordEngine {
  return <WordEngine>dictionaries.get(dictType);
}
