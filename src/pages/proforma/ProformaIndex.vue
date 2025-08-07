<template>
  <q-page class="q-pa-md bg-gray-50 min-h-screen">
     <div style="visibility: hidden; position: absolute; z-index: -1;" id="imprimer">
        <Imprimer :calculationData="calculationData" :facture="proformaStore?.calculationResult?.facture"></Imprimer>
    </div>
    <!-- Header avec style EPAL -->
    <div class="proforma-header bg-gradient-to-r from-white via-blue-50 to-blue-600 q-pa-lg rounded-xl shadow-lg mb-6">
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div class="flex items-center">
          <q-img src="/logo-epal.png" class="w-16 h-16 mr-4" />
          <div>
            <h1 class="text-2xl font-bold text-gray-800">Facture Proforma EPAL</h1>
            <p class="text-sm text-gray-600">Rechercher et calculer votre proforma</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulaire de recherche -->
    <q-card class="mb-6 border-l-4 border-blue-600" flat bordered>
      <q-card-section>
        <div class="flex items-center mb-4">
          <q-icon name="search" size="md" class="text-blue-600 mr-2" />
          <h2 class="text-lg font-semibold text-gray-800">Recherche BL et Conteneur</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <q-input
            v-model="searchForm.bl"
            label="BL"
            outlined
            color="blue-6"
            :error="!!proformaStore.errors.bl"
            :error-message="proformaStore.errors.bl?.[0]"
            @keyup.enter="search"
            autofocus
          >
            <template v-slot:prepend>
              <q-icon name="description" />
            </template>
          </q-input>
          
          <q-input
            v-model="searchForm.conteneur"
            label="N° Conteneur"
            outlined
            color="blue-6"
            :error="!!proformaStore.errors.conteneur"
            :error-message="proformaStore.errors.conteneur?.[0]"
            @keyup.enter="search"
          >
            <template v-slot:prepend>
              <q-icon name="inventory_2" />
            </template>
          </q-input>
        </div>

        <!-- Messages d'erreur généraux -->
        <q-banner 
          v-if="proformaStore.errors.both || proformaStore.errors.general" 
          class="text-red bg-red-1 mb-4" 
          rounded
        >
          {{ proformaStore.errors.both?.[0] || proformaStore.errors.general?.[0] }}
        </q-banner>
        
        <q-btn 
          @click="search"
          label="Chercher"
          color="blue-6"
          icon="search"
          class="w-full"
          :loading="proformaStore.searchLoading"
          :disable="!searchForm.bl || !searchForm.conteneur"
          unelevated
        />
      </q-card-section>
    </q-card>

    <!-- Résultats de recherche -->
    <q-card v-if="proformaStore.hasSearchResult" class="mb-6 border-l-4 border-green-500" flat bordered>
      <q-card-section>
        <div class="flex items-center mb-4">
          <q-icon name="info" size="md" class="text-green-600 mr-2" />
          <h3 class="text-lg font-semibold text-gray-800">Informations de l'escale</h3>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div class="bg-blue-50 p-3 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Numéro d'escale</p>
            <p class="font-semibold text-gray-800">{{ proformaStore.searchResult.escale }}</p>
          </div>
          <div class="bg-blue-50 p-3 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Navire</p>
            <p class="font-semibold text-gray-800">{{ proformaStore.searchResult.navire }}</p>
          </div>
          <div class="bg-blue-50 p-3 rounded-lg">
            <p class="text-sm text-gray-600 mb-1">Date de livraison</p>
            <p class="font-semibold text-gray-800">{{ formatDate(proformaStore.searchResult.date) }}</p>
          </div>
        </div>

        <!-- Informations conteneurs -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <q-input
            :model-value="proformaStore.searchResult.c20p"
            label="Nombre de conteneurs 20 pieds"
            outlined
            readonly
            class="bg-gray-50"
          >
            <template v-slot:prepend>
              <q-icon name="widgets" />
            </template>
          </q-input>
          
          <q-input
            :model-value="proformaStore.searchResult.c40p"
            label="Nombre de conteneurs 40 pieds"
            outlined
            readonly
            class="bg-gray-50"
          >
            <template v-slot:prepend>
              <q-icon name="widgets" />
            </template>
          </q-input>
        </div>
      </q-card-section>
    </q-card>

    <!-- Formulaire de calcul -->
    <q-card v-if="proformaStore.hasSearchResult" class="mb-6 border-l-4 border-orange-500" flat bordered>
      <q-card-section>
        <div class="flex items-center mb-4">
          <q-icon name="calculate" size="md" class="text-orange-600 mr-2" />
          <h3 class="text-lg font-semibold text-gray-800">Calcul de la proforma</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <!-- Date de livraison prévisionnelle -->
          <q-input
            v-model="calculationForm.dateFin"
            label="Date de livraison prévisionnelle"
            type="date"
            outlined
            color="orange-6"
            :error="!!proformaStore.errors.dateFin"
            :error-message="proformaStore.errors.dateFin?.[0]"
          >
            <template v-slot:prepend>
              <q-icon name="event" />
            </template>
          </q-input>

          <!-- Options scan et visite -->
          <div class="flex flex-col gap-2">
            <q-checkbox
              v-model="calculationForm.visite"
              label="Avec visite"
              color="orange-6"
              @update:model-value="onVisiteChange"
            />
            <q-checkbox
              v-model="calculationForm.scan"
              label="Avec scanner"
              color="orange-6"
              :disable="calculationForm.visite"
            />
          </div>
        </div>

        <!-- Nombre de conteneurs visités -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <q-input
            v-model.number="calculationForm.nbc20PV"
            label="Nombre de conteneurs 20p visités"
            type="number"
            :min="0"
            :max="proformaStore.searchResult.c20p"
            outlined
            color="orange-6"
            :error="!!proformaStore.errors.nbc20PV"
            :error-message="proformaStore.errors.nbc20PV?.[0]"
          >
            <template v-slot:prepend>
              <q-icon name="inventory" />
            </template>
          </q-input>
          
          <q-input
            v-model.number="calculationForm.nbc40PV"
            label="Nombre de conteneurs 40p visités"
            type="number"
            :min="0"
            :max="proformaStore.searchResult.c40p"
            outlined
            color="orange-6"
            :error="!!proformaStore.errors.nbc40PV"
            :error-message="proformaStore.errors.nbc40PV?.[0]"
          >
            <template v-slot:prepend>
              <q-icon name="inventory" />
            </template>
          </q-input>
        </div>

        <q-btn 
          @click="calculate"
          label="Calculer la proforma"
          color="orange-6"
          icon="calculate"
          class="w-full"
          :loading="proformaStore.calculateLoading"
          :disable="!isCalculationFormValid"
          unelevated
        />
      </q-card-section>
    </q-card>

    <!-- Tableau des résultats -->
    <q-card v-if="proformaStore.hasCalculationResult" class="mb-6 border-l-4 border-purple-500" flat bordered>
      <q-card-section>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <q-icon name="receipt" size="md" class="text-purple-600 mr-2" />
            <h3 class="text-lg font-semibold text-gray-800">Détail de la facture</h3>
          </div>
          <q-btn 
            @click="printInvoice"
            label="Imprimer"
            color="purple-6"
            icon="print"
            outline
          />
        </div>

        <!-- Table responsive -->
        <div class="overflow-x-auto">
          <q-table
            :rows="proformaStore.calculationResult.facture.details"
            :columns="tableColumns"
            row-key="prscod"
            flat
            bordered
            class="proforma-table"
          >
            <template v-slot:body-cell-pu="props">
              <q-td :props="props">
                {{ proformaStore.formatMontant(props.value) }}
              </q-td>
            </template>
            <template v-slot:body-cell-montant="props">
              <q-td :props="props" class="font-semibold">
                {{ proformaStore.formatMontant(props.value) }}
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- Section totaux -->
        <div class="mt-6 bg-gray-50 p-4 rounded-lg">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div></div>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span>Frais d'impression:</span>
                <span class="font-semibold">100,00 DA</span>
              </div>
              <div class="flex justify-between">
                <span>Total HT:</span>
                <span class="font-semibold">{{ proformaStore.formattedTotalHT }}</span>
              </div>
              <div class="flex justify-between">
                <span>TVA (19%):</span>
                <span class="font-semibold">{{ proformaStore.formattedTVA }}</span>
              </div>
              <div class="flex justify-between bg-blue-600 text-white p-3 rounded-lg">
                <span class="font-bold">Montant TTC:</span>
                <span class="font-bold text-xl">{{ proformaStore.formattedTTC }}</span>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Conditions générales -->
    <q-card class="border-l-4 border-gray-400" flat bordered>
      <q-card-section>
        <h3 class="text-lg font-semibold text-gray-800 mb-3">Conditions générales</h3>
        <p class="text-gray-600 text-sm leading-relaxed">
          La présente facture proforma est émise à titre informatif et ne constitue pas une facture définitive.
          Elle permet d'estimer les frais portuaires liés à l'opération de manutention, de stockage, ou toute
          autre prestation demandée.
        </p>
      </q-card-section>
    </q-card>

    <!-- Loading overlay -->
    <q-inner-loading :showing="proformaStore.isLoading" color="blue-6" />
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useProformaStore } from 'stores/proforma'
import { useAuthStore } from 'stores/auth'
import { useRouter } from 'vue-router'
import { useMeta, useQuasar } from 'quasar'
import Imprimer from 'components/Imprimer.vue';
// Meta title
useMeta({
  title: 'Proforma - EPAL'
})

