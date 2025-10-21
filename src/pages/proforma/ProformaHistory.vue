<template>
  <q-page class="q-pa-lg cosmic-light-bg">
    <!-- Header avec titre holographique -->
    <div class="row q-mb-xl">
      <div class="col-12">
        <div class="flex items-center q-mb-lg">
          <div class="hologram-title-container q-mr-md">
            <div class="hologram-title">
              <div class="hologram-grid"></div>
              <q-icon name="history" size="lg" class="title-icon" />
              <div class="energy-beam beam-1"></div>
              <div class="energy-beam beam-2"></div>
            </div>
          </div>
          <div>
            <h4 class="text-h4 q-mb-xs text-dark title-neon">Historique des Proformas</h4>
            <p class="text-grey-7 q-mb-none subtitle">
              Chronologie complète de vos calculs de factures proforma
            </p>
          </div>
        </div>

        <!-- Bouton retour avec effet quantique -->
        <q-btn 
          @click="$router.push('/proforma')"
          class="quantum-back-btn q-mb-lg"
          unelevated
        >
          <template v-slot:default>
            <div class="btn-content">
              <div class="btn-icon">
                <q-icon name="arrow_back" />
              </div>
              <span class="btn-text">Retour au Calculateur</span>
              <div class="btn-particles">
                <div v-for="i in 3" :key="i" class="particle" :style="particleStyle(i)"></div>
              </div>
            </div>
          </template>
        </q-btn>

        <!-- Cartes de statistiques cosmiques -->
        <div class="row q-col-gutter-md q-mb-lg" v-if="proformaStore.history.length > 0">
          <div
            class="col-6 col-sm-3"
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
                  {{ stat.trend }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau d'historique avec design extraordinaire -->
    <q-card class="cosmic-table-card-enhanced">
      <div class="table-header-glow"></div>
      <q-card-section class="no-padding">
        <q-table
          :rows="proformaStore.history"
          :columns="enhancedHistoryColumns"
          row-key="id"
          :loading="proformaStore.historyLoading"
          :pagination="{ rowsPerPage: 10 }"
          binary-state-sort
          flat
          class="cosmic-table-enhanced"
          :rows-per-page-options="[10, 15, 20, 50]"
        >
          <!-- Loading avec animation cosmique -->
          <template v-slot:loading>
            <q-inner-loading showing color="primary">
              <div class="loading-cosmic">
                <div class="loading-orbits">
                  <div class="loading-orbit"></div>
                  <div class="loading-orbit"></div>
                  <div class="loading-orbit"></div>
                </div>
                <div class="text-primary text-h6">
                  Chargement de l'historique...
                </div>
              </div>
            </q-inner-loading>
          </template>

          <!-- En-tête du tableau -->
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

          <!-- Cellule BL avec effet data-stream -->
          <template v-slot:body-cell-cnsbld="props">
            <q-td :props="props" class="cosmic-cell-enhanced">
              <div class="data-stream-container">
                <div class="data-stream"></div>
                <span class="data-value">{{ props.value }}</span>
                <div class="data-glow"></div>
              </div>
            </q-td>
          </template>

          <!-- Cellule Conteneur avec effet hologramme -->
          <template v-slot:body-cell-dctcod="props">
            <q-td :props="props" class="cosmic-cell-enhanced">
              <div class="hologram-badge">
                <div class="hologram-grid"></div>
                <span class="container-code">{{ props.value }}</span>
                <div class="hologram-shine"></div>
              </div>
            </q-td>
          </template>

          <!-- Cellule Scanner avec effet néon -->
          <template v-slot:body-cell-scan="props">
            <q-td :props="props" class="cosmic-cell-enhanced">
              <div class="neon-indicator" :class="{ active: props.value }">
                <div class="neon-glow"></div>
                <div class="neon-text">{{ props.value ? 'ACTIF' : 'INACTIF' }}</div>
                <div class="status-dot" :class="{ active: props.value }"></div>
              </div>
            </q-td>
          </template>

          <!-- Cellule Montant avec effet énergétique -->
          <template v-slot:body-cell-ttc="props">
            <q-td :props="props" class="cosmic-cell-enhanced">
              <div class="energy-display">
                <div class="currency-symbol">DA</div>
                <span class="amount-value">{{ proformaStore.formatMontant(props.value) }}</span>
                <div class="energy-bars">
                  <div class="energy-bar" :style="energyStyle(props.value)"></div>
                </div>
              </div>
            </q-td>
          </template>

          <!-- Cellule Date Calcul avec effet timeline -->
          <template v-slot:body-cell-created_at="props">
            <q-td :props="props" class="cosmic-cell-enhanced">
              <div class="timeline-marker">
                <div class="timeline-dot"></div>
                <div class="timeline-line"></div>
              </div>
              <div class="timestamp">
                <div class="full-datetime">{{ formatDateTime(props.value) }}</div>
                <div class="time-ago">{{ timeAgo(props.value) }}</div>
              </div>
            </q-td>
          </template>

          <!-- État vide cosmique -->
          <template v-slot:no-data>
            <div class="cosmic-empty-state">
              <div class="empty-orbit">
                <div class="empty-planet">📊</div>
                <div class="empty-ring"></div>
              </div>
              <div class="empty-title">Aucun historique trouvé</div>
              <div class="empty-subtitle">Vos calculs de proforma apparaîtront ici</div>
              <q-btn
                color="primary"
                icon="add"
                label="Créer une proforma"
                @click="$router.push('/proforma')"
                class="q-mt-md cosmic-btn-enhanced"
                glossy
              />
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Effets de particules flottantes -->
    <div class="floating-particles">
      <div v-for="i in 10" :key="i" class="particle" :style="floatingParticleStyle(i)"></div>
    </div>
  </q-page>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useProformaStore } from 'stores/proforma'
