"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { translations, type Lang, type Translations } from "@/lib/i18n/translations"

interface LangContextValue {
  lang: Lang
  t: Translations
  setLang: (l: Lang) => void
}

const LangContext = createContext<LangContextValue>({
  lang: "sk",
  t: translations.sk as unknown as Translations,
  setLang: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("sk")

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null
    if (stored && stored in translations) setLangState(stored)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem("lang", l)
  }

  return (
    <LangContext.Provider value={{ lang, t: translations[lang] as unknown as Translations, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useT() {
  return useContext(LangContext)
}
