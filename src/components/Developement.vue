<template>
  <q-page class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-2 sm:p-4">
    <div class="w-full max-w-4xl mx-auto text-center px-2 sm:px-4">
      <!-- Animation Container -->
      <div class="relative">
        <!-- Floating Elements - Hidden on mobile for better performance -->
        <div class="hidden sm:block absolute -top-10 -left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-bounce"></div>
        <div class="hidden sm:block absolute -top-5 -right-5 w-16 h-16 bg-purple-200 rounded-full opacity-30 animate-pulse"></div>
        <div class="hidden sm:block absolute -bottom-5 left-5 w-12 h-12 bg-indigo-200 rounded-full opacity-25 animate-bounce" style="animation-delay: 0.5s"></div>
        
        <!-- Main Content Card -->
        <div class="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-8 lg:p-12 border border-gray-100 backdrop-blur-sm">
          <!-- Image Section -->
          <div class="mb-6 sm:mb-8">
            <div class="relative w-full max-w-md mx-auto">
              <!-- Background decorative elements -->
              <div class="absolute inset-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl opacity-50"></div>
              
              <!-- Main development image -->
              <div class="relative p-4 sm:p-6">
                <q-img
                  class="w-full h-40 sm:h-52 md:h-64 lg:h-80 object-contain mx-auto"
                  src="/Under development/under-development.png"
                  alt="Module en développement"
                  loading="lazy"
                />
              </div>
              
              <!-- Decorative squares - Responsive positioning -->
              <q-img
                class="absolute top-2 -right-2 sm:top-4 sm:-right-4 h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 opacity-60"
                src="/unauthorized/square_1.svg"
                alt=""
              />
              <q-img
                class="absolute -bottom-2 left-2 sm:-bottom-4 sm:left-4 h-6 w-6 sm:h-10 sm:w-10 md:h-12 md:w-12 opacity-60"
                src="/unauthorized/square_2.svg"
                alt=""
              />
            </div>
            
            <!-- Progress Indicator -->
            <div class="flex justify-center mt-4 sm:mt-6">
              <div class="flex space-x-2">
                <div class="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div class="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 sm:w-3 sm:h-3 bg-blue-300 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
              </div>
            </div>
          </div>

          <!-- Title Section -->
          <div class="mb-6 sm:mb-8">
            <h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 sm:mb-4 leading-tight">
              {{ title || 'Module en Développement' }}
            </h1>
            
            <div class="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-4 sm:mb-6"></div>
          </div>

          <!-- Content Section -->
          <div class="mb-6 sm:mb-8">
            <p class="text-sm sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-4 sm:mb-6 px-2 sm:px-0">
              {{ content }}
            </p>
         
          </div>

          <!-- Call to Action -->
          <div class="space-y-3 sm:space-y-4">
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full inline-flex items-center space-x-2 shadow-lg text-sm sm:text-base">
              <q-icon name="schedule" class="text-base sm:text-lg" />
              <span class="font-semibold">Disponible Bientôt</span>
            </div>
            
            <p class="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4 px-2 sm:px-0">
              Notre équipe travaille activement sur ce module pour vous offrir la meilleure expérience possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Module en Développement'
  },
  content: {
    type: String,
    default: 'Ce module est actuellement en cours de développement. Notre équipe travaille pour vous apporter de nouvelles fonctionnalités innovantes et une expérience utilisateur exceptionnelle.'
  }
})
</script>

<style scoped>
/* Animation personnalisées */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Effet de brillance sur le titre */
@keyframes shine {
  0% {
    background-position: -200% center;
  }
  100% {
    background-position: 200% center;
  }
}

.bg-clip-text {
  background-size: 200% auto;
  animation: shine 3s linear infinite;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .animate-bounce,
  .animate-pulse {
    animation-duration: 2s; /* Slower animations on mobile for better performance */
  }
}

/* Ensure proper text rendering on mobile */
@media (max-width: 480px) {
  .bg-clip-text {
    background-size: 100% auto;
    animation: none; /* Disable animation on very small screens */
  }
}
</style>