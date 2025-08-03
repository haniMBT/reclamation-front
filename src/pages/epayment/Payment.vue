<template>
  <q-page class="q-pa-lg payment-page">
    <div v-if="loading" class="flex flex-center">
      <q-spinner-dots size="xl" color="primary" />
    </div>

    <div v-else-if="facture" class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="container-form">
          <!-- Header intégré dans le container-form -->
          <div class="text-center q-mb-lg">
            <q-icon name="payment" size="4rem" color="white" />
            <h4 class="text-h4 q-mb-none text-white">Paiement en ligne</h4>
            <p class="text-subtitle1 text-white">
              Paiement sécurisé par carte bancaire
            </p>
          </div>

          <!-- Formulaire de paiement style payer.blade.php -->
          <div class="payment-card">
            <div class="card-header">
              <h3 class="card-title">
                <q-icon name="credit_card" class="q-mr-sm" />
                Formulaire de Paiement
              </h3>
            </div>

            <q-form @submit="processPayment" class="card-body">
              <!-- Informations de la facture -->
              <div class="form-group q-mb-md">
                <label class="form-label"
                  >Vous êtes sur le point de payer la facture N° :
                </label>
                <q-input
                  readonly
                  filled
                  :model-value="`${facture.facrfe || ''} du ${
                    formatDate(facture.facdat) || ''
                  }`"
                  class="form-control-lg"
                />
                <!-- :value="`${facture.facrfe || facture.facnum} du ${formatDate(
                    facture.facdat
                  )}`" -->
              </div>

              <div class="form-group q-mb-md">
                <label class="form-label">Montant TTC à payer :</label>
                <div class="amount-display">
                  {{ formatCurrency(facture.facttc) }}
                </div>
              </div>

              <!-- reCAPTCHA -->
              <div class="form-group q-mb-md">
                <div ref="recaptchaContainer" id="recaptcha-container"></div>
                <div
                  v-if="captchaError"
                  class="alert alert-danger fade-in q-mt-sm"
                >
                  <strong>{{ captchaError }}</strong>
                </div>
              </div>

              <!-- Conditions d'utilisation -->
              <div class="form-group q-mb-md">
                <q-checkbox
                  v-model="form.acceptTerms"
                  color="primary"
                  class="custom-checkbox"
                >
                  <template v-slot:default>
                    <span class="checkbox-label">
                      J'accepte
                      <a
                        :href="conditionsUrl"
                        target="_blank"
                        class="conditions-link"
                        @click="printConditions"
                      >
                        les conditions d'utilisation </a
                      >.
                    </span>
                  </template>
                </q-checkbox>
                <div
                  v-if="termsError"
                  class="alert alert-danger fade-in q-mt-sm"
                >
                  <strong>{{ termsError }}</strong>
                </div>
              </div>
            </q-form>

            <!-- Footer: Méthode de paiement + Bouton de validation -->
            <div class="card-footer">
              <div class="payment-method">
                <p class="lead">Méthode de Paiement :</p>
                <div class="payment-logo">
                  <q-img
                    src="/Logo_Interoperabilite_Final.png"
                    alt="CIB"
                    width="120px"
                    height="auto"
                    @error="onImageError"
                  />
                </div>
              </div>
              <q-btn
                @click="processPayment"
                label="Valider"
                color="primary"
                size="lg"
                icon="lock"
                :loading="processing"
                :disable="!canSubmit"
                class="btn-validate"
              />
            </div>
          </div>

          <!-- Informations de sécurité -->
          <div class="security-info q-mt-md">
            <div class="row items-center">
              <div class="col-auto">
                <q-icon name="security" size="2rem" color="positive" />
              </div>
              <div class="col q-ml-md">
                <div class="text-subtitle2 text-white">
                  Paiement 100% sécurisé
                </div>
                <div class="text-body2 text-white">
                  Vos données bancaires sont protégées par cryptage SSL 256
                  bits. Nous ne stockons aucune information bancaire.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center q-mt-xl">
      <q-icon name="error" size="xl" color="grey" />
      <div class="text-h6 q-mt-md">Facture non trouvée</div>
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

export default defineComponent({
  name: "Payment",

  setup() {
    const route = useRoute();
    const router = useRouter();
    const $q = useQuasar();
    const epaymentStore = useEpaymentStore();
    const BASE_URL = process.env.BASE_URL;
    const loading = ref(false);
    const processing = ref(false);
    const facture = ref(null);
    const factureAPayee = ref("");
    const showCaptcha = ref(true); // Toujours afficher reCAPTCHA
    const captchaError = ref("");
    const termsError = ref("");
    const recaptchaWidget = ref(null);

    const form = ref({
      acceptTerms: false,
      captchaResponse: "",
    });

    // URL du backend pour les conditions d'utilisation
    const conditionsUrl = computed(() => {
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
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
      // Ouvrir le PDF dans un nouvel onglet
      const url = `${BASE_URL}/epayment/conditions/pdf`;
      window.open(url);
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("fr-FR");
    };

    const loadFacture = async () => {
      loading.value = true;
      try {
        const factureId = route.params.id;
        const response = await epaymentStore.getFacture(factureId);
        facture.value = response.facture;
        factureAPayee.value = facture.value.facrfe + facture.value.facnum;
        console.log("factureAPayee", factureAPayee.value);

        // Vérifier si la facture est déjà payée
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

    // Charger le script reCAPTCHA
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

    // Initialiser reCAPTCHA
    const initRecaptcha = async () => {
      try {
        const grecaptcha = await loadRecaptcha();
        if (grecaptcha && document.getElementById("recaptcha-container")) {
          recaptchaWidget.value = grecaptcha.render("recaptcha-container", {
            sitekey: "6LcZTJkrAAAAAKWlsB2EDpzHZ5lj7aQT3a862Ihl", // Clé de test, à remplacer
            callback: onRecaptchaCallback,
            "expired-callback": onRecaptchaExpired,
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement de reCAPTCHA:", error);
      }
    };

    // Callback reCAPTCHA
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
      // Validation
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
        });

        if (response.success && response.data.payment_url) {
          // Rediriger vers la page de paiement sécurisée
          window.location.href = response.data.payment_url;
        } else {
          throw new Error(
            response.message || "Erreur lors de l'initialisation du paiement"
          );
        }
      } catch (error) {
        // Reset reCAPTCHA en cas d'erreur
        if (window.grecaptcha && recaptchaWidget.value !== null) {
          window.grecaptcha.reset(recaptchaWidget.value);
        }
        form.value.captchaResponse = "";

        $q.notify({
          type: "negative",
          message: "Erreur lors du traitement du paiement",
          caption: error.message,
        });
      } finally {
        processing.value = false;
      }
    };

    onBeforeMount(async () => {
      await loadFacture();
      // Initialiser reCAPTCHA après le chargement de la facture
      setTimeout(initRecaptcha, 500);
    });

    onUnmounted(() => {
      // Nettoyer les scripts reCAPTCHA si nécessaire
      if (window.onRecaptchaLoad) {
        delete window.onRecaptchaLoad;
      }
    });

    return {
      loading,
      processing,
      facture,
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
    };
  },
});
</script>

<style scoped>
/* Styles inspirés de payer.blade.php */
.payment-page {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
}

.container-form {
  background: linear-gradient(135deg, #d0f0ff, #0072ff);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  color: white;
}

.payment-card {
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  overflow: hidden;
}

.card-header {
  background-color: #007bff;
  color: white;
  padding: 15px 20px;
  border-radius: 12px 12px 0 0;
}

.card-header .card-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
}

.card-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-label {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  display: block;
}

.form-control-lg {
  border-radius: 8px;
  border: 1px solid #ddd;
  transition: border-color 0.3s ease;
}

.form-control-lg:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.2);
}

.amount-display {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  background: linear-gradient(45deg, #007bff, #0056b3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.custom-checkbox {
  margin-top: 10px;
}

.checkbox-label {
  color: #333;
  font-size: 0.95rem;
}

.conditions-link {
  color: #007bff;
  text-decoration: underline;
  font-weight: 500;
}

.conditions-link:hover {
  color: #0056b3;
}

.alert {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.9em;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-footer {
  padding: 20px;
  background-color: #f8f9fa;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.payment-method {
  display: flex;
  align-items: center;
  gap: 15px;
}

.payment-method .lead {
  margin: 0;
  font-weight: 600;
  color: #333;
}

.payment-logo {
  display: flex;
  align-items: center;
}

.btn-validate {
  background-color: #007bff;
  border-color: #007bff;
  transition: all 0.3s ease;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-validate:hover {
  background-color: #0056b3;
  border-color: #0056b3;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
}

.security-info {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 15px;
  backdrop-filter: blur(10px);
}

#recaptcha-container {
  margin: 10px 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .container-form {
    padding: 20px;
    margin: 10px;
  }

  .card-footer {
    flex-direction: column;
    text-align: center;
  }

  .payment-method {
    flex-direction: column;
    gap: 10px;
  }

  .amount-display {
    font-size: 1.5rem;
  }
}

/* Transition pour tous les éléments interactifs */
.q-btn,
.q-input,
.q-checkbox {
  transition: all 0.2s ease;
}

/* Animation d'entrée pour le formulaire */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.payment-card {
  animation: slideInRight 0.6s ease-out;
}
</style>
