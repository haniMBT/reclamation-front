<template>
  <q-page class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden relative">
    <!-- Particules animées en arrière-plan -->
    <div class="fixed inset-0 z-0">
      <div v-for="i in 30" :key="i" 
           class="absolute rounded-full bg-gradient-to-r from-teal-400/20 to-purple-600/20"
           :style="{
             width: `${Math.random() * 20 + 5}px`,
             height: `${Math.random() * 20 + 5}px`,
             left: `${Math.random() * 100}%`,
             top: `${Math.random() * 100}%`,
             animation: `float ${Math.random() * 20 + 10}s infinite ease-in-out`,
             animationDelay: `${Math.random() * 5}s`
           }">
      </div>
    </div>

    <!-- Header avec effet glassmorphisme -->
    <div class="fixed top-0 w-full z-50 transition-all duration-500" 
         :class="{'backdrop-blur-xl bg-white/5 shadow-2xl': scrolled, 'backdrop-blur-md bg-transparent': !scrolled}">
      <div class="container mx-auto px-4 sm:px-6 py-4">
        <div class="flex justify-between items-center">
          <!-- Logo avec animation 3D -->
          <div class="flex items-center group cursor-pointer" @click="goToLogin">
            <div class="relative">
              <div class="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform transition-all duration-700 group-hover:rotate-y-180">
                <q-img class="w-8 h-8 filter brightness-0 invert" src="/logo-epal.png" />
              </div>
              <div class="absolute inset-0 bg-gradient-to-br from-cyan-400/50 to-purple-600/50 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
          
          <!-- Bouton de connexion avec effet néon -->
          <q-btn 
            to="/login"
            class="relative overflow-hidden group px-6 py-3 font-semibold rounded-xl border-0"
            unelevated
          >
            <div class="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            <div class="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur-sm group-hover:blur-md transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
            <span class="relative z-10 flex items-center text-white">
              <q-icon name="login" class="mr-2 transition-transform duration-300 group-hover:translate-x-1" />
              <span class="relative">
                Se connecter
                <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
              </span>
            </span>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Hero Section avec effet parallaxe -->
    <div class="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <!-- Éléments décoratifs flottants -->
      <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
      <div class="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 2s"></div>
      
      <div class="container mx-auto px-4 sm:px-6 text-center relative z-10">
        <!-- Titre principal avec effet de découpage -->
        <div class="mb-8">
          <h2 class="text-5xl sm:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight">
            <span class="block opacity-0 animate-slide-in-up" style="animation-delay: 0.2s">
              <span class="bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent bg-size-200 animate-gradient-x">
                PORTUAIR
              </span>
            </span>
            <span class="block opacity-0 animate-slide-in-up" style="animation-delay: 0.4s">
              <span class="bg-gradient-to-r from-purple-400 via-cyan-500 to-purple-400 bg-clip-text text-transparent bg-size-200 animate-gradient-x" style="animation-delay: 0.5s">
                DIGITAL
              </span>
            </span>
          </h2>
          
          <p class="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed opacity-0 animate-fade-in-up" style="animation-delay: 0.8s">
            Révolutionnez votre expérience portuaire avec notre plateforme 
            <span class="text-cyan-400 font-semibold">intelligente</span> et 
            <span class="text-purple-400 font-semibold">immersive</span>
          </p>
        </div>

        <!-- CTA avec effet holographique -->
        <div class="opacity-0 animate-fade-in-up" style="animation-delay: 1.2s">
          <button 
            @click="goToLogin"
            class="relative group px-12 py-4 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 backdrop-blur-xl border border-cyan-400/30 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
            <span class="relative z-10 text-white text-lg font-semibold flex items-center">
              <span class="mr-3">Explorer la Plateforme</span>
              <q-icon name="arrow_forward" class="transition-transform duration-300 group-hover:translate-x-2" />
            </span>
            <div class="absolute inset-0 border border-cyan-400/50 rounded-2xl animate-pulse"></div>
          </button>
        </div>
      </div>

      <!-- Vagues animées en bas -->
      <div class="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg class="relative block w-full h-24 sm:h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
                opacity=".25" 
                class="fill-current text-cyan-900/50"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
                opacity=".5" 
                class="fill-current text-purple-900/50"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
                class="fill-current text-slate-900/50"></path>
        </svg>
      </div>
    </div>

    <!-- Section Modules avec effet carte 3D -->
    <div class="relative py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div class="container mx-auto px-4 sm:px-6">
        <div class="text-center mb-16">
          <h3 class="text-4xl sm:text-5xl font-black text-white mb-6 opacity-0 animate-fade-in-up" style="animation-delay: 0.3s">
            <span class="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Services Intelligents
            </span>
          </h3>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto opacity-0 animate-fade-in-up" style="animation-delay: 0.6s">
            Découvrez nos modules innovants conçus pour transformer votre expérience portuaire
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <!-- Module E-paiement -->
          <div 
            class="module-3d group perspective-1000 opacity-0 animate-fade-in-up"
            style="animation-delay: 0.9s"
            @mouseenter="activateCard(0)"
            @mouseleave="deactivateCard(0)"
          >
            <div class="relative transform-style-3d transition-transform duration-700" 
                 :class="{'rotate-y-10': activeCard === 0}">
              <!-- Face avant -->
              <div class="front absolute inset-0 bg-gradient-to-br from-cyan-900/50 to-slate-800/50 backdrop-blur-xl rounded-3xl border border-cyan-500/30 p-8 shadow-2xl">
                <div class="text-center">
                  <div class="w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                    <q-icon name="account_balance_wallet" class="text-3xl text-white" />
                  </div>
                  <h4 class="text-2xl font-bold text-white mb-4">E-paiement</h4>
                  <p class="text-gray-300 leading-relaxed">
                    Transactions sécurisées en temps réel avec suivi intelligent
                  </p>
                </div>
              </div>
              
              <!-- Face arrière (reveal au survol) -->
              <div class="back absolute inset-0 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-3xl p-8 transform rotate-y-180 backface-hidden">
                <div class="text-center text-white">
                  <h4 class="text-2xl font-bold mb-4">Fonctionnalités Avancées</h4>
                  <ul class="space-y-3 text-left">
                    <li class="flex items-center">
                      <q-icon name="check_circle" class="text-green-400 mr-2" />
                      Paiements cryptés
                    </li>
                    <li class="flex items-center">
                      <q-icon name="check_circle" class="text-green-400 mr-2" />
                      Suivi en temps réel
                    </li>
                    <li class="flex items-center">
                      <q-icon name="check_circle" class="text-green-400 mr-2" />
                      Rapports automatiques
                    </li>
                  </ul>
                  <button to="/login" class="mt-6 px-6 py-2 bg-white text-cyan-600 rounded-full font-semibold hover:scale-105 transition-transform">
                    Découvrir
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Module Facture Proforma -->
          <div 
            class="module-3d group perspective-1000 opacity-0 animate-fade-in-up"
            style="animation-delay: 1.1s"
            @mouseenter="activateCard(1)"
            @mouseleave="deactivateCard(1)"
          >
            <div class="relative transform-style-3d transition-transform duration-700" 
                 :class="{'rotate-y-10': activeCard === 1}">
              <div class="front absolute inset-0 bg-gradient-to-br from-purple-900/50 to-slate-800/50 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-8 shadow-2xl">
                <div class="text-center">
                  <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12">
                    <q-icon name="receipt_long" class="text-3xl text-white" />
                  </div>
                  <h4 class="text-2xl font-bold text-white mb-4">Facture Proforma</h4>
                  <p class="text-gray-300 leading-relaxed">
                    Génération automatique et gestion simplifiée des documents
                  </p>
                </div>
              </div>
              
              <div class="back absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl p-8 transform rotate-y-180 backface-hidden">
                <div class="text-center text-white">
                  <h4 class="text-2xl font-bold mb-4">Automatisation Intelligente</h4>
                  <ul class="space-y-3 text-left">
                    <li class="flex items-center">
                      <q-icon name="check_circle" class="text-green-400 mr-2" />
                      Génération instantanée
                    </li>
                    <li class="flex items-center">
                      <q-icon name="check_circle" class="text-green-400 mr-2" />
                      Templates personnalisables
                    </li>
                    <li class="flex items-center">
                      <q-icon name="check_circle" class="text-green-400 mr-2" />
                      Historique intelligent
                    </li>
                  </ul>
                  <button to="/login" class="mt-6 px-6 py-2 bg-white text-purple-600 rounded-full font-semibold hover:scale-105 transition-transform">
                    Découvrir
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Module Réclamation -->
          <div 
            class="module-3d group perspective-1000 opacity-0 animate-fade-in-up"
            style="animation-delay: 1.3s"
            @mouseenter="activateCard(2)"
            @mouseleave="deactivateCard(2)"
          >
            <div class="relative transform-style-3d transition-transform duration-700" 
                 :class="{'rotate-y-10': activeCard === 2}">
              <div class="front absolute inset-0 bg-gradient-to-br from-teal-900/50 to-slate-800/50 backdrop-blur-xl rounded-3xl border border-teal-500/30 p-8 shadow-2xl">
                <div class="text-center">
                  <div class="w-20 h-20 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                    <q-icon name="support_agent" class="text-3xl text-white" />
                  </div>
                  <h4 class="text-2xl font-bold text-white mb-4">Réclamation Client</h4>
                  <p class="text-gray-300 leading-relaxed">
                    Support proactif avec résolution accélérée des incidents
                  </p>
                </div>
              </div>
              
              <div class="back absolute inset-0 bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-8 transform rotate-y-180 backface-hidden">
                <div class="text-center text-white">
                  <h4 class="text-2xl font-bold mb-4">Support 360°</h4>
                  <ul class="space-y-3 text-left">
                    <li class="flex items-center">
                      <q-icon name="check_circle" class="text-green-400 mr-2" />
                      Ticket intelligent
                    </li>
                    <li class="flex items-center">
                      <q-icon name="check_circle" class="text-green-400 mr-2" />
                      Résolution rapide
                    </li>
                    <li class="flex items-center">
                      <q-icon name="check_circle" class="text-green-400 mr-2" />
                      Feedback automatique
                    </li>
                  </ul>
                  <button to="/login" class="mt-6 px-6 py-2 bg-white text-teal-600 rounded-full font-semibold hover:scale-105 transition-transform">
                    Découvrir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Statistiques avec compteurs animés -->
    <div class="relative py-20 bg-gradient-to-br from-slate-800 via-purple-900 to-slate-900">
      <div class="container mx-auto px-4 sm:px-6">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div v-for="(stat, index) in stats" :key="index" 
               class="opacity-0 animate-fade-in-up" 
               :style="`animation-delay: ${0.5 + index * 0.2}s`">
            <div class="text-4xl sm:text-5xl font-black text-white mb-2">
              <span class="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {{ animatedStats[index] }}{{ stat.suffix }}
              </span>
            </div>
            <p class="text-gray-400 font-semibold">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer avec effet néon -->
    <div class="relative bg-slate-900 border-t border-cyan-500/20">
      <div class="container mx-auto px-4 sm:px-6 py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Logo et description -->
          <div class="md:col-span-2">
            <div class="flex items-center mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <q-img class="w-8 h-8 filter brightness-0 invert" src="/logo-epal.png" />
              </div>
              <h3 class="text-2xl font-black text-white ml-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                EPAL DIGITAL
              </h3>
            </div>
            <p class="text-gray-400 leading-relaxed max-w-md">
              L'avenir du portuaire commence ici. Innovation, sécurité et performance 
              au service de votre excellence opérationnelle.
            </p>
          </div>

          <!-- Liens rapides -->
          <div>
            <h4 class="text-lg font-semibold text-white mb-6">Navigation</h4>
            <div class="space-y-3">
              <a v-for="link in footerLinks" :key="link.name"
                 :href="link.href" 
                 class="block text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:translate-x-2">
                {{ link.name }}
              </a>
            </div>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="text-lg font-semibold text-white mb-6">Contact</h4>
            <div class="space-y-3 text-gray-400">
              <div class="flex items-center hover:text-cyan-400 transition-colors cursor-pointer">
                <q-icon name="location_on" class="mr-3 text-cyan-400" />
                <span>Port d'Alger, Algérie</span>
              </div>
              <div class="flex items-center hover:text-cyan-400 transition-colors cursor-pointer">
                <q-icon name="phone" class="mr-3 text-purple-400" />
                <span>+213 (0) 21 XXX XXX</span>
              </div>
              <div class="flex items-center hover:text-cyan-400 transition-colors cursor-pointer">
                <q-icon name="email" class="mr-3 text-teal-400" />
                <span>innovation@epal.dz</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bas de footer -->
        <div class="border-t border-gray-800 mt-12 pt-8 text-center">
          <p class="text-gray-500">
            &copy; {{ currentYear }} EPAL Digital - Révolution Portuaire. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const currentYear = computed(() => new Date().getFullYear());
