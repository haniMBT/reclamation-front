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
    path: '/reclamations/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'client', component: () => import('src/pages/reclamation/Index.vue') },
      { path: 'client/:id', component: () => import('src/pages/reclamation/show.vue') },
      { path: 'all', component: () => import('src/pages/reclamation/index2.vue') },
      { path: 'edit', component: () => import('src/pages/reclamation/Edit.vue') },
      { path: 'nature', component: () => import('src/pages/reclamation/nature/index.vue') },
      { path: 'parametrage', component: () => import('src/pages/reclamation/parametrage/index.vue') }
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
      { path: ':code', component: () => import('src/pages/privilege/Show.vue') }
    ]
  },
   {
    path: "/volets",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/volets/Index.vue"),
      },
    ],
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

  // Module E-paiement
  {
    path: '/epayment',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'factures',
        name: 'epayment-factures',
        component: () => import('pages/epayment/FacturesList.vue')
      },
      {
        path: 'factures/:id',
        name: 'epayment-facture-detail',
        component: () => import('pages/epayment/FactureDetail.vue')
      },
      {
        path: 'payment/:id',
        name: 'epayment-payment',
        component: () => import('pages/epayment/Payment.vue')
      },
      {
        path: 'payment/success/:id',
        name: 'epayment-payment-success',
        component: () => import('pages/epayment/PaymentSuccess.vue')
      },
      {
        path: 'payment/failure/:id',
        name: 'epayment-payment-failure',
        component: () => import('pages/epayment/PaymentFailure.vue')
      }
    ]
  },

  // Module Proforma
  {
    path: '/proforma',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'proforma-index',
        component: () => import('pages/proforma/ProformaIndex.vue')
      },
      {
        path: 'history',
        name: 'proforma-history',
        component: () => import('pages/proforma/ProformaHistory.vue')
      }
    ]
  },

  // Pages publiques pour invités (module e-paiement)
  {
    path: '/guest',
    component: () => import('layouts/GuestLayout.vue'), // Il faudra créer ce layout
    children: [
      {
        path: 'search',
        name: 'guest-search',
        component: () => import('pages/epayment/GuestSearch.vue')
      },
      {
        path: 'facture/:id',
        name: 'guest-facture',
        component: () => import('pages/epayment/GuestFactureDetail.vue')
      },
      {
        path: 'payment/:id',
        name: 'guest-payment',
        component: () => import('pages/epayment/GuestPayment.vue')
      },
      {
        path: 'payment/success/:id',
        name: 'guest-payment-success',
        component: () => import('pages/epayment/GuestPaymentSuccess.vue')
      },
      {
        path: 'payment/failure/:id',
        name: 'guest-payment-failure',
        component: () => import('pages/epayment/GuestPaymentFailure.vue')
      }
    ]
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
