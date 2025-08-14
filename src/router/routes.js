const routes = [
  {
    path: '/acceuil',
    component: () => import('layouts/AcceuilLayout.vue'),
    children: [
      { path: '', component: () => import('pages/acceuil.vue') }
    ]
  },

  {
    path: "/login", name: 'login', component: () => import("src/pages/auth/Login.vue")
  },
  {
    path: "/forgot-password", name: 'forgot-password', component: () => import("src/pages/auth/ForgotPassword.vue")
  },
  {
    path: "/changePasswrod", name: 'changePasswrod', component: () => import("src/pages/auth/ChangePasswrod.vue")
  },

  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Dashboard.vue') }
    ]
  },
  {
    path: '/reclamation_client',
     component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/reclamation/Index.vue') },
      { path: ':id', component: () => import('src/pages/reclamation/show.vue') }
    ]
  },
  {
    path: '/reclamations/all',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/reclamation/index2.vue') }
    ]
  },
  {
    path: '/profile',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/profile/Show.vue') }
    ]
  },
  {
    path: '/profil',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/Profil.vue') }
    ]
  },
  {
    path: '/privilege',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/privilege/Index.vue') },
      { path: ':code', component: () => import('src/pages/privilege/show.vue') }
    ]
  },
  {
    path: '/utilisateur',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/utilisateur/Index.vue') }
    ]
  },
  {
    path: '/under-development',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('components/Developement.vue') }
    ]

  },
  {
    path: '/log-history',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'logHistory', component: () => import('pages/logHistory/Index.vue') },
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
