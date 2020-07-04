import { resetStyle } from "./style";
import { resetGlobalShortcuts, resetLocalShortcuts } from "../common/shortcuts";
export function resetAllConfig() {
  resetLocalShortcuts();
  resetGlobalShortcuts();
  resetStyle();
}
