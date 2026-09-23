<template>
  <DefaultLayout>
    <div class="page">
      <!-- HEADER -->
      <div class="mb-4">
        <h1 class="title">Upload Outbound</h1>

        <p class="subtitle">Upload and Manage Outbound Files</p>
      </div>

      <!-- CARD UPLOAD -->
      <v-card class="upload-card" elevation="1">
        <div
          class="drop-area"
          @click="openFile"
          @dragover.prevent
          @drop.prevent="dropFile"
        >
          <!-- ICON -->
          <div class="upload-icon">
            <v-icon size="45" color="primary"> mdi-file-upload-outline </v-icon>
          </div>

          <h3>Drag and drop your file here</h3>

          <p>or click to browse from your device</p>

          <v-btn color="primary" class="browse-btn">
            <v-icon left> mdi-folder-open </v-icon>

            Browse Files
          </v-btn>

          <span class="support"> Supported files: .xls,.xlsx,.csv </span>

          <input
            ref="fileInput"
            type="file"
            hidden
            accept=".xlsx,.xls,.csv"
            @change="handleFile"
          />
        </div>

        <!-- PREVIEW -->
        <div v-if="customers.length" class="preview-section">
          <h3 class="mb-4">Preview Customer</h3>

          <v-data-table
            :headers="previewHeaders"
            :items="customers"
            hide-default-footer
            density="compact"
          >
            <template #item.status="{ item }">
              <v-chip color="warning" size="small">
                ● {{ item.status }}
              </v-chip>
            </template>
          </v-data-table>

          <v-btn
            color="primary"
            class="mt-6"
            prepend-icon="mdi-upload"
            @click="saveCustomer"
          >
            Upload
          </v-btn>
        </div>
      </v-card>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref } from "vue";
import * as XLSX from "xlsx";

import DefaultLayout from "../layouts/DefaultLayout.vue";

import { useOutboundStore } from "../stores/outbound";

const outboundStore = useOutboundStore();

const previewHeaders = [
  {
    title: "No",
    key: "no",
  },

  {
    title: "Name",
    key: "name",
  },

  {
    title: "Phone Number",
    key: "phone",
  },

  {
    title: "Campaign",
    key: "campaign",
  },

  {
    title: "Status",
    key: "status",
  },
];

const customers = ref([]);
const selectedFile = ref(null);

const fileName = ref("");

const fileSize = ref("");

const showPreview = ref(false);
const fileInput = ref(null);

function openFile() {
  fileInput.value.click();
}

function dropFile(event) {
  const file = event.dataTransfer.files[0];

  readFile(file);
}

function handleFile(event) {
  const file = event.target.files[0];

  selectedFile.value = file;

  fileName.value = file.name;

  fileSize.value = (file.size / 1024).toFixed(2) + " KB";

  readFile(file);

  showPreview.value = true;
}

function readFile(file) {
  const reader = new FileReader();

  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);

    const workbook = XLSX.read(data, {
      type: "array",
    });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const result = XLSX.utils.sheet_to_json(sheet);

    customers.value = result.map((item, index) => ({
      no: index + 1,

      name: item.name,

      phone: item.phone,

      campaign: item.campaign,

      status: "WAITING",
    }));
  };

  reader.readAsArrayBuffer(file);
}

function removeFile() {
  selectedFile.value = null;

  fileName.value = "";

  customers.value = [];

  showPreview.value = false;
}

function saveCustomer() {
  const newCalls = customers.value.map((customer, index) => ({
    id: Date.now() + index,

    actionId: "-",

    phone: customer.phone,

    campaign: customer.campaign || "marketing",

    uploadedTime: new Date().toLocaleString(),

    updatedTime: new Date().toLocaleString(),

    status: "WAITING",

    callCount: 0,

    salary: "-",

    script: "-",

    location: "-",

    fullName: customer.name,

    jobPosition: "-",
  }));

  outboundStore.outboundCalls.push(...newCalls);
}
</script>

<style scoped>
.page {
  padding: 0;
}

.title {
  font-size: 24px;
  font-weight: 700;
}

.subtitle {
  color: #9e9e9e;
  font-size: 14px;
}

.upload-card {
  border-radius: 12px;

  padding: 16px;
}

.drop-area {
  height: 230px;

  border: 2px dashed #4d8dff;

  border-radius: 8px;

  background: #fafcff;

  display: flex;

  flex-direction: column;

  justify-content: center;

  align-items: center;

  cursor: pointer;
}

.upload-icon {
  width: 60px;

  height: 60px;

  border-radius: 50%;

  background: #e3f0ff;

  display: flex;

  align-items: center;

  justify-content: center;

  margin-bottom: 12px;
}

.drop-area h3 {
  margin: 5px;

  font-size: 16px;

  font-weight: 600;
}

.drop-area p {
  margin: 0 0 15px;

  color: #9e9e9e;

  font-size: 13px;
}

.browse-btn {
  text-transform: none;
}

.support {
  margin-top: 12px;

  font-size: 11px;

  color: #b0b0b0;
}

.preview {
  margin-top: 20px;
}

.browse-btn {
  height: 32px;
  font-size: 13px;
}

.file-preview {
  margin-top: 20px;

  padding: 20px;

  border: 1px solid #e5e7eb;

  border-radius: 10px;

  display: flex;

  justify-content: space-between;

  align-items: center;

  background: white;
}

.file-preview p {
  margin: 5px 0;

  color: #777;

  font-size: 13px;
}
</style>
