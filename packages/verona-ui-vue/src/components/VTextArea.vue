<template>
  <div class="verona-field">
    <label class="block text-sm font-medium text-gray-700">{{ label }} <span v-if="required" class="text-red-500">*</span></label>
    <textarea
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :rows="rows || 3"
      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
    ></textarea>
    <p v-if="helpText" class="mt-1 text-xs text-gray-500">{{ helpText }}</p>
  </div>
</template>

<script setup>
defineProps(['modelValue', 'label', 'required', 'placeholder', 'helpText', 'rows']);
defineEmits(['update:modelValue']);
</script>
