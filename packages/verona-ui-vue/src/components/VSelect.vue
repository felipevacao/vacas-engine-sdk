<template>
  <div class="verona-field">
    <label class="block text-sm font-medium text-gray-700">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="" disabled>{{ placeholder || 'Selecione uma opção...' }}</option>
      <option 
        v-for="option in options" 
        :key="option.value" 
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    
    <p v-if="helpText" class="mt-1 text-xs text-gray-500">{{ helpText }}</p>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number, Boolean],
  label: String,
  required: Boolean,
  placeholder: String,
  helpText: String,
  options: {
    type: Array,
    default: () => []
  }
});
defineEmits(['update:modelValue']);
</script>
