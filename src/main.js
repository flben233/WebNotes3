import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createVuestic } from 'vuestic-ui'
import 'vuestic-ui/css'
import './assets/main.css'
// import 'md-editor-v3/lib/style.css';
// import './assets/md-editor-v3.css'
// import './assets/material-icons.css'
// import './assets/vuestic-ui-modifed.css'

const app = createApp(App)
app.use(router)
app.use(createVuestic());
app.mount('#app')
