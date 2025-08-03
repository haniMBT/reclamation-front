<template>
  <div>
    <q-btn-dropdown
      class="w-full"
      v-model="menu"
      color="white"
      text-color="black"
      :no-caps="!capital"
      dropdown-icon="expand_more"
    >
      <template v-slot:label>
        <div class="flex justify-between items-center w-full">
          <span>
            {{ selected ? selectedItem : title }}
          </span>
        </div>
      </template>
      <q-list v-if="acceptCancel" :style="{ maxHeight: height, overflowY: 'auto' }">
        <q-item
          v-if="selectMessage"
          :clickable="selected != null"
          v-close-popup
          @click="cancelSelection"
          class="cursor-pointer"
        >
          <q-item-section>
            <q-item-label class="text-blue-400">
              {{ selected == null ? selectMessage : "Annuler la sélection" }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-for="(item, index) in items"
          clickable
          v-close-popup
          @click="onItemClick(item, index)"
        >
          <q-item-section v-if="icons.length" avatar>
            <img class="max-h-6" :src="icons[index]" />
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ keyName ? item[valName] : item }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const emits = defineEmits(["select-item", "cancel-selection"]);

const props = defineProps({
  items: {
    type: Array,
    default: [],
  },
  selected: {
    type: String,
    default: null,
  },
  selectMessage: {
    type: String,
    default: null,
  },
  icons: {
    type: Array,
    default: [],
  },
  title: {
    type: String,
    default: "",
  },
  acceptCancel: {
    type: Boolean,
    default: true,
  },
  capital: {
    type: Boolean,
    default: false,
  },
  keyName: {
    type: String,
    default: null
  },
  valName: {
    type: String,
    default: null
  },
  height: {
    type: String,
    default: 'auto', // Valeur par défaut
  },
})

const selectedItem = computed(() =>
  props.keyName
    ? (props.items.find((i) => i[props.keyName] == props.selected) ? props.items.find((i) => i[props.keyName] == props.selected)[props.valName] : props.title)
    : props.selected
);

let menu = ref(false);

function onItemClick(item, index) {
  emits("select-item", props.keyName ? item[props.keyName] : item);
}
function cancelSelection() {
  emits("cancel-selection");
}
</script>
