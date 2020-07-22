import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/naver'
    },
    {
      path: '/naver',
      name: 'naver-main',
      component: require('@/components/naver/NaverMain').default
    },
    {
      path: '/kakao',
      name: 'kakao-main',
      component: require('@/components/kakao/KakaoMain').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
