<template>
  <DefaultLayout>

    <div>
      <h1 class="text-h5 font-weight-bold">
        Outbound Call
      </h1>
      <p class="text-grey">
        Outbound call monitoring page
      </p>

      <div class="mt-5">
        <p>
          Total Call :
          {{ totalCall }}
        </p>
        <p>
          Connected :
          {{ connectedCall }}
        </p>
        <p>
          Failed :
          {{ failedCall }}
        </p>
        <p>
          Pending :
          {{ pendingCall }}
        </p>

        <hr class="my-5">
        <h3>Outbound Call Data</h3>
        <div
          v-for="call in outboundCalls"
          :key="call.id"
          class="mt-3"
        >
          {{ call.customer }}
          -
          {{ call.agent }}
          -
          {{ call.status }}

        </div>
      </div>

    </div>
  </DefaultLayout>
</template>


<script setup>
import { computed } from 'vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import { useOutboundStore } from '../stores/outbound'

const outboundStore = useOutboundStore()
const outboundCalls = computed(() =>
  outboundStore.outboundCalls
)
const totalCall = computed(() =>
  outboundStore.totalCall
)
const connectedCall = computed(() =>
  outboundStore.connectedCall
)
const failedCall = computed(() =>
  outboundStore.failedCall
)
const pendingCall = computed(() =>
  outboundStore.pendingCall
)
</script>