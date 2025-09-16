<template>
  <div class="bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- Header Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center mb-4">
          <q-icon name="settings" size="2rem" class="text-blue-600 mr-3" />
          <div>
            <h1 class="text-2xl font-bold text-gray-800 mb-1">Gestion des Tickets</h1>
            <p class="text-gray-600 text-sm">Administration des tickets de réclamation</p>
          </div>
        </div>
      </div>

      <!-- Toolbar Section -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div class="flex flex-col sm:flex-row gap-3">
            <q-btn
              icon="add"
              color="blue-6"
              no-caps
              @click="openAddTicket"
              class="px-6"
            >
              Ajouter un ticket
            </q-btn>
            <q-input
              outlined
              dense
              v-model="searchTickets"
              label="Rechercher un ticket"
              class="min-w-[300px]"
            >
              <template #prepend>
                <q-icon name="search" class="text-blue-600" />
              </template>
              <template #append>
                <q-icon
                  name="close"
                  @click="clearSearchTickets"
                  class="cursor-pointer text-gray-500 hover:text-gray-700"
                />
              </template>
            </q-input>
          </div>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <!-- Liste des tickets avec affichage hiérarchisé -->
        <div class="space-y-4">
          <q-expansion-item
            v-for="ticket in filteredTickets"
            :key="ticket.id"
            :label="ticket.libelle"
            :caption="`Direction: ${ticket.direction}`"
            icon="confirmation_number"
            class="bg-white shadow-sm rounded-lg overflow-hidden"
            header-class="bg-blue-50 text-blue-900 font-medium"
          >
            <template #header>
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center space-x-3">
                  <q-icon name="confirmation_number" class="text-blue-600" size="1.5rem" />
                  <div>
                    <div class="font-semibold text-gray-900">{{ ticket.libelle }}</div>
                    <div class="text-sm text-gray-600">Direction: {{ ticket.direction }}</div>
                  </div>
                </div>
                <div class="flex space-x-2">
                  <q-btn
                    icon="delete"
                    size="sm"
                    flat
                    round
                    color="negative"
                    @click.stop="openDeleteTicket(ticket)"
                  >
                    <q-tooltip>Supprimer</q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="edit"
                    size="sm"
                    flat
                    round
                    color="primary"
                    @click.stop="openEditTicket(ticket)"
                  >
                    <q-tooltip>Modifier</q-tooltip>
                  </q-btn>

                  <q-btn
                    icon="rule"
                    size="sm"
                    flat
                    round
                    color="purple-6"
                    @click.stop="openGlobalEdit(ticket)"
                  >
                    <q-tooltip>Modification globale des types et détails</q-tooltip>
                  </q-btn>
                </div>
              </div>
            </template>

            <div class="p-6 bg-gray-50">
              <!-- Document à fournir -->
              <div v-if="ticket.documentAfornir" class="mb-6">
                <h4 class="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <q-icon name="description" class="mr-2 text-gray-500" />
                  Document à fournir
                </h4>
                <div class="bg-white p-3 rounded border text-sm" v-html="ticket.documentAfornir"></div>
              </div>

              <!-- Section Infos générales -->
              <div class="mb-6">
                <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <q-icon name="info" class="mr-2 text-blue-500" />
                  Informations générales
                  <q-badge v-if="ticket.infos_generales?.length" :label="ticket.infos_generales.length" color="blue-6" class="ml-2" />
                </h4>
                <q-list v-if="ticket.infos_generales?.length" bordered separator class="rounded bg-white">
                  <q-item
                    v-for="info in ticket.infos_generales"
                    :key="info.id"
                    class="py-3"
                  >
                    <q-item-section avatar>
                      <q-icon
                        :name="info.key_attribut ? 'star' : 'info_outline'"
                        :color="info.key_attribut ? 'amber-6' : 'blue-grey-5'"
                        size="1.2rem"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label class="font-medium">{{ info.libelle }}</q-item-label>
                      <q-item-label v-if="info.key_attribut" caption class="text-amber-600">
                        <q-icon name="star" size="xs" class="mr-1" />
                        Information clé
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
                <div v-else class="text-center py-4 text-gray-500 bg-white rounded border border-dashed">
                  <q-icon name="info_outline" size="1.5rem" class="mb-2" />
                  <p class="text-sm">Aucune information générale</p>
                </div>
              </div>

              <!-- Section Types -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <q-icon name="category" class="mr-2 text-green-500" />
                  Types
                  <q-badge v-if="ticket.types?.length" :label="ticket.types.length" color="green-6" class="ml-2" />
                </h4>
                <div v-if="ticket.types?.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <q-card
                    v-for="type in ticket.types"
                    :key="type.id"
                    class="bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <q-card-section class="pb-2">
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <h5 class="font-semibold text-gray-900 mb-1">{{ type.libelle }}</h5>
                          <p class="text-sm text-gray-600 mb-2">
                            <q-icon name="business" size="xs" class="mr-1" />
                            {{ type.direction || 'Non spécifiée' }}
                          </p>
                          <q-badge
                            :color="getStatutColor(type.statut_direction)"
                            :label="type.statut_direction || 'Non défini'"
                            class="text-xs"
                          />
                        </div>

                      </div>
                    </q-card-section>

                    <!-- Section Détails du type -->
                    <q-card-section v-if="type.details?.length" class="pt-0">
                      <q-separator class="mb-3" />
                      <h6 class="text-xs font-medium text-gray-600 mb-2 flex items-center">
                        <q-icon name="list" size="xs" class="mr-1" />
                        Détails ({{ type.details.length }})
                      </h6>
                      <q-table
                        :rows="type.details"
                        :columns="detailColumns"
                        row-key="id"
                        flat
                        dense
                        :rows-per-page-options="[0]"
                        hide-pagination
                        class="text-xs"
                      >
                        <template #body-cell-statut_direction="props">
                          <q-td :props="props">
                            <q-badge
                              :color="getStatutColor(props.value)"
                              :label="props.value || 'Non défini'"
                              class="text-xs"
                            />
                          </q-td>
                        </template>
                      </q-table>
                    </q-card-section>
                    <q-card-section v-else class="pt-0">
                      <q-separator class="mb-3" />
                      <div class="text-center py-2 text-gray-400">
                        <q-icon name="list" size="1rem" class="mb-1" />
                        <p class="text-xs">Aucun détail</p>
                      </div>
                    </q-card-section>
                  </q-card>
                </div>
                <div v-else class="text-center py-4 text-gray-500 bg-white rounded border border-dashed">
                  <q-icon name="category" size="1.5rem" class="mb-2" />
                  <p class="text-sm">Aucun type défini</p>
                </div>
              </div>
            </div>
          </q-expansion-item>
        </div>
      </div>

      <!-- Add Ticket Dialog -->
      <q-dialog v-model="addTicket" persistent>
        <q-card class="w-full" style="min-width: 60vw; max-width: 80vw; max-height: 80vh; display: flex; flex-direction: column;">
          <q-card-section class="flex items-center bg-blue-50">
            <q-icon name="add" class="text-blue-600 mr-3" size="2rem" />
            <div>
              <div class="text-xl font-semibold text-blue-900">Ajouter un ticket</div>
              <div class="text-sm text-blue-700">Remplissez les informations du ticket</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-lg overflow-auto" style="flex: 1;">
              <form class="space-y-6">
                <div class="grid grid-cols-1 gap-6">
                  <!-- Formulaire ticket existant -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Libellé du ticket <span class="text-red-500">*</span>
                    </label>
                    <q-input
                      v-model="form.libelle"
                      outlined
                      dense
                      placeholder="Entrez le libellé du ticket"
                      :rules="[val => !!val || 'Le libellé est requis']"
                    >
                      <template #prepend>
                        <q-icon name="label" class="text-blue-600" />
                      </template>
                    </q-input>
                    <ErrorValidation v-if="myerrors?.libelle" :myerrors="myerrors?.libelle" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Direction <span class="text-red-500">*</span>
                    </label>
                    <q-select
                      v-model="form.direction"
                      :options="directions"
                      option-value="DIRECTION"
                      option-label="DIRECTION"
                      emit-value
                      map-options
                      outlined
                      dense
                      placeholder="Sélectionnez une direction"
                      :rules="[val => !!val || 'La direction est requise']"
                    >
                      <template #prepend>
                        <q-icon name="business" class="text-blue-600" />
                      </template>
                    </q-select>
                    <ErrorValidation v-if="myerrors?.direction" :myerrors="myerrors?.direction" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Document à fournir
                    </label>
                    <q-editor
                      v-model="form.documentAfornir"
                      min-height="5rem"
                      :toolbar="[
                        ['bold', 'italic', 'underline'],
                        ['unordered', 'ordered'],
                        ['undo', 'redo']
                      ]"
                    />
                    <ErrorValidation v-if="myerrors?.documentAfornir" :myerrors="myerrors?.documentAfornir" />
                  </div>

                  <!-- Nouvelle section : Infos générales -->
                  <div class="border-t pt-6">
                    <div class="flex items-center justify-between mb-4">
                      <label class="block text-sm font-medium text-gray-700">
                        Infos générales
                      </label>
                      <q-btn
                        icon="add"
                        color="green-6"
                        size="sm"
                        outline
                        @click="addInfoGenerale"
                        class="px-4"
                      >
                        Ajouter une info générale
                      </q-btn>
                    </div>

                    <!-- Liste des infos générales avec drag & drop -->
                    <draggable
                      v-if="form.infos_generales.length > 0"
                      v-model="form.infos_generales"
                      item-key="id"
                      class="space-y-3"
                      ghost-class="ghost"
                      chosen-class="chosen"
                      drag-class="drag"
                      handle=".drag-handle"
                    >
                      <template #item="{ element: info, index }">
                        <div class="row items-center justify-between space-x-4">
                          <!-- Zone draggable à gauche -->
                          <div class="flex-1 border border-gray-200 rounded-lg p-4 bg-gray-50 hover:shadow-md transition-shadow">
                            <div class="flex items-start space-x-3">
                              <!-- Handle de drag explicite -->
                              <div class="flex items-center mt-2 drag-handle cursor-move">
                                <q-icon name="drag_indicator" class="text-gray-400" size="sm" />
                              </div>

                              <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- Libellé -->
                                <div>
                                  <label class="block text-xs font-medium text-gray-600 mb-1">
                                    Libellé
                                  </label>
                                  <q-input
                                    v-model="info.libelle"
                                    outlined
                                    dense
                                    placeholder="Entrez le libellé"
                                  >
                                    <template #prepend>
                                      <q-icon name="text_fields" class="text-gray-500" size="sm" />
                                    </template>
                                  </q-input>
                                </div>

                                <!-- Key attribut -->
                                <div class="flex items-center">
                                    <q-checkbox
                                          v-model="info.key_attribut"
                                          color="blue-6"
                                          label="Information clé"
                                          class="text-xs font-medium text-gray-600"
                                    />
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Bouton supprimer à droite (en dehors de la zone draggable) -->
                          <div class="flex-shrink-0">
                            <q-btn
                              icon="delete"
                              size="sm"
                              flat
                              round
                              color="negative"
                              @click.stop="removeInfoGenerale(info.id)"
                              @mousedown.prevent
                              class="mt-1"
                            >
                              <q-tooltip>Supprimer cette info générale</q-tooltip>
                            </q-btn>
                          </div>
                        </div>
                      </template>
                    </draggable>

                    <!-- Message si aucune info générale -->
                    <div v-else class="text-center py-4 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                      <q-icon name="info" size="1.5rem" class="mb-2" />
                      <p class="text-sm">Aucune info générale ajoutée</p>
                    </div>
                  </div>
                </div>
              </form>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-md bg-white">
            <q-btn
              flat
              label="Annuler"
              color="grey"
              @click="closeAddTicket"
              class="px-6"
            />
            <q-btn
              label="Enregistrer"
              color="blue-6"
              @click="sendData"
              :loading="loading"
              :disable="!isFormValid || loading"
              class="px-6"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Edit Ticket Dialog -->
      <q-dialog v-model="editTicket" persistent>
        <q-card class="w-full" style="min-width: 60vw; max-width: 80vw; max-height: 80vh; display: flex; flex-direction: column;">
          <q-card-section class="flex items-center bg-orange-50">
            <q-icon name="edit" class="text-orange-600 mr-3" size="2rem" />
            <div>
              <div class="text-xl font-semibold text-orange-900">Modifier le ticket</div>
              <div class="text-sm text-orange-700">Modifiez les informations du ticket</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-lg overflow-auto" style="flex: 1;">
              <form class="space-y-6">
                <div class="grid grid-cols-1 gap-6">
                  <!-- Formulaire ticket existant -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Libellé du ticket <span class="text-red-500">*</span>
                    </label>
                    <q-input
                      v-model="form.libelle"
                      outlined
                      dense
                      placeholder="Entrez le libellé du ticket"
                      :rules="[val => !!val || 'Le libellé est requis']"
                    >
                      <template #prepend>
                        <q-icon name="label" class="text-orange-600" />
                      </template>
                    </q-input>
                    <ErrorValidation v-if="myerrors?.libelle" :myerrors="myerrors?.libelle" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Direction <span class="text-red-500">*</span>
                    </label>
                    <q-select
                      v-model="form.direction"
                      :options="directions"
                      option-value="DIRECTION"
                      option-label="DIRECTION"
                      emit-value
                      map-options
                      outlined
                      dense
                      placeholder="Sélectionnez une direction"
                      :rules="[val => !!val || 'La direction est requise']"
                    >
                      <template #prepend>
                        <q-icon name="business" class="text-orange-600" />
                      </template>
                    </q-select>
                    <ErrorValidation v-if="myerrors?.direction" :myerrors="myerrors?.direction" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Document à fournir
                    </label>
                    <q-editor
                      v-model="form.documentAfornir"
                      min-height="5rem"
                      :toolbar="[
                        ['bold', 'italic', 'underline'],
                        ['unordered', 'ordered'],
                        ['undo', 'redo']
                      ]"
                    />
                    <ErrorValidation v-if="myerrors?.documentAfornir" :myerrors="myerrors?.documentAfornir" />
                  </div>

                  <!-- Section Infos générales -->
                  <div>
                    <div class="flex items-center justify-between mb-4">
                      <label class="block text-sm font-medium text-gray-700">
                        Informations générales
                      </label>
                      <q-btn
                        icon="add"
                        label="Ajouter une info"
                        color="orange-6"
                        size="sm"
                        @click="addInfoGenerale"
                        class="px-4"
                      />
                    </div>

                    <div class="space-y-3">
                      <!-- Liste des infos générales avec drag & drop -->
                      <draggable
                        v-if="form.infos_generales.length > 0"
                        v-model="form.infos_generales"
                        item-key="id"
                        handle=".drag-handle"
                        class="space-y-3"
                      >
                        <template #item="{ element: info }">
                          <div class="flex items-start space-x-3 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                            <!-- Handle de drag -->
                            <div class="drag-handle cursor-move flex-shrink-0 mt-2">
                              <q-icon name="drag_indicator" class="text-gray-400" size="sm" />
                            </div>

                            <!-- Contenu de l'info générale -->
                            <div class="flex-1 space-y-3">
                              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <!-- Libellé -->
                                <div>
                                  <label class="block text-xs font-medium text-gray-600 mb-1">
                                    Libellé <span class="text-red-500">*</span>
                                  </label>
                                  <q-input
                                    v-model="info.libelle"
                                    outlined
                                    dense
                                    placeholder="Entrez le libellé"
                                  >
                                    <template #prepend>
                                      <q-icon name="text_fields" class="text-gray-500" size="sm" />
                                    </template>
                                  </q-input>
                                </div>

                                <!-- Key attribut -->
                                <div class="flex items-center">
                                    <q-checkbox
                                          v-model="info.key_attribut"
                                          color="orange-6"
                                          label="Information clé"
                                          class="text-xs font-medium text-gray-600"
                                    />
                                </div>
                              </div>
                            </div>

                            <!-- Bouton supprimer à droite (en dehors de la zone draggable) -->
                            <div class="flex-shrink-0">
                              <q-btn
                                icon="delete"
                                size="sm"
                                flat
                                round
                                color="negative"
                                @click.stop="removeInfoGenerale(info.id)"
                                @mousedown.prevent
                                class="mt-1"
                              >
                                <q-tooltip>Supprimer cette info générale</q-tooltip>
                              </q-btn>
                            </div>
                          </div>
                        </template>
                      </draggable>

                      <!-- Message si aucune info générale -->
                      <div v-else class="text-center py-4 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                        <q-icon name="info" size="1.5rem" class="mb-2" />
                        <p class="text-sm">Aucune info générale ajoutée</p>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-md bg-white">
            <q-btn
              flat
              label="Annuler"
              color="grey"
              @click="closeEditTicket"
              class="px-6"
            />
            <q-btn
              label="Modifier"
              color="orange-6"
              @click="updateData"
              :loading="loading"
              :disable="!isFormValid || loading"
              class="px-6"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!-- Delete Ticket Dialog -->
      <q-dialog v-model="deleteTicket" persistent>
        <q-card class="w-full max-w-lg" style="display: flex; flex-direction: column;">
          <q-card-section class="flex items-center bg-red-50">
            <q-icon name="warning" class="text-red-600 mr-3" size="2.5rem" />
            <div>
              <div class="text-xl font-semibold text-red-900">Confirmer la suppression</div>
              <div class="text-sm text-red-700">Cette action est irréversible</div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-pa-lg" style="flex: 1;">
            <div class="space-y-4">
              <p class="text-gray-700 font-medium">
                Êtes-vous sûr de vouloir supprimer le ticket suivant ?
              </p>

              <div class="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
                <div class="flex items-start space-x-3">
                  <q-icon name="confirmation_number" class="text-red-500 mt-1" size="1.2rem" />
                  <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">{{ selectedTicket?.libelle }}</h4>
                    <p class="text-sm text-gray-600 mt-1">
                      <q-icon name="business" size="xs" class="mr-1" />
                      Direction: {{ selectedTicket?.direction }}
                    </p>
                    <div class="mt-2 text-xs text-gray-500">
                      <div v-if="selectedTicket?.infos_generales?.length">
                        <q-icon name="info" size="xs" class="mr-1" />
                        {{ selectedTicket.infos_generales.length }} information(s) générale(s)
                      </div>
                      <div v-if="selectedTicket?.types?.length">
                        <q-icon name="category" size="xs" class="mr-1" />
                        {{ selectedTicket.types.length }} type(s) avec leurs détails
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-amber-50 p-3 rounded border border-amber-200">
                <div class="flex items-start space-x-2">
                  <q-icon name="info" class="text-amber-600 mt-0.5" size="1rem" />
                  <div class="text-sm text-amber-800">
                    <strong>Attention :</strong> La suppression de ce ticket entraînera également la suppression de toutes ses informations générales, types et détails associés.
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right" class="q-pa-md bg-white">
            <q-btn
              flat
              label="Annuler"
              color="grey"
              @click="closeDeleteTicket"
              class="px-6"
              :disable="loading"
            />
            <q-btn
              label="Supprimer définitivement"
              color="negative"
              @click="deleteData"
              :loading="loading"
              class="px-6"
              icon="delete_forever"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
  </div>


  <!-- Global Edit Dialog -->
  <q-dialog v-model="globalEditDialog" persistent>
    <q-card class="w-full" style="min-width: 80vw; max-width: 90vw; max-height: 90vh; display: flex; flex-direction: column;">
      <q-card-section class="flex items-center bg-purple-50">
        <q-icon name="rule" class="text-purple-600 mr-3" size="2rem" />
        <div>
          <div class="text-xl font-semibold text-purple-900">Modification globale des Types et Détails</div>
          <div class="text-sm text-purple-700">Ticket: {{ selectedTicket?.libelle }}</div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-lg overflow-auto" style="flex: 1;">
        <div class="space-y-3">
          <!-- Types Section -->
          <div v-if="globalEditForm.types.length > 0">
            <draggable
              v-model="globalEditForm.types"
              group="types"
              @start="onDragStart"
              @end="onDragEnd"
              item-key="id"
              handle=".type-drag-handle"
              ghost-class="drag-ghost"
              chosen-class="drag-chosen"
              drag-class="drag-active"
              class="space-y-2"
            >
              <template #item="{ element: type, index: typeIndex }">
                <q-expansion-item
                  :model-value="type.expanded || false"
                  @update:model-value="(val) => type.expanded = val"
                  :class="{
                    'drag-item-dragging': type.isDragging,
                    'border-l-4 border-purple-500': true
                  }"
                  class="bg-white shadow-sm rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <!-- En-tête compact du type -->
                  <template #header>
                    <div class="flex items-center w-full py-2 px-1">
                      <!-- Handle de drag -->
                      <div class="type-drag-handle cursor-move flex-shrink-0 mr-3 p-1 rounded hover:bg-gray-100 transition-colors">
                        <q-icon name="drag_indicator" class="text-gray-400" size="sm" />
                      </div>

                      <!-- Informations du type -->
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center space-x-3">
                          <div class="flex-1 min-w-0">
                            <div class="text-sm font-medium text-gray-900 truncate">
                              {{ type.libelle || `Type ${typeIndex + 1}` }}
                            </div>
                            <div class="text-xs text-gray-500 flex items-center space-x-2">
                              <span v-if="type.direction" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {{ type.direction }}
                              </span>
                              <span v-if="type.statut_direction" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {{ type.statut_direction }}
                              </span>
                              <span class="text-gray-400">{{ type.details?.length || 0 }} détail(s)</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Actions -->
                      <div class="flex items-center space-x-1 ml-3">
                        <q-btn
                          icon="add"
                          size="xs"
                          flat
                          round
                          color="green-6"
                          @click.stop="addDetail(typeIndex)"
                          class="hover:bg-green-50"
                        >
                          <q-tooltip>Ajouter un détail</q-tooltip>
                        </q-btn>
                        <q-btn
                          icon="delete"
                          size="xs"
                          flat
                          round
                          color="negative"
                          @click.stop="removeType(typeIndex)"
                          class="hover:bg-red-50"
                        >
                          <q-tooltip>Supprimer ce type</q-tooltip>
                        </q-btn>
                      </div>
                    </div>
                  </template>

                  <!-- Contenu détaillé du type (dans l'accordéon) -->
                  <div class="px-4 pb-4">
                    <!-- Formulaire du type -->
                    <div class="bg-gray-50 p-4 rounded-lg mb-4">
                      <h6 class="text-sm font-medium text-gray-700 mb-3">Configuration du type</h6>
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label class="block text-xs font-medium text-gray-600 mb-1">
                            Libellé du type <span class="text-red-500">*</span>
                          </label>
                          <q-input
                            v-model="type.libelle"
                            outlined
                            dense
                            placeholder="Entrez le libellé du type"
                            class="bg-white"
                          />
                        </div>
                        <div>
                          <label class="block text-xs font-medium text-gray-600 mb-1">
                            Direction
                          </label>
                          <q-select
                            v-model="type.direction"
                            :options="directions"
                            option-value="DIRECTION"
                            option-label="DIRECTION"
                            emit-value
                            map-options
                            outlined
                            dense
                            clearable
                            placeholder="Sélectionnez une direction"
                            class="bg-white"
                          >
                            <template #prepend>
                              <q-icon name="business" class="text-purple-600" size="xs" />
                            </template>
                          </q-select>
                        </div>
                        <div v-if="type.direction">
                          <label class="block text-xs font-medium text-gray-600 mb-1">
                            Statut Direction <span class="text-red-500">*</span>
                          </label>
                          <q-select
                            v-model="type.statut_direction"
                            :options="['consultation', 'traitement']"
                            outlined
                            dense
                            placeholder="Sélectionnez un statut"
                            class="bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Section des détails -->
                    <div>
                      <div class="flex items-center justify-between mb-3">
                        <h6 class="text-sm font-medium text-gray-700">Détails du type</h6>
                        <q-btn
                          icon="add"
                          label="Ajouter un détail"
                          size="sm"
                          outline
                          color="green-6"
                          @click="addDetail(typeIndex)"
                          class="text-xs"
                        />
                      </div>

                      <!-- Liste des détails avec drag & drop -->
                      <draggable
                        v-if="type.details && type.details.length > 0"
                        v-model="type.details"
                        group="details"
                        @start="onDetailDragStart"
                        @end="onDetailDragEnd"
                        item-key="id"
                        handle=".detail-drag-handle"
                        ghost-class="drag-ghost"
                        chosen-class="drag-chosen"
                        drag-class="drag-active"
                        class="space-y-2"
                      >
                        <template #item="{ element: detail, index: detailIndex }">
                          <q-item
                            :class="{
                              'drag-item-dragging': detail.isDragging,
                              'bg-white': true
                            }"
                            class="border border-gray-200 rounded-lg transition-all duration-200 hover:shadow-sm"
                          >
                            <q-item-section side class="pr-3">
                              <div class="detail-drag-handle cursor-move p-1 rounded hover:bg-gray-100 transition-colors">
                                <q-icon name="drag_indicator" class="text-gray-400" size="xs" />
                              </div>
                            </q-item-section>

                            <q-item-section>
                              <div class="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                                <div>
                                  <q-input
                                    v-model="detail.libelle"
                                    outlined
                                    dense
                                    placeholder="Libellé du détail"
                                    class="text-sm"
                                  >
                                    <template #before>
                                      <span class="text-xs text-gray-500 mr-2">Libellé:</span>
                                    </template>
                                  </q-input>
                                </div>
                                <div>
                                  <q-select
                                    v-model="detail.direction"
                                    :options="directions"
                                    option-value="DIRECTION"
                                    option-label="DIRECTION"
                                    emit-value
                                    map-options
                                    outlined
                                    dense
                                    clearable
                                    placeholder="Direction"
                                    class="text-sm"
                                  >
                                    <template #before>
                                      <span class="text-xs text-gray-500 mr-2">Direction:</span>
                                    </template>
                                    <template #prepend>
                                      <q-icon name="business" class="text-purple-600" size="xs" />
                                    </template>
                                  </q-select>
                                </div>
                                <div v-if="detail.direction">
                                  <q-select
                                    v-model="detail.statut_direction"
                                    :options="['consultation', 'traitement']"
                                    outlined
                                    dense
                                    placeholder="Statut"
                                    class="text-sm"
                                  >
                                    <template #before>
                                      <span class="text-xs text-gray-500 mr-2">Statut:</span>
                                    </template>
                                  </q-select>
                                </div>
                                <div class="flex justify-end">
                                  <q-btn
                                    icon="delete"
                                    size="xs"
                                    flat
                                    round
                                    color="negative"
                                    @click="removeDetail(typeIndex, detailIndex)"
                                    class="hover:bg-red-50"
                                  >
                                    <q-tooltip>Supprimer ce détail</q-tooltip>
                                  </q-btn>
                                </div>
                              </div>
                            </q-item-section>
                          </q-item>
                        </template>
                      </draggable>

                      <!-- Message si aucun détail -->
                      <div v-else class="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <q-icon name="list" size="1.5rem" class="mb-2" />
                        <p class="text-sm">Aucun détail pour ce type</p>
                        <p class="text-xs text-gray-400">Cliquez sur "Ajouter un détail" pour commencer</p>
                      </div>
                    </div>
                  </div>
                </q-expansion-item>
              </template>
            </draggable>
          </div>

          <!-- Add Type Button -->
          <div class="text-center">
            <q-btn
              icon="add"
              label="Ajouter un Type"
              color="purple-6"
              outline
              @click="addType"
              class="px-6"
            />
          </div>

          <div v-if="globalEditForm.types.length === 0" class="text-center py-8 text-gray-500">
            <q-icon name="category" size="3rem" class="mb-4" />
            <p class="text-lg">Aucun type défini</p>
            <p class="text-sm">Cliquez sur "Ajouter un Type" pour commencer</p>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md bg-white">
        <q-btn
          flat
          label="Annuler"
          color="grey"
          @click="closeGlobalEdit"
          class="px-6"
        />
        <q-btn
          label="Modifier"
          color="purple-6"
          @click="saveGlobalEdit"
          :loading="loading"
          :disable="!isGlobalEditFormValid || loading"
          class="px-6"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import ErrorValidation from 'src/components/ErrorValidation.vue';

