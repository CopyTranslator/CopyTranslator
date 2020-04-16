import { Locale } from "../../common/types";
import Vue from "vue";

export function registerLocale(store: any, state = {}) {
  const l10nModule = {
    state: state,
    getters: {
      locales(state: any) {
        return state.locales;
      },
      locale(state: any) {
        return state.locale;
      }
    },
    mutations: {
      updateLocale(state: any, locale: Locale) {
        Vue.set(state, "locale", locale);
      }
    },
    actions: {
      updateLocale(context: any, locale: Locale) {
        context.commit("updateLocale", locale);
      }
    }
  };
  store.registerModule("l10n", l10nModule);
}
