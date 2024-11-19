import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enToast from '@/locales/en/toast.json'
import enAuth from '@/locales/en/auth.json'
import enCommon from '@/locales/en/common.json'
import enSidebar from '@/locales/en/sidebar.json'
import enMenu from '@/locales/en/menu.json'
import enSetting from '@/locales/en/setting.json'
import enProduct from '@/locales/en/product.json'
import enLog from '@/locales/en/log.json'

import viToast from '@/locales/vi/toast.json'
import viAuth from '@/locales/vi/auth.json'
import viCommon from '@/locales/vi/common.json'
import viSidebar from '@/locales/vi/sidebar.json'
import viMenu from '@/locales/vi/menu.json'
import viSetting from '@/locales/vi/setting.json'
import viProduct from '@/locales/vi/product.json'
import viLog from '@/locales/vi/log.json'

i18n
  .use(LanguageDetector) // Tự động phát hiện ngôn ngữ
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        toast: enToast,
        auth: enAuth,
        common: enCommon,
        sidebar: enSidebar,
        menu: enMenu,
        setting: enSetting,
        product: enProduct,
        log: enLog
      },
      vi: {
        toast: viToast,
        auth: viAuth,
        common: viCommon,
        sidebar: viSidebar,
        menu: viMenu,
        setting: viSetting,
        product: viProduct,
        log: viLog
      }
    },
    lng: window.localStorage.getItem('i18nextLng') || 'vi',
    fallbackLng: 'vi', // Ngôn ngữ mặc định
    interpolation: {
      escapeValue: false // React đã tự động bảo vệ trước XSS
    },
    //Setup type-safe translation
    ns: ['toast', 'auth', 'common', 'sidebar', 'menu', 'setting', 'product', 'log'], //Dùng để phân biệt các phần khác nhau của app
    defaultNS: 'auth' //Ngôn ngữ mặc định
  })

export default i18n