const $q = useQuasar()
const router = useRouter()
const proformaStore = useProformaStore()
const authStore = useAuthStore()

// Formulaires reactifs
const searchForm = reactive({
  bl: '',
  conteneur: ''
})

const calculationForm = reactive({
  dateFin: new Date().toISOString().split('T')[0],
  scan: false,
  visite: false,
  nbc20PV: 0,
  nbc40PV: 0
})

// Colonnes du tableau
const tableColumns = [
  {
    name: 'prscod',
    required: true,
    label: 'Code prestation',
    align: 'left',
    field: 'prscod',
    sortable: true
  },
  {
    name: 'libelle',
    required: true,
    label: 'Libellé prestation',
    align: 'left',
    field: 'libelle',
    sortable: true
  },
  {
    name: 'duree',
    required: true,
    label: 'Durée',
    align: 'center',
    field: 'duree',
    sortable: true
  },
  {
    name: 'quantite',
    required: true,
    label: 'Qté',
    align: 'center',
    field: 'quantite',
    sortable: true
  },
  {
    name: 'pu',
    required: true,
    label: 'P.U',
    align: 'right',
    field: 'pu',
    sortable: true
  },
  {
    name: 'montant',
    required: true,
    label: 'Montant',
    align: 'right',
    field: 'montant',
    sortable: true
  }
]

