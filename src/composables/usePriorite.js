// Helper centralisé pour les niveaux de priorité des réclamations.
// Doit rester aligné avec App\Support\PrioriteHelper (backend).

export const PRIORITE_LEVELS = {
  normal:    { value: 'normal',    label: 'Normal',    weight: 1, color: 'blue-grey-6' },
  important: { value: 'important', label: 'Important', weight: 2, color: 'amber-7' },
  urgent:    { value: 'urgent',    label: 'Urgent',    weight: 3, color: 'orange-8' },
  critique:  { value: 'critique',  label: 'Critique',  weight: 4, color: 'red-7' },
};

export const PRIORITE_DEFAULT = 'normal';

export const PRIORITE_OPTIONS = Object.values(PRIORITE_LEVELS);

export function isValidPriorite(value) {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(PRIORITE_LEVELS, value);
}

export function normalizePriorite(value) {
  return isValidPriorite(value) ? value : PRIORITE_DEFAULT;
}

export function getPrioriteMeta(value) {
  return PRIORITE_LEVELS[normalizePriorite(value)];
}

export function getPrioriteLabel(value) {
  return getPrioriteMeta(value).label;
}

export function getPrioriteColor(value) {
  return getPrioriteMeta(value).color;
}

export function getPrioriteWeight(value) {
  return getPrioriteMeta(value).weight;
}
