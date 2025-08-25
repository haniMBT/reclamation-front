<template>
  <q-page class="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
    <!-- Main Content Section -->
    <div class="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <!-- Welcome Message -->
      <div class="text-center mb-8 sm:mb-16">
        <div
          class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto"
        >
          <h3 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
            Bienvenue sur la plateforme EPAL
          </h3>
          <p class="text-base sm:text-lg text-gray-600 leading-relaxed">
            Vous êtes connecté à votre espace personnel. Explorez les
            fonctionnalités disponibles pour gérer efficacement vos activités
            portuaires. Notre solution vous offre un accès simplifié à
            l’ensemble de vos services essentiels.
          </p>
        </div>
      </div>

      <!-- Welcome Cards -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto px-4"
      >
        <!-- Gestion des Paiements -->
        <div
          class="welcome-card group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
        >
          <div class="flex flex-col items-center text-center">
            <div
              class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110"
            >
              <q-icon
                name="account_balance_wallet"
                class="text-2xl sm:text-3xl text-emerald-600"
              />
            </div>

            <h3
              class="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4"
            >
              Gestion des Paiements
            </h3>
            <p
              class="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6"
            >
              Consultez l'historique de vos paiements, suivez vos transactions
              et gérez vos factures en temps réel.
            </p>

            <div
              class="flex items-center text-emerald-600 font-semibold text-sm sm:text-base"
            >
              <q-icon name="trending_up" class="mr-2" />
              <span>Suivi en temps réel</span>
            </div>
          </div>
        </div>

        <!-- Statistiques -->
        <div
          class="welcome-card group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
        >
          <div class="flex flex-col items-center text-center">
            <div
              class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110"
            >
              <q-icon
                name="analytics"
                class="text-2xl sm:text-3xl text-orange-600"
              />
            </div>

            <h3
              class="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4"
            >
              Facture Proforma
            </h3>
            <p
              class="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6"
            >
              Générez vos factures proforma en quelques clics et gardez un
              contrôle total grâce à un suivi détaillé et une gestion
              simplifiée.
            </p>

            <div
              class="flex items-center text-orange-600 font-semibold text-sm sm:text-base"
            >
              <q-icon name="bar_chart" class="mr-2" />
              <span>Suivi précis</span>
            </div>
          </div>
        </div>

        <!-- Activités Récentes -->
        <div
          class="welcome-card group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 sm:col-span-2 lg:col-span-1"
        >
          <div class="flex flex-col items-center text-center">
            <div
              class="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transition-transform duration-300 group-hover:scale-110"
            >
              <q-icon
                name="history"
                class="text-2xl sm:text-3xl text-teal-600"
              />
            </div>

            <h3
              class="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center justify-center gap-2"
            >
              Réclamation Client
              <span
                class="inline-flex items-center px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded-full"
              >
                <q-icon name="build" class="mr-1 text-yellow-600" /> Bientôt
              </span>
            </h3>

            <p
              class="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-6"
            >
              Soumettez et suivez vos réclamations facilement. Support client
              réactif pour résoudre vos problèmes rapidement.
            </p>

            <div
              class="flex items-center text-teal-600 font-semibold text-sm sm:text-base"
            >
              <q-icon name="notifications_active" class="mr-2" />
              <span>Assistance rapide</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div
        class="mt-12 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center px-4"
      >
        <div class="flex flex-col items-center">
          <div
            class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4"
          >
            <q-icon name="security" class="text-xl text-emerald-600" />
          </div>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">
            Sécurité Renforcée
          </h4>
          <p class="text-gray-600">
            Toutes vos données sont protégées par des protocoles de sécurité
            avancés.
          </p>
        </div>

        <div class="flex flex-col items-center">
          <div
            class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4"
          >
            <q-icon name="speed" class="text-xl text-orange-600" />
          </div>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">
            Performance Optimale
          </h4>
          <p class="text-gray-600">
            Interface rapide et réactive pour une expérience utilisateur fluide.
          </p>
        </div>

        <div class="flex flex-col items-center">
          <div
            class="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4"
          >
            <q-icon name="support" class="text-xl text-teal-600" />
          </div>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">
            Support Technique
          </h4>
          <p class="text-gray-600">
            Équipe support disponible pour vous accompagner dans vos démarches.
          </p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
// Composant Dashboard simplifié avec design élégant
</script>

<style scoped>
.welcome-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  backdrop-filter: blur(10px);
}

.welcome-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Animation d'entrée */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-card {
  animation: slideInUp 0.6s ease-out;
}

.welcome-card:nth-child(1) {
  animation-delay: 0.1s;
}

.welcome-card:nth-child(2) {
  animation-delay: 0.2s;
}

.welcome-card:nth-child(3) {
  animation-delay: 0.3s;
}

/* Hover animations */
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}
</style>