import { useMeta, date } from 'quasar'
import { useRouter } from 'vue-router'

const router = useRouter()
useMeta({
  title: 'Historique Proforma - EPAL'
})

const proformaStore = useProformaStore()

// Statistiques calculées
const enhancedStats = computed(() => {
  const history = proformaStore.history
  const total = history.length
  const withScan = history.filter(item => item.scan).length
  const totalAmount = history.reduce((sum, item) => sum + (item.ttc || 0), 0)
  const avgAmount = total > 0 ? totalAmount / total : 0

  return [
    {
      value: total,
      label: 'Total Proformas',
      icon: 'receipt',
      cardClass: 'total-card-enhanced',
      iconClass: 'cosmic-blue-enhanced',
      numberClass: 'text-blue-8',
      badgeClass: 'badge-blue',
      trend: '📈'
    },
    {
      value: withScan,
      label: 'Avec Scanner',
      icon: 'scanner',
      cardClass: 'success-card-enhanced',
      iconClass: 'cosmic-green-enhanced',
      numberClass: 'text-green-8',
      badgeClass: 'badge-green',
      trend: '🔍'
    },
    {
      value: history.length - withScan,
      label: 'Sans Scanner',
      icon: 'scanner_off',
      cardClass: 'warning-card-enhanced',
      iconClass: 'cosmic-orange-enhanced',
      numberClass: 'text-orange-8',
      badgeClass: 'badge-orange',
      trend: '🚫'
    },
    {
      value: proformaStore.formatMontant(avgAmount),
      label: 'Moyenne TTC',
      icon: 'trending_up',
      cardClass: 'amount-card-enhanced',
      iconClass: 'cosmic-purple-enhanced',
      numberClass: 'text-purple-8',
      badgeClass: 'badge-purple',
      trend: '💰'
    }
  ]
})

// Colonnes améliorées avec effets
const enhancedHistoryColumns = [
  {
    name: 'cnsbld',
    required: true,
    label: '📋 BL',
    align: 'left',
    field: 'cnsbld',
    sortable: true,
    icon: 'qr_code'
  },
  {
    name: 'dctcod',
    required: true,
    label: '🚢 Conteneur',
    align: 'left',
    field: 'dctcod',
    sortable: true,
    icon: 'container'
  },
  {
    name: 'scan',
    required: true,
    label: '🔍 Scanner',
    align: 'center',
    field: 'scan',
    sortable: true,
    icon: 'scanner'
  },
  {
    name: 'ttc',
    required: true,
    label: '💰 Montant TTC',
    align: 'right',
    field: 'ttc',
    sortable: true,
    icon: 'payments'
  },
  {
    name: 'created_at',
    required: true,
    label: '⏱️ Date Calcul',
    align: 'center',
    field: 'created_at',
    sortable: true,
    icon: 'schedule'
  },
]

// Styles dynamiques pour les particules
const particleStyle = (index) => {
  const sizes = ['2px', '3px', '4px']
  const delays = [0, 0.2, 0.4]
  return {
    width: sizes[index - 1],
    height: sizes[index - 1],
    'animation-delay': `${delays[index - 1]}s`
  }
}

