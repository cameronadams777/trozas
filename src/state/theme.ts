import { defineStore } from "pinia";

type Theme = "light" | "dark";

interface IThemeState {
  theme: Theme;
}

export const useThemeStore = defineStore({
  id: "themes_store",
  state(): IThemeState {
    return {
      theme:
        localStorage.getItem("theme") ??
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
    };
  },
  actions: {
    toggleTheme(): void {
      this.theme = this.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", this.theme);
    },
  },
});
