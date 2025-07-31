<template>
  <q-page class="tw-min-h-screen tw-bg-gradient-to-br tw-from-gray-50 tw-to-slate-100">
    <!-- Header Section -->
    <div class="tw-bg-white tw-shadow-sm">
      <div class="tw-container tw-mx-auto tw-px-6 tw-py-4">
        <div class="tw-flex tw-justify-between tw-items-center">
          <!-- Logo EPAL -->
          <div class="tw-flex tw-items-center">
            <q-img class="tw-w-12 tw-h-12 tw-mr-3" src="/logo epal.png" />
            <div>
              <h1 class="tw-text-xl tw-font-bold tw-text-gray-800">EPAL</h1>
              <p class="tw-text-sm tw-text-gray-600">Entreprise Portuaire d'Alger</p>
            </div>
          </div>
          
          <!-- Auth Button -->
          <q-btn 
            to="/login"
            color="teal-6" 
            icon="login" 
            label="Se connecter" 
            class="tw-px-6 tw-py-2"
            unelevated
            rounded
          />
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="tw-container tw-mx-auto tw-px-6 tw-py-16">
      <div class="tw-text-center tw-mb-16">
        <h2 class="tw-text-5xl tw-font-bold tw-text-gray-800 tw-mb-6">
          Plateforme de Gestion
          <span class="tw-text-teal-600">Portuaire</span>
        </h2>
        <p class="tw-text-xl tw-text-gray-600 tw-max-w-3xl tw-mx-auto tw-leading-relaxed">
          Simplifiez vos démarches portuaires avec notre plateforme digitale moderne. 
          Gérez vos paiements, factures et réclamations en toute simplicité.
        </p>
      </div>

      <!-- Modules Cards -->
      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-8 tw-max-w-6xl tw-mx-auto">
        
        <!-- E-paiement -->
        <div 
          class="module-card tw-group tw-bg-white tw-rounded-2xl tw-p-8 tw-shadow-lg tw-border tw-border-gray-100 tw-cursor-pointer tw-transition-all tw-duration-300 hover:tw-shadow-2xl hover:-tw-translate-y-2"
          @click="goToLogin"
        >
          <div class="tw-flex tw-flex-col tw-items-center tw-text-center">
            <div class="tw-w-16 tw-h-16 tw-bg-gradient-to-br tw-from-emerald-100 tw-to-emerald-200 tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-mb-6 tw-transition-transform tw-duration-300 group-hover:tw-scale-110">
              <q-icon name="account_balance_wallet" class="tw-text-3xl tw-text-emerald-600" />
            </div>
            
            <h3 class="tw-text-2xl tw-font-bold tw-text-gray-800 tw-mb-4">E-paiement</h3>
            <p class="tw-text-gray-600 tw-leading-relaxed tw-mb-6">
              Effectuez vos paiements portuaires en ligne de manière rapide et sécurisée. 
              Suivi en temps réel de toutes vos transactions.
            </p>
            
            <div class="tw-flex tw-items-center tw-text-emerald-600 tw-font-semibold tw-transition-transform tw-duration-300 group-hover:tw-translate-x-2">
              <span class="tw-mr-2">Accéder au service</span>
              <q-icon name="arrow_forward" />
            </div>
          </div>
        </div>

        <!-- Facture Proforma -->
        <div 
          class="module-card tw-group tw-bg-white tw-rounded-2xl tw-p-8 tw-shadow-lg tw-border tw-border-gray-100 tw-cursor-pointer tw-transition-all tw-duration-300 hover:tw-shadow-2xl hover:-tw-translate-y-2"
          @click="goToLogin"
        >
          <div class="tw-flex tw-flex-col tw-items-center tw-text-center">
            <div class="tw-w-16 tw-h-16 tw-bg-gradient-to-br tw-from-orange-100 tw-to-orange-200 tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-mb-6 tw-transition-transform tw-duration-300 group-hover:tw-scale-110">
              <q-icon name="receipt_long" class="tw-text-3xl tw-text-orange-600" />
            </div>
            
            <h3 class="tw-text-2xl tw-font-bold tw-text-gray-800 tw-mb-4">Facture Proforma</h3>
            <p class="tw-text-gray-600 tw-leading-relaxed tw-mb-6">
              Générez et consultez vos factures proforma. Gestion simplifiée 
              de votre facturation avec suivi détaillé.
            </p>
            
            <div class="tw-flex tw-items-center tw-text-orange-600 tw-font-semibold tw-transition-transform tw-duration-300 group-hover:tw-translate-x-2">
              <span class="tw-mr-2">Accéder au service</span>
              <q-icon name="arrow_forward" />
            </div>
          </div>
        </div>

        <!-- Réclamation Client -->
        <div 
          class="module-card tw-group tw-bg-white tw-rounded-2xl tw-p-8 tw-shadow-lg tw-border tw-border-gray-100 tw-cursor-pointer tw-transition-all tw-duration-300 hover:tw-shadow-2xl hover:-tw-translate-y-2"
          @click="goToLogin"
        >
          <div class="tw-flex tw-flex-col tw-items-center tw-text-center">
            <div class="tw-w-16 tw-h-16 tw-bg-gradient-to-br tw-from-teal-100 tw-to-teal-200 tw-rounded-2xl tw-flex tw-items-center tw-justify-center tw-mb-6 tw-transition-transform tw-duration-300 group-hover:tw-scale-110">
              <q-icon name="support_agent" class="tw-text-3xl tw-text-teal-600" />
            </div>
            
            <h3 class="tw-text-2xl tw-font-bold tw-text-gray-800 tw-mb-4">Réclamation Client</h3>
            <p class="tw-text-gray-600 tw-leading-relaxed tw-mb-6">
              Soumettez et suivez vos réclamations facilement. Support client 
              réactif pour résoudre vos problèmes rapidement.
            </p>
            
            <div class="tw-flex tw-items-center tw-text-teal-600 tw-font-semibold tw-transition-transform tw-duration-300 group-hover:tw-translate-x-2">
              <span class="tw-mr-2">Accéder au service</span>
              <q-icon name="arrow_forward" />
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="tw-mt-20 tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-8 tw-text-center">
        <div class="tw-flex tw-flex-col tw-items-center">
          <div class="tw-w-12 tw-h-12 tw-bg-emerald-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mb-4">
            <q-icon name="security" class="tw-text-xl tw-text-emerald-600" />
          </div>
          <h4 class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-2">100% Sécurisé</h4>
          <p class="tw-text-gray-600">Vos données et transactions sont protégées par un cryptage de niveau bancaire.</p>
        </div>
        
        <div class="tw-flex tw-flex-col tw-items-center">
          <div class="tw-w-12 tw-h-12 tw-bg-orange-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mb-4">
            <q-icon name="speed" class="tw-text-xl tw-text-orange-600" />
          </div>
          <h4 class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-2">Rapide & Efficace</h4>
          <p class="tw-text-gray-600">Traitez vos démarches en quelques clics avec notre interface intuitive.</p>
        </div>
        
        <div class="tw-flex tw-flex-col tw-items-center">
          <div class="tw-w-12 tw-h-12 tw-bg-teal-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mb-4">
            <q-icon name="support" class="tw-text-xl tw-text-teal-600" />
          </div>
          <h4 class="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-2">Support 24/7</h4>
          <p class="tw-text-gray-600">Notre équipe support est disponible pour vous accompagner à tout moment.</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="tw-bg-gray-800 tw-text-white tw-py-12 tw-mt-20">
      <div class="tw-container tw-mx-auto tw-px-6">
        <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-8">
          <!-- Company Info -->
          <div>
            <div class="tw-flex tw-items-center tw-mb-4">
              <q-img class="tw-w-10 tw-h-10 tw-mr-3" src="/logo epal.png" />
              <h3 class="tw-text-xl tw-font-bold">EPAL</h3>
            </div>
            <p class="tw-text-gray-300 tw-leading-relaxed">
              L'Entreprise Portuaire d'Alger, votre partenaire de confiance pour 
              tous vos besoins portuaires et logistiques.
            </p>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="tw-text-lg tw-font-semibold tw-mb-4">Contact</h4>
            <div class="tw-space-y-2 tw-text-gray-300">
              <div class="tw-flex tw-items-center">
                <q-icon name="location_on" class="tw-mr-2" />
                <span>Port d'Alger, Algérie</span>
              </div>
              <div class="tw-flex tw-items-center">
                <q-icon name="phone" class="tw-mr-2" />
                <span>+213 (0) 21 xxx xxx</span>
              </div>
              <div class="tw-flex tw-items-center">
                <q-icon name="email" class="tw-mr-2" />
                <span>contact@epal.dz</span>
              </div>
            </div>
          </div>

          <!-- Links -->
          <div>
            <h4 class="tw-text-lg tw-font-semibold tw-mb-4">Liens Utiles</h4>
            <div class="tw-space-y-2">
              <div><a href="#" class="tw-text-gray-300 hover:tw-text-white tw-transition-colors">Services</a></div>
              <div><a href="#" class="tw-text-gray-300 hover:tw-text-white tw-transition-colors">Tarifs</a></div>
              <div><a href="#" class="tw-text-gray-300 hover:tw-text-white tw-transition-colors">Support</a></div>
              <div><a href="#" class="tw-text-gray-300 hover:tw-text-white tw-transition-colors">Documentation</a></div>
            </div>
          </div>
        </div>
        
        <div class="tw-border-t tw-border-gray-700 tw-mt-8 tw-pt-8 tw-text-center">
          <p class="tw-text-gray-400">
            &copy; {{ currentYear }} EPAL - Entreprise Portuaire d'Alger. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentYear = computed(() => new Date().getFullYear());

const goToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.module-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  backdrop-filter: blur(10px);
}

.module-card:hover {
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

.module-card {
  animation: slideInUp 0.6s ease-out;
}

.module-card:nth-child(1) {
  animation-delay: 0.1s;
}

.module-card:nth-child(2) {
  animation-delay: 0.2s;
}

.module-card:nth-child(3) {
  animation-delay: 0.3s;
}

/* Hover animations */
.tw-group:hover .group-hover\:tw-scale-110 {
  transform: scale(1.1);
}

.tw-group:hover .group-hover\:tw-translate-x-2 {
  transform: translateX(0.5rem);
}
</style>