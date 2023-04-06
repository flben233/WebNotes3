import { createRouter, createWebHistory } from 'vue-router'
import IndexView from "../views/IndexView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import ResetView from "../views/ResetView.vue";
import CenterView from "../views/CenterView.vue";
import axios from "axios";
import ReadView from "@/views/ReadView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: IndexView
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

router.beforeEach((to, from, next) => {
    axios({
      url: '/api/article/user/',
      method: 'get',
      headers: {
        'Content-Type': "application/json;charset=utf-8",
        'Access-Control-Allow-Credentials':"true"
      },
      withCredentials: true
    }).then(function (response){
      if (response.data.code === 0) {
        next()
      } else {
        console.log(to.path)
        if (to.path !== "/login" && to.path !== "/register" && to.path !== "/reset" && !to.path.includes("/article")) {
          next("/login");
        } else {
          next();
        }
      }
      // console.log(status);
    })
})

export default router
