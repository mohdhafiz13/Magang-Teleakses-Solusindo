<template>
  <DefaultLayout>
    <div>
      <h1 class="text-h5 font-weight-bold">Management Agent</h1>
      <p class="text-grey">
        Agent management page
      </p>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '../layouts/DefaultLayout.vue'
import { useAgentStore } from '../stores/agent'

const agentStore = useAgentStore()

console.log('Management Agent Loaded')
console.log(
  'Agent Data:',
  JSON.parse(JSON.stringify(agentStore.agents))
)
console.log('Total Agent:', agentStore.totalAgent)
</script>