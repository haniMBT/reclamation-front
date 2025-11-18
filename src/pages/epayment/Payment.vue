<template>
  <q-page class="q-pa-lg cosmic-payment-bg">
    <!-- Loading cosmique -->
    <div v-if="loading" class="flex flex-center cosmic-loading">
      <div class="payment-loading-orbits">
        <div class="loading-orbit"></div>
        <div class="loading-orbit"></div>
        <div class="loading-orbit"></div>
      </div>
      <div class="text-primary text-h6 q-ml-md">Chargement de la facture...</div>
    </div>

    <div v-else-if="facture" class="row justify-center">
      <div class="col-12 col-md-10 col-lg-8">
        <!-- Container principal avec design cosmique -->
        <div class="cosmic-payment-container">
          <div class="payment-particle-system">
            <div v-for="i in 15" :key="i" class="payment-particle" :style="getParticleStyle(i)"></div>
          </div>
          
          <!-- Header holographique -->
          <div class="cosmic-payment-header text-center q-mb-xl">
            <div class="payment-hologram-container">
              <div class="payment-hologram">
                <div class="hologram-grid"></div>
                <q-icon name="payments" size="3rem" class="payment-title-icon" />
                <div class="energy-beam beam-1"></div>
                <div class="energy-beam beam-2"></div>
              </div>
            </div>
            <h4 class="text-h3 q-mb-sm text-white payment-title-neon">
              Paiement Sécurisé
            </h4>
            <p class="text-h6 text-white opacity-80">
              Transaction cryptée par technologie blockchain
            </p>
          </div>

          <!-- Carte de paiement principale -->
          <div class="cosmic-payment-card">
            <div class="payment-card-glow"></div>
            
            <!-- En-tête de la carte -->
            <div class="payment-card-header">
              <div class="row items-center justify-between">
                <div class="flex items-center">
                  <q-icon name="credit_card" size="lg" class="q-mr-sm text-white" />
                  <h5 class="text-h5 q-ma-none text-white">Formulaire de Paiement</h5>
                </div>
                <div class="security-badge">
                  <q-icon name="lock" class="q-mr-xs" />
                  <span>SSL 256-bit</span>
                </div>
              </div>
            </div>

            <!-- Corps de la carte -->
            <div class="payment-card-body q-pa-xl">
              <q-form @submit="processPayment" class="cosmic-payment-form">
                <!-- Informations de la facture -->
                <div class="payment-info-section q-mb-xl">
                  <div class="info-grid">
                    <!-- Facture -->
                    <div class="info-item cosmic-info-card">
                      <div class="info-icon">
                        <q-icon name="receipt" />
                      </div>
                      <div class="info-content">
                        <div class="info-label">Facture N°</div>
                        <div class="info-value highlight">
                          {{ facture.facrfe || facture.facnum }}
                        </div>
                        <div class="info-date">
                          {{ formatDate(facture.facdat) }}
                        </div>
                      </div>
                    </div>

                    <!-- Montant -->
                    <div class="info-item cosmic-info-card">
                      <div class="info-icon">
                        <q-icon name="attach_money" />
                      </div>
                      <div class="info-content">
                        <div class="info-label">Montant TTC</div>
                        <div class="info-value cosmic-amount">
                          {{ formatCurrency(facture.facttc) }}
                        </div>
                        <div class="info-subtext">Total à débourser</div>
                      </div>
                    </div>

                    <!-- Statut -->
                    <div class="info-item cosmic-info-card">
                      <div class="info-icon">
                        <q-icon name="schedule" />
                      </div>
                      <div class="info-content">
                        <div class="info-label">Statut</div>
                        <div class="info-value">
                          <q-badge color="orange" class="status-badge">
                            En attente de paiement
                          </q-badge>
                        </div>
                        <div class="info-subtext">Transaction sécurisée</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Section reCAPTCHA -->
                <div class="captcha-section q-mb-lg">
                  <div class="section-title">
                    <q-icon name="security" class="q-mr-sm" />
                    Vérification de sécurité
                  </div>
                  <div class="captcha-container">
                    <div ref="recaptchaContainer" id="recaptcha-container" class="recaptcha-wrapper"></div>
                    <div v-if="captchaError" class="error-message cosmic-error">
                      <q-icon name="warning" class="q-mr-sm" />
                      {{ captchaError }}
                    </div>
                  </div>
                </div>

                <!-- Conditions d'utilisation -->
                <div class="terms-section q-mb-xl">
                  <div class="section-title">
                    <q-icon name="gavel" class="q-mr-sm" />
                    Conditions d'utilisation
                  </div>
                  <div class="terms-container">
                    <q-checkbox
                      v-model="form.acceptTerms"
                      color="primary"
                      class="cosmic-checkbox"
                      size="lg"
                    >
                      <template v-slot:default>
                        <span class="checkbox-label">
                          J'accepte les 
                          <a
                            :href="conditionsUrl"
                            target="_blank"
                            class="conditions-link cosmic-link"
                            @click="printConditions"
                          >
                            conditions d'utilisation
                          </a>
                          et confirme avoir pris connaissance du traitement de mes données
                        </span>
                      </template>
                    </q-checkbox>
                    <div v-if="termsError" class="error-message cosmic-error">
                      <q-icon name="warning" class="q-mr-sm" />
                      {{ termsError }}
                    </div>
                  </div>
                </div>
              </q-form>
            </div>

            <!-- Pied de carte avec bouton de paiement -->
            <div class="payment-card-footer">
              <div class="payment-method-info">
                <div class="method-label">Processeur de paiement</div>
                <div class="method-logo">
                  <q-img
                    src="/Logo_Interoperabilite_Final.png"
                    alt="CIB"
                    class="payment-logo-img"
                    @error="onImageError"
                  />
                  <div class="method-glow"></div>
                </div>
              </div>
              
              <q-btn
                @click="processPayment"
                label="Procéder au Paiement"
                color="positive"
                size="lg"
                icon="lock"
                :loading="processing"
                :disable="!canSubmit"
                class="cosmic-payment-btn"
                glossy
              >
                <template v-slot:loading>
                  <q-spinner-dots class="q-mr-sm" />
                  Initialisation...
                </template>
              </q-btn>
            </div>
          </div>

          <!-- Informations de sécurité -->
          <div class="security-info-section q-mt-xl">
            <div class="security-card">
              <div class="security-glow"></div>
              <div class="row items-center">
                <div class="col-auto">
                  <div class="security-icon">
                    <q-icon name="verified_user" size="xl" />
                  </div>
                </div>
                <div class="col q-ml-lg">
                  <div class="security-title">Paiement 100% Sécurisé</div>
                  <div class="security-description">
                    Vos données bancaires sont cryptées avec la technologie SSL 256-bit. 
                    Aucune information sensible n'est stockée sur nos serveurs. 
                    Transactions certifiées PCI DSS.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- État facture non trouvée -->
    <div v-else class="text-center q-mt-xl cosmic-not-found">
      <div class="not-found-content">
        <q-icon name="error_outline" size="xl" color="grey" />
        <div class="text-h5 q-mt-md text-grey-7">Facture non trouvée</div>
        <q-btn
          color="primary"
          icon="home"
          label="Retour à l'accueil"
          @click="$router.push('/')"
          class="q-mt-md cosmic-btn-primary"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  computed,
  onBeforeMount,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useEpaymentStore } from "../../stores/epayment";
