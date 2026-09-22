<template>
  <DefaultLayout>
    <div>
      <!-- HEADER DI LUAR CARD -->
      <div class="mb-4">
        <h1 class="text-h5 font-weight-bold">Outbound Call</h1>

        <p class="text-grey">View and manage outbound call activities</p>
      </div>

      <!-- CARD MULAI DARI FILTER + TABLE -->
      <v-card class="outbound-card pa-3" elevation="1">
        <!-- FILTER -->
        <v-row align="center" class="filter-row">
          <!-- DATE -->
          <v-col cols="12" md="4">
            <v-menu v-model="showDatePicker" :close-on-content-click="false">
              <template #activator="{ props }">
                <div class="filter-label">Date</div>

                <v-text-field
                  v-model="dateRange"
                  prepend-inner-icon="mdi-calendar"
                  append-inner-icon="mdi-chevron-down"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </template>

              <v-date-picker v-model="selectedDates" multiple="range" />
            </v-menu>
          </v-col>

          <!-- SEARCH -->
          <v-col cols="12" md="4">
            <div class="filter-label">Search</div>

            <v-text-field
              v-model="searchKeyword"
              placeholder="Search Phone Number/Campaign"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>

          <!-- SUBMIT -->
          <v-col cols="12" md="2" class="d-flex align-center">
            <v-btn
              color="primary"
              height="40"
              width="120"
              @click="submitDateFilter"
            >
              Submit
            </v-btn>
          </v-col>

          <!-- DOWNLOAD -->
          <v-col cols="12" md="2" class="d-flex justify-end align-center">
            <v-btn
              color="success"
              variant="outlined"
              height="40"
              prepend-icon="mdi-download"
              @click="downloadExcel"
            >
              Download
            </v-btn>
          </v-col>
        </v-row>

        <!-- ROW PER PAGE -->
        <div class="d-flex align-center mb-2">
          <span class="text-caption"> Row per page </span>

          <v-select
            v-model="rowsPerPage"
            :items="[10, 25, 50, 100]"
            density="compact"
            variant="plain"
            hide-details
            class="ml-3"
            style="max-width: 70px"
          />
        </div>

        <!-- TABLE -->
        <v-data-table
          :headers="headers"
          :items="filteredCalls"
          :items-per-page="rowsPerPage"
          :items-per-page-options="[10, 25, 50, 100]"
          density="compact"
        >
          <!-- STATUS CHIP -->

          <template #item.status="{ item }">
            <v-chip
              v-if="item.status === 'Answered'"
              color="success"
              size="small"
            >
              <span class="dot">●</span>
              Answered
            </v-chip>

            <v-chip
              v-else-if="item.status === 'No such user'"
              color="warning"
              size="small"
              class="no-user-chip"
            >
              <span class="dot">●</span>
              <span>
                No such extension<br />
                or number
              </span>
            </v-chip>

            <v-chip v-else color="error" size="small">
              <span class="dot">●</span>
              Not Answered
            </v-chip>
          </template>

          <!-- ACTION -->

          <template #item.action="{ item }">
            <v-btn
              size="small"
              variant="outlined"
              prepend-icon="mdi-file-document-outline"
              @click="openDetail(item)"
            >
              Detail
            </v-btn>
          </template>

          <!-- FOOTER -->

          <template #bottom>
            <div class="custom-footer">
              <div class="showing-text">
                Showing {{ startItem }}-{{ endItem }} of
                {{ totalItems }} entries
              </div>

              <div class="pagination">
                <button class="page-btn arrow-btn" @click="previousPage">
                  ‹ Previous
                </button>

                <button
                  v-for="page in pages"
                  :key="page"
                  class="page-btn"
                  :class="{ active: page === currentPage }"
                  @click="currentPage = page"
                >
                  {{ page }}
                </button>

                <button class="page-btn arrow-btn" @click="nextPage">
                  Next ›
                </button>
              </div>
            </div>
          </template>
        </v-data-table>

        <!-- DETAIL MODAL -->

        <v-dialog v-model="showDetail" max-width="620">
          <v-card v-if="selectedCall">
            <v-card-title class="d-flex align-center px-5 py-3">
              <div class="icon-wrapper">
                <v-icon color="primary"> mdi-phone </v-icon>
              </div>

              <div class="ml-4">
                <div class="call-title">Call Detail</div>

                <div class="call-subtitle">
                  Detailed information about the outbound call activity.
                </div>
              </div>

              <v-spacer />

              <v-btn
                icon="mdi-close"
                variant="text"
                @click="showDetail = false"
              />
            </v-card-title>

            <v-divider />

            <v-card-text>
              <v-row
                v-for="item in detailItems"
                :key="item.label"
                class="detail-row"
              >
                <v-col cols="5">
                  <v-icon class="mr-2">
                    {{ item.icon }}
                  </v-icon>

                  {{ item.label }}
                </v-col>

                <v-col cols="7">
                  <v-text-field
                    :value="item.value"
                    density="compact"
                    variant="solo"
                    readonly
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-card-text>

            <v-card-actions>
              <v-spacer />

              <v-btn
                color="primary"
                variant="outlined"
                @click="showDetail = false"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { computed, ref } from "vue";
