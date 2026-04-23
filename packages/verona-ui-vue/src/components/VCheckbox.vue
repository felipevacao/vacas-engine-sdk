<template>
  <div class="verona-field flex items-start">
    <div class="flex items-center h-5">
      <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
        class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
      />
    </div>
    <div class="ml-3 text-sm">
      <label class="font-medium text-gray-700">{{ label }} <span v-if="required" class="text-red-500">*</span></label>
      <p v-if="helpText" class="text-gray-500">{{ helpText }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps(['modelValue', 'label', 'required', 'helpText']);
defineEmits(['update:modelValue']);
</script>
