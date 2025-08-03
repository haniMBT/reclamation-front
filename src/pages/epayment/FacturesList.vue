<template>
  <q-page class="q-pa-lg">
    <!-- Header avec statistiques -->
    <div class="row q-mb-lg">
      <div class="col-12">
        <h4 class="text-h4 q-mb-md text-primary">Mes Factures</h4>
        
        <!-- Cartes de statistiques -->
        <div class="row q-gutter-md q-mb-lg">
          <div class="col-12 col-md-3">
            <q-card class="bg-blue-1 text-primary">
              <q-card-section>
                <div class="text-h6">{{ stats.total_factures }}</div>
                <div class="text-caption">Total Factures</div>
              </q-card-section>
            </q-card>
          </div>
          
          <div class="col-12 col-md-3">
            <q-card class="bg-green-1 text-positive">
              <q-card-section>
                <div class="text-h6">{{ stats.factures_payees }}</div>
                <div class="text-caption">Factures Payées</div>
              </q-card-section>
            </q-card>
          </div>
          
          <div class="col-12 col-md-3">
            <q-card class="bg-orange-1 text-warning">
              <q-card-section>
                <div class="text-h6">{{ stats.factures_impayees }}</div>
                <div class="text-caption">Factures Impayées</div>
              </q-card-section>
            </q-card>
          </div>
          
          <div class="col-12 col-md-3">
            <q-card class="bg-grey-2">
              <q-card-section>
                <div class="text-h6">{{ formatCurrency(stats.montant_total) }}</div>
                <div class="text-caption">Montant Total</div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="row q-gutter-md items-center">
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.status"
              :options="statusOptions"
              label="Statut"
              emit-value
              map-options
              clearable
              @update:model-value="applyFilters"
            />
          </div>
          
          <div class="col-12 col-md-3">
            <q-input
              v-model="filters.date_from"
              type="date"
              label="Date début"
              @update:model-value="applyFilters"
            />
          </div>
          
          <div class="col-12 col-md-3">
            <q-input
              v-model="filters.date_to"
              type="date"
              label="Date fin"
              @update:model-value="applyFilters"
            />
          </div>
          
          <div class="col-12 col-md-3">
            <q-btn
              color="primary"
              icon="refresh"
              label="Actualiser"
              @click="loadFactures"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Liste des factures -->
    <q-card>
      <q-table
        :rows="factures"
        :columns="columns"
        :loading="loading"
        row-key="id"
        :pagination="pagination"
        @request="onRequest"
        binary-state-sort
      >
        <template v-slot:body-cell-escale_navire="props">
          <q-td :props="props">
            <div>
              <a class="text-body1">{{ props.row.escnum }}</a>
              <br />
              <span class="text-orange">{{ props.row.navnom }}</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-ref_facture_date="props">
          <q-td :props="props">
            <div>
              <a 
                class="text-h6 text-primary cursor-pointer" 
                @click="viewFacture(props.row)"
              >
                {{ props.row.facrfe }}
              </a>
              <br />
              <small class="text-grey-6">
                 {{ formatDate(props.row.facdat) }}
              </small>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-montant_ht="props">
          <q-td :props="props">
            <div>
              {{ formatCurrency(props.row.facmnt) }}
              <br />
              <small class="text-grey-6">
                frais d'impression: {{ formatCurrency(props.row.facfix) }}
              </small>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-montant_tva="props">
          <q-td :props="props">
            <div>
              {{ formatCurrency(props.row.factva) }}
              <br />
              <small class="text-grey-6">
                Taux TVA: {{ props.row.facttv }}%
              </small>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-total_payer="props">
          <q-td :props="props">
            <span class="text-weight-bold text-h6">
              {{ formatCurrency(props.row.facttc) }}
            </span>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              color="info"
              size="sm"
              dense
              icon="search"
              @click="viewFacture(props.row)"
              class="q-mr-xs"
            >
              <q-tooltip>Voir détails</q-tooltip>
            </q-btn>
            
            <q-btn
              color="primary"
              size="sm"
              dense
              icon="print"
              @click="printFacture(props.row)"
              class="q-mr-xs"
            >
              <q-tooltip>Imprimer PDF</q-tooltip>
            </q-btn>
            
            <q-btn
              v-if="props.row.status != 1"
              color="positive"
              size="sm"
              dense
              icon="credit_card"
              @click="payFacture(props.row)"
            >
              <q-tooltip>Payer</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useEpaymentStore } from '../../stores/epayment'
