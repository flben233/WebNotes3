import { createRouter, createWebHistory } from 'vue-router'
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import ResetView from "../views/ResetView.vue";
import CenterView from "../views/CenterView.vue";
import ReadView from "@/views/ReadView.vue";
import {check} from "@/api/login";
import NoteView from "@/views/NoteView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'note',
      component: NoteView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/reset',
      name: 'reset',
      component: ResetView
    },
    {
      path: '/article/:aid',
      component: ReadView,
      name: 'read'
    },
    {
      path: '/center',
      component: CenterView,
      name: 'center'
    }
  ]
})

const excludes = ["/login", "/register", "/reset"];
router.beforeEach((to, from, next) => {
  check().then(function (response){
      if (response.data.code === 0) {
        next()
      } else {
        if (excludes.indexOf(to.path) === -1 && !to.path.includes("/article")) {
          next("/login");
        } else {
          next();
        }
      }
    })
})

export default router
