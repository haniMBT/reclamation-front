<template>
  <q-page class="q-pa-lg cosmic-light-bg">
    <!-- Loading cosmique -->
    <div v-if="loading" class="flex flex-center cosmic-loading">
      <div class="loading-orbits">
        <div class="loading-orbit"></div>
        <div class="loading-orbit"></div>
        <div class="loading-orbit"></div>
      </div>
      <div class="text-primary text-h6 q-ml-md">Chargement de la facture...</div>
    </div>

    <div v-else-if="facture" class="cosmic-container">
      <!-- Header avec design holographique -->
      <div class="row items-center q-mb-xl cosmic-header">
        <div class="col">
          <q-btn
            flat
            icon="arrow_back"
            label="Retour"
            @click="$router.go(-1)"
            class="cosmic-back-btn"
          />
          <div class="flex items-center q-mt-md">
            <div class="hologram-title-container q-mr-md">
              <div class="hologram-title">
                <div class="hologram-grid"></div>
                <q-icon name="receipt" class="title-icon" />
                <div class="energy-beam beam-1"></div>
                <div class="energy-beam beam-2"></div>
              </div>
            </div>
            <div>
              <h4 class="text-h4 q-mb-xs text-dark title-neon">
                Facture {{ facture.facnum }}
              </h4>
              <q-badge 
                :color="facture.status === 1 ? 'positive' : 'warning'" 
                class="status-badge-global"
                :class="facture.status === 1 ? 'paid-global' : 'unpaid-global'"
              >
                <q-icon :name="facture.status === 1 ? 'check_circle' : 'schedule'" class="q-mr-xs" />
                {{ facture.status === 1 ? 'Payée' : 'En attente de paiement' }}
              </q-badge>
            </div>
          </div>
        </div>
        <div class="col-auto">
          <div class="action-buttons-header">
            <q-btn
              v-if="!facture.isPaid"
              color="positive"
              icon="payments"
              label="Payer cette facture"
              @click="payFacture"
              class="cosmic-btn-success q-mr-sm"
              glossy
            />
            <q-btn
              v-if="paymentInfo"
              color="primary"
              icon="receipt_long"
              label="Voir le reçu"
              @click="viewReceipt"
              class="cosmic-btn-primary"
              glossy
            />
          </div>
        </div>
      </div>

      <!-- Carte principale de la facture avec design cosmique -->
      <q-card class="cosmic-invoice-card q-mb-xl">
        <div class="invoice-glow"></div>
        <q-card-section class="q-pa-xl">
          <!-- En-tête EPAL -->
          <div class="row q-mb-lg cosmic-header-section">
            <div class="col-12">
              <div class="row items-center justify-between">
                <div class="flex items-center">
                  <div class="epal-logo-container q-mr-md">
                    <q-img
                      src="/logo-epal.png"
                      class="epal-logo"
                    />
                    <div class="logo-orbits">
                      <div class="orbit orbit-1"></div>
                      <div class="orbit orbit-2"></div>
                    </div>
                  </div>
                  <div>
                    <h4 class="text-h4 q-ma-none text-primary epal-title">
                      ENTREPRISE PORTUAIRE D'ALGER
                    </h4>
                    <p class="text-grey-6 q-ma-none epal-subtitle">Direction des Ports et Interfaces</p>
                  </div>
                </div>
                <div class="invoice-date cosmic-date">
                  <q-icon name="today" class="q-mr-sm" />
                  {{ formatDate(new Date()) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Informations en grille cosmique -->
          <div class="row q-col-gutter-xl cosmic-info-grid">
            <!-- Informations Client -->
            <div class="col-12 col-md-4">
              <div class="info-card cosmic-client-card">
                <div class="info-header">
                  <q-icon name="person" class="q-mr-sm" />
                  <span class="text-weight-bold text-primary">Informations Client</span>
                </div>
                <div class="info-content">
                  <div class="info-item">
                    <span class="info-label">Nom:</span>
                    <span class="info-value">{{ facture.trsnom }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Adresse:</span>
                    <span class="info-value">{{ facture.trsadr }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">RC/NIS:</span>
                    <span class="info-value">{{ facture.trsnrc }} / {{ facture.trsnis }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Contact:</span>
                    <span class="info-value">{{ facture.trstel }} | {{ facture.trseml }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Informations ESCALE -->
            <div class="col-12 col-md-4">
              <div class="info-card cosmic-escale-card">
                <div class="info-header">
                  <q-icon name="sailing" class="q-mr-sm" />
                  <span class="text-weight-bold text-primary">Informations ESCALE</span>
                </div>
                <div class="info-content">
                  <div class="info-item">
                    <span class="info-label">N° Escale:</span>
                    <span class="info-value highlight">{{ facture.escnum }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Navire:</span>
                    <span class="info-value highlight">🚢 {{ facture.navnom }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Arrivée:</span>
                    <span class="info-value">{{ formatDate(facture.escdar) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">BL N°:</span>
                    <span class="info-value">{{ facture.cnsbld }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Informations Facture -->
            <div class="col-12 col-md-4">
              <div class="info-card cosmic-facture-card">
                <div class="info-header">
                  <q-icon name="description" class="q-mr-sm" />
                  <span class="text-weight-bold text-primary">Informations Facture</span>
                </div>
                <div class="info-content">
                  <div class="info-item">
                    <span class="info-label">Facture N°:</span>
                    <span class="info-value highlight">📋 {{ facture.facnum }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Taxation N°:</span>
                    <span class="info-value">{{ facture.taxnum }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Date:</span>
                    <span class="info-value">{{ formatDate(facture.facdat) }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Compte N°:</span>
                    <span class="info-value">{{ facture.trscod }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <!-- Tableau des prestations avec design amélioré -->
      <q-card class="cosmic-prestations-card q-mb-xl">
        <div class="prestations-glow"></div>
        <q-card-section class="q-pa-xl">
          <div class="row items-center q-mb-lg">
            <div class="col">
              <div class="text-h5 text-dark prestations-title">
                <q-icon name="list_alt" class="q-mr-sm" />
                Détail des Prestations
              </div>
            </div>
            <div class="col-auto">
              <q-chip color="primary" text-color="white" class="prestations-count">
                <q-avatar icon="assignment" color="white" text-color="primary" />
                {{ filteredDetails.length }} prestation(s)
              </q-chip>
            </div>
          </div>

          <!-- Filtre de recherche cosmique -->
          <div class="row q-mb-lg">
            <div class="col-12 col-md-6">
              <q-input
                v-model="prestationsFilter"
                outlined
                dense
                placeholder="🔍 Rechercher dans les prestations..."
                debounce="300"
                clearable
                class="cosmic-search-input"
              >
                <template v-slot:prepend>
                  <q-icon name="search" color="primary" />
                </template>
              </q-input>
            </div>
          </div>

          <q-table
            :rows="filteredDetails"
            :columns="detailColumns"
            row-key="id"
            :pagination="detailPagination"
            :rows-per-page-options="[5, 10, 25, 50]"
            flat
            class="cosmic-table"
          >
            <template v-slot:loading>
              <q-inner-loading showing color="primary" />
            </template>

            <template v-slot:header="props">
              <q-tr :props="props" class="cosmic-table-header">
                <q-th
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                  class="text-weight-bold"
                >
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>

            <template v-slot:body-cell-dfapun="props">
              <q-td :props="props" class="cosmic-table-cell">
                <span class="amount-value">{{ formatCurrency(props.value) }}</span>
              </q-td>
            </template>

            <template v-slot:body-cell-dfamnt="props">
              <q-td :props="props" class="cosmic-table-cell">
                <span class="amount-value highlight-amount">{{ formatCurrency(props.value) }}</span>
              </q-td>
            </template>

            <template v-slot:no-data>
              <div class="full-width row flex-center text-grey-6 q-pa-xl cosmic-no-data">
                <q-icon name="sentiment_dissatisfied" size="xl" class="q-mb-sm" />
                <div class="text-h6 q-ml-md">Aucune prestation trouvée</div>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>

      <!-- Section Totaux avec design premium -->
      <div class="row q-mb-xl">
        <div class="col-12 col-md-8"></div>
        <div class="col-12 col-md-4">
          <q-card class="cosmic-totals-card">
            <div class="totals-glow"></div>
            <q-card-section class="q-pa-xl">
              <div class="text-h5 text-dark totals-title q-mb-lg">
                <q-icon name="calculate" class="q-mr-sm" />
                TOTAL À PAYER
              </div>

              <div class="totals-list">
                <div class="total-item" v-for="(row, index) in totauxRows" :key="index">
                  <div class="total-label" :class="row.type">
                    {{ row.libelle }}
                  </div>
                  <div class="total-value" :class="row.type">
                    {{ row.valeur }}
                  </div>
                </div>
              </div>

              <q-separator class="q-my-lg total-separator" />

              <div class="final-total">
                <div class="final-label">MONTANT FINAL</div>
                <div class="final-value">{{ formatCurrency(facture.facttc) }}</div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Actions finales -->
      <div class="row no-print cosmic-actions">
        <div class="col-12 text-center">
          <q-btn
            v-if="facture.status != 1"
            color="positive"
            icon="credit_card"
            label="Effectuer le paiement"
            @click="payFacture"
            class="cosmic-btn-success q-mr-md"
            size="lg"
            glossy
          />
          <q-btn
            color="primary"
            icon="download"
            label="Télécharger PDF"
            @click="printFacture"
            class="cosmic-btn-primary"
            size="lg"
            glossy
          />
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
          class="q-mt-md"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useEpaymentStore } from "../../stores/epayment";

const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const epaymentStore = useEpaymentStore();

const loading = ref(false);
const facture = ref(null);
const details = ref([]);
const paymentInfo = ref(null);
const totauxRows = ref([]);
const prestationsFilter = ref("");
const VITE_API_BASE_URL = process.env.VITE_API_BASE_URL;
const detailPagination = ref({
  sortBy: "prscod",
  descending: false,
  page: 1,
  rowsPerPage: 10,
});

const detailColumns = [
  {
    name: "prscod",
    label: "Code",
    align: "left",
    field: "prscod",
    style: "width: 15%"
  },
  {
    name: "prslib",
    label: "Prestation",
    align: "left",
    field: "prslib",
    style: "width: 40%"
  },
  {
    name: "dfaqte",
    label: "Quantité",
    align: "center",
    field: "dfaqte",
    style: "width: 10%"
  },
  {
    name: "dfadur",
    label: "Durée",
    align: "center",
    field: "dfadur",
    style: "width: 10%"
  },
  {
    name: "dfapun",
    label: "Prix Unitaire",
    align: "right",
    field: "dfapun",
    style: "width: 15%"
  },
  {
    name: "dfamnt",
    label: "Montant",
    align: "right",
    field: "dfamnt",
    style: "width: 15%"
  },
];

// Les autres fonctions (formatCurrency, formatDate, etc.) restent identiques
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency: "DZD",
  }).format(amount || 0);
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
    details.value = response.details;
    paymentInfo.value = response.payment_info;

    // Calculer les totaux
    totauxRows.value = [
      {
        libelle: "Sous-total:",
        valeur: formatCurrency(facture.value.facmnt),
        type: "subtotal",
      },
      {
        libelle: `TVA (${facture.value.facttv} %)`,
        valeur: formatCurrency(facture.value.factva),
        type: "tva",
      },
      {
        libelle: "Frais d'impression:",
        valeur: formatCurrency(facture.value.facfix),
        type: "frais",
      },
      {
        libelle: "Total:",
        valeur: formatCurrency(facture.value.facttc),
        type: "total",
      },
    ];
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Erreur lors du chargement de la facture",
      caption: error.message,
    });
  } finally {
    loading.value = false;
  }
};

const payFacture = () => {
  router.push(`/epayment/payment/${facture.value.id}`);
};

const viewReceipt = () => {
  window.location.href = `${VITE_API_BASE_URL}/receiptByFacture/${facture.value.id}`;
};

const printFacture = () => {
  const url = `${VITE_API_BASE_URL}/epayment/factures/${facture.value.id}/pdf`;
  window.open(url);
};

const filteredDetails = computed(() => {
  if (!prestationsFilter.value) {
    return details.value;
  }

  const filter = prestationsFilter.value.toLowerCase();
  return details.value.filter(
    (item) =>
      (item.prscod && item.prscod.toLowerCase().includes(filter)) ||
      (item.prslib && item.prslib.toLowerCase().includes(filter)) ||
      (item.dfaqte && item.dfaqte.toString().includes(filter)) ||
      (item.dfamnt && item.dfamnt.toString().includes(filter))
  );
});

onMounted(() => {
  loadFacture();
});
</script>

<style scoped>
/* Styles cosmiques - à ajouter */
.cosmic-light-bg {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
  min-height: 100vh;
}

/* Loading cosmique */
.cosmic-loading {
  min-height: 50vh;
}

.loading-orbits {
  position: relative;
  width: 80px;
  height: 80px;
}

.loading-orbit {
  position: absolute;
  border: 2px solid #3b82f6;
  border-radius: 50%;
  animation: orbitSpin 2s linear infinite;
}

.loading-orbit:nth-child(1) {
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  animation-duration: 3s;
}

.loading-orbit:nth-child(2) {
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  animation-duration: 4s;
  animation-direction: reverse;
}

.loading-orbit:nth-child(3) {
  top: 15px;
  left: 15px;
  right: 15px;
  bottom: 15px;
  animation-duration: 5s;
}

/* Header holographique */
.hologram-title-container {
  position: relative;
}

.hologram-title {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.hologram-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    linear-gradient(90deg, transparent 49%, rgba(255,255,255,0.3) 50%, transparent 51%),
    linear-gradient(transparent 49%, rgba(255,255,255,0.3) 50%, transparent 51%);
  background-size: 10px 10px;
  animation: hologramSpin 4s linear infinite;
}

.title-icon {
  color: white;
  filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));
  position: relative;
  z-index: 2;
}

.energy-beam {
  position: absolute;
  width: 2px;
  height: 20px;
  background: rgba(255, 255, 255, 0.8);
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  animation: dataFlow 2s linear infinite;
}

.beam-1 { animation-delay: 0s; }
.beam-2 { animation-delay: 1s; }

.title-neon {
  background: linear-gradient(135deg, #1e40af, #3b82f6, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

.status-badge-global {
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
}

.paid-global {
  background: linear-gradient(135deg, #10b981, #059669) !important;
}

.unpaid-global {
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
}

/* Cartes cosmiques */
.cosmic-invoice-card,
.cosmic-prestations-card,
.cosmic-totals-card {
  position: relative;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.invoice-glow,
.prestations-glow,
.totals-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #10b981, #f59e0b, #8b5cf6);
  animation: glowFlow 4s ease-in-out infinite;
}

/* Logo EPAL animé */
.epal-logo-container {
  position: relative;
  width: 80px;
  height: 80px;
}

.epal-logo {
  width: 100%;
  height: 100%;
  border-radius: 16px;
}

.logo-orbits {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.logo-orbits .orbit {
  position: absolute;
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  animation: orbitSpin 6s linear infinite;
}

.logo-orbits .orbit-1 {
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  animation-duration: 8s;
}

.logo-orbits .orbit-2 {
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  animation-duration: 12s;
  animation-direction: reverse;
}

.epal-title {
  font-weight: 800;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cosmic-date {
  background: rgba(59, 130, 246, 0.1);
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 600;
  color: #1e40af;
}

/* Cartes d'information */
.info-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  height: 100%;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.info-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(59, 130, 246, 0.2);
}

.info-content {
  space-y: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.info-label {
  font-weight: 600;
  color: #6b7280;
  font-size: 0.9em;
  flex: 1;
}

.info-value {
  font-weight: 500;
  color: #1f2937;
  text-align: right;
  flex: 2;
}

.highlight {
  color: #3b82f6;
  font-weight: 700;
}

/* Table cosmique */
.cosmic-table :deep(.q-table__container) {
  background: transparent;
}

.cosmic-table-header {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05)) !important;
}

.cosmic-table-header th {
  color: #1e40af !important;
  font-weight: 700;
  border-bottom: 2px solid rgba(59, 130, 246, 0.2) !important;
}

.cosmic-table-cell {
  border-bottom: 1px solid rgba(59, 130, 246, 0.1) !important;
}

.amount-value {
  font-weight: 600;
}

.highlight-amount {
  color: #059669;
  font-weight: 700;
}

/* Section totaux */
.totals-list {
  space-y: 12px;
}

.total-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.total-label {
  font-weight: 500;
  color: #6b7280;
}

.total-label.total {
  font-weight: 700;
  color: #1f2937;
  font-size: 1.1em;
}

.total-value {
  font-weight: 600;
  color: #1f2937;
}

.total-value.total {
  font-weight: 800;
  color: #059669;
  font-size: 1.2em;
}

.total-separator {
  border-color: rgba(59, 130, 246, 0.3);
}

.final-total {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05));
  padding: 20px;
  border-radius: 16px;
  border: 2px solid rgba(16, 185, 129, 0.2);
  text-align: center;
}

.final-label {
  font-weight: 700;
  color: #059669;
  font-size: 1.1em;
  margin-bottom: 8px;
}

.final-value {
  font-weight: 800;
  color: #059669;
  font-size: 1.8em;
}

/* Boutons cosmiques */
.cosmic-btn-success {
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.cosmic-btn-primary {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.cosmic-back-btn {
  color: #6b7280;
  font-weight: 500;
}

.cosmic-back-btn:hover {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}

/* Animations */
@keyframes hologramSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes dataFlow {
  0% { transform: translateX(-50%) translateY(-20px); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(-50%) translateY(20px); opacity: 0; }
}

@keyframes orbitSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes glowFlow {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* Responsive */
@media (max-width: 768px) {
  .cosmic-info-grid {
    space-y: 16px;
  }
  
  .action-buttons-header {
    flex-direction: column;
    gap: 8px;
  }
  
  .cosmic-actions .q-btn {
    width: 100%;
    margin-bottom: 8px;
  }
}
</style>