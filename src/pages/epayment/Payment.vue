<template>
  <q-page class="q-pa-lg">
    <div v-if="loading" class="flex flex-center">
      <q-spinner-dots size="xl" color="primary" />
    </div>
    
    <div v-else-if="facture" class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <!-- Header -->
        <div class="text-center q-mb-lg">
          <q-icon name="payment" size="4rem" color="primary" />
          <h4 class="text-h4 q-mb-none text-primary">Paiement en ligne</h4>
          <p class="text-subtitle1 text-grey-7">Paiement sécurisé par carte bancaire</p>
        </div>

        <!-- Récapitulatif de la facture -->
        <q-card class="q-mb-lg">
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="receipt" class="q-mr-sm" />
              Récapitulatif de la facture
            </div>
            
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-weight-bold">Numéro de facture</q-item-label>
                  <q-item-label caption>{{ facture.facnum }}</q-item-label>
                </q-item-section>
              </q-item>
              
              <q-item>
                <q-item-section>
                  <q-item-label class="text-weight-bold">Date</q-item-label>
                  <q-item-label caption>{{ formatDate(facture.facdat) }}</q-item-label>
                </q-item-section>
              </q-item>
              
              <q-item>
                <q-item-section>
                  <q-item-label class="text-weight-bold">Tiers</q-item-label>
                  <q-item-label caption>{{ facture.trsnom }}</q-item-label>
                </q-item-section>
              </q-item>
              
              <q-separator spaced />
              
              <q-item>
                <q-item-section>
                  <q-item-label class="text-h5 text-weight-bold text-primary">
                    Montant à payer: {{ formatCurrency(facture.facttc) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <!-- Formulaire de paiement -->
        <q-card>
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="credit_card" class="q-mr-sm" />
              Informations de paiement
            </div>
            
            <q-form @submit="processPayment" class="q-gutter-md">
              <!-- Conditions d'utilisation -->
              <div class="q-pa-md bg-blue-1 rounded-borders">
                <div class="text-subtitle2 q-mb-sm">Conditions de paiement</div>
                <div class="text-body2 text-grey-7">
                  En procédant au paiement, vous acceptez nos conditions générales d'utilisation 
                  et notre politique de confidentialité. Le paiement est sécurisé et traité par 
                  notre partenaire bancaire SATIM.
                </div>
              </div>

              <!-- Case à cocher pour accepter les conditions -->
              <q-checkbox
                v-model="form.acceptTerms"
                color="primary"
                :rules="[val => val || 'Vous devez accepter les conditions']"
              >
                <template v-slot:default>
                  <span>
                    J'accepte 
                    <a 
                      href="http://localhost:8000/api/epayment/conditions" 
                      target="_blank" 
                      class="text-primary text-decoration-underline"
                    >
                      les conditions d'utilisation
                    </a>.
                  </span>
                </template>
              </q-checkbox>

              <!-- Captcha (si nécessaire) -->
              <div v-if="showCaptcha" class="q-mt-md">
                <div class="text-subtitle2 q-mb-sm">Vérification de sécurité</div>
                <!-- Ici on peut intégrer reCAPTCHA si nécessaire -->
                <div class="text-caption text-grey-6">
                  Cliquez sur "Procéder au paiement" pour continuer vers la page sécurisée
                </div>
              </div>

              <!-- Actions -->
              <div class="row q-gutter-md q-mt-lg">
                <div class="col">
                  <q-btn
                    flat
                    label="Annuler"
                    color="grey"
                    icon="arrow_back"
                    @click="$router.go(-1)"
                    class="full-width"
                  />
                </div>
                <div class="col">
                  <q-btn
                    type="submit"
                    label="Procéder au paiement"
                    color="positive"
                    icon="lock"
                    :loading="processing"
                    :disable="!form.acceptTerms"
                    class="full-width"
                  />
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>

        <!-- Informations de sécurité -->
        <q-card class="q-mt-md bg-green-1">
          <q-card-section>
            <div class="row items-center">
              <div class="col-auto">
                <q-icon name="security" size="2rem" color="positive" />
              </div>
              <div class="col q-ml-md">
                <div class="text-subtitle2">Paiement 100% sécurisé</div>
                <div class="text-body2 text-grey-7">
                  Vos données bancaires sont protégées par cryptage SSL 256 bits. 
                  Nous ne stockons aucune information bancaire.
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    
    <div v-else class="text-center q-mt-xl">
      <q-icon name="error" size="xl" color="grey" />
      <div class="text-h6 q-mt-md">Facture non trouvée</div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useEpaymentStore } from '../../stores/epayment'

export default defineComponent({
  name: 'Payment',
  
  setup() {
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()
    const epaymentStore = useEpaymentStore()
    
    const loading = ref(false)
    const processing = ref(false)
    const facture = ref(null)
    const showCaptcha = ref(false)
    
    const form = ref({
      acceptTerms: false
    })
    
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('fr-DZ', {
        style: 'currency',
        currency: 'DZD'
      }).format(amount || 0)
    }
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('fr-FR')
    }
    
    const loadFacture = async () => {
      loading.value = true
      try {
        const factureId = route.params.id
        const response = await epaymentStore.getFacture(factureId)
        facture.value = response.facture
        
        // Vérifier si la facture est déjà payée
        if (response.facture.status === 1) {
          $q.notify({
            type: 'info',
            message: 'Cette facture a déjà été payée'
          })
          router.push(`/epayment/factures/${factureId}`)
          return
        }
        
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erreur lors du chargement de la facture',
          caption: error.message
        })
        router.push('/epayment/factures')
      } finally {
        loading.value = false
      }
    }
    
    const processPayment = async () => {
      if (!form.value.acceptTerms) {
        $q.notify({
          type: 'warning',
          message: 'Vous devez accepter les conditions pour continuer'
        })
        return
      }
      
      processing.value = true
      
      try {
        const response = await epaymentStore.processPayment(facture.value.id, {
          terms: form.value.acceptTerms
        })
        
        if (response.success && response.data.payment_url) {
          // Rediriger vers la page de paiement sécurisée
          window.location.href = response.data.payment_url
        } else {
          throw new Error(response.message || 'Erreur lors de l\'initialisation du paiement')
        }
        
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erreur lors du traitement du paiement',
          caption: error.message
        })
      } finally {
        processing.value = false
      }
    }
    
    onMounted(() => {
      loadFacture()
    })
    
    return {
      loading,
      processing,
      facture,
      showCaptcha,
      form,
      formatCurrency,
      formatDate,
      processPayment
    }
  }
})
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
</style>