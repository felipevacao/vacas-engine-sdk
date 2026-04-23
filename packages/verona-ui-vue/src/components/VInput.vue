<template>
  <div class="verona-field">
    <label class="block text-sm font-medium text-gray-700">{{ label }} <span v-if="required" class="text-red-500">*</span></label>
    <input
      :type="type"
      v-maska
      :data-maska="mask"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
    />
    <p v-if="helpText" class="mt-1 text-xs text-gray-500">{{ helpText }}</p>
  </div>
</template>

<script setup>
import { vMaska } from "maska/vue"
defineProps(['modelValue', 'label', 'required', 'placeholder', 'helpText', 'type', 'mask']);
defineEmits(['update:modelValue']);
</script>
