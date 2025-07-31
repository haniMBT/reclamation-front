<template>
  <q-page class="tw-bg-gray-50 tw-min-h-screen">
    <div class="tw-container tw-mx-auto tw-p-6">
      <!-- Header -->
      <div class="tw-mb-8">
        <h1 class="tw-text-3xl tw-font-bold tw-text-gray-800 tw-mb-2">
          Tableau de bord EPAL
        </h1>
        <p class="tw-text-gray-600">Vue d'ensemble de vos services portuaires</p>
      </div>

      <!-- Stats Cards -->
      <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-6 tw-mb-8">
        <!-- Total Transactions -->
        <div class="tw-bg-white tw-rounded-xl tw-p-6 tw-shadow-lg tw-border-l-4 tw-border-emerald-500">
          <div class="tw-flex tw-items-center tw-justify-between">
            <div>
              <p class="tw-text-sm tw-font-medium tw-text-gray-600 tw-uppercase">Total Transactions</p>
              <p class="tw-text-2xl tw-font-bold tw-text-gray-900">{{ stats.totalTransactions }}</p>
            </div>
            <div class="tw-p-3 tw-bg-emerald-100 tw-rounded-full">
              <q-icon name="trending_up" class="tw-text-xl tw-text-emerald-600" />
            </div>
          </div>
          <div class="tw-mt-4">
            <span class="tw-text-emerald-500 tw-text-sm tw-font-semibold">+12%</span>
            <span class="tw-text-gray-500 tw-text-sm tw-ml-2">ce mois</span>
          </div>
        </div>

        <!-- E-paiements -->
        <div class="tw-bg-white tw-rounded-xl tw-p-6 tw-shadow-lg tw-border-l-4 tw-border-teal-500">
          <div class="tw-flex tw-items-center tw-justify-between">
            <div>
              <p class="tw-text-sm tw-font-medium tw-text-gray-600 tw-uppercase">E-paiements</p>
              <p class="tw-text-2xl tw-font-bold tw-text-gray-900">{{ stats.epaiements }}</p>
            </div>
            <div class="tw-p-3 tw-bg-teal-100 tw-rounded-full">
              <q-icon name="account_balance_wallet" class="tw-text-xl tw-text-teal-600" />
            </div>
          </div>
          <div class="tw-mt-4">
            <span class="tw-text-teal-500 tw-text-sm tw-font-semibold">+8%</span>
            <span class="tw-text-gray-500 tw-text-sm tw-ml-2">ce mois</span>
          </div>
        </div>

        <!-- Factures -->
        <div class="tw-bg-white tw-rounded-xl tw-p-6 tw-shadow-lg tw-border-l-4 tw-border-orange-500">
          <div class="tw-flex tw-items-center tw-justify-between">
            <div>
              <p class="tw-text-sm tw-font-medium tw-text-gray-600 tw-uppercase">Factures</p>
              <p class="tw-text-2xl tw-font-bold tw-text-gray-900">{{ stats.factures }}</p>
            </div>
            <div class="tw-p-3 tw-bg-orange-100 tw-rounded-full">
              <q-icon name="receipt_long" class="tw-text-xl tw-text-orange-600" />
            </div>
          </div>
          <div class="tw-mt-4">
            <span class="tw-text-orange-500 tw-text-sm tw-font-semibold">+15%</span>
            <span class="tw-text-gray-500 tw-text-sm tw-ml-2">ce mois</span>
          </div>
        </div>

        <!-- Réclamations -->
        <div class="tw-bg-white tw-rounded-xl tw-p-6 tw-shadow-lg tw-border-l-4 tw-border-red-500">
          <div class="tw-flex tw-items-center tw-justify-between">
            <div>
              <p class="tw-text-sm tw-font-medium tw-text-gray-600 tw-uppercase">Réclamations</p>
              <p class="tw-text-2xl tw-font-bold tw-text-gray-900">{{ stats.reclamations }}</p>
            </div>
            <div class="tw-p-3 tw-bg-red-100 tw-rounded-full">
              <q-icon name="support_agent" class="tw-text-xl tw-text-red-600" />
            </div>
          </div>
          <div class="tw-mt-4">
            <span class="tw-text-red-500 tw-text-sm tw-font-semibold">-3%</span>
            <span class="tw-text-gray-500 tw-text-sm tw-ml-2">ce mois</span>
          </div>
        </div>
      </div>

              <!-- Charts Section -->
        <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-8 tw-mb-8">
          <!-- ApexCharts Bar Chart -->
          <div class="tw-bg-white tw-rounded-xl tw-p-6 tw-shadow-lg">
            <div class="tw-flex tw-justify-between tw-items-center tw-mb-6">
              <h3 class="tw-text-xl tw-font-bold tw-text-gray-800">Transactions par Mois</h3>
              <q-btn 
                @click="refreshChart"
                icon="refresh"
                color="primary"
                flat
                round
                size="sm"
              >
                <q-tooltip>Actualiser avec nouvelles couleurs</q-tooltip>
              </q-btn>
            </div>
            <apexchart
              type="bar"
              height="300"
              :options="chartOptions"
              :series="chartSeries"
              ref="chart"
            />
          </div>

        <!-- Quick Actions -->
        <div class="tw-bg-white tw-rounded-xl tw-p-6 tw-shadow-lg">
          <h3 class="tw-text-xl tw-font-bold tw-text-gray-800 tw-mb-6">Actions Rapides</h3>
          <div class="tw-space-y-4">
            <q-btn 
              class="tw-w-full tw-justify-start" 
              color="emerald-6" 
              icon="account_balance_wallet" 
              label="Nouveau Paiement"
              flat
              size="lg"
            />
            <q-btn 
              class="tw-w-full tw-justify-start" 
              color="orange-6" 
              icon="receipt_long" 
              label="Créer Facture"
              flat
              size="lg"
            />
            <q-btn 
              class="tw-w-full tw-justify-start" 
              color="teal-6" 
              icon="support_agent" 
              label="Nouvelle Réclamation"
              flat
              size="lg"
            />
            <q-btn 
              class="tw-w-full tw-justify-start" 
              color="gray-6" 
              icon="bar_chart" 
              label="Voir Rapports"
              flat
              size="lg"
            />
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="tw-bg-white tw-rounded-xl tw-p-6 tw-shadow-lg">
        <h3 class="tw-text-xl tw-font-bold tw-text-gray-800 tw-mb-6">Activités Récentes</h3>
        <div class="tw-space-y-4">
          <div 
            v-for="activity in recentActivities" 
            :key="activity.id"
            class="tw-flex tw-items-center tw-p-4 tw-bg-gray-50 tw-rounded-lg tw-transition-all tw-duration-300 hover:tw-bg-gray-100"
          >
            <div 
              class="tw-w-10 tw-h-10 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-4"
              :class="getActivityColor(activity.type)"
            >
              <q-icon :name="getActivityIcon(activity.type)" class="tw-text-white" />
            </div>
            <div class="tw-flex-1">
              <p class="tw-font-semibold tw-text-gray-800">{{ activity.title }}</p>
              <p class="tw-text-sm tw-text-gray-600">{{ activity.description }}</p>
            </div>
            <div class="tw-text-right">
              <p class="tw-text-sm tw-text-gray-500">{{ activity.time }}</p>
              <span 
                class="tw-text-xs tw-font-semibold tw-px-2 tw-py-1 tw-rounded-full"
                :class="getStatusColor(activity.status)"
              >
                {{ activity.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useAuthStore } from "stores/auth";
import VueApexCharts from "vue3-apexcharts";

// Enregistrer le composant ApexCharts
const apexchart = VueApexCharts;

const authStore = useAuthStore();

// Données fictives simplifiées
const stats = ref({
  totalTransactions: 1247,
  epaiements: 456,
  factures: 381,
  reclamations: 67
});

// Données du graphique avec couleurs aléatoires
const chartSeries = ref([
  {
    name: 'Transactions',
    data: [150, 230, 180, 290, 340, 420, 380, 510, 290, 380, 460, 320]
  }
]);

const chartOptions = reactive({
  chart: {
    type: 'bar',
    height: 300,
    toolbar: {
      show: false
    },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350
      }
    }
  },
  colors: [], // Sera rempli par generateRandomColors()
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: '60%',
      distributed: true // Couleur différente pour chaque barre
    }
  },
  dataLabels: {
    enabled: false
  },
  legend: {
    show: false
  },
  grid: {
    show: true,
    borderColor: '#e0e6ed',
    strokeDashArray: 3,
    xaxis: {
      lines: {
        show: false
      }
    },
    yaxis: {
      lines: {
        show: true
      }
    }
  },
  xaxis: {
    categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    },
    labels: {
      style: {
        colors: '#8b8b8b',
        fontSize: '12px'
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: '#8b8b8b',
        fontSize: '12px'
      }
    }
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: function (val) {
        return val + ' transactions'
      }
    }
  }
});

