<template>
  <q-page class="q-pa-lg cosmic-light-bg">
    <!-- Header avec titre holographique -->
    <div class="row q-mb-xl">
      <div class="col-12">
        <div class="flex items-center q-mb-lg">
          <div class="hologram-title-container q-mr-md">
            <div class="hologram-title">
              <div class="hologram-grid"></div>
              <q-icon name="receipt" size="lg" class="title-icon" />
              <div class="energy-beam beam-1"></div>
              <div class="energy-beam beam-2"></div>
            </div>
          </div>
          <div>
            <h4 class="text-h4 q-mb-xs text-dark title-neon">Mes Factures</h4>
            <p class="text-grey-7 q-mb-none subtitle">
              Gérez et suivez vos factures en temps réel
            </p>
          </div>
        </div>

        <!-- Cartes de statistiques cosmiques améliorées -->
        <div class="row q-col-gutter-md q-mb-lg">
          <div
            class="col-6 col-sm-4 col-md-3"
            v-for="(stat, index) in enhancedStats"
            :key="index"
          >
            <div
              class="cosmic-card-enhanced"
              :class="stat.cardClass"
              @mouseenter="startCardAnimation(index)"
              @mouseleave="stopCardAnimation(index)"
            >
              <div class="card-particle-system">
                <div
                  v-for="i in 8"
                  :key="i"
                  class="particle"
                  :style="getParticleStyle(i, index)"
                ></div>
              </div>
              <div class="card-orbits">
                <div class="orbit orbit-1"></div>
                <div class="orbit orbit-2"></div>
                <div class="orbit orbit-3"></div>
              </div>
              <div class="card-glow"></div>
              <div class="card-content">
                <div class="stat-icon" :class="stat.iconClass">
                  <q-icon :name="stat.icon" />
                </div>
                <div class="stat-info">
                  <div
                    class="text-h4 text-dark stat-number"
                    :class="stat.numberClass"
                  >
                    {{ stat.value }}
                  </div>
                  <div class="text-caption text-grey-7 stat-label">
                    {{ stat.label }}
                  </div>
                </div>
                <div class="stat-badge" :class="stat.badgeClass">
                  {{ stat.trend || "📈" }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres avec design futuriste -->
    <q-card class="q-mb-lg cosmic-filter-card-enhanced">
      <div class="filter-particle-system">
        <div
          v-for="i in 12"
          :key="i"
          class="filter-particle"
          :style="getFilterParticleStyle(i)"
        ></div>
      </div>
      <q-card-section class="q-pa-xl">
        <div class="row justify-between items-center q-mb-md">
          <div class="text-h6 text-dark filter-title">🔍 Filtres Avancés</div>
          <q-btn
            color="grey"
            icon="clear_all"
            label="Effacer les filtres"
            @click="clearFilters"
            class="clear-filters-btn"
            flat
            dense
          >
            <q-tooltip class="cosmic-tooltip"
              >Réinitialiser tous les filtres</q-tooltip
            >
          </q-btn>
        </div>
        <div class="row q-gutter-lg items-center">
          <div class="col-12 col-md-3">
            <q-select
              v-model="filters.status"
              :options="statusOptions"
              label="📊 Statut"
              emit-value
              map-options
              clearable
              @update:model-value="applyFilters"
              class="cosmic-select-enhanced"
              standout
              behavior="menu"
            >
              <template v-slot:prepend>
                <q-icon name="filter_alt" class="text-primary" />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-3">
            <q-input
              v-model="filters.date_from"
              type="date"
              label="📅 Date début"
              @update:model-value="applyFilters"
              class="cosmic-input-enhanced date-input"
              standout
            >
              <template v-slot:prepend>
                <q-icon name="event" class="text-primary" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <q-input
              v-model="filters.date_to"
              type="date"
              label="📅 Date fin"
              @update:model-value="applyFilters"
              class="cosmic-input-enhanced date-input"
              standout
            >
              <template v-slot:prepend>
                <q-icon name="event" class="text-primary" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-3">
            <q-btn
              color="primary"
              icon="refresh"
              label="Actualiser"
              @click="loadFactures"
              class="cosmic-btn-enhanced"
              glossy
            >
              <q-tooltip class="cosmic-tooltip"
                >Rafraîchir les données</q-tooltip
              >
            </q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tableau des factures avec design extraordinaire -->
    <q-card class="cosmic-table-card-enhanced">
      <div class="table-header-glow"></div>
      <q-card-section class="no-padding">
        <q-table
          :rows="factures"
          :columns="enhancedColumns"
          :loading="loading"
          row-key="id"
          :pagination="pagination"
          @request="onRequest"
          binary-state-sort
          flat
          class="cosmic-table-enhanced"
          :rows-per-page-options="[10, 15, 20, 50]"
        >
          <template v-slot:loading>
            <q-inner-loading showing color="primary">
              <div class="loading-cosmic">
                <div class="loading-orbits">
                  <div class="loading-orbit"></div>
                  <div class="loading-orbit"></div>
                  <div class="loading-orbit"></div>
                </div>
                <div class="text-primary text-h6">
                  Chargement des factures...
                </div>
              </div>
            </q-inner-loading>
          </template>

          <template v-slot:header="props">
            <q-tr :props="props" class="cosmic-header-enhanced">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                class="text-weight-bold cosmic-th"
              >
                <div class="header-cell">
                  <q-icon :name="col.icon" class="q-mr-sm" />
                  {{ col.label }}
                </div>
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body-cell-escale_navire="props">
            <q-td :props="props" class="cosmic-cell-enhanced">
              <div class="navire-info-enhanced">
                <div class="escale-badge">
                  <q-icon name="sailing" class="q-mr-xs" />
                  {{ props.row.escnum }}
                </div>
                <div class="navire-name-enhanced text-orange">
                  🚢 {{ props.row.navnom }}
                </div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-ref_facture_date="props">
            <q-td :props="props" class="cosmic-cell-enhanced">
              <div class="facture-ref-enhanced">
                <a
                  class="facture-number-enhanced cosmic-link"
                  @click="viewFacture(props.row)"
                >
                  📋 {{ props.row.facrfe }}
                </a>
                <div class="facture-date-enhanced text-grey-6">
                  <q-icon name="schedule" class="q-mr-xs" />
                  {{ formatDate(props.row.facdat) }}
                </div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-montant_ht="props">
            <q-td :props="props" class="cosmic-cell-enhanced">
              <div class="montant-info-enhanced">
                <div class="main-amount-enhanced text-dark">
                  {{ formatCurrency(props.row.facmnt) }}
                </div>
                <div class="frais-amount-enhanced text-grey-6">
                  🖨️ Frais: {{ formatCurrency(props.row.facfix) }}
                </div>
                <div class="amount-words text-xs text-grey-5">
                  {{ numberToWords(props.row.facmnt) }} dinars
                </div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-montant_tva="props">
            <q-td :props="props" class="cosmic-cell-enhanced">
              <div class="tva-info-enhanced">
                <div class="tva-amount-enhanced text-dark">
                  {{ formatCurrency(props.row.factva) }}
                </div>
                <div class="tva-rate-enhanced text-grey-6">
                  📊 TVA: {{ props.row.facttv }}%
                </div>
                <div class="tva-words text-xs text-grey-5">
                  {{ numberToWords(props.row.factva) }} dinars
                </div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-total_payer="props">
            <q-td :props="props" class="cosmic-cell-enhanced">
              <div
                class="total-amount-enhanced"
                :class="getTotalAmountClass(props.row)"
              >
                <div class="total-number">
                  {{ formatCurrency(props.row.facttc) }}
                </div>
                <div class="total-words text-xs">
                  {{ numberToWords(props.row.facttc) }} dinars
                </div>
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props" class="cosmic-cell-enhanced">
              <q-badge
                :color="props.row.status === 1 ? 'positive' : 'warning'"
                class="status-badge"
                :class="props.row.status === 1 ? 'paid-badge' : 'unpaid-badge'"
              >
                <q-icon
                  :name="props.row.status === 1 ? 'check_circle' : 'schedule'"
                  class="q-mr-xs"
                />
                {{ props.row.status === 1 ? "Payée" : "En attente" }}
              </q-badge>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="cosmic-cell-enhanced">
              <div class="action-buttons-enhanced">
                <q-btn
                  color="info"
                  size="sm"
                  icon="visibility"
                  @click="viewFacture(props.row)"
                  class="action-btn-enhanced info-btn"
                  round
                  glossy
                >
                  <q-tooltip class="cosmic-tooltip">Voir détails</q-tooltip>
                </q-btn>

                <q-btn
                  color="primary"
                  size="sm"
                  icon="print"
                  @click="printFacture(props.row)"
                  class="action-btn-enhanced primary-btn"
                  round
                  glossy
                >
                  <q-tooltip class="cosmic-tooltip">Imprimer PDF</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="props.row.status != 1"
                  color="positive"
                  size="sm"
                  icon="payments"
                  @click="payFacture(props.row)"
                  class="action-btn-enhanced success-btn"
                  round
                  glossy
                >
                  <q-tooltip class="cosmic-tooltip">Payer maintenant</q-tooltip>
                </q-btn>

                <q-btn
                  v-if="props.row.status == 1"
                  color="green"
                  size="sm"
                  icon="verified"
                  class="action-btn-enhanced paid-btn"
                  round
                  disable
                >
                  <q-tooltip class="cosmic-tooltip">Facture payée</q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>

          <template v-slot:no-data>
            <div
              class="full-width row flex-center text-grey-6 q-pa-xl no-data-section"
            >
              <div class="no-data-content">
                <q-icon name="receipt_long" size="xl" class="no-data-icon" />
                <div class="text-h6 q-mt-md">Aucune facture trouvée</div>
                <div class="text-caption q-mt-sm">
                  Essayez de modifier vos filtres
                </div>
              </div>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useEpaymentStore } from "../../stores/epayment";
