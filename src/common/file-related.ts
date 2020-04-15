import { resetStyle } from "./style";
import { resetGlobalShortcuts, resetLocalShortcuts } from "./shortcuts";
export function resetAllConfig() {
  resetLocalShortcuts();
  resetGlobalShortcuts();
  resetStyle();
}
