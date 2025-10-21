<template>
  <q-page>
    <img src="entete.png" alt="">
    <h1>Facture proforma</h1>
    <p>
      Facture proforma établie au nom de (Madame / Monsieur)
      <span style="font-weight: bold;">{{ user?.name }}</span>
      le {{ formatDateTime(proformaStore?.calculationResult?.historique?.created_at) }}
    </p>
    <div id="info">
      <div>
        <p><span>BL: </span>{{ proformaStore?.searchResult?.bl }}</p>
        <p><span>N° Conteneur: </span>{{ proformaStore?.searchResult?.conteneur }}</p>
        <p><span>Numéro d'escale: </span>{{ proformaStore?.searchResult?.escale }}</p>
        <p><span>Navire: </span>{{ proformaStore?.searchResult?.navire }}</p>
      </div>
      <div>
        <p><span>Date de livraison: </span>{{ formatDate(proformaStore?.searchResult?.date) }}</p>
        <p><span>Nombre: </span>{{ nbrCont }}</p>
        <p><span>Date livraison prévisionnelle: </span>{{ formatDate(datePrevisionnelle) }}</p>
        <p>
          <span>Visite: </span>{{ visite ? 'Oui' : 'Non' }}
          <span style="margin-right: 32px;"></span>
          <span>Scanner: </span>{{ scanner ? 'Oui' : 'Non' }}
        </p>
      </div>
    </div>

    <div v-if="facture?.ttc">
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Libellé prestation</th>
            <th>Durée</th>
            <th>Qte</th>
            <th>P.U</th>
            <th>Montant</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(pre, index) in facture.details" :key="index">
            <td>{{ pre.prscod }}</td>
            <td>{{ pre.libelle }}</td>
            <td>{{ pre.duree }}</td>
            <td>{{ pre.quantite }}</td>
            <td>{{ formatter.format(pre.pu) }}</td>
            <td>{{ formatter.format(pre.montant) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="total-section-imp">
        <div class="total-section">
          <p>
            <span>Frais imp:</span> 100,00 DA <br>
            <span>HT:</span> {{ formatter.format(facture.totalHT) }} <br>
            <span>TVA:</span> {{ formatter.format(facture.tva) }}
          </p>
          <div class="total-box">
            Montant TTC: {{ formatter.format(facture.ttc) }}
          </div>
        </div>
      </div>

      <div class="condition">
        La présente facture proforma est émise à titre informatif et ne constitue pas une facture définitive.
        Elle permet d’estimer les frais portuaires liés à l’opération de manutention, de stockage,
        ou toute autre prestation demandée.
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useProformaStore } from 'stores/proforma'
const proformaStore = useProformaStore()
// Props reçus du parent ou d’un store
const props = defineProps({
  user: { type: Object, required: true },
  calculationData: { type: Object, required: true },
  facture: { type: Object, required: true }
})

const formatter = new Intl.NumberFormat('fr-DZ', {
  style: 'currency',
  currency: 'DZD'
})

const nbrCont = computed(() => {
  const n20 = proformaStore.calculationResult?.nbc20PV
    ?? proformaStore.calculationResult?.c20p
    ?? props.calculationData?.nbc20PV
    ?? props.calculationData?.c20p
    ?? 0
  const n40 = proformaStore.calculationResult?.nbc40PV
    ?? proformaStore.calculationResult?.c40p
    ?? props.calculationData?.nbc40PV
    ?? props.calculationData?.c40p
    ?? 0
  return `${n20} (20 pieds) / ${n40} (40 pieds)`
})

const visite = computed(() => {
  return proformaStore.calculationResult?.visite
    ?? props.calculationData?.visite
    ?? false
})

const scanner = computed(() => {
  return proformaStore.calculationResult?.scan
    ?? proformaStore.calculationResult?.historique?.scan
    ?? props.calculationData?.scan
    ?? false
})

const datePrevisionnelle = computed(() => {
  return proformaStore.calculationResult?.dateFin
    ?? proformaStore.calculationResult?.historique?.date_fin
    ?? props.calculationData?.dateFin
    ?? ''
})

function formatDate(dateStr = "") {
  if (!dateStr) return ""
  const [year, month, day] = dateStr.split('-')
  return `${day}-${month}-${year}`
}

function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return ""
  const date = new Date(dateTimeStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}
</script>

<style scoped>
* {
  font-size: 16px;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
  color-adjust: exact !important;
}

h1 {
  font-size: 32px;
  text-decoration: underline;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  page-break-after: avoid;
}

#info {
  display: flex;
  margin-top: 10px;
  page-break-inside: avoid;
}

#info>div {
  width: 45%;
}

#info span {
  font-weight: bold;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.95rem;
  page-break-inside: avoid;
}

table * {
  font-size: 14px !important;
}

thead {
  background: #0e4ba1 !important;
  color: white !important;
  -webkit-print-color-adjust: exact;
}

thead th,
tbody td {
  padding: 0.5rem;
  text-align: left;
  border-bottom: 1px solid #ccc;
}

.total-section-imp {
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 4px !important;
  page-break-inside: avoid;
}

.total-section {
  margin-top: 4px !important;
  padding: 8px 16px;
}

.total-section span {
  font-weight: bold;
}

.condition {
  font-size: 14px !important;
  color: gray;
  page-break-before: avoid;
}

/* Styles spécifiques pour l'impression */
@media print {
  .q-page {
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    min-height: auto !important;
  }
  
  /* Éviter les coupures dans les éléments importants */
  table, #info, .total-section-imp {
    page-break-inside: avoid;
  }
  
  /* S'assurer que les couleurs s'impriment */
  thead {
    background: #0e4ba1 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    color: white !important;
  }
}
</style>