import { date } from "quasar";
import moment from "moment";
import "moment/locale/fr";

// Utilisation de written-number qui fonctionne bien
import writtenNumber from "written-number";

const router = useRouter();
const $q = useQuasar();
const epaymentStore = useEpaymentStore();
const VITE_API_BASE_URL = process.env.VITE_API_BASE_URL;

const loading = ref(false);
const factures = ref([]);
const stats = ref({
  total_factures: 0,
  factures_payees: 0,
  factures_impayees: 0,
  montant_total: 0,
  montant_paye: 0,
  montant_impaye: 0,
});

const filters = ref({
  status: null,
  date_from: null,
  date_to: null,
});

const pagination = ref({
  sortBy: "facdat",
  descending: true,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
});

const enhancedColumns = [
  {
    name: "escale_navire",
    label: "Escale / Navire",
    align: "left",
    field: (row) => row,
    style: "width: 15%",
    icon: "sailing",
  },
  {
    name: "ref_facture_date",
    label: "Référence / Date",
    align: "left",
    field: (row) => row,
    style: "width: 15%",
    icon: "description",
  },
  {
    name: "montant_ht",
    label: "Montant HT",
    align: "left",
    field: (row) => row,
    style: "width: 20%",
    icon: "request_quote",
  },
  {
    name: "montant_tva",
    label: "Montant TVA",
    align: "left",
    field: (row) => row,
    style: "width: 15%",
    icon: "percent",
  },
  {
    name: "total_payer",
    label: "Total à payer",
    align: "left",
    field: "facttc",
    style: "width: 15%",
    icon: "payments",
  },
  {
    name: "status",
    label: "Statut",
    align: "center",
    field: "status",
    style: "width: 10%",
    icon: "status",
  },
  {
    name: "actions",
    label: "Actions",
    align: "center",
    style: "width: 10%",
    icon: "settings",
  },
];

