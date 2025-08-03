<template>
  <div class="min-h-screen relative flex items-center justify-center overflow-hidden">
    <!-- Background Image -->
    <div 
      class="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style="background-image: url('/slider_bg02.jpg')"
    ></div>
    
    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/30"></div>

    <!-- Main Container -->
    <div class="relative z-10 w-full max-w-md mx-auto px-6">
      
      <!-- Logo Section -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center mb-4">
          <q-img class="w-16 h-16" src="/logo epal.png" />
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">EPAL</h1>
        <p class="text-white/80">Récupération de mot de passe</p>
      </div>

      <!-- Form Container -->
      <div class="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
        
        <!-- Step 1: Email Input -->
        <div v-if="step === 1">
          <div class="text-center mb-6">
            <h2 class="text-xl font-bold text-gray-800 mb-2">Mot de passe oublié</h2>
            <p class="text-gray-600 text-sm">
              Saisissez votre adresse email pour recevoir un code de récupération
            </p>
          </div>

          <form @submit.prevent="sendCode" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Adresse email <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <q-icon name="email" class="text-gray-400" />
                </div>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="votre.email@exemple.com"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  required
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-3">
              <p class="text-red-600 text-sm">{{ errorMessage }}</p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading || !form.email"
              class="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <q-spinner-oval v-if="loading" size="20px" class="mr-3" />
              <q-icon v-else name="send" class="mr-2" />
              {{ loading ? "Envoi en cours..." : "Envoyer le code" }}
            </button>
          </form>
        </div>

        <!-- Step 2: Code Verification + New Password -->
        <div v-if="step === 2">
          <div class="text-center mb-6">
            <h2 class="text-xl font-bold text-gray-800 mb-2">Code de vérification</h2>
            <p class="text-gray-600 text-sm">
              Un code a été envoyé à <strong>{{ form.email }}</strong>
            </p>
          </div>

          <form @submit.prevent="resetPassword" class="space-y-4">
            <!-- Code Input -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Code de vérification <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <q-icon name="verified_user" class="text-gray-400" />
                </div>
                <input
                  v-model="form.code"
                  type="text"
                  placeholder="123456"
                  maxlength="6"
                  class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 text-center font-mono text-lg tracking-widest"
                  required
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- New Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nouveau mot de passe <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <q-icon name="lock" class="text-gray-400" />
                </div>
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Nouveau mot de passe"
                  class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  required
                  minlength="8"
                  :disabled="loading"
                />
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <q-icon 
                    :name="showPassword ? 'visibility_off' : 'visibility'" 
                    class="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" 
                  />
                </button>
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <q-icon name="lock" class="text-gray-400" />
                </div>
                <input
                  v-model="form.password_confirmation"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Confirmer le mot de passe"
                  class="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                  required
                  minlength="8"
                  :disabled="loading"
                />
                <button 
                  type="button" 
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <q-icon 
                    :name="showConfirmPassword ? 'visibility_off' : 'visibility'" 
                    class="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer" 
                  />
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-3">
              <p class="text-red-600 text-sm">{{ errorMessage }}</p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading || !form.code || !form.password || !form.password_confirmation"
              class="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <q-spinner-oval v-if="loading" size="20px" class="mr-3" />
              <q-icon v-else name="check" class="mr-2" />
              {{ loading ? "Réinitialisation..." : "Réinitialiser le mot de passe" }}
            </button>

            <!-- Back Button -->
            <button
              type="button"
              @click="goBackToEmail"
              class="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm"
            >
              ← Modifier l'adresse email
            </button>
          </form>
        </div>

        <!-- Step 3: Success -->
        <div v-if="step === 3" class="text-center">
          <div class="mb-6">
            <div class="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <q-icon name="check_circle" class="text-3xl text-emerald-600" />
            </div>
            <h2 class="text-xl font-bold text-gray-800 mb-2">Mot de passe réinitialisé !</h2>
            <p class="text-gray-600 text-sm">
              Votre mot de passe a été mis à jour avec succès.
            </p>
          </div>

          <q-btn
            to="/login"
            color="emerald-6"
            icon="login"
            label="Se connecter"
            class="w-full py-3"
            size="lg"
            rounded
          />
        </div>

        <!-- Back to Login Link -->
        <div v-if="step !== 3" class="text-center mt-6 pt-4 border-t border-gray-200">
          <router-link 
            to="/login" 
            class="text-emerald-600 hover:text-emerald-700 transition-colors text-sm"
          >
            ← Retour à la connexion
          </router-link>
        </div>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="absolute top-10 right-10 w-20 h-20 bg-emerald-400/10 rounded-full blur-xl"></div>
    <div class="absolute bottom-20 left-10 w-24 h-24 bg-teal-400/10 rounded-full blur-xl"></div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useAuthStore } from "stores/auth";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const authStore = useAuthStore();
const router = useRouter();
const $q = useQuasar();

const step = ref(1); // 1: email, 2: code+password, 3: success
const loading = ref(false);
const errorMessage = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const form = reactive({
  email: '',
  code: '',
  password: '',
  password_confirmation: ''
});

// Étape 1: Envoyer le code par email
const sendCode = async () => {
  loading.value = true;
  errorMessage.value = '';

  const result = await authStore.forgotPassword(form.email);
  
  if (result.success) {
    step.value = 2;
    $q.notify({
      type: 'positive',
      message: 'Code envoyé à votre adresse email',
      position: 'top'
    });
  } else {
    errorMessage.value = result.error;
  }
  
  loading.value = false;
};

// Étape 2: Réinitialiser le mot de passe
const resetPassword = async () => {
  // Vérifier que les mots de passe correspondent
  if (form.password !== form.password_confirmation) {
    errorMessage.value = 'Les mots de passe ne correspondent pas';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  const resetData = {
    email: form.email,
    code: form.code,
    password: form.password,
    password_confirmation: form.password_confirmation
  };

  const result = await authStore.resetPassword(resetData);
  
  if (result.success) {
    step.value = 3;
    $q.notify({
      type: 'positive',
      message: 'Mot de passe réinitialisé avec succès',
      position: 'top'
    });
  } else {
    errorMessage.value = result.error;
  }
  
  loading.value = false;
};

// Retourner à l'étape email
const goBackToEmail = () => {
  step.value = 1;
  form.code = '';
  form.password = '';
  form.password_confirmation = '';
  errorMessage.value = '';
};
</script>

<style scoped>
/* Transitions fluides */
input, button {
  transition: all 0.2s ease;
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

.bg-white\/95 {
  animation: slideInUp 0.6s ease-out;
}

/* Focus states */
input:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}
</style>