import { createRouter, createWebHistory } from 'vue-router'

import Options from '../components/Options.vue'
import Game from '../components/Game.vue'

const routes = [
  {
    path: '/play',
    name: 'Game',
    component: Game,
    props: true,
  },
  {
    path: '/',
    name: 'Options',
    component: Options,
  },
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'Options' },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
