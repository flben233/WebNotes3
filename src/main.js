import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createVuestic } from 'vuestic-ui'
import 'vuestic-ui/css'
import './assets/main.css'
import { config } from 'md-editor-v3';

config({
    markdownItPlugins(plugins) {
        return plugins.map((p) => {
            if (p.type === 'image') {
                console.log(p)
                return {
                    ...p,
                    options: {
                        ...p.options,
                        lazy: true,
                        async: true
                    }
                };
            }

            return p;
        });
    }
});


const app = createApp(App)
app.use(router)
app.use(createVuestic());
app.mount('#app')