const statusOptions = [
  { label: "📊 Toutes les factures", value: null },
  { label: "✅ Factures payées", value: "paid" },
  { label: "⏳ Factures impayées", value: "unpaid" },
];

// Fonction de conversion des nombres en lettres avec written-number
const numberToWords = (num) => {
  if (!num || num === 0) return "zéro";

  try {
    // written-number fonctionne bien avec le français
    return writtenNumber(Math.floor(num), { lang: "fr" });
  } catch (error) {
    console.warn("Erreur written-number, fallback:", error);
    return fallbackNumberToWords(num);
  }
};

// Fonction de fallback au cas où
const fallbackNumberToWords = (num) => {
  const units = [
    "",
    "un",
    "deux",
    "trois",
    "quatre",
    "cinq",
    "six",
    "sept",
    "huit",
    "neuf",
  ];
  const teens = [
    "dix",
    "onze",
    "douze",
    "treize",
    "quatorze",
    "quinze",
    "seize",
    "dix-sept",
    "dix-huit",
    "dix-neuf",
  ];
  const tens = [
    "",
    "",
    "vingt",
    "trente",
    "quarante",
    "cinquante",
    "soixante",
    "soixante",
    "quatre-vingt",
    "quatre-vingt",
  ];

  if (num < 10) return units[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const unit = num % 10;
    if (unit === 0) return tens[ten];
    if (ten === 7 || ten === 9) return tens[ten] + "-" + teens[unit];
    return tens[ten] + "-" + units[unit];
  }

  if (num < 1000) {
    const hundred = Math.floor(num / 100);
    const rest = num % 100;
    if (hundred === 1)
      return rest === 0 ? "cent" : "cent " + fallbackNumberToWords(rest);
    return (
      units[hundred] +
      " cent" +
      (rest === 0 ? "s" : " " + fallbackNumberToWords(rest))
    );
  }

  return "nombre";
};

