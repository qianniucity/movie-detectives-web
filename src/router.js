import { createRouter, createWebHistory } from 'vue-router'
import Home from './components/Home.vue'
import Quiz from './components/Quiz.vue'
import Sessions from './components/Sessions.vue'
import About from './components/About.vue'
import Stats from './components/Stats.vue'

const routes = [
  {
    path: '/',
    name: '首页',
    component: Home
  },
  {
    path: '/quiz',
    name: '侦探',
    component: Quiz
  },
  {
    path: '/sessions',
    name: '会话记录',
    component: Sessions
  },
  {
    path: '/about',
    name: '关于',
    component: About
  },
  {
    path: '/stats',
    name: '统计',
    component: Stats
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