import draggable from 'vuedraggable';

// Reactive variables
const tickets = ref([]);
const directions = ref([]);
const searchTickets = ref('');
const addTicket = ref(false);
const editTicket = ref(false);
const deleteTicket = ref(false);

const selectedTicket = ref(null);
const selectedType = ref(null);
const loading = ref(false);
const loadingTickets = ref(false);
const myerrors = ref();
const message = ref();

// Global Edit Dialog variables
const globalEditDialog = ref(false);
const drag = ref(false);
const detailDrag = ref(false);
const globalEditForm = ref({
  types: []
});
const savingOrder = ref(false);

// Form data
const form = ref({
  libelle: '',
  direction: '',
  documentAfornir: '',
  infos_generales: []
});

// Validation du formulaire
const isFormValid = computed(() => {
  // Vérifier les champs obligatoires du ticket
  if (!form.value.libelle || !form.value.direction) {
    return false;
  }

  // Si des infos générales sont ajoutées, vérifier que chaque libellé est rempli
  for (const info of form.value.infos_generales) {
    if (!info.libelle) {
      return false;
    }
  }

  return true;
});

// Global Edit Form Validation
const isGlobalEditFormValid = computed(() => {
  // Vérifier qu'il y a au moins un type
  if (globalEditForm.value.types.length === 0) {
    return false;
  }

  // Vérifier chaque type
  for (const type of globalEditForm.value.types) {
    // Libellé obligatoire
    if (!type.libelle) {
      return false;
    }

    // Si direction définie, statut_direction obligatoire
    if (type.direction && !type.statut_direction) {
      return false;
    }

    // Vérifier chaque détail
    for (const detail of type.details) {
      // Libellé obligatoire
      if (!detail.libelle) {
        return false;
      }

      // Si direction définie, statut_direction obligatoire
      if (detail.direction && !detail.statut_direction) {
        return false;
      }
    }
  }

  return true;
});