const enhancedStats = computed(() => [
  {
    value: stats.value.total_factures,
    label: "Total Factures",
    words: numberToWords(stats.value.total_factures),
    icon: "description",
    cardClass: "total-card-enhanced",
    iconClass: "cosmic-blue-enhanced",
    numberClass: "text-blue-8",
    badgeClass: "badge-blue",
    trend: "📈",
  },
  {
    value: stats.value.factures_payees,
    label: "Factures Payées",
    words: numberToWords(stats.value.factures_payees),
    icon: "check_circle",
    cardClass: "success-card-enhanced",
    iconClass: "cosmic-green-enhanced",
    numberClass: "text-green-8",
    badgeClass: "badge-green",
    trend: "✅",
  },
  {
    value: stats.value.factures_impayees,
    label: "Factures Impayées",
    words: numberToWords(stats.value.factures_impayees),
    icon: "pending_actions",
    cardClass: "warning-card-enhanced",
    iconClass: "cosmic-orange-enhanced",
    numberClass: "text-orange-8",
    badgeClass: "badge-orange",
    trend: "⏳",
  },
  {
    value: formatCurrency(stats.value.montant_total),
    label: "Montant Total",
    words: numberToWords(Math.floor(stats.value.montant_total)) + " dinars",
    icon: "account_balance_wallet",
    cardClass: "amount-card-enhanced",
    iconClass: "cosmic-purple-enhanced",
    numberClass: "text-purple-8",
    badgeClass: "badge-purple",
    trend: "💰",
  },
]);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency: "DZD",
  }).format(amount || 0);
};

const formatDate = (date) => {
  return moment(date).locale("fr").format("DD MMM YYYY");
};

const getTotalAmountClass = (row) => {
  return row.status === 1 ? "total-paid" : "total-unpaid";
};

const getParticleStyle = (index, cardIndex) => {
  const angle = (index / 8) * 360;
  const delay = index * 0.2 + cardIndex * 0.5;
  return {
    "--particle-angle": `${angle}deg`,
    "--particle-delay": `${delay}s`,
    "--particle-index": cardIndex,
  };
};