// Computed
const isCalculationFormValid = computed(() => {
  return calculationForm.dateFin && 
         calculationForm.nbc20PV >= 0 && 
         calculationForm.nbc40PV >= 0
})

// Méthodes
const search = async () => {
  try {
    proformaStore.clearErrors()
    await proformaStore.searchProforma(searchForm)
    
    // Initialiser les valeurs du formulaire de calcul
    calculationForm.nbc20PV = proformaStore.searchResult.c20p
    calculationForm.nbc40PV = proformaStore.searchResult.c40p
    
    $q.notify({
      type: 'positive',
      message: 'Recherche effectuée avec succès',
      position: 'top-right'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erreur lors de la recherche',
      position: 'top-right'
    })
  }
}

const calculate = async () => {
  try {
    proformaStore.clearErrors()
    
    const calculationData = {
      ...searchForm,
      ...calculationForm,
      ...proformaStore.searchResult,
      dateDebut: proformaStore.searchResult.date,
      maxNbc20P: proformaStore.searchResult.c20p,
      maxNbc40P: proformaStore.searchResult.c40p
    }
    
    await proformaStore.calculateProforma(calculationData)
    
    $q.notify({
      type: 'positive',
      message: 'Calcul effectué avec succès',
      position: 'top-right'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erreur lors du calcul',
      position: 'top-right'
    })
  }
}

const onVisiteChange = (newVal) => {
  if (newVal) {
    calculationForm.scan = true
  } else {
    calculationForm.scan = false
  }
}

const printInvoice = () => {
  window.print()
}

const logout = async () => {
  try {
    await authStore.logout()
    router.push('/acceuil')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    router.push('/acceuil')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fr-FR')
}

// Lifecycle
onMounted(() => {
  // Reset des données au montage
  proformaStore.resetSearch()
})
</script>

<style scoped>
.proforma-table {
  @apply shadow-sm;
}

.proforma-table :deep(.q-table__top) {
  @apply bg-blue-600 text-white;
}

.proforma-table :deep(.q-table thead th) {
  @apply bg-blue-600 text-white font-semibold;
}

.proforma-table :deep(.q-table tbody tr:nth-child(even)) {
  @apply bg-gray-50;
}

@media print {
    body * {
        visibility: hidden;
    }

    #imprimer {
        position: absolute;
        top: 0;
        z-index: 1 !important;
    }

    #imprimer * {
        visibility: visible;
        border: none;
        z-index: 1 !important;

    }
}

body {
    font-family: 'Segoe UI', sans-serif;
    margin: 0;
    background: #fff;
}

</style>