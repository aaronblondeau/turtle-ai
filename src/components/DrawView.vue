<template>
  <div class="grid md:grid-cols-2 gap-4">
    <div class="grid grid-cols-1 m-4">
      <div role="alert" class="alert alert-error" v-if="error">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{error}</span>
      </div>
      <div>
        <p>
          turtleAI (<a href="https://github.com/aaronblondeau/turtle-ai" target="_blank">see source</a>) is tool that tests different AI model's ability to draw shapes with LOGO ("Turtle") graphics commands. This implementation uses
          <a href="https://caesarovich.github.io/better-turtle/index.html" target="_blank">BetterTurtle</a>.
          Start by typing a prompt, then click "Generate Code" to generate LOGO commands. Click "Run Code" down at the bottom to run the commands and see the drawing.
        </p>
        <div class="label">
          <span class="label-text">Model</span>
        </div>
        <select v-model="settingsStore.model" class="select select-bordered w-full max-w-xs">
          <option v-for="modelOption of settingsStore.modelOptions" :key="modelOption">{{ modelOption }}</option>
        </select>
        <div class="label">
          <span class="label-text">What should I draw?</span>
        </div>
        <input type="text" v-model="prompt" placeholder="Draw a red square!" class="input input-bordered w-full" />
      </div>
      <button class="btn btn-primary w-full mt-4" :disabled="busy" @click="generateCommands">
        <span v-if="busy" class="loading loading-spinner"></span>
        Generate Code
      </button>
      <div>
        <textarea class="textarea w-full h-96" placeholder="forward(100)" v-model="commands"></textarea>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <button class="btn btn-primary w-full" :disabled="busy" @click="runCommands">Run Code</button>
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">Show All Model Output</span> 
            <input type="checkbox" v-model="showModelOutput" class="checkbox" />
          </label>
        </div>
      </div>
    </div>
    <div class="m-4">
      <canvas ref="turtlecanvas" width="400" height="400" class="border border-indigo-600"></canvas>
    </div>
  </div>
  <div class="p-4" v-if="showModelOutput">
    <div class="card w-full bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Model Output</h2>
        <pre style="max-width: 100%; overflow-x: scroll;">{{modelOutput}}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Note that process.env.URL is set via vite.config.ts's define:
declare var process: {
  env: {
    URL: string
  }
}
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()

const { Turtle } = (window as any).BetterTurtle
const turtlecanvas = ref<HTMLCanvasElement>()
const prompt = ref('')
const commands = ref('')
const busy = ref(false)
const error = ref('')
const modelOutput = ref('')
const showModelOutput = ref(false)
let turtle: typeof Turtle | null = null

function runCommands() {
  if (!turtle) return
  turtle.clear()
  turtle.goto(0, 0)
  error.value = ''
  // https://caesarovich.github.io/better-turtle/classes/Turtle.html
  // Using eval on user input is usually a big no-no, but in this case it's fine
  // run commands one line at a time
  const commandLines = commands.value.split('\n')
  for (const commandLine of commandLines) {
    eval(commandLine)
  }
}

async function generateCommands() {
  error.value = ''
  busy.value = true
  try {
    const response = await axios.post(`${process.env.URL}/api/` + settingsStore.model, { prompt: prompt.value })
    commands.value = response.data.commands
    modelOutput.value = response.data.modelOutput
  } catch (e) {
    console.error(e)
    if (e instanceof Error) {
      error.value = e.message
    } else {
      error.value = e + ''
    }
  } finally {
    busy.value = false
  }
}

onMounted(() => {
  if (turtlecanvas.value) {
    const ctx = turtlecanvas.value.getContext('2d')
    if (ctx) {
      turtle = new Turtle(ctx)
      turtle.expose(window)
    }
  }
})
</script>