const scrolled = ref(false);
const activeCard = ref(null);
const animatedStats = ref([0, 0, 0, 0]);

const stats = [
  { value: 150, suffix: "+", label: "Clients Satisfaits" },
  { value: 500, suffix: "K", label: "Transactions" },
  { value: 99, suffix: "%", label: "Disponibilité" },
  { value: 24, suffix: "h", label: "Support" }
];

const footerLinks = [
  { name: "Accueil", href: "#" },
  { name: "Services", href: "#" },
  { name: "Tarification", href: "#" },
  { name: "Support", href: "#" },
  { name: "Documentation", href: "#" }
];

// Animation des statistiques
const animateStats = () => {
  stats.forEach((stat, index) => {
    const duration = 2000;
    const step = stat.value / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= stat.value) {
        current = stat.value;
        clearInterval(timer);
      }
      animatedStats.value[index] = Math.floor(current);
    }, 16);
  });
};

// Gestion des cartes 3D
const activateCard = (index) => {
  activeCard.value = index;
};

const deactivateCard = (index) => {
  activeCard.value = null;
};

const handleScroll = () => {
  scrolled.value = window.scrollY > 50;
};

const goToLogin = () => {
  router.push("/login");
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  // Déclencher l'animation des stats après le chargement
  setTimeout(animateStats, 1000);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* Animations personnalisées avancées */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(120deg);
  }
  66% {
    transform: translateY(10px) rotate(240deg);
  }
}

@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(100px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradient-x {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-slide-in-up {
  animation: slide-in-up 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 3s ease infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Styles 3D avancés */
.perspective-1000 {
  perspective: 1000px;
}

.transform-style-3d {
  transform-style: preserve-3d;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-10 {
  transform: rotateY(10deg);
}

.rotate-y-180 {
  transform: rotateY(180deg);
}

.module-3d {
  height: 300px;
  cursor: pointer;
}

.module-3d .front,
.module-3d .back {
  transition: transform 0.7s cubic-bezier(0.645, 0.045, 0.355, 1);
  backface-visibility: hidden;
}

.module-3d:hover .front {
  transform: rotateY(180deg);
}

.module-3d:hover .back {
  transform: rotateY(0deg);
}

/* Effets de verre avancés */
.backdrop-blur-xl {
  backdrop-filter: blur(24px);
}

/* Optimisations de performance */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Support des navigateurs modernes */
@supports not (backdrop-filter: blur(12px)) {
  .backdrop-blur-xl {
    background-color: rgba(15, 23, 42, 0.9);
  }
}
</style>