const getFilterParticleStyle = (index) => {
  const positions = ["10%", "30%", "50%", "70%", "90%"];
  const delays = [0, 0.5, 1, 1.5, 2];
  return {
    left: positions[index % 5],
    "animation-delay": `${delays[index % 5]}s`,
  };
};

const cardAnimations = ref([]);

const startCardAnimation = (index) => {
  cardAnimations.value[index] = true;
};

const stopCardAnimation = (index) => {
  cardAnimations.value[index] = false;
};

// Fonction pour effacer tous les filtres
const clearFilters = () => {
  filters.value = {
    status: null,
    date_from: null,
    date_to: null,
  };
  pagination.value.page = 1;
  loadFactures();
  $q.notify({
    type: "positive",
    message: "Filtres réinitialisés",
    position: "top",
  });
};

const loadFactures = async () => {
  loading.value = true;
  try {
    const params = {
      page: pagination.value.page,
      per_page: pagination.value.rowsPerPage,
      ...filters.value,
    };

    const response = await epaymentStore.getFactures(params);
    factures.value = response.data;
    pagination.value.rowsNumber = response.total;

    const statsResponse = await epaymentStore.getFacturesStats();
    stats.value = statsResponse;
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Erreur lors du chargement des factures",
      caption: error.message,
    });
  } finally {
    loading.value = false;
  }
};

const onRequest = (props) => {
  pagination.value = props.pagination;
  loadFactures();
};

const applyFilters = () => {
  pagination.value.page = 1;
  loadFactures();
};

const viewFacture = (facture) => {
  router.push(`/epayment/factures/${facture.id}`);
};

const payFacture = (facture) => {
  router.push(`/epayment/payment/${facture.id}`);
};

const printFacture = (facture) => {
  const url = `${VITE_API_BASE_URL}/epayment/factures/${facture.id}/pdf`;
  window.open(url);
};

onMounted(() => {
  loadFactures();
});
</script>

<style scoped>
/* Les styles CSS restent exactement les mêmes que dans la version précédente */
/* Fond clair avec dégradé subtil */
.cosmic-light-bg {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
  min-height: 100vh;
}

/* Titre holographique amélioré */
.hologram-title-container {
  position: relative;
}

.hologram-title {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
}

.hologram-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
      90deg,
      transparent 49%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 51%
    ),
    linear-gradient(
      transparent 49%,
      rgba(255, 255, 255, 0.3) 50%,
      transparent 51%
    );
  background-size: 15px 15px;
  animation: hologramSpin 4s linear infinite;
}

.title-icon {
  color: white;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8));
  position: relative;
  z-index: 2;
}

.energy-beam {
  position: absolute;
  width: 2px;
  height: 30px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 255, 0.8),
    transparent
  );
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  animation: dataFlow 2s linear infinite;
}

.beam-1 {
  animation-delay: 0s;
}
.beam-2 {
  animation-delay: 1s;
}