import DefaultLayout from "../layouts/DefaultLayout.vue";
import { useOutboundStore } from "../stores/outbound";
import * as XLSX from "xlsx";

const outboundStore = useOutboundStore();

// FILTER
const searchKeyword = ref("");
const selectedStatus = ref("ALL");

// DATE
const showDatePicker = ref(false);

const selectedDates = ref(["2026-09-01", "2026-09-07"]);

const dateRange = ref("01 Sep 2026 - 07 September 2026");

const appliedDateRange = ref({
  start: "2026-09-01",

  end: "2026-09-30",
});

// PAGINATION
const rowsPerPage = ref(50);

const currentPage = ref(1);

const totalItems = computed(() => 1250);

const startItem = computed(() => {
  return (currentPage.value - 1) * rowsPerPage.value + 1;
});

const endItem = computed(() => {
  return Math.min(currentPage.value * rowsPerPage.value, totalItems.value);
});

const pages = computed(() => {
  return [1, 2, 3, 4, "...", 25];
});

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < 25) {
    currentPage.value++;
  }
};

// DETAIL
const showDetail = ref(false);

const selectedCall = ref(null);

const openDetail = (call) => {
  selectedCall.value = call;

  showDetail.value = true;
};

// DATE SUBMIT

const submitDateFilter = () => {
  if (selectedDates.value.length >= 2) {
    appliedDateRange.value = {
      start: selectedDates.value[0],

      end: selectedDates.value[1],
    };

    dateRange.value = `${selectedDates.value[0]} - ${selectedDates.value[1]}`;
  }
};

// DOWNLOAD EXCEL

