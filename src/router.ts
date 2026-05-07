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

let hasTrackedInitialPageLoad = false

function trackSpaPageView(path: string, referrer?: string) {
  if (typeof window.gtag !== 'function') return false

  window.gtag('event', 'page_view', {
    page_title: document.title,
    page_path: path,
    page_location: window.location.origin + path,
    page_referrer: referrer,
  })
  return true
}

router.afterEach((to, from) => {
  const path = to.fullPath

  // The initial page load is already tracked by the base gtag config in index.html.
  if (!hasTrackedInitialPageLoad) {
    hasTrackedInitialPageLoad = true
    return
  }

  if (!trackSpaPageView(path, from.fullPath ? window.location.origin + from.fullPath : document.referrer)) {
    const timer = setInterval(() => {
      if (trackSpaPageView(path, from.fullPath ? window.location.origin + from.fullPath : document.referrer)) {
        clearInterval(timer)
      }
    }, 100)
    setTimeout(() => clearInterval(timer), 3000)
  }
})