const recentActivities = ref([
  {
    id: 1,
    type: 'payment',
    title: 'Paiement reçu',
    description: 'Paiement de 15,000 DA',
    time: 'Il y a 2h',
    status: 'Validé'
  },
  {
    id: 2,
    type: 'invoice',
    title: 'Facture générée',
    description: 'Facture #FP-2024-0156',
    time: 'Il y a 4h',
    status: 'En attente'
  },
  {
    id: 3,
    type: 'complaint',
    title: 'Nouvelle réclamation',
    description: 'Réclamation #RC-789',
    time: 'Il y a 6h',
    status: 'En cours'
  }
]);

const getActivityIcon = (type) => {
  switch (type) {
    case 'payment': return 'account_balance_wallet';
    case 'invoice': return 'receipt_long';
    case 'complaint': return 'support_agent';
    default: return 'info';
  }
};

const getActivityColor = (type) => {
  switch (type) {
    case 'payment': return 'tw-bg-emerald-500';
    case 'invoice': return 'tw-bg-orange-500';
    case 'complaint': return 'tw-bg-teal-500';
    default: return 'tw-bg-gray-500';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Validé': return 'tw-bg-emerald-100 tw-text-emerald-800';
    case 'En attente': return 'tw-bg-orange-100 tw-text-orange-800';
    case 'En cours': return 'tw-bg-teal-100 tw-text-teal-800';
    default: return 'tw-bg-gray-100 tw-text-gray-800';
  }
};