import { date } from 'quasar'
import moment from 'moment';
import 'moment/locale/fr';
export default defineComponent({
  name: 'FacturesList',
  
  setup() {
    const router = useRouter()
    const $q = useQuasar()
    const epaymentStore = useEpaymentStore()
    const BASE_URL = process.env.BASE_URL
    const loading = ref(false)
    const factures = ref([])
    const stats = ref({
      total_factures: 0,
      factures_payees: 0,
      factures_impayees: 0,
      montant_total: 0,
      montant_paye: 0,
      montant_impaye: 0
    })
    
    const filters = ref({
      status: null,
      date_from: null,
      date_to: null
    })
    
    const pagination = ref({
      sortBy: 'facdat',
      descending: true,
      page: 1,
      rowsPerPage: 15,
      rowsNumber: 0
    })
    
    const columns = [
      {
        name: 'escale_navire',
        label: 'N° Escale / Navire',
        align: 'left',
        field: row => row,
        style: 'width: 15%'
      },
      {
        name: 'ref_facture_date',
        label: 'Ref Facture/Date',
        align: 'left',
        field: row => row,
        style: 'width: 15%'
      },
      {
        name: 'montant_ht',
        label: 'Montant HT',
        align: 'left',
        field: row => row,
        style: 'width: 20%'
      },
      {
        name: 'montant_tva',
        label: 'Montant TVA',
        align: 'left',
        field: row => row,
        style: 'width: 15%'
      },
      {
        name: 'total_payer',
        label: 'Total à payer',
        align: 'left',
        field: 'facttc',
        style: 'width: 20%'
      },
      {
        name: 'actions',
        label: 'Actions',
        align: 'center',
        style: 'width: 15%'
      }
    ]
    
    const statusOptions = [
      { label: 'Toutes', value: null },
      { label: 'Payées', value: 'paid' },
      { label: 'Impayées', value: 'unpaid' }
    ]
    
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('fr-DZ', {
        style: 'currency',
        currency: 'DZD'
      }).format(amount || 0)
    }
    
    const getStatusColor = (status) => {
      return status === 1 ? 'positive' : 'warning'
    }
    
    const getStatusLabel = (status) => {
      return status === 1 ? 'Payée' : 'Impayée'
    }

    const formatDate = (date) => {
      return moment(date).locale('fr').format('DD/MM/YYYY')
    }
    
    const loadFactures = async () => {
      loading.value = true
      try {
        const params = {
          page: pagination.value.page,
          per_page: pagination.value.rowsPerPage,
          ...filters.value
        }
        
        const response = await epaymentStore.getFactures(params)
        factures.value = response.data
        pagination.value.rowsNumber = response.total
        
        // Charger les statistiques
        const statsResponse = await epaymentStore.getFacturesStats()
        stats.value = statsResponse
        
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Erreur lors du chargement des factures',
          caption: error.message
        })
      } finally {
        loading.value = false
      }
    }
    
    const onRequest = (props) => {
      pagination.value = props.pagination
      loadFactures()
    }
    
    const applyFilters = () => {
      pagination.value.page = 1
      loadFactures()
    }
    
    const viewFacture = (facture) => {
      router.push(`/epayment/factures/${facture.id}`)
    }
    
    const payFacture = (facture) => {
      router.push(`/epayment/payment/${facture.id}`)
    }
    

    const printFacture = (facture) => {
      // Ouvrir le PDF dans un nouvel onglet
        const url = `${BASE_URL}/epayment/factures/${facture.id}/pdf`
        window.open(url);
    }
    
    onMounted(() => {
      loadFactures()
    })
    
    return {
      loading,
      factures,
      stats,
      filters,
      pagination,
      columns,
      statusOptions,
      formatCurrency,
      getStatusColor,
      getStatusLabel,
      formatDate,
      loadFactures,
      onRequest,
      applyFilters,
      viewFacture,
      payFacture,
      printFacture
    }
  }
})
</script>

<style scoped>
.q-table th {
  font-weight: bold;
}

.text-orange {
  color: rgb(248, 140, 8);
}
</style>