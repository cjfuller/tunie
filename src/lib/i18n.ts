import { addMessages, init, getLocaleFromNavigator } from "svelte-i18n";
import en from "./locales/en.json";
import fr from "./locales/fr.json";

const getInitialLocale = (): string | null =>
  globalThis.localStorage.getItem("locale") ?? getLocaleFromNavigator();

addMessages("en", en);
addMessages("fr", fr);

if (globalThis.localStorage) {
  init({
    fallbackLocale: "en",
    initialLocale: getInitialLocale(),
  });
} else {
  init({
    fallbackLocale: "en",
    initialLocale: null,
  });
}
