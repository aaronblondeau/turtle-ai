<template>
  <div class="grid md:grid-cols-2 gap-4">
    <div class="grid grid-cols-1 m-4">
      <div>
        <div class="label">
          <span class="label-text">What should I draw?</span>
        </div>
        <input type="text" model="prompt" placeholder="Draw a red square!" class="input input-bordered w-full" />
      </div>
      <button class="btn btn-primary w-full" @click="generateCommands">Generate</button>
      <div>
        <textarea class="textarea w-full h-96" placeholder="forward(100)" v-model="commands"></textarea>
      </div>
      <button class="btn btn-primary w-full" @click="runCommands">Run</button>
    </div>
    <div class="flex justify-center m-4">
      <canvas ref="turtlecanvas" width="400" height="400" class="border border-indigo-600"></canvas>
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

const { Turtle } = (window as any).BetterTurtle
const turtlecanvas = ref<HTMLCanvasElement>()
const prompt = ref('')
const commands = ref('')

function runCommands() {
  // https://caesarovich.github.io/better-turtle/classes/Turtle.html
  // Using eval on user input is usually a big no-no, but in this case it's fine
  eval(commands.value)
}

function generateCommands() {
  console.log('~~ Would generate commands for:', prompt.value)
  axios.post(`${process.env.URL}/api/cohere_command`, { prompt: prompt.value })
    .then((response) => {
      commands.value = JSON.stringify(response.data, null, 2)
    })
    .catch((error) => {
      console.log('~~ error is:', error)
    })
}

onMounted(() => {
  if (turtlecanvas.value) {
    const ctx = turtlecanvas.value.getContext('2d')
    if (ctx) {
      const turtle = new Turtle(ctx)
      turtle.expose(window)
    }
  }
})
</script>