const floatingParticleStyle = (index) => {
  const left = Math.random() * 100
  const size = Math.random() * 3 + 1
  const delay = Math.random() * 20
  const duration = Math.random() * 10 + 10
  return {
    left: `${left}%`,
    width: `${size}px`,
    height: `${size}px`,
    'animation-delay': `${delay}s`,
    'animation-duration': `${duration}s`
  }
}

const energyStyle = (amount) => {
  const intensity = Math.min(amount / 100000, 1)
  return {
    width: `${intensity * 100}%`,
    opacity: intensity
  }
}

const cardAnimations = ref([])

const startCardAnimation = (index) => {
  cardAnimations.value[index] = true
}

const stopCardAnimation = (index) => {
  cardAnimations.value[index] = false
}

const getParticleStyle = (index, cardIndex) => {
  const angle = (index / 8) * 360
  const delay = index * 0.2 + cardIndex * 0.5
  return {
    '--particle-angle': `${angle}deg`,
    '--particle-delay': `${delay}s`,
    '--particle-index': cardIndex,
  }
}

// Formatage des dates
const formatDate = (dateString) => {
  if (!dateString) return ''
  return date.formatDate(dateString, 'DD/MM/YYYY')
}

const formatDateTime = (dateString) => {
  if (!dateString) return ''
  return date.formatDate(dateString, 'DD/MM/YYYY HH:mm')
}

