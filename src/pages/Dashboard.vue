<template>
  <q-page class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <!-- Animated Background Elements -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl"></div>
    </div>

    <!-- Main Content Section -->
    <div class="container mx-auto px-4 sm:px-6 py-8 sm:py-16 relative z-10">
      <!-- Welcome Message -->
      <div class="text-center mb-8 sm:mb-16">
        <div
          class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/20 max-w-4xl mx-auto transform transition-all duration-700 hover:shadow-purple-500/10"
        >
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <q-icon
              name="anchor"
              class="text-3xl text-white"
            />
          </div>
          <h3 class="text-3xl sm:text-4xl font-bold text-white mb-4">
            Bienvenue sur la plateforme <span class="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">EPAL</span>
          </h3>
          <p class="text-lg sm:text-xl text-gray-300 leading-relaxed">
            Vous êtes connecté à votre espace personnel. Explorez les
            fonctionnalités disponibles pour gérer efficacement vos activités
            portuaires. Notre solution vous offre un accès simplifié à
            l'ensemble de vos services essentiels.
          </p>
        </div>
      </div>

      <!-- Welcome Cards -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto"
      >
        <!-- Gestion des Paiements -->
        <div
          class="welcome-card group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-cyan-500/20 transition-all duration-500 hover:border-cyan-400/40 hover:shadow-cyan-500/20 relative overflow-hidden"
          @mouseenter="startParticleAnimation(0)"
        >
          <!-- Animated Background -->
          <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <!-- Floating Particles -->
          <div class="particles-container absolute inset-0 overflow-hidden">
            <div 
              v-for="i in 5" 
              :key="i" 
              class="particle absolute w-2 h-2 bg-cyan-400/30 rounded-full"
              :style="particleStyles[0]?.[i-1]"
            ></div>
          </div>

          <div class="relative z-10 flex flex-col items-center text-center">
            <div
              class="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg"
            >
              <q-icon
                name="account_balance_wallet"
                class="text-3xl text-white"
              />
            </div>

            <h3
              class="text-2xl font-bold text-white mb-4"
            >
              Gestion des Paiements
            </h3>
            <p
              class="text-gray-300 leading-relaxed mb-6"
            >
              Consultez l'historique de vos paiements, suivez vos transactions
              et gérez vos factures en temps réel.
            </p>

            <div
              class="flex items-center text-cyan-400 font-semibold cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <q-icon name="trending_up" class="mr-2 transition-transform duration-300 group-hover:translate-x-1" />
              <span>Suivi en temps réel</span>
            </div>
          </div>
        </div>

        <!-- Facture Proforma -->
        <div
          class="welcome-card group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-orange-500/20 transition-all duration-500 hover:border-orange-400/40 hover:shadow-orange-500/20 relative overflow-hidden"
          @mouseenter="startParticleAnimation(1)"
        >
          <!-- Animated Background -->
          <div class="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <!-- Floating Particles -->
          <div class="particles-container absolute inset-0 overflow-hidden">
            <div 
              v-for="i in 5" 
              :key="i" 
              class="particle absolute w-2 h-2 bg-orange-400/30 rounded-full"
              :style="particleStyles[1]?.[i-1]"
            ></div>
          </div>

          <div class="relative z-10 flex flex-col items-center text-center">
            <div
              class="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 shadow-lg"
            >
              <q-icon
                name="analytics"
                class="text-3xl text-white"
              />
            </div>

            <h3
              class="text-2xl font-bold text-white mb-4"
            >
              Facture Proforma
            </h3>
            <p
              class="text-gray-300 leading-relaxed mb-6"
            >
              Générez vos factures proforma en quelques clics et gardez un
              contrôle total grâce à un suivi détaillé et une gestion
              simplifiée.
            </p>

            <div
              class="flex items-center text-orange-400 font-semibold cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <q-icon name="bar_chart" class="mr-2 transition-transform duration-300 group-hover:translate-x-1" />
              <span>Suivi précis</span>
            </div>
          </div>
        </div>

        <!-- Réclamation Client -->
        <div
          class="welcome-card group bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-teal-500/20 transition-all duration-500 hover:border-teal-400/40 hover:shadow-teal-500/20 relative overflow-hidden"
          @mouseenter="startParticleAnimation(2)"
        >
          <!-- Animated Background -->
          <div class="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <!-- Floating Particles -->
          <div class="particles-container absolute inset-0 overflow-hidden">
            <div 
              v-for="i in 5" 
              :key="i" 
              class="particle absolute w-2 h-2 bg-teal-400/30 rounded-full"
              :style="particleStyles[2]?.[i-1]"
            ></div>
          </div>

          <div class="relative z-10 flex flex-col items-center text-center">
            <div
              class="w-20 h-20 bg-gradient-to-br from-teal-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg"
            >
              <q-icon
                name="history"
                class="text-3xl text-white"
              />
            </div>

            <h3
              class="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2"
            >
              Réclamation Client
              <span
                class="inline-flex items-center px-3 py-1 text-sm font-semibold text-yellow-300 bg-yellow-500/20 rounded-full border border-yellow-500/30"
              >
                <q-icon name="build" class="mr-1 text-yellow-400" /> Bientôt
              </span>
            </h3>

            <p
              class="text-gray-300 leading-relaxed mb-6"
            >
              Soumettez et suivez vos réclamations facilement. Support client
              réactif pour résoudre vos problèmes rapidement.
            </p>

            <div
              class="flex items-center text-teal-400 font-semibold cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <q-icon name="notifications_active" class="mr-2 transition-transform duration-300 group-hover:translate-x-1" />
              <span>Assistance rapide</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div
        class="mt-16 sm:mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4"
      >
        <div class="flex flex-col items-center group">
          <div
            class="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:bg-cyan-500/30 border border-cyan-500/30"
          >
            <q-icon name="security" class="text-2xl text-cyan-400" />
          </div>
          <h4 class="text-xl font-semibold text-white mb-3">Sécurité Renforcée</h4>
          <p class="text-gray-300">
            Toutes vos données sont protégées par des protocoles de sécurité
            avancés.
          </p>
        </div>

        <div class="flex flex-col items-center group">
          <div
            class="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-600/20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:bg-orange-500/30 border border-orange-500/30"
          >
            <q-icon name="speed" class="text-2xl text-orange-400" />
          </div>
          <h4 class="text-xl font-semibold text-white mb-3">Performance Optimale</h4>
          <p class="text-gray-300">
            Interface rapide et réactive pour une expérience utilisateur fluide.
          </p>
        </div>

        <div class="flex flex-col items-center group">
          <div
            class="w-16 h-16 bg-gradient-to-br from-teal-500/20 to-green-600/20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:bg-teal-500/30 border border-teal-500/30"
          >
            <q-icon name="support" class="text-2xl text-teal-400" />
          </div>
          <h4 class="text-xl font-semibold text-white mb-3">Support Technique</h4>
          <p class="text-gray-300">
            Équipe support disponible pour vous accompagner dans vos démarches.
          </p>
        </div>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'

