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

      <select v-model="selectedStatus">
        <option value="ALL">All</option>

        <option value="CONNECTED">Connected</option>

        <option value="NO ANSWER">No Answer</option>

        <option value="PENDING">Pending</option>
      </select>

      <h3>Call List</h3>

      <div v-for="call in filteredCalls" :key="call.id">
        <p>Customer : {{ call.customer }}</p>

        <p>Phone : {{ call.phone }}</p>

        <p>Campaign : {{ call.campaign }}</p>

        <p>Agent : {{ call.agent }}</p>

        <p>Status : {{ call.status }}</p>

        <p>Duration : {{ call.duration }}</p>

        <p>Time : {{ call.callTime }}</p>

        <hr />
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { computed, ref } from "vue";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import { useOutboundStore } from "../stores/outbound";

const outboundStore = useOutboundStore();
const selectedStatus = ref("ALL");
const outboundCalls = computed(() => outboundStore.outboundCalls);
const totalCall = computed(() => outboundStore.totalCall);
const connectedCall = computed(() => outboundStore.connectedCall);
const failedCall = computed(() => outboundStore.failedCall);
const pendingCall = computed(() => outboundStore.pendingCall);
const filteredCalls = computed(() => {
  if (selectedStatus.value === "ALL") {
    return outboundCalls.value;
  }

  return outboundCalls.value.filter(
    (call) => call.status === selectedStatus.value,
  );
});
</script>