// Table configuration
const showTicketsTable = computed(() => tickets.value.length > 0);

const ticketsCols = ref([
  {
    name: 'Actions',
    label: 'Actions',
    field: 'Actions',
    align: 'center',
    sortable: false,
  },
  {
    name: 'libelle',
    required: true,
    label: 'Libellé',
    align: 'left',
    field: row => row.libelle,
    format: val => `${val}`,
    sortable: true,
  },
  {
    name: 'direction',
    label: 'Direction',
    align: 'left',
    field: row => row.direction,
    format: val => `${val}`,
    sortable: true,
  },
  {
    name: 'documentAfornir',
    label: 'Document à fournir',
    align: 'left',
    field: row => row.documentAfornir,
    format: val => `${val}`,
    sortable: true,
  },
]);

const initialPagination = ref({
  rowsPerPage: 10
});

const $q = useQuasar();

// Methods
const fetchData = async () => {
  loadingTickets.value = true;
  try {
    const response = await api.get('/api/rec/parametrage');
    tickets.value = response.data.tickets || [];
    directions.value = response.data.directions || [];
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    $q.notify({
      type: 'negative',
      message: 'Erreur lors du chargement des données'
    });
  } finally {
    loadingTickets.value = false;
  }
};

const openAddTicket = () => {
  form.value = {
    libelle: '',
    direction: '',
    documentAfornir: '',
    infos_generales: []
  };
  myerrors.value = null;
  addTicket.value = true;
};

