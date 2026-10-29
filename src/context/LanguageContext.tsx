"use client";
import { createContext, useState, useContext, ReactNode } from 'react';

// Restringimos los idiomas estrictamente a español e inglés
type Language = 'es' | 'en';

type LanguageContextType = {
  idioma: Language;
  setIdioma: (idioma: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [idioma, setIdioma] = useState<Language>('es');

  return (
    <LanguageContext.Provider value={{ idioma, setIdioma }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useIdioma = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useIdioma debe usarse dentro de un LanguageProvider');
  }
  return context;
};