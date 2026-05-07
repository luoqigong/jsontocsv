import { createRouter, createWebHistory } from 'vue-router'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

const Home = () => import('./pages/Home.vue')
const About = () => import('./pages/About.vue')
const Contact = () => import('./pages/Contact.vue')
const Privacy = () => import('./pages/Privacy.vue')
const CookiePolicy = () => import('./pages/CookiePolicy.vue')
const Terms = () => import('./pages/Terms.vue')
const NotFound = () => import('./pages/NotFound.vue')

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/contact', component: Contact },
    { path: '/privacy', component: Privacy },
    { path: '/cookies', component: CookiePolicy },
    { path: '/terms', component: Terms },
    { path: '/:pathMatch(.*)*', component: NotFound },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  if (typeof window.gtag === 'function') {
    window.gtag('config', 'G-42LXEJW456', {
      page_path: to.fullPath,
      page_location: window.location.origin + to.fullPath,
    })
  }
})