const closeAddTicket = () => {
  addTicket.value = false;
  form.value = {
    libelle: '',
    direction: '',
    documentAfornir: '',
    infos_generales: []
  };
  myerrors.value = null;
};

const openDeleteTicket = (ticket) => {
  selectedTicket.value = ticket;
  deleteTicket.value = true;
};

const closeDeleteTicket = () => {
  deleteTicket.value = false;
  selectedTicket.value = null;
};

const openEditTicket = (ticket) => {
  selectedTicket.value = ticket;
  // Pré-remplir le formulaire avec les données du ticket
  form.value = {
    libelle: ticket.libelle,
    direction: ticket.direction,
    documentAfornir: ticket.documentAfornir || '',
    infos_generales: ticket.infos_generales.map(info => ({
      id: info.id || Date.now() + Math.random(),
      libelle: info.libelle,
      key_attribut: info.key_attribut
    }))
  };
  myerrors.value = null;
  editTicket.value = true;
};

const closeEditTicket = () => {
  editTicket.value = false;
  selectedTicket.value = null;
  form.value = {
    libelle: '',
    direction: '',
    documentAfornir: '',
    infos_generales: []
  };
  myerrors.value = null;
};

const clearSearchTickets = () => {
  searchTickets.value = '';
};

const sendData = async () => {
  loading.value = true;
  myerrors.value = null;

  const data = {
    libelle: form.value.libelle,
    direction: form.value.direction,
    documentAfornir: form.value.documentAfornir,
    infos_generales: form.value.infos_generales
  };

  try {
    const response = await api.post('/api/rec/parametrage', data);
    message.value = response.data.message;
    $q.notify({
      type: 'positive',
      message: message.value
    });
    closeAddTicket();
    await fetchData(); // Refresh the list
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    if (error.response && error.response.status === 422) {
      myerrors.value = error.response.data.errors;
    } else {
      $q.notify({
        type: 'negative',
        message: 'Erreur lors de l\'enregistrement du ticket'
      });
    }
  } finally {
    loading.value = false;
  }
};

