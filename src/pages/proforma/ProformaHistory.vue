<template>
  <q-page class="q-pa-md">
    <div class="q-mb-lg">
      <h1 class="text-h4 text-grey-8 q-mb-sm">Historique des Proformas</h1>
      <p class="text-grey-6">Consultez l'historique de vos calculs de factures proforma</p>
    </div>

    <!-- Bouton retour -->
    <q-btn 
      @click="$router.push('/proforma')"
      icon="arrow_back"
      label="Retour"
      color="primary"
      flat
      class="q-mb-md"
    />

    <!-- Table d'historique -->
    <q-card>
      <q-card-section>
        <q-table
          :rows="proformaStore.history"
          :columns="historyColumns"
          row-key="id"
          :loading="proformaStore.historyLoading"
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:body-cell-ttc="props">
            <q-td :props="props">
              {{ proformaStore.formatMontant(props.value) }}
            </q-td>
          </template>
          
          <template v-slot:body-cell-scan="props">
            <q-td :props="props">
              <q-chip 
                :color="props.value ? 'green' : 'grey'" 
                text-color="white"
                size="sm"
              >
                {{ props.value ? 'Oui' : 'Non' }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-created_at="props">
            <q-td :props="props">
              {{ formatDateTime(props.value) }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProformaStore } from 'stores/proforma'
import { useMeta } from 'quasar'
import { date } from 'quasar'
useMeta({
  title: 'Historique Proforma - EPAL'
})

const proformaStore = useProformaStore()

const historyColumns = [
  {
    name: 'cnsbld',
    required: true,
    label: 'BL',
    align: 'left',
    field: 'cnsbld',
    sortable: true
  },
  {
    name: 'dctcod',
    required: true,
    label: 'N° Conteneur',
    align: 'left',
    field: 'dctcod',
    sortable: true
  },
  {
    name: 'scan',
    required: true,
    label: 'Scanner',
    align: 'center',
    field: 'scan',
    sortable: true
  },
  {
    name: 'date_fin',
    required: true,
    label: 'Date Fin',
    align: 'center',
    field: 'date_fin',
    sortable: true,
    format: val => date.formatDate(val, 'DD-MM-YYYY')
  },
  {
    name: 'ttc',
    required: true,
    label: 'Montant TTC',
    align: 'right',
    field: 'ttc',
    sortable: true
  },
  {
    name: 'created_at',
    required: true,
    label: 'Date Calcul',
    align: 'center',
    field: 'created_at',
    sortable: true,
    format: val => date.formatDate(val, 'DD-MM-YYYY HH:mm:ss')
  }
]

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('fr-FR')
}

onMounted(async () => {
  try {
    await proformaStore.fetchHistory()
  } catch (error) {
    console.error('Erreur lors du chargement de l\'historique:', error)
  }
})
</script>