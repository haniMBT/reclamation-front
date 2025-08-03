<template>
  <q-page class="q-pa-lg">
    <div v-if="loading" class="flex flex-center">
      <q-spinner-dots size="xl" color="primary" />
    </div>
    
    <div v-else class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <!-- Message d'échec -->
        <div class="text-center q-mb-lg">
          <q-icon name="error" size="6rem" color="negative" />
          <h4 class="text-h4 q-mb-md text-negative">Paiement échoué</h4>
          <p class="text-subtitle1 text-grey-7">
            {{ errorMessage || 'Votre paiement n\'a pas pu être traité.' }}
          </p>
        </div>

        <!-- Détails de l'erreur -->
        <q-card v-if="paymentData" class="q-mb-lg">
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="info" class="q-mr-sm" />
              Détails de l'échec
            </div>
            
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-weight-bold">Facture</q-item-label>
                  <q-item-label caption>{{ paymentData.facture.facnum }}</q-item-label>
                </q-item-section>
              </q-item>
              
              <q-item>
                <q-item-section>
                  <q-item-label class="text-weight-bold">Montant</q-item-label>
                  <q-item-label caption>{{ formatCurrency(paymentData.facture.facttc) }}</q-item-label>
                </q-item-section>
              </q-item>
              
              <q-item v-if="paymentData.error_code">
                <q-item-section>
                  <q-item-label class="text-weight-bold">Code d'erreur</q-item-label>
                  <q-item-label caption>{{ paymentData.error_code }}</q-item-label>
                </q-item-section>
              </q-item>
              
              <q-item v-if="paymentData.order_status">
                <q-item-section>
                  <q-item-label class="text-weight-bold">Statut de la commande</q-item-label>
                  <q-item-label caption>{{ paymentData.order_status }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <!-- Causes possibles -->
        <q-card class="q-mb-lg bg-orange-1">
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="help" class="q-mr-sm" />
              Causes possibles
            </div>
            
            <ul class="text-body2">
              <li>Solde insuffisant sur votre carte</li>
              <li>Carte expirée ou données incorrectes</li>
              <li>Limite de paiement dépassée</li>
              <li>Problème de connexion réseau</li>
              <li>Carte non autorisée pour les paiements en ligne</li>
            </ul>
          </q-card-section>
        </q-card>

        <!-- Actions -->
        <div class="row q-gutter-md">
          <div class="col-12 col-md-6">
            <q-btn
              color="positive"
              icon="refresh"
              label="Réessayer le paiement"
              @click="retryPayment"
              class="full-width"
            />
          </div>
          
          <div class="col-12 col-md-6">
            <q-btn
              color="primary"
              icon="contact_support"
              label="Contacter le support"
              @click="contactSupport"
              class="full-width"
              flat
            />
          </div>
        </div>

        <!-- Boutons de navigation -->
        <div class="row q-gutter-md q-mt-lg">
          <div class="col-12 col-md-6">
            <q-btn
              outline
              color="primary"
              icon="list"
              label="Mes factures"
              @click="goToFactures"
              class="full-width"
            />
          </div>
          
          <div class="col-12 col-md-6">
            <q-btn
              outline
              color="primary"
              icon="visibility"
              label="Voir la facture"
              @click="viewFacture"
              class="full-width"
            />
          </div>
        </div>

        <!-- Support et aide -->
        <q-card class="q-mt-lg bg-blue-1">
          <q-card-section>
            <div class="row items-center">
              <div class="col-auto">
                <q-icon name="support_agent" size="2rem" color="primary" />
              </div>
              <div class="col q-ml-md">
                <div class="text-subtitle2">Besoin d'aide ?</div>
                <div class="text-body2 text-grey-7">
                  Notre équipe support est disponible pour vous aider. 
                  Contactez-nous par email ou téléphone pour résoudre ce problème.
                </div>
                <div class="text-body2 text-weight-bold q-mt-sm">
                  Email: support@epal.dz | Tél: +213 XX XX XX XX
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Dialog de contact support -->
    <q-dialog v-model="showSupportDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Contacter le support</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-body2 q-mb-md">
            Décrivez brièvement le problème rencontré :
          </div>
          <q-input
            v-model="supportMessage"
            type="textarea"
            rows="4"
            outlined
            placeholder="Décrivez votre problème..."
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" v-close-popup />
          <q-btn 
            color="primary" 
            label="Envoyer" 
            @click="sendSupportMessage"
            :loading="sendingSupport"
            :disable="!supportMessage.trim()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useEpaymentStore } from '../../stores/epayment'

export default defineComponent({
  name: 'PaymentFailure',
  
  setup() {
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()
    const epaymentStore = useEpaymentStore()
    
    const loading = ref(false)
    const paymentData = ref(null)
    const errorMessage = ref('')
    const showSupportDialog = ref(false)
    const supportMessage = ref('')
    const sendingSupport = ref(false)
    
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('fr-DZ', {
        style: 'currency',
        currency: 'DZD'
      }).format(amount || 0)
    }
    
    const loadPaymentFailure = async () => {
      loading.value = true
      try {
        const factureId = route.params.id
        const token = route.query.token
        const orderId = route.query.orderId
        
        if (!token || !orderId) {
          errorMessage.value = 'Paramètres de paiement manquants'
          return
        }
        
        const response = await epaymentStore.processPaymentFailure(factureId, {
          token,
          orderId
        })
        
        paymentData.value = response.data
        errorMessage.value = response.message || 'Erreur lors du paiement'
        
      } catch (error) {
        errorMessage.value = error.message || 'Une erreur est survenue'
      } finally {
        loading.value = false
      }
    }
    
    const retryPayment = () => {
      if (paymentData.value?.facture?.id) {
        router.push(`/epayment/payment/${paymentData.value.facture.id}`)
      }
    }
    
    const contactSupport = () => {
      showSupportDialog.value = true
    }
    
    const sendSupportMessage = async () => {
      if (!supportMessage.value.trim()) return
      
      sendingSupport.value = true
      
      try {
        // Ici on pourrait implémenter l'envoi du message au support
        // Pour l'instant, on simule juste un succès
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        $q.notify({
          type: 'positive',
          message: 'Message envoyé au support avec succès'
        })
        
        showSupportDialog.value = false
        supportMessage.value = ''
        
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erreur lors de l\'envoi du message'
        })
      } finally {
        sendingSupport.value = false
      }
    }
    
    const goToFactures = () => {
      router.push('/epayment/factures')
    }
    
    const viewFacture = () => {
      if (paymentData.value?.facture?.id) {
        router.push(`/epayment/factures/${paymentData.value.facture.id}`)
      }
    }
    
    onMounted(() => {
      loadPaymentFailure()
    })
    
    return {
      loading,
      paymentData,
      errorMessage,
      showSupportDialog,
      supportMessage,
      sendingSupport,
      formatCurrency,
      retryPayment,
      contactSupport,
      sendSupportMessage,
      goToFactures,
      viewFacture
    }
  }
})
</script>