const updateData = async () => {
  if (!selectedTicket.value) {
    $q.notify({
      type: 'negative',
      message: 'Aucun ticket sélectionné pour la modification'
    });
    return;
  }

  loading.value = true;
  myerrors.value = null;

  const data = {
    libelle: form.value.libelle,
    direction: form.value.direction,
    documentAfornir: form.value.documentAfornir,
    infos_generales: form.value.infos_generales.map(info => ({
      libelle: info.libelle,
      key_attribut: info.key_attribut
    }))
  };

  try {
    const response = await api.put(`/api/rec/parametrage/${selectedTicket.value.id}`, data);
    message.value = response.data.message;
    $q.notify({
      type: 'positive',
      message: message.value || 'Ticket modifié avec succès'
    });
    closeEditTicket();
    await fetchData(); // Refresh the list
  } catch (error) {
    console.error('Erreur lors de la modification:', error);
    if (error.response && error.response.status === 422) {
      myerrors.value = error.response.data.errors;
    } else {
      $q.notify({
        type: 'negative',
        message: 'Erreur lors de la modification du ticket'
      });
    }
  } finally {
    loading.value = false;
  }
};

// Méthodes pour la gestion des infos générales
const addInfoGenerale = () => {
  form.value.infos_generales.push({
    id: Date.now() + Math.random(), // ID unique pour vuedraggable
    libelle: '',
    key_attribut: false
  });
};

