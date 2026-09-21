<template>
  <DefaultLayout>
    <div>
      <h1 class="text-h5 font-weight-bold">Outbound Call</h1>

      <p class="text-grey">Outbound call monitoring</p>

      <p>Total Call : {{ totalCall }}</p>

      <p>Connected : {{ connectedCall }}</p>

      <p>Failed : {{ failedCall }}</p>

      <p>Pending : {{ pendingCall }}</p>

      <hr />

      <h3>Call List</h3>

      <div 
  v-for="call in outboundCalls" 
  :key="call.id"
>

  <p>
    Customer : {{ call.customer }}
  </p>

  <p>
    Phone : {{ call.phone }}
  </p>

  <p>
    Campaign : {{ call.campaign }}
  </p>

  <p>
    Agent : {{ call.agent }}
  </p>

  <p>
    Status : {{ call.status }}
  </p>

  <p>
    Duration : {{ call.duration }}
  </p>

  <p>
    Time : {{ call.callTime }}
  </p>

  <hr>

</div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { computed } from "vue";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import { useOutboundStore } from "../stores/outbound";

const outboundStore = useOutboundStore();
const outboundCalls = computed(() => outboundStore.outboundCalls);
const totalCall = computed(() => outboundStore.totalCall);
const connectedCall = computed(() => outboundStore.connectedCall);
const failedCall = computed(() => outboundStore.failedCall);
const pendingCall = computed(() => outboundStore.pendingCall);
</script>