import { useAuthStore } from "stores/auth";

export default defineComponent({
  name: "Payment",

  setup() {
    const route = useRoute();
    const router = useRouter();
    const $q = useQuasar();
    const epaymentStore = useEpaymentStore();
    const authStore = useAuthStore();
    const VITE_API_BASE_URL = process.env.VITE_API_BASE_URL;
    const loading = ref(false);
    const processing = ref(false);
    const facture = ref(null);
    const factureAPayee = ref("");
    const showCaptcha = ref(true);
    const captchaError = ref("");
    const termsError = ref("");
    const recaptchaWidget = ref(null);
    const form = ref({
      acceptTerms: false,
      captchaResponse: "",
    });

    // URL du backend pour les conditions d'utilisation
    const conditionsUrl = computed(() => {
      const baseUrl = process.env.VITE_API_BASE_URL
      return `${baseUrl}/conditions`;
    });

    // Vérifier si le formulaire peut être soumis
    const canSubmit = computed(() => {
      return form.value.acceptTerms && form.value.captchaResponse;
    });

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("fr-DZ", {
        style: "currency",
        currency: "DZD",
      }).format(amount || 0);
    };

    const printConditions = (facture) => {
      const url = `${VITE_API_BASE_URL}/epayment/conditions/pdf`;
      window.open(url);
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("fr-FR");
    };

    const getParticleStyle = (index) => {
      const angle = (index / 15) * 360;
      const delay = index * 0.2;
      return {
        '--particle-angle': `${angle}deg`,
        '--particle-delay': `${delay}s`
      }
    };

    const loadFacture = async () => {
      loading.value = true;
      try {
        const factureId = route.params.id;
        const response = await epaymentStore.getFacture(factureId);
        facture.value = response.facture;
        factureAPayee.value = facture.value.facrfe + facture.value.facnum;

        if (response.facture.status === 1) {
          $q.notify({
            type: "info",
            message: "Cette facture a déjà été payée",
          });
          router.push(`/epayment/factures/${factureId}`);
          return;
        }
      } catch (error) {
        $q.notify({
          type: "negative",
          message: "Erreur lors du chargement de la facture",
          caption: error.message,
        });
        router.push("/epayment/factures");
      } finally {
        loading.value = false;
      }
    };

    // Les fonctions reCAPTCHA restent identiques
    const loadRecaptcha = () => {
      return new Promise((resolve) => {
        if (window.grecaptcha) {
          resolve(window.grecaptcha);
          return;
        }

        const script = document.createElement("script");
        script.src =
          "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
        script.async = true;
        script.defer = true;

        window.onRecaptchaLoad = () => {
          resolve(window.grecaptcha);
        };

        document.head.appendChild(script);
      });
    };

    const initRecaptcha = async () => {
      try {
        const grecaptcha = await loadRecaptcha();
        if (grecaptcha && document.getElementById("recaptcha-container")) {
          recaptchaWidget.value = grecaptcha.render("recaptcha-container", {
            sitekey: "6LcZTJkrAAAAAKWlsB2EDpzHZ5lj7aQT3a862Ihl",
            callback: onRecaptchaCallback,
            "expired-callback": onRecaptchaExpired,
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement de reCAPTCHA:", error);
      }
    };

    const onRecaptchaCallback = (response) => {
      form.value.captchaResponse = response;
      captchaError.value = "";
    };

    const onRecaptchaExpired = () => {
      form.value.captchaResponse = "";
      captchaError.value = "Le CAPTCHA a expiré, veuillez le refaire";
    };

    const onImageError = () => {
      console.log("Erreur lors du chargement de l'image logo");
    };

    const processPayment = async () => {
      captchaError.value = "";
      termsError.value = "";

      if (!form.value.acceptTerms) {
        termsError.value = "Vous devez accepter les conditions pour continuer";
        return;
      }

      if (!form.value.captchaResponse) {
        captchaError.value = "Veuillez compléter la vérification CAPTCHA";
        return;
      }

      processing.value = true;

      try {
        const response = await epaymentStore.processPayment(facture.value.id, {
          terms: form.value.acceptTerms,
          "g-recaptcha-response": form.value.captchaResponse,
        }, authStore.user.Email);

        if (response.success && response.data.payment_url) {
          window.location.href = response.data.payment_url;
        } else {
          throw new Error(
            response.message || "Erreur lors de l'initialisation du paiement"
          );
        }
      } catch (error) {
        if (window.grecaptcha && recaptchaWidget.value !== null) {
          window.grecaptcha.reset(recaptchaWidget.value);
        }
        form.value.captchaResponse = "";
      } finally {
        processing.value = false;
      }
    };

    onBeforeMount(async () => {
      await loadFacture();
      setTimeout(initRecaptcha, 500);
    });

    onUnmounted(() => {
      if (window.onRecaptchaLoad) {
        delete window.onRecaptchaLoad;
      }
    });

    return {
      loading,
      processing,
      facture,
      VITE_API_BASE_URL,
      showCaptcha,
      captchaError,
      termsError,
      form,
      conditionsUrl,
      canSubmit,
      formatCurrency,
      printConditions,
      formatDate,
      processPayment,
      onImageError,
      getParticleStyle,
    };
  },
});
</script>

<style scoped>
/* Design cosmique pour la page de paiement */
.cosmic-payment-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  min-height: 100vh;
}

.cosmic-payment-container {
  position: relative;
  padding: 40px 0;
}

.payment-particle-system {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.payment-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform-origin: center;
  animation: particleOrbit 4s linear infinite;
  animation-delay: var(--particle-delay);
}

/* Header holographique */
.cosmic-payment-header {
  position: relative;
  z-index: 2;
}

.payment-hologram-container {
  display: inline-block;
  margin-bottom: 20px;
}

.payment-hologram {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(79, 172, 254, 0.4);
}

.payment-title-icon {
  color: white;
  filter: drop-shadow(0 0 10px rgba(255,255,255,0.8));
  position: relative;
  z-index: 2;
}

.payment-title-neon {
  background: linear-gradient(135deg, #ffffff, #e0f7ff, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

/* Carte de paiement principale */
.cosmic-payment-card {
  position: relative;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  margin-bottom: 30px;
}

.payment-card-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4facfe, #00f2fe, #667eea, #764ba2);
  animation: glowFlow 3s ease-in-out infinite;
}

.payment-card-header {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 25px 30px;
  position: relative;
  overflow: hidden;
}

.security-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-weight: 600;
  font-size: 0.9em;
  backdrop-filter: blur(10px);
}

.payment-card-body {
  background: rgba(255, 255, 255, 0.98);
}

/* Section informations */
.payment-info-section {
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 30px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.cosmic-info-card {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 15px;
}

.cosmic-info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.info-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 0.9em;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 4px;
}

.info-value {
  font-size: 1.2em;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.info-value.highlight {
  color: #667eea;
}

.cosmic-amount {
  font-size: 1.4em;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.info-date, .info-subtext {
  font-size: 0.8em;
  color: #9ca3af;
}

.status-badge {
  font-size: 0.8em;
  font-weight: 600;
}

/* Sections de formulaire */
.section-title {
  font-size: 1.1em;
  font-weight: 700;
  color: #374151;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.captcha-container, .terms-container {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.recaptcha-wrapper {
  display: flex;
  justify-content: center;
}

.cosmic-checkbox :deep(.q-checkbox__inner) {
  font-size: 1.2em;
}

.checkbox-label {
  color: #374151;
  font-size: 0.95em;
  line-height: 1.4;
}

.cosmic-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cosmic-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.error-message {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 10px;
  font-size: 0.9em;
  font-weight: 500;
}

.cosmic-error {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

/* Pied de carte */
.payment-card-footer {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  padding: 30px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.payment-method-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.method-label {
  font-weight: 600;
  color: #374151;
}

.method-logo {
  position: relative;
  padding: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.payment-logo-img {
  width: 120px;
  height: auto;
}

.method-glow {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
  z-index: -1;
  opacity: 0.3;
}

.cosmic-payment-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1em;
  padding: 12px 30px;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
  transition: all 0.3s ease;
  min-width: 200px;
}

.cosmic-payment-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(16, 185, 129, 0.6);
}

.cosmic-payment-btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Section sécurité */
.security-info-section {
  position: relative;
}

.security-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  overflow: hidden;
}

.security-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #10b981, #059669, #34d399);
}

.security-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #10b981, #34d399);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.security-title {
  font-size: 1.2em;
  font-weight: 700;
  color: #065f46;
  margin-bottom: 8px;
}

.security-description {
  color: #374151;
  line-height: 1.5;
  font-size: 0.95em;
}

/* Loading cosmique */
.cosmic-loading {
  min-height: 50vh;
}

.payment-loading-orbits {
  position: relative;
  width: 80px;
  height: 80px;
}

/* Animations */
@keyframes particleOrbit {
  0% {
    transform: rotate(var(--particle-angle)) translateX(200px) rotate(calc(-1 * var(--particle-angle)));
    opacity: 1;
  }
  100% {
    transform: rotate(calc(var(--particle-angle) + 360deg)) translateX(200px) rotate(calc(-1 * var(--particle-angle) - 360deg));
    opacity: 0;
  }
}

@keyframes glowFlow {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

@keyframes hologramSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes dataFlow {
  0% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(-50%) translateY(20px); opacity: 0; }
}

/* Responsive */
@media (max-width: 768px) {
  .cosmic-payment-container {
    padding: 20px 0;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .payment-card-footer {
    flex-direction: column;
    text-align: center;
  }
  
  .payment-method-info {
    flex-direction: column;
    gap: 10px;
  }
  
  .cosmic-payment-btn {
    width: 100%;
  }
}

.opacity-80 {
  opacity: 0.8;
}
</style>