// import './styles/reset.css'
// import './styles/global.scss'
import './style.css'

import { createApp } from 'vue'

import store from '@/store/index'

import App from './App.vue'
// import i18n from './i18n'

const app = createApp(App)
app.use(store)
app.mount('#app')
