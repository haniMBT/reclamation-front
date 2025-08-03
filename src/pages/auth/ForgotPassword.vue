<template>
  <div class="tw-min-h-screen tw-relative tw-flex tw-items-center tw-justify-center tw-overflow-hidden">
    <!-- Background Image -->
    <div 
      class="tw-absolute tw-inset-0 tw-bg-cover tw-bg-center tw-bg-no-repeat"
      style="background-image: url('/slider_bg02.jpg')"
    ></div>
    
    <!-- Overlay -->
    <div class="tw-absolute tw-inset-0 tw-bg-black/30"></div>

    <!-- Main Container -->
    <div class="tw-relative tw-z-10 tw-w-full tw-max-w-md tw-mx-auto tw-px-6">
      
      <!-- Logo Section -->
      <div class="tw-text-center tw-mb-8">
        <div class="tw-flex tw-items-center tw-justify-center tw-mb-4">
          <q-img class="tw-w-16 tw-h-16" src="/logo-epal.png" />
        </div>
        <h1 class="tw-text-2xl tw-font-bold tw-text-white tw-mb-2">EPAL</h1>
        <p class="tw-text-white/80">Récupération de mot de passe</p>
      </div>

      <!-- Form Container -->
      <div class="tw-bg-white/95 tw-backdrop-blur-sm tw-rounded-3xl tw-shadow-2xl tw-p-8 tw-border tw-border-white/20">
        
        <!-- Step 1: Email Input -->
        <div v-if="step === 1">
          <div class="tw-text-center tw-mb-6">
            <h2 class="tw-text-xl tw-font-bold tw-text-gray-800 tw-mb-2">Mot de passe oublié</h2>
            <p class="tw-text-gray-600 tw-text-sm">
              Saisissez votre adresse email pour recevoir un code de récupération
            </p>
          </div>

          <form @submit.prevent="sendCode" class="tw-space-y-4">
            <div>
              <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                Adresse email <span class="tw-text-red-500">*</span>
              </label>
              <div class="tw-relative">
                <div class="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
                  <q-icon name="email" class="tw-text-gray-400" />
                </div>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="votre.email@exemple.com"
                  class="tw-w-full tw-pl-10 tw-pr-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-xl tw-bg-white tw-text-gray-900 focus:tw-ring-2 focus:tw-ring-emerald-500 focus:tw-border-emerald-500 tw-transition-all tw-duration-200"
                  required
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-lg tw-p-3">
              <p class="tw-text-red-600 tw-text-sm">{{ errorMessage }}</p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading || !form.email"
              class="tw-w-full tw-py-3 tw-px-4 tw-bg-gradient-to-r tw-from-emerald-600 tw-to-teal-600 hover:tw-from-emerald-700 hover:tw-to-teal-700 tw-text-white tw-font-semibold tw-rounded-xl tw-shadow-lg tw-transition-all tw-duration-200 tw-transform hover:tw-scale-[1.02] tw-flex tw-items-center tw-justify-center disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
            >
              <q-spinner-oval v-if="loading" size="20px" class="tw-mr-3" />
              <q-icon v-else name="send" class="tw-mr-2" />
              {{ loading ? "Envoi en cours..." : "Envoyer le code" }}
            </button>
          </form>
        </div>

        <!-- Step 2: Code Verification + New Password -->
        <div v-if="step === 2">
          <div class="tw-text-center tw-mb-6">
            <h2 class="tw-text-xl tw-font-bold tw-text-gray-800 tw-mb-2">Code de vérification</h2>
            <p class="tw-text-gray-600 tw-text-sm">
              Un code a été envoyé à <strong>{{ form.email }}</strong>
            </p>
          </div>

          <form @submit.prevent="resetPassword" class="tw-space-y-4">
            <!-- Code Input -->
            <div>
              <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                Code de vérification <span class="tw-text-red-500">*</span>
              </label>
              <div class="tw-relative">
                <div class="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
                  <q-icon name="verified_user" class="tw-text-gray-400" />
                </div>
                <input
                  v-model="form.code"
                  type="text"
                  placeholder="123456"
                  maxlength="6"
                  class="tw-w-full tw-pl-10 tw-pr-4 tw-py-3 tw-border tw-border-gray-300 tw-rounded-xl tw-bg-white tw-text-gray-900 focus:tw-ring-2 focus:tw-ring-emerald-500 focus:tw-border-emerald-500 tw-transition-all tw-duration-200 tw-text-center tw-font-mono tw-text-lg tw-tracking-widest"
                  required
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- New Password -->
            <div>
              <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                Nouveau mot de passe <span class="tw-text-red-500">*</span>
              </label>
              <div class="tw-relative">
                <div class="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
                  <q-icon name="lock" class="tw-text-gray-400" />
                </div>
                <input
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Nouveau mot de passe"
                  class="tw-w-full tw-pl-10 tw-pr-12 tw-py-3 tw-border tw-border-gray-300 tw-rounded-xl tw-bg-white tw-text-gray-900 focus:tw-ring-2 focus:tw-ring-emerald-500 focus:tw-border-emerald-500 tw-transition-all tw-duration-200"
                  required
                  minlength="8"
                  :disabled="loading"
                />
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="tw-absolute tw-inset-y-0 tw-right-0 tw-pr-3 tw-flex tw-items-center"
                >
                  <q-icon 
                    :name="showPassword ? 'visibility_off' : 'visibility'" 
                    class="tw-text-gray-400 hover:tw-text-gray-600 tw-transition-colors tw-cursor-pointer" 
                  />
                </button>
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 tw-mb-2">
                Confirmer le mot de passe <span class="tw-text-red-500">*</span>
              </label>
              <div class="tw-relative">
                <div class="tw-absolute tw-inset-y-0 tw-left-0 tw-pl-3 tw-flex tw-items-center tw-pointer-events-none">
                  <q-icon name="lock" class="tw-text-gray-400" />
                </div>
                <input
                  v-model="form.password_confirmation"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Confirmer le mot de passe"
                  class="tw-w-full tw-pl-10 tw-pr-12 tw-py-3 tw-border tw-border-gray-300 tw-rounded-xl tw-bg-white tw-text-gray-900 focus:tw-ring-2 focus:tw-ring-emerald-500 focus:tw-border-emerald-500 tw-transition-all tw-duration-200"
                  required
                  minlength="8"
                  :disabled="loading"
                />
                <button 
                  type="button" 
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="tw-absolute tw-inset-y-0 tw-right-0 tw-pr-3 tw-flex tw-items-center"
                >
                  <q-icon 
                    :name="showConfirmPassword ? 'visibility_off' : 'visibility'" 
                    class="tw-text-gray-400 hover:tw-text-gray-600 tw-transition-colors tw-cursor-pointer" 
                  />
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="tw-bg-red-50 tw-border tw-border-red-200 tw-rounded-lg tw-p-3">
              <p class="tw-text-red-600 tw-text-sm">{{ errorMessage }}</p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading || !form.code || !form.password || !form.password_confirmation"
              class="tw-w-full tw-py-3 tw-px-4 tw-bg-gradient-to-r tw-from-emerald-600 tw-to-teal-600 hover:tw-from-emerald-700 hover:tw-to-teal-700 tw-text-white tw-font-semibold tw-rounded-xl tw-shadow-lg tw-transition-all tw-duration-200 tw-transform hover:tw-scale-[1.02] tw-flex tw-items-center tw-justify-center disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
            >
              <q-spinner-oval v-if="loading" size="20px" class="tw-mr-3" />
              <q-icon v-else name="check" class="tw-mr-2" />
              {{ loading ? "Réinitialisation..." : "Réinitialiser le mot de passe" }}
            </button>

            <!-- Back Button -->
            <button
              type="button"
              @click="goBackToEmail"
              class="tw-w-full tw-py-2 tw-text-gray-600 hover:tw-text-gray-800 tw-transition-colors tw-text-sm"
            >
              ← Modifier l'adresse email
            </button>
          </form>
        </div>

        <!-- Step 3: Success -->
        <div v-if="step === 3" class="tw-text-center">
          <div class="tw-mb-6">
            <div class="tw-w-16 tw-h-16 tw-bg-emerald-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4">
              <q-icon name="check_circle" class="tw-text-3xl tw-text-emerald-600" />
            </div>
            <h2 class="tw-text-xl tw-font-bold tw-text-gray-800 tw-mb-2">Mot de passe réinitialisé !</h2>
            <p class="tw-text-gray-600 tw-text-sm">
              Votre mot de passe a été mis à jour avec succès.
            </p>
          </div>

          <q-btn
            to="/login"
            color="emerald-6"
            icon="login"
            label="Se connecter"
            class="tw-w-full tw-py-3"
            size="lg"
            rounded
          />
        </div>

        <!-- Back to Login Link -->
        <div v-if="step !== 3" class="tw-text-center tw-mt-6 tw-pt-4 tw-border-t tw-border-gray-200">
          <router-link 
            to="/login" 
            class="tw-text-emerald-600 hover:tw-text-emerald-700 tw-transition-colors tw-text-sm"
          >
            ← Retour à la connexion
          </router-link>
        </div>
      </div>
    </div>

    <!-- Decorative Elements -->
    <div class="tw-absolute tw-top-10 tw-right-10 tw-w-20 tw-h-20 tw-bg-emerald-400/10 tw-rounded-full tw-blur-xl"></div>
    <div class="tw-absolute tw-bottom-20 tw-left-10 tw-w-24 tw-h-24 tw-bg-teal-400/10 tw-rounded-full tw-blur-xl"></div>
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

.tw-bg-white\/95 {
  animation: slideInUp 0.6s ease-out;
}

/* Focus states */
input:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}
</style>