// Particle animation states
const particleStyles = reactive([
  Array(5).fill(null).map(() => ({})),
  Array(5).fill(null).map(() => ({})),
  Array(5).fill(null).map(() => ({}))
])

const startParticleAnimation = (cardIndex) => {
  particleStyles[cardIndex] = particleStyles[cardIndex].map(() => {
    const angle = Math.random() * Math.PI * 2
    const distance = 20 + Math.random() * 30
    const duration = 1 + Math.random() * 2
    
    return {
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      opacity: '0',
      transition: `all ${duration}s ease-out`
    }
  })
  
  // Trigger reflow
  setTimeout(() => {
    particleStyles[cardIndex] = particleStyles[cardIndex].map((_, i) => {
      const angle = (i / particleStyles[cardIndex].length) * Math.PI * 2
      const distance = 40 + Math.random() * 40
      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance
      const duration = 1 + Math.random() * 2
      
      return {
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: 'translate(-50%, -50%)',
        opacity: '1',
        transition: `all ${duration}s ease-out`
      }
    })
  }, 10)
  
  // Reset after animation
  setTimeout(() => {
    particleStyles[cardIndex] = particleStyles[cardIndex].map(() => ({}))
  }, 2000)
}
</script>

<style scoped>
.welcome-card {
  animation: slideInUp 0.8s ease-out;
  transform-style: preserve-3d;
  perspective: 1000px;
}

.welcome-card:hover {
  transform: translateY(-12px) rotateX(5deg);
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

/* Animation d'entrée */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Floating animation for background elements */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Glow effect */
.glow {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.5);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #06b6d4, #3b82f6);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #0891b2, #2563eb);
}
</style>