// Fonctions pour les couleurs aléatoires du graphique
const generateRandomColors = () => {
  const colors = [];
  const baseColors = [
    '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', 
    '#f97316', '#06b6d4', '#84cc16', '#ec4899', '#6366f1',
    '#14b8a6', '#eab308', '#f43f5e', '#0ea5e9'
  ];
  
  // Générer 12 couleurs aléatoires pour les 12 mois
  for (let i = 0; i < 12; i++) {
    // Mélanger et choisir une couleur aléatoire
    const randomIndex = Math.floor(Math.random() * baseColors.length);
    let chosenColor = baseColors[randomIndex];
    
    // Ajouter une variation de luminosité aléatoire
    const variations = ['', '90', '80', '70', '60', '50'];
    const variationIndex = Math.floor(Math.random() * variations.length);
    
    if (variations[variationIndex]) {
      // Modifier légèrement la couleur pour plus de variété
      const r = parseInt(chosenColor.slice(1, 3), 16);
      const g = parseInt(chosenColor.slice(3, 5), 16);
      const b = parseInt(chosenColor.slice(5, 7), 16);
      
      const factor = parseInt(variations[variationIndex]) / 100;
      const newR = Math.floor(r * factor);
      const newG = Math.floor(g * factor);
      const newB = Math.floor(b * factor);
      
      chosenColor = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }
    
    colors.push(chosenColor);
  }
  
  return colors;
};

// Actualiser le graphique avec de nouvelles couleurs
const refreshChart = () => {
  chartOptions.colors = generateRandomColors();
  
  // Optionnellement, modifier aussi les données légèrement
  const baseData = [150, 230, 180, 290, 340, 420, 380, 510, 290, 380, 460, 320];
  const newData = baseData.map(value => {
    const variation = Math.floor(Math.random() * 50) - 25; // ±25
    return Math.max(50, value + variation); // Minimum 50
  });
  
  chartSeries.value = [{
    name: 'Transactions',
    data: newData
  }];
};

// Initialiser les couleurs au chargement
onMounted(() => {
  chartOptions.colors = generateRandomColors();
});
</script>

<style scoped>
/* Animations au hover pour les cartes stats */
.tw-shadow-lg {
  transition: all 0.3s ease;
}

.tw-shadow-lg:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>