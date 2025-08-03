<template>
  <q-page class="q-pa-lg">
    <div v-if="loading" class="flex flex-center">
      <q-spinner-dots size="xl" color="primary" />
    </div>
    
    <div v-else class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <!-- Message de succès -->
        <div class="text-center q-mb-lg">
          <q-icon name="check_circle" size="6rem" color="positive" />
          <h4 class="text-h4 q-mb-md text-positive">Paiement réussi !</h4>
          <p class="text-subtitle1 text-grey-7">
            Votre paiement a été traité avec succès. Un reçu vous a été envoyé par email.
          </p>
        </div>

        <!-- Détails du paiement -->
        <q-card v-if="paymentData" class="q-mb-lg">
          <q-card-section>
            <div class="text-h6 q-mb-md">
              <q-icon name="receipt_long" class="q-mr-sm" />
              Détails du paiement
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
                  <q-item-label class="text-weight-bold">Montant payé</q-item-label>
                  <q-item-label caption>{{ formatCurrency(paymentData.facture.facttc) }}</q-item-label>
                </q-item-section>
              </q-item>
              
              <q-item>
                <q-item-section>
                  <q-item-label class="text-weight-bold">Date du paiement</q-item-label>
                  <q-item-label caption>{{ paymentData.date_valable }}</q-item-label>
                </q-item-section>
              </q-item>
              
              <q-item>
                <q-item-section>
                  <q-item-label class="text-weight-bold">Référence</q-item-label>
                  <q-item-label caption>{{ paymentData.order_id }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="paymentData.order.cardholderName">
                <q-item-section>
                  <q-item-label class="text-weight-bold">Porteur de carte</q-item-label>
                  <q-item-label caption>{{ paymentData.order.cardholderName }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="paymentData.order.Pan">
                <q-item-section>
                  <q-item-label class="text-weight-bold">Carte (masquée)</q-item-label>
                  <q-item-label caption>****{{ paymentData.order.Pan.slice(-4) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>

        <!-- Actions -->
        <div class="row q-gutter-md">
          <div class="col-12 col-md-6">
            <q-btn
              color="primary"
              icon="file_download"
              label="Télécharger le reçu"
              @click="downloadReceipt"
              class="full-width"
              :loading="downloadingReceipt"
            />
          </div>
          
          <div class="col-12 col-md-6">
            <q-btn
              color="positive"
              icon="email"
              label="Renvoyer par email"
              @click="showEmailDialog = true"
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

        <!-- Information importante -->
        <q-card class="q-mt-lg bg-blue-1">
          <q-card-section>
            <div class="row items-center">
              <div class="col-auto">
                <q-icon name="info" size="2rem" color="primary" />
              </div>
              <div class="col q-ml-md">
                <div class="text-subtitle2">Information importante</div>
                <div class="text-body2 text-grey-7">
                  Conservez ce reçu comme preuve de paiement. Un email de confirmation 
                  a été envoyé à votre adresse électronique.
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Dialog pour envoi email -->
    <q-dialog v-model="showEmailDialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Envoyer le reçu par email</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            v-model="emailAddress"
            label="Adresse email"
            type="email"
            outlined
            :rules="[val => val && val.includes('@') || 'Email valide requis']"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Annuler" v-close-popup />
          <q-btn 
            color="primary" 
            label="Envoyer" 
            @click="sendEmail"
            :loading="sendingEmail"
            :disable="!emailAddress || !emailAddress.includes('@')"
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
  name: 'PaymentSuccess',
  
  setup() {
    const route = useRoute()
    const router = useRouter()
    const $q = useQuasar()
    const epaymentStore = useEpaymentStore()
    
    const loading = ref(false)
    const paymentData = ref(null)
    const showEmailDialog = ref(false)
    const emailAddress = ref('')
    const sendingEmail = ref(false)
    const downloadingReceipt = ref(false)
    
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('fr-DZ', {
        style: 'currency',
        currency: 'DZD'
      }).format(amount || 0)
    }
    
    const loadPaymentSuccess = async () => {
      loading.value = true
      try {
        const factureId = route.params.id
        const token = route.query.token
        const orderId = route.query.orderId
        
        if (!token || !orderId) {
          throw new Error('Paramètres de paiement manquants')
        }
        
        const response = await epaymentStore.processPaymentSuccess(factureId, {
          token,
          orderId
        })
        
        if (response.success) {
          paymentData.value = response.data
        } else {
          throw new Error(response.message || 'Erreur lors de la validation du paiement')
        }
        
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erreur lors de la validation du paiement',
          caption: error.message
        })
        router.push('/epayment/factures')
      } finally {
        loading.value = false
      }
    }
    
    const downloadReceipt = async () => {
      if (!paymentData.value?.order?.recuId) {
        $q.notify({
          type: 'warning',
          message: 'Aucun reçu disponible'
        })
        return
      }
      
      downloadingReceipt.value = true
      try {
        await epaymentStore.downloadReceipt(paymentData.value.order.recuId)
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erreur lors du téléchargement',
          caption: error.message
        })
      } finally {
        downloadingReceipt.value = false
      }
    }
    
    const sendEmail = async () => {
      if (!emailAddress.value || !paymentData.value?.order?.recuId) return
      
      sendingEmail.value = true
      try {
        await epaymentStore.sendReceiptByEmail(paymentData.value.order.recuId, emailAddress.value)
        $q.notify({
          type: 'positive',
          message: 'Email envoyé avec succès'
        })
        showEmailDialog.value = false
        emailAddress.value = ''
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erreur lors de l\'envoi',
          caption: error.message
        })
      } finally {
        sendingEmail.value = false
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
      loadPaymentSuccess()
    })
    
    return {
      loading,
      paymentData,
      showEmailDialog,
      emailAddress,
      sendingEmail,
      downloadingReceipt,
      formatCurrency,
      downloadReceipt,
      sendEmail,
      goToFactures,
      viewFacture
    }
  }
})
</script>