import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', () => {
  const model = ref(localStorage.getItem('settings:model') || 'cohere_command')
  
  const modelOptions = ['cohere_command', 'openai_gpt_3_5_turbo', 'openai_gpt_4']

  watch(model, (value) => {
    localStorage.setItem('settings:model', value)
  })

  return { model, modelOptions }
})
