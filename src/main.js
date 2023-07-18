import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createVuestic } from 'vuestic-ui'
import 'vuestic-ui/css'
import './assets/main.css'
// import './assets/vuestic-ui-modify.css'
import './assets/md-editor-v3-modify.css'

const app = createApp(App)
app.use(router)
app.use(createVuestic());
app.mount('#app')
