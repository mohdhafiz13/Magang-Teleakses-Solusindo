<template>
  <DefaultLayout>

    <div>

      <h1 class="text-h5 font-weight-bold">
        Upload Report
      </h1>

      <p class="text-grey">
        Upload outbound call report
      </p>


      <input
        type="file"
        accept=".xlsx,.xls"
        @change="handleFile"
      />


      <div v-if="reports.length">

        <h3 class="mt-5">
          Preview Report
        </h3>


        <div
          v-for="report in reports"
          :key="report.id"
        >

          {{ report.customer }}
          -
          {{ report.agent }}
          -
          {{ report.status }}

        </div>


        <button
          class="mt-4"
          @click="saveReport"
        >
          Save Report
        </button>


      </div>


    </div>

  </DefaultLayout>
</template>


<script setup>

import { ref } from 'vue'
import * as XLSX from 'xlsx'

import DefaultLayout from '../layouts/DefaultLayout.vue'

import { useOutboundStore } from '../stores/outbound'


const outboundStore = useOutboundStore()


const reports = ref([])



function handleFile(event){

  const file = event.target.files[0]


  const reader = new FileReader()


  reader.onload = (e)=>{


    const data = new Uint8Array(
      e.target.result
    )


    const workbook =
      XLSX.read(
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



    reports.value =
      result.map(
        (item,index)=>({

          id:index+1,

          customer:item.customer,

          agent:item.agent,

          status:item.status,

          duration:item.duration,

          callTime:item.callTime

        })
      )


    console.log(
      "Report Preview",
      reports.value
    )


  }


  reader.readAsArrayBuffer(file)


}



function saveReport(){

  reports.value.forEach(
    report=>{

      outboundStore.addOutboundCall(
        report
      )

    }
  )


  console.log(
    "Report saved",
    outboundStore.outboundCalls
  )


}


</script>