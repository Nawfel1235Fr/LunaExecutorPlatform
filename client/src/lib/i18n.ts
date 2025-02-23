
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      "welcome": "Bienvenue sur LunaExecutor",
      "features": {
        "powerfulExecution": "Exécution Puissante",
        "securePlatform": "Plateforme Sécurisée",
        "support": "Support 24/7"
      },
      "settings": {
        "title": "Paramètres",
        "language": "Langue",
        "theme": "Thème",
        "notifications": "Notifications",
        "save": "Sauvegarder"
      }
    }
  },
  en: {
    translation: {
      "welcome": "Welcome to LunaExecutor",
      "features": {
        "powerfulExecution": "Powerful Execution",
        "securePlatform": "Secure Platform",
        "support": "24/7 Support"
      },
      "settings": {
        "title": "Settings",
        "language": "Language",
        "theme": "Theme",
        "notifications": "Notifications",
        "save": "Save Changes"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