const downloadExcel = () => {
  const data = filteredCalls.value.map((item) => ({
    No: item.no,

    "Action ID": item.actionId,

    "Phone Number": item.phone,

    Campaign: item.campaign,

    "Uploaded Time": item.uploadedTime,

    "Updated Time": item.updatedTime,

    Status: item.status,

    "Call Count": item.callCount,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,

    worksheet,

    "Outbound Call",
  );

  XLSX.writeFile(
    workbook,

    "outbound-call.xlsx",
  );
};

// DATA STORE

const outboundCalls = computed(() => {
  return outboundStore.outboundCalls;
});

// DETAIL DATA

const detailItems = computed(() => [
  {
    label: "Salary",

    icon: "mdi-wallet-outline",

    value: selectedCall.value?.salary,
  },

  {
    label: "Script",

    icon: "mdi-file-document-outline",

    value: selectedCall.value?.script,
  },

  {
    label: "Campaign",

    icon: "mdi-bullhorn-outline",

    value: selectedCall.value?.campaign,
  },

  {
    label: "Location",

    icon: "mdi-map-marker-outline",

    value: selectedCall.value?.location,
  },

  {
    label: "Action ID",

    icon: "mdi-pound",

    value: selectedCall.value?.actionId,
  },

  {
    label: "Full Name",

    icon: "mdi-account-outline",

    value: selectedCall.value?.fullName,
  },

  {
    label: "Job Position",

    icon: "mdi-briefcase-outline",

    value: selectedCall.value?.jobPosition,
  },

  {
    label: "Phone Number",

    icon: "mdi-phone-outline",

    value: selectedCall.value?.phone,
  },

  {
    label: "Upload Timestamp",

    icon: "mdi-calendar-clock",

    value: selectedCall.value?.uploadedTime,
  },
]);

// TABLE HEADER

const headers = [
  {
    title: "No",

    key: "no",
  },

  {
    title: "Action ID",

    key: "actionId",
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
    title: "Uploaded Time",

    key: "uploadedTime",
  },

  {
    title: "Updated Time",

    key: "updatedTime",
  },

  {
    title: "Status",

    key: "status",
  },

  {
    title: "Call Count",

    key: "callCount",
  },

  {
    title: "Action",

    key: "action",

    sortable: false,
  },
];

// FILTER DATA

const filteredCalls = computed(() => {
  let result = [...outboundCalls.value];

  // DATE FILTER

  result = result.filter((call) => {
    const date = new Date(
      call.uploadedTime.replace(/(\d{2}) (\w{3}) (\d{4}).*/, "$2 $1 $3"),
    );

    const start = new Date(appliedDateRange.value.start);

    const end = new Date(appliedDateRange.value.end);

    return date >= start && date <= end;
  });

  // STATUS FILTER

  if (selectedStatus.value !== "ALL") {
    result = result.filter((call) => call.status === selectedStatus.value);
  }

  // SEARCH

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();

    result = result.filter((call) => {
      return (
        call.phone.includes(keyword) ||
        call.campaign.toLowerCase().includes(keyword)
      );
    });
  }

  return result.map((call, index) => ({
    ...call,

    no: index + 1,
  }));
});
</script>

<style scoped>
.outbound-card {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}
.filter-row {
  margin-bottom: 0px;
}

/* TABLE */

:deep(.v-data-table) {
  font-size: 13px;
}

:deep(.v-data-table-header__content) {
  font-weight: 600;

  color: #555;
}

/* STATUS */

/* STATUS CHIP */
:deep(.v-chip) {
  font-size: 12px;
  height: 24px;
  border-radius: 15px;
  padding: 0 10px;
}

.no-user-chip {
  height: 34px !important;
  padding: 4px 12px !important;
  border-radius: 18px;
}

.no-user-chip span {
  line-height: 12px;
  text-align: left;
}

.dot {
  margin-right: 5px;
  font-size: 10px;
}

/* DETAIL MODAL */

.icon-wrapper {
  width: 48px;

  height: 48px;

  min-width: 48px;

  border-radius: 50%;

  background: #e3f2fd;

  display: flex;

  align-items: center;

  justify-content: center;
}

.call-title {
  font-size: 18px;

  font-weight: 600;
}

.call-subtitle {
  font-size: 13px;

  color: #9e9e9e;

  margin-top: 2px;
}

.detail-row {
  margin-bottom: 6px;
}

.detail-row .v-col {
  padding-top: 4px;

  padding-bottom: 4px;
}

/* FOOTER TABLE */

.custom-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  font-size: 13px;
  color: #666;
}

.custom-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  color: #666;
  font-size: 13px;
}

.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn {
  height: 40px;
  min-width: 40px;
  padding: 0 14px;

  border: 1px solid #e0e0e0;
  border-radius: 6px;

  background: white;
  color: #555;

  font-size: 14px;

  cursor: pointer;
}

.page-btn:hover {
  background: #f5f5f5;
}

.page-btn.active {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}

.arrow-btn {
  min-width: 120px;
}
:deep(.v-data-table tbody tr) {
  height: 42px;
}

:deep(.v-data-table-footer) {
  min-height: 45px;
}
.outbound-card {
  padding-top: 10px;
}
.filter-row {
  align-items: center;
}

.filter-row .v-col {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-label {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
}

.filter-row {
  column-gap: 20px;
}

:deep(.v-field__input::placeholder) {
  color: #9ca3af;
  opacity: 1;
  font-size: 14px;
}

:deep(.v-field__prepend-inner .v-icon) {
  font-size: 22px;
  color: #9ca3af;
}

.no-user-chip {
  height: 48px !important;
  border-radius: 25px;
  padding: 8px 18px;
}

.no-user-chip span {
  line-height: 14px;
  text-align: left;
}

.dot {
  margin-right: 8px;
  font-size: 14px;
}

:deep(.v-chip--variant-tonal .v-chip__content) {
  font-weight: 500;
}
</style>
