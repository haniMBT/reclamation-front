<template>
  <div>
    <h1>Facture proforma</h1>

    <p>
      Facture proforma établie au nom de (Madame / Monsieur)
      <span style="font-weight: bold;">{{ user?.name }}</span>
      le {{ formatDateTime(calcForm?.created_at) }}
    </p>

    <div id="info">
      <div>
        <p><span>BL: </span>{{ calcForm?.bl }}</p>
        <p><span>N° Conteneur: </span>{{ calcForm?.conteneur }}</p>
        <p><span>Numéro d'escale: </span>{{ calcForm?.escale }}</p>
        <p><span>Navire: </span>{{ calcForm?.navire }}</p>
      </div>
      <div>
        <p><span>Date de livraison: </span>{{ formatDate(calcForm?.date) }}</p>
        <p><span>Nombre: </span>{{ nbrCont }}</p>
        <p><span>Date de livraison prévisionnelle: </span>{{ formatDate(calcForm?.dateFin) }}</p>
        <p>
          <span>Visite: </span>{{ calcForm?.visite ? 'Oui' : 'Non' }}
          <span style="margin-right: 32px;"></span>
          <span>Scanner: </span>{{ calcForm?.scan ? 'Oui' : 'Non' }}
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
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props reçus du parent ou d’un store
const props = defineProps({
  user: { type: Object, required: true },
  calcForm: { type: Object, required: true },
  facture: { type: Object, required: true }
})

const formatter = new Intl.NumberFormat('fr-DZ', {
  style: 'currency',
  currency: 'DZD'
})

const nbrCont = computed(() => 
  `${props.calcForm?.nbc20PV || 0} (20 pieds) / ${props.calcForm?.nbc40PV || 0} (40 pieds)`
)

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
}

h1 {
  font-size: 32px;
  text-decoration: underline;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
}

#info {
  display: flex;
  margin-top: 10px;
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
}

table * {
  font-size: 14px !important;
}

thead {
  background: #0e4ba1;
  color: white;
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
}
</style>
