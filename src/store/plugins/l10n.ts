import { Locale } from "../../common/types";
import Vue from "vue";
import { Language } from "@opentranslate/languages";

type Locales = { lang: Language; localeName: string }[];

export function registerLocale(
  store: any,
  state: {
    locales: Locales;
    locale: Locale;
  } = {
    locales: [],
    locale: {}
  }
) {
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
      },
      updateLocales(state: any, locales: Locale) {
        Vue.set(state, "locales", locales);
      }
    },
    actions: {
      updateLocale(context: any, locale: Locale) {
        context.commit("updateLocale", locale);
      },
      updateLocales(context: any, locales: Locale) {
        context.commit("updateLocales", locales);
      }
    }
  };
  store.registerModule("l10n", l10nModule);
}
