<!-- components->DynamicRulesForm.vue -->
<template>
    <DynamicRulesForm v-model="formData.rules" />
  </template>
  
  <script>
  export default {
    data() {
      return {
        formData: {
          rules: [''] 
        }
      }
    }
  }
  </script>