.title-neon {
  background: linear-gradient(135deg, #1e40af, #3b82f6, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
  text-shadow: 0 5px 15px rgba(59, 130, 246, 0.2);
}

.subtitle {
  font-size: 1.1em;
  font-weight: 500;
}

/* Cartes de statistiques extraordinaires */
.cosmic-card-enhanced {
  position: relative;
  border-radius: 24px;
  padding: 25px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 160px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  /* Ajouter cette ligne pour s'assurer qu'elles restent alignées */
  height: 100%;
}

.cosmic-card-enhanced:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.total-card-enhanced {
  border-top: 4px solid #3b82f6;
}
.success-card-enhanced {
  border-top: 4px solid #10b981;
}
.warning-card-enhanced {
  border-top: 4px solid #f59e0b;
}
.amount-card-enhanced {
  border-top: 4px solid #8b5cf6;
}

.card-particle-system {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform-origin: center;
  animation: particleOrbit 3s linear infinite;
  animation-delay: var(--particle-delay);
}

.particle:nth-child(odd) {
  background: #3b82f6;
  animation-duration: 4s;
}

.particle:nth-child(even) {
  background: #8b5cf6;
  animation-duration: 6s;
}

.card-orbits {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.orbit {
  position: absolute;
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  animation: orbitSpin 8s linear infinite;
}

.orbit-1 {
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  animation-duration: 12s;
}

.orbit-2 {
  top: 5px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  animation-duration: 16s;
  animation-direction: reverse;
}

.orbit-3 {
  top: 15px;
  left: 15px;
  right: 15px;
  bottom: 15px;
  animation-duration: 20s;
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(
    circle at center,
    rgba(59, 130, 246, 0.1),
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cosmic-card-enhanced:hover .card-glow {
  opacity: 1;
}

.card-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.cosmic-blue-enhanced {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.cosmic-green-enhanced {
  background: linear-gradient(135deg, #10b981, #059669);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
}

.cosmic-orange-enhanced {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
}

.cosmic-purple-enhanced {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-weight: 800;
  font-size: 2rem;
  margin-bottom: 4px;
}

.stat-label {
  font-weight: 600;
  font-size: 0.9em;
  margin-bottom: 4px;
}

.stat-words {
  font-style: italic;
  color: #6b7280;
}

.stat-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 600;
}

.badge-blue {
  background: rgba(59, 130, 246, 0.1);
  color: #1d4ed8;
}
.badge-green {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
}
.badge-orange {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}
.badge-purple {
  background: rgba(139, 92, 246, 0.1);
  color: #7c3aed;
}

/* Filtres améliorés */
.cosmic-filter-card-enhanced {
  position: relative;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.filter-particle-system {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
}

.filter-particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: linear-gradient(90deg, #3b82f6, #10b981, #f59e0b, #8b5cf6);
  border-radius: 50%;
  top: 0;
  animation: filterFlow 3s ease-in-out infinite;
}

.filter-title {
  font-weight: 700;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.clear-filters-btn {
  color: #6b7280;
  font-weight: 500;
  transition: all 0.3s ease;
}

.clear-filters-btn:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

/* Correction pour les inputs date - texte visible */
.cosmic-select-enhanced :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
  color: #1f2937 !important;
}

.cosmic-select-enhanced :deep(.q-field__control:hover) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.cosmic-input-enhanced :deep(.q-field__control) {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.2);
  transition: all 0.3s ease;
  color: #1f2937 !important;
}

/* Correction spécifique pour les inputs date */
.date-input :deep(.q-field__control) {
  color: #1f2937 !important;
}

.date-input :deep(.q-field__native) {
  color: #1f2937 !important;
}

.date-input :deep(.q-field__label) {
  color: #6b7280 !important;
}

.date-input :deep(.q-field__control::before) {
  color: #1f2937 !important;
}

.cosmic-btn-enhanced {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  padding: 12px 24px;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.cosmic-btn-enhanced:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(59, 130, 246, 0.4);
}

/* Tableau extraordinaire */
.cosmic-table-card-enhanced {
  position: relative;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.table-header-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #10b981, #f59e0b, #8b5cf6);
  animation: glowFlow 4s ease-in-out infinite;
}

.cosmic-table-enhanced :deep(.q-table__container) {
  background: transparent;
}

.cosmic-header-enhanced {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.05),
    rgba(139, 92, 246, 0.05)
  ) !important;
}

.cosmic-th {
  color: #1e40af !important;
  font-size: 14px;
  font-weight: 700;
  border-bottom: 2px solid rgba(59, 130, 246, 0.2) !important;
  padding: 16px 12px;
}

.header-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cosmic-cell-enhanced {
  border-bottom: 1px solid rgba(59, 130, 246, 0.1) !important;
  background: transparent !important;
  padding: 12px;
  transition: all 0.3s ease;
}

.cosmic-cell-enhanced:hover {
  background: rgba(59, 130, 246, 0.03) !important;
}

/* Styles spécifiques améliorés */
.navire-info-enhanced .escale-badge {
  background: rgba(59, 130, 246, 0.1);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #1e40af;
  display: inline-flex;
  align-items: center;
  margin-bottom: 4px;
}

.navire-name-enhanced {
  font-weight: 600;
  font-size: 13px;
}

.facture-number-enhanced {
  font-weight: 800;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.3s ease;
  display: block;
  margin-bottom: 4px;
}

.cosmic-link:hover {
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  transform: scale(1.05);
}

.facture-date-enhanced {
  font-size: 12px;
  display: flex;
  align-items: center;
}

.montant-info-enhanced .main-amount-enhanced {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 2px;
}

.montant-info-enhanced .frais-amount-enhanced {
  font-size: 11px;
  margin-bottom: 2px;
}

.amount-words {
  font-style: italic;
}

.tva-info-enhanced .tva-amount-enhanced {
  font-weight: 700;
  font-size: 14px;
  margin-bottom: 2px;
}

.tva-info-enhanced .tva-rate-enhanced {
  font-size: 11px;
  margin-bottom: 2px;
}

.tva-words {
  font-style: italic;
}

.total-amount-enhanced {
  padding: 8px 12px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
}

.total-paid {
  background: linear-gradient(
    135deg,
    rgba(16, 185, 129, 0.1),
    rgba(5, 150, 105, 0.05)
  );
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.total-unpaid {
  background: linear-gradient(
    135deg,
    rgba(245, 158, 11, 0.1),
    rgba(217, 119, 6, 0.05)
  );
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.total-number {
  font-weight: 800;
  font-size: 15px;
  margin-bottom: 2px;
}

.total-words {
  font-style: italic;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 12px;
}

.paid-badge {
  background: linear-gradient(135deg, #10b981, #059669) !important;
  color: white !important;
}

.unpaid-badge {
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
  color: white !important;
}

/* Boutons d'action améliorés */
.action-buttons-enhanced {
  display: flex;
  justify-content: center;
  gap: 6px;
}

.action-btn-enhanced {
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-btn-enhanced:hover {
  transform: scale(1.15) translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.info-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.primary-btn {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.success-btn {
  background: linear-gradient(135deg, #10b981, #059669);
}

.paid-btn {
  background: linear-gradient(135deg, #059669, #047857);
}

/* Loading animation */
.loading-cosmic {
  text-align: center;
  padding: 40px;
}

.loading-orbits {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
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

/* Section no data */
.no-data-section {
  min-height: 300px;
}

.no-data-content {
  text-align: center;
}

.no-data-icon {
  color: #9ca3af;
  font-size: 4rem;
}

/* Animations */
@keyframes hologramSpin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dataFlow {
  0% {
    transform: translateX(-50%) translateY(-30px);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) translateY(30px);
    opacity: 0;
  }
}

@keyframes orbitSpin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes particleOrbit {
  0% {
    transform: rotate(var(--particle-angle)) translateX(40px)
      rotate(calc(-1 * var(--particle-angle)));
    opacity: 1;
  }
  100% {
    transform: rotate(calc(var(--particle-angle) + 360deg)) translateX(40px)
      rotate(calc(-1 * var(--particle-angle) - 360deg));
    opacity: 0;
  }
}

@keyframes glowFlow {
  0%,
  100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

@keyframes filterFlow {
  0%,
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .cosmic-card-enhanced {
    min-height: 140px;
    padding: 20px;
    /* Sur mobile, on peut mettre 2 cartes par ligne */
  }

  .col-12.col-md-3 {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }

  .card-content {
    gap: 15px;
  }

  .stat-number {
    font-size: 1.5rem;
  }

  .action-buttons-enhanced {
    flex-direction: column;
    gap: 4px;
  }
}

.text-orange {
  color: #f59e0b;
}
</style>