const removeInfoGenerale = (id) => {
  const index = form.value.infos_generales.findIndex(info => info.id === id);
  if (index !== -1) {
    form.value.infos_generales.splice(index, 1);
  }
};

const deleteData = async () => {
  if (!selectedTicket.value) {
    $q.notify({
      type: 'negative',
      message: 'Aucun ticket sélectionné pour la suppression'
    });
    return;
  }

  loading.value = true;

  try {
    const response = await api.delete(`/api/rec/parametrage/${selectedTicket.value.id}`);

    // Message de succès personnalisé
    const successMessage = response.data.message || `Ticket "${selectedTicket.value.libelle}" supprimé avec succès`;

    $q.notify({
      type: 'positive',
      message: successMessage,
      icon: 'check_circle',
      position: 'top',
      timeout: 3000
    });

    closeDeleteTicket();
    await fetchData(); // Refresh the list

  } catch (error) {
    console.error('Erreur lors de la suppression:', error);

    let errorMessage = 'Erreur lors de la suppression du ticket';

    if (error.response) {
      switch (error.response.status) {
        case 404:
          errorMessage = 'Le ticket à supprimer n\'existe plus';
          break;
        case 403:
          errorMessage = 'Vous n\'avez pas les droits pour supprimer ce ticket';
          break;
        case 500:
          errorMessage = error.response.data.message || 'Erreur serveur lors de la suppression';
          break;
        default:
          errorMessage = error.response.data.message || errorMessage;
      }
    } else if (error.request) {
      errorMessage = 'Impossible de contacter le serveur';
    }

    $q.notify({
      type: 'negative',
      message: errorMessage,
      icon: 'error',
      position: 'top',
      timeout: 5000
    });
  } finally {
    loading.value = false;
  }
};

// Computed property for filtered tickets
const filteredTickets = computed(() => {
  if (!searchTickets.value) {
    return tickets.value;
  }
  const needle = searchTickets.value.toLowerCase();
  return tickets.value.filter(ticket =>
    ticket.libelle?.toLowerCase().includes(needle) ||
    ticket.direction?.toLowerCase().includes(needle)
  );
});



// Méthode pour obtenir la couleur du statut
const getStatutColor = (statut) => {
  switch (statut) {
    case 'traitement':
      return 'green-6';
    case 'consultation':
      return 'blue-6';
    case 'Actif':
      return 'green-6';
    case 'Inactif':
      return 'red-6';
    case 'En attente':
      return 'orange-6';
    default:
      return 'grey-6';
  }
};

// Colonnes pour les détails des types
const detailColumns = ref([
  {
    name: 'libelle',
    label: 'Libellé',
    field: 'libelle',
    align: 'left',
    sortable: true
  },
  {
    name: 'direction',
    label: 'Direction',
    field: 'direction',
    align: 'left',
    sortable: true
  },
  {
    name: 'statut_direction',
    label: 'Statut',
    field: 'statut_direction',
    align: 'center',
    sortable: true
  }
]);

// Watch for search changes
watch(searchTickets, () => {
  // Update table data when search changes
  // This could be implemented with a computed property or by updating the table directly
});

// Global Edit Methods
const openGlobalEdit = (ticket) => {
  selectedTicket.value = ticket;

  // Préparer le formulaire avec les types existants du ticket
  globalEditForm.value.types = ticket.types ? ticket.types.map(type => ({
    id: type.id || Date.now() + Math.random(),
    libelle: type.libelle || '',
    direction: type.direction || null,
    statut_direction: type.statut_direction || null,
    expanded: false, // Accordéons fermés par défaut
    isDragging: false, // État de drag
    details: type.details ? type.details.map(detail => ({
      id: detail.id || Date.now() + Math.random(),
      libelle: detail.libelle || '',
      direction: detail.direction || null,
      statut_direction: detail.statut_direction || null,
      isDragging: false // État de drag pour les détails
    })) : []
  })) : [];

  globalEditDialog.value = true;
};

const closeGlobalEdit = () => {
  globalEditDialog.value = false;
  selectedTicket.value = null;
  globalEditForm.value.types = [];
  myerrors.value = null;
};

const addType = () => {
  globalEditForm.value.types.push({
    id: Date.now() + Math.random(),
    libelle: '',
    direction: null,
    statut_direction: null,
    expanded: true, // Nouveau type ouvert par défaut
    isDragging: false,
    details: []
  });
};

const removeType = (typeIndex) => {
  globalEditForm.value.types.splice(typeIndex, 1);
};

const addDetail = (typeIndex) => {
  // S'assurer que le type est ouvert quand on ajoute un détail
  globalEditForm.value.types[typeIndex].expanded = true;

  globalEditForm.value.types[typeIndex].details.push({
    id: Date.now() + Math.random(),
    libelle: '',
    direction: null,
    statut_direction: null,
    isDragging: false
  });
};

const removeDetail = (typeIndex, detailIndex) => {
  globalEditForm.value.types[typeIndex].details.splice(detailIndex, 1);
};

// Drag & Drop event handlers
const onDragStart = (evt) => {
  drag.value = true;
  const typeIndex = evt.oldIndex;
  if (globalEditForm.value.types[typeIndex]) {
    globalEditForm.value.types[typeIndex].isDragging = true;
  }
};

const onDragEnd = (evt) => {
  drag.value = false;
  // Reset dragging state for all types
  globalEditForm.value.types.forEach(type => {
    type.isDragging = false;
  });
};

const onDetailDragStart = (evt) => {
  detailDrag.value = true;
  // Find the parent type and detail being dragged
  const detailElement = evt.item;
  const typeElement = detailElement.closest('.q-expansion-item');
  if (typeElement) {
    const typeIndex = Array.from(typeElement.parentNode.children).indexOf(typeElement);
    const detailIndex = evt.oldIndex;
    if (globalEditForm.value.types[typeIndex]?.details[detailIndex]) {
      globalEditForm.value.types[typeIndex].details[detailIndex].isDragging = true;
    }
  }
};

const onDetailDragEnd = (evt) => {
  detailDrag.value = false;
  // Reset dragging state for all details
  globalEditForm.value.types.forEach(type => {
    if (type.details) {
      type.details.forEach(detail => {
        detail.isDragging = false;
      });
    }
  });
};

const saveGlobalEdit = async () => {
  loading.value = true;
  myerrors.value = null;

  const data = {
    types: globalEditForm.value.types.map(type => ({
      libelle: type.libelle,
      direction: type.direction,
      statut_direction: type.statut_direction,
      details: type.details.map(detail => ({
        libelle: detail.libelle,
        direction: detail.direction,
        statut_direction: detail.statut_direction
      }))
    }))
  };

  try {
    const response = await api.put(`/api/rec/type/global/${selectedTicket.value.id}`, data);
    message.value = response.data.message || 'Types et détails modifiés avec succès';
    $q.notify({
      type: 'positive',
      message: message.value
    });
    closeGlobalEdit();
    await fetchData(); // Refresh the list
  } catch (error) {
    console.error('Erreur lors de la modification globale:', error);
    if (error.response && error.response.status === 422) {
      myerrors.value = error.response.data.errors;
    } else {
      $q.notify({
        type: 'negative',
        message: 'Erreur lors de la modification des types et détails'
      });
    }
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchData();
});
</script>

<style scoped>
/* Add any custom styles here */

/* Styles améliorés pour le drag & drop */
.drag-ghost {
  opacity: 0.6;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: 2px dashed #2196f3;
  border-radius: 8px;
  transform: rotate(2deg);
  box-shadow: 0 8px 25px rgba(33, 150, 243, 0.3);
}

.drag-chosen {
  transform: scale(1.02) rotate(1deg);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  border: 2px solid #2196f3;
}

.drag-active {
  opacity: 0.9;
  transform: rotate(3deg);
  cursor: grabbing !important;
}

.drag-item-dragging {
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%) !important;
  border-color: #9c27b0 !important;
  box-shadow: 0 4px 12px rgba(156, 39, 176, 0.3) !important;
}

/* Handles de drag améliorés */
.type-drag-handle:hover {
  background-color: #f5f5f5 !important;
  transform: scale(1.1);
}

.detail-drag-handle:hover {
  background-color: #f5f5f5 !important;
  transform: scale(1.1);
}

.type-drag-handle:active,
.detail-drag-handle:active {
  cursor: grabbing !important;
}

/* Transitions fluides */
.q-expansion-item {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.q-expansion-item:hover {
  transform: translateY(-1px);
}

.q-item {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.q-item:hover {
  transform: translateX(2px);
}

/* Amélioration des badges de statut */
.bg-blue-100 {
  background-color: #dbeafe;
}

.text-blue-800 {
  color: #1e40af;
}

.bg-green-100 {
  background-color: #dcfce7;
}

.text-green-800 {
  color: #166534;
}

/* Curseurs personnalisés */
.cursor-move {
  cursor: grab;
}

.cursor-move:active {
  cursor: grabbing;
}

/* Amélioration des boutons d'action */
.hover\:bg-green-50:hover {
  background-color: #f0fdf4;
}

.hover\:bg-red-50:hover {
  background-color: #fef2f2;
}

.hover\:bg-gray-100:hover {
  background-color: #f3f4f6;
}

/* Animation pour les accordéons */
.q-expansion-item__content {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design amélioré */
@media (max-width: 768px) {
  .grid-cols-4 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .space-x-3 > * + * {
    margin-left: 0;
    margin-top: 0.75rem;
  }
}
</style>
