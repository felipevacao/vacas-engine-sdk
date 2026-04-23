<template>
  <div class="verona-form-container">
    <div v-if="loading" class="flex justify-center p-8">
      <span>Carregando interface...</span>
    </div>

    <form v-else @submit.prevent="submit" class="space-y-8">
      <div v-for="group in groups" :key="group" class="form-section">
        <h3 class="text-lg font-semibold border-b pb-2 mb-4 text-gray-800">{{ group }}</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="field in getFieldsByGroup(group)" 
            :key="field.name"
            :class="field.display?.width === 'half' ? 'col-span-1' : 'col-span-full'"
          >
            <!-- Renderização Dinâmica -->
            <component
              :is="field.component"
              v-model="formData[field.name]"
              v-bind="getFieldProps(field)"
            />
          </div>
        </div>
      </div>

      <div class="pt-4 flex justify-end">
        <button 
          type="submit" 
          :disabled="submitting"
          class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {{ submitting ? 'Salvando...' : 'Salvar Alterações' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { VeronaVueOrchestrator } from '../orchestrator';

const props = defineProps({
  entity: { type: String, required: true },
  id: { type: [String, Number], default: null }
});

const emit = defineEmits(['success', 'error']);

const orchestrator = new VeronaVueOrchestrator();
const loading = ref(true);
const submitting = ref(false);
const metadata = ref({ fields: [] });
const formData = reactive({});

onMounted(async () => {
  const state = await orchestrator.getVueFormConfig(props.entity, props.id);
  metadata.value = state.metadata;
  
  // Inicializa dados (do banco ou vazio)
  state.metadata.fields.forEach(f => {
    formData[f.name] = state.data ? state.data[f.name] : (f.defaultValue || '');
  });
  
  loading.value = false;
});

const groups = computed(() => {
  const allGroups = metadata.value.fields.map(f => f.display?.group || 'Geral');
  return [...new Set(allGroups)].sort();
});

const getFieldsByGroup = (groupName) => {
  return metadata.value.fields
    .filter(f => (f.display?.group || 'Geral') === groupName)
    .sort((a, b) => (a.display?.order || 0) - (b.display?.order || 0));
};

const getFieldProps = (field) => {
  return {
    label: field.label,
    required: field.required,
    placeholder: field.display?.placeholder,
    helpText: field.display?.helpText,
    type: field.formType,
    mask: field.format?.mask, // Repassa a máscara do backend
    rows: field.config?.rows, // Para textareas
    ...field.props
  };
};

const submit = async () => {
  submitting.value = true;
  try {
    const result = await orchestrator.submitForm(props.entity, formData, props.id);
    emit('success', result);
  } catch (e) {
    emit('error', e);
  } finally {
    submitting.value = false;
  }
};
</script>
