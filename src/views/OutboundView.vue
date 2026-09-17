<template>

<DefaultLayout>

<h1>
Upload Outbound
</h1>


<input 
type="file"
accept=".xlsx,.xls"
@change="handleFile"
/>


<div v-if="customers.length">

<h3>
Preview Customer
</h3>


<div
v-for="customer in customers"
:key="customer.phone"
>

{{customer.name}}
-
{{customer.phone}}

</div>


<button @click="saveCustomer">
Save Customer
</button>


</div>


</DefaultLayout>


</template>



<script setup>

import * as XLSX from 'xlsx'

import { ref } from 'vue'

import DefaultLayout from '../layouts/DefaultLayout.vue'

import { useOutboundStore } from '../stores/outbound'


const outboundStore = useOutboundStore()


const customers = ref([])



function handleFile(event){


const file = event.target.files[0]


const reader = new FileReader()


reader.onload = (e)=>{


const data = new Uint8Array(
e.target.result
)


const workbook = XLSX.read(
data,
{
type:'array'
}
)


const sheet =
workbook.Sheets[
workbook.SheetNames[0]
]


const result =
XLSX.utils.sheet_to_json(sheet)



customers.value =
result.map(item=>({

name:item.name,

phone:item.phone,

status:'WAITING'


}))


console.log(customers.value)


}



reader.readAsArrayBuffer(file)


}



function saveCustomer(){


outboundStore.addCustomers(
customers.value
)


console.log(
"Customer saved",
outboundStore.customers
)


}


</script>