const timeAgo = (dateString) => {
  if (!dateString) return ''
  const now = new Date()
  const then = new Date(dateString)
  const diff = now - then
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return "Aujourd'hui"
  if (days === 1) return 'Hier'
  if (days < 7) return `Il y a ${days} jours`
  if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`
  return `Il y a ${Math.floor(days / 30)} mois`
}

onMounted(async () => {
  try {
    await proformaStore.fetchHistory()
  } catch (error) {
    console.error('Erreur lors du chargement de l\'historique:', error)
  }
})
</script>

<style scoped>
/* === FOND CLAIR COSMIQUE === */
.cosmic-light-bg {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* === HEADER HOLOGRAPHIQUE === */
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

/* === BOUTON QUANTIQUE === */
.quantum-back-btn {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8) !important;
  border: none;
  border-radius: 16px;
  padding: 12px 24px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
}

.quantum-back-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.quantum-back-btn:hover::before {
  left: 100%;
}

.quantum-back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(59, 130, 246, 0.4);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 2;
}

.btn-icon {
  font-size: 1.2rem;
}

.btn-text {
  font-weight: 600;
}

.btn-particles {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
}

.btn-particles .particle {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: float 2s ease-in-out infinite;
}

/* === CARTES DE STATISTIQUES === */
.cosmic-card-enhanced {
  position: relative;
  border-radius: 24px;
  padding: 25px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 140px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  height: 100%;
}

.cosmic-card-enhanced:hover {
  transform: translateY(-8px) scale(1.02);
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
  gap: 15px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
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
  font-size: 1.8rem;
  margin-bottom: 4px;
}

.stat-label {
  font-weight: 600;
  font-size: 0.85em;
  margin-bottom: 4px;
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

/* === TABLEAU EXTRAORDINAIRE === */
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

/* === CELLULES SPÉCIALISÉES === */

/* Cellule BL avec data-stream */
.data-stream-container {
  position: relative;
  padding: 8px 12px;
}

.data-stream {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.2), transparent);
  animation: dataFlow 3s linear infinite;
}

.data-value {
  position: relative;
  z-index: 2;
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #1e40af;
}

.data-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1), transparent);
}

/* Cellule Conteneur avec hologramme */
.hologram-badge {
  position: relative;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 8px;
  padding: 6px 12px;
  text-align: center;
  animation: hologramFlicker 4s ease-in-out infinite;
}

.container-code {
  position: relative;
  z-index: 2;
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #1e40af;
}

.hologram-shine {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
  animation: shine 3s ease-in-out infinite;
}

/* Cellule Scanner avec néon */
.neon-indicator {
  position: relative;
  padding: 6px 12px;
  border-radius: 20px;
  text-align: center;
  border: 1px solid;
  transition: all 0.3s ease;
}

.neon-indicator:not(.active) {
  border-color: #6b7280;
  color: #6b7280;
}

.neon-indicator.active {
  border-color: #10b981;
  color: #10b981;
  animation: neonPulse 2s ease-in-out infinite;
}

.neon-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  opacity: 0.3;
}

.neon-indicator.active .neon-glow {
  background: #10b981;
  filter: blur(5px);
}

.neon-text {
  position: relative;
  z-index: 2;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #6b7280;
  transition: all 0.3s ease;
}

.status-dot.active {
  background: #10b981;
  box-shadow: 0 0 10px #10b981;
}

/* Cellule Date avec chrono */
.chrono-display {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
}

.calendar-icon {
  font-size: 1.1rem;
}

.date-value {
  font-weight: 600;
  color: #1f2937;
}

.time-ripple {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: 1px solid transparent;
  animation: ripple 2s ease-in-out infinite;
}

/* Cellule Montant avec énergie */
.energy-display {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.currency-symbol {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.7);
  font-weight: 600;
}

.amount-value {
  font-weight: 700;
  color: #b45309;
  font-size: 0.9rem;
}

.energy-bars {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(255, 215, 0, 0.2);
  border-radius: 1px;
  overflow: hidden;
}

.energy-bar {
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  border-radius: 1px;
  animation: energyPulse 2s ease-in-out infinite;
}

/* Cellule Timeline */
.timeline-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.timeline-dot {
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.timeline-line {
  width: 2px;
  height: 20px;
  background: linear-gradient(to bottom, #3b82f6, transparent);
}

.timestamp {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.full-datetime {
  font-weight: 600;
  font-size: 0.85rem;
  color: #1f2937;
}

.time-ago {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.6);
}

/* Boutons d'action */
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

.success-btn {
  background: linear-gradient(135deg, #10b981, #059669);
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

/* État vide cosmique */
.cosmic-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 60px 20px;
  text-align: center;
}

.empty-orbit {
  position: relative;
  width: 100px;
  height: 100px;
}

.empty-planet {
  font-size: 3rem;
  position: relative;
  z-index: 2;
}

.empty-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px dashed rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  animation: orbitSpin 10s linear infinite;
}

.empty-title {
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
}

.empty-subtitle {
  color: rgba(0, 0, 0, 0.6);
  font-size: 1rem;
}

/* Particules flottantes */
.floating-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-particles .particle {
  position: absolute;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  animation: float 15s ease-in-out infinite;
}

/* === ANIMATIONS === */
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
    transform: rotate(var(--particle-angle)) translateX(30px)
      rotate(calc(-1 * var(--particle-angle)));
    opacity: 1;
  }
  100% {
    transform: rotate(calc(var(--particle-angle) + 360deg)) translateX(30px)
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

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

@keyframes hologramFlicker {
  0%, 100% { opacity: 1; filter: brightness(1); }
  50% { opacity: 0.8; filter: brightness(1.3); }
}

@keyframes neonPulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 5px currentColor; }
  50% { opacity: 0.7; box-shadow: 0 0 15px currentColor; }
}

@keyframes energyPulse {
  0%, 100% { transform: scaleY(1); opacity: 0.5; }
  50% { transform: scaleY(1.5); opacity: 1; }
}

@keyframes ripple {
  0%, 100% { border-color: transparent; }
  50% { border-color: rgba(59, 130, 246, 0.5); }
}

@keyframes shine {
  0%, 100% { transform: translateX(-100%) translateY(-100%); }
  50% { transform: translateX(100%) translateY(100%); }
}

/* Responsive */
@media (max-width: 768px) {
  .cosmic-card-enhanced {
    min-height: 120px;
    padding: 20px;
  }

  .col-6.col-sm-3 {
    flex: 0 0 50%;
    max-width: 50%;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .card-content {
    gap: 12px;
  }

  .stat-number {
    font-size: 1.4rem;
  }

  .action-buttons-enhanced {
    flex-direction: column;
    gap: 4px;
  }

  .cosmic-th {
    font-size: 12px;
    padding: 12px 8px;
  }

  .cosmic-cell-enhanced {
    padding: 8px;
  }

  .q-layout,
  .q-header,
  .q-drawer,
  .q-footer,
  .menu-btn,
  .logo-master,
  .user-dropdown,
  .cosmic-drawer,
  .stellar-menu-item,
  .stellar-expansion,
  .nebula-card {
    display: none !important;
  }
}

/* Tooltip cosmique */
.cosmic-tooltip {
  background: rgba(0, 0, 0, 0.8) !important;
  backdrop-filter: blur(10px);
  border-radius: 8px;
  font-size: 12px;
}
</style>