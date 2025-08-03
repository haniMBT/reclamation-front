<template>
  <q-page class="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
    <!-- Header Section -->
    <div class="bg-white shadow-sm">
      <div class="container mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
          <!-- Logo EPAL -->
          <div class="flex items-center">
            <q-img class="w-12 h-12 mr-3" src="/logo-epal.png" />
            <div>
              <h1 class="text-xl font-bold text-gray-800">EPAL</h1>
              <p class="text-sm text-gray-600">Entreprise Portuaire d'Alger</p>
            </div>
          </div>
          
          <!-- Auth Button -->
          <q-btn 
            to="/login"
            color="teal-6" 
            icon="login" 
            label="Se connecter" 
            class="px-6 py-2"
            unelevated
            rounded
          />
        </div>
      </div>
    </div>

    <!-- Hero Section -->
    <div class="container mx-auto px-6 py-16">
      <div class="text-center mb-16">
        <h2 class="text-5xl font-bold text-gray-800 mb-6">
          Plateforme de Gestion
          <span class="text-teal-600">Portuaire</span>
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Simplifiez vos démarches portuaires avec notre plateforme digitale moderne. 
          Gérez vos paiements, factures et réclamations en toute simplicité.
        </p>
      </div>

      <!-- Modules Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        <!-- E-paiement -->
        <div 
          class="module-card group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          @click="goToLogin"
        >
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
              <q-icon name="account_balance_wallet" class="text-3xl text-emerald-600" />
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800 mb-4">E-paiement</h3>
            <p class="text-gray-600 leading-relaxed mb-6">
              Effectuez vos paiements portuaires en ligne de manière rapide et sécurisée. 
              Suivi en temps réel de toutes vos transactions.
            </p>
            
            <div class="flex items-center text-emerald-600 font-semibold transition-transform duration-300 group-hover:translate-x-2">
              <span class="mr-2">Accéder au service</span>
              <q-icon name="arrow_forward" />
            </div>
          </div>
        </div>

        <!-- Facture Proforma -->
        <div 
          class="module-card group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          @click="goToLogin"
        >
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
              <q-icon name="receipt_long" class="text-3xl text-orange-600" />
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800 mb-4">Facture Proforma</h3>
            <p class="text-gray-600 leading-relaxed mb-6">
              Générez et consultez vos factures proforma. Gestion simplifiée 
              de votre facturation avec suivi détaillé.
            </p>
            
            <div class="flex items-center text-orange-600 font-semibold transition-transform duration-300 group-hover:translate-x-2">
              <span class="mr-2">Accéder au service</span>
              <q-icon name="arrow_forward" />
            </div>
          </div>
        </div>

        <!-- Réclamation Client -->
        <div 
          class="module-card group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
          @click="goToLogin"
        >
          <div class="flex flex-col items-center text-center">
            <div class="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110">
              <q-icon name="support_agent" class="text-3xl text-teal-600" />
            </div>
            
            <h3 class="text-2xl font-bold text-gray-800 mb-4">Réclamation Client</h3>
            <p class="text-gray-600 leading-relaxed mb-6">
              Soumettez et suivez vos réclamations facilement. Support client 
              réactif pour résoudre vos problèmes rapidement.
            </p>
            
            <div class="flex items-center text-teal-600 font-semibold transition-transform duration-300 group-hover:translate-x-2">
              <span class="mr-2">Accéder au service</span>
              <q-icon name="arrow_forward" />
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
            <q-icon name="security" class="text-xl text-emerald-600" />
          </div>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">100% Sécurisé</h4>
          <p class="text-gray-600">Vos données et transactions sont protégées par un cryptage de niveau bancaire.</p>
        </div>
        
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <q-icon name="speed" class="text-xl text-orange-600" />
          </div>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">Rapide & Efficace</h4>
          <p class="text-gray-600">Traitez vos démarches en quelques clics avec notre interface intuitive.</p>
        </div>
        
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
            <q-icon name="support" class="text-xl text-teal-600" />
          </div>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">Support 24/7</h4>
          <p class="text-gray-600">Notre équipe support est disponible pour vous accompagner à tout moment.</p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="bg-gray-800 text-white py-12 mt-20">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Company Info -->
          <div>
            <div class="flex items-center mb-4">
              <q-img class="w-10 h-10 mr-3" src="/logo-epal.png" />
              <h3 class="text-xl font-bold">EPAL</h3>
            </div>
            <p class="text-gray-300 leading-relaxed">
              L'Entreprise Portuaire d'Alger, votre partenaire de confiance pour 
              tous vos besoins portuaires et logistiques.
            </p>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Contact</h4>
            <div class="space-y-2 text-gray-300">
              <div class="flex items-center">
                <q-icon name="location_on" class="mr-2" />
                <span>Port d'Alger, Algérie</span>
              </div>
              <div class="flex items-center">
                <q-icon name="phone" class="mr-2" />
                <span>+213 (0) 21 xxx xxx</span>
              </div>
              <div class="flex items-center">
                <q-icon name="email" class="mr-2" />
                <span>contact@epal.dz</span>
              </div>
            </div>
          </div>

          <!-- Links -->
          <div>
            <h4 class="text-lg font-semibold mb-4">Liens Utiles</h4>
            <div class="space-y-2">
              <div><a href="#" class="text-gray-300 hover:text-white transition-colors">Services</a></div>
              <div><a href="#" class="text-gray-300 hover:text-white transition-colors">Tarifs</a></div>
              <div><a href="#" class="text-gray-300 hover:text-white transition-colors">Support</a></div>
              <div><a href="#" class="text-gray-300 hover:text-white transition-colors">Documentation</a></div>
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-700 mt-8 pt-8 text-center">
          <p class="text-gray-400">
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
.group:hover .group-hover\:scale-110 {
  transform: scale(1.1);
}

.group:hover .group-hover\:translate-x-2 {
  transform: translateX(0.5rem);
}
</style>