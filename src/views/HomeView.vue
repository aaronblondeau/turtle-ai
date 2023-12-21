<template>
  <main>
    <div role="tablist" class="tabs tabs-bordered">
      <a role="tab" class="tab" :class="{'tab-active': tab === 'draw'}" @click="tab = 'draw'">Draw</a>
      <a role="tab" class="tab" :class="{'tab-active': tab === 'settings'}" @click="tab = 'settings'">Settings</a>
    </div>

    <Transition name="fade" mode="out-in">
      <component :is="activeComponent"></component>
    </Transition>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DrawView from '@/components/DrawView.vue'
import SettingsView from '@/components/SettingsView.vue'

const tab = ref('draw')

const activeComponent = computed(() => {
  if (tab.value === 'draw') return DrawView
  return SettingsView
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
