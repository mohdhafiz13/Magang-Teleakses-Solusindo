import { defineStore } from "pinia";

export const useOutboundStore = defineStore("outbound", {
  state: () => ({
    outboundCalls: [
      {
        id: 1,
        actionId: "1789458214-QF7K2L9M4XNP-1",
        phone: "081234567890",
        campaign: "marketing",
        uploadedTime: "17 Sep 2026 09:42:18",
        updatedTime: "17 Sep 2026 09:43:02",
        status: "Answered",
        callCount: 1,

        salary: "10.000.000",
        script: "halo kakak",
        location: "Jakarta",
        fullName: "Nindy",
        jobPosition: "PNS",
      },

      {
        id: 2,
        actionId: "1789457632-PL8W3N6R1KQZ-1",
        phone: "085712345678",
        campaign: "marketing",
        uploadedTime: "17 Sep 2026 09:35:42",
        updatedTime: "17 Sep 2026 09:36:15",
        status: "Answered",
        callCount: 1,

        salary: "8.500.000",
        script: "selamat pagi kak, kami dari tim marketing",
        location: "Bandung",
        fullName: "Rina Amelia",
        jobPosition: "Marketing",
      },

      {
        id: 3,
        actionId: "1789456198-MV4C7X2H9JST-1",
        phone: "081398765432",
        campaign: "marketing",
        uploadedTime: "17 Sep 2026 09:28:15",
        updatedTime: "17 Sep 2026 09:28:47",
        status: "No such user",
        callCount: 1,

        salary: "7.500.000",
        script: "halo, izin mengganggu waktunya",
        location: "Surabaya",
        fullName: "Dimas Pratama",
        jobPosition: "Sales",
      },

      {
        id: 4,
        actionId: "1789454978-BNMK2Q8J5WPL-1",
        phone: "082112345678",
        campaign: "marketing",
        uploadedTime: "17 Sep 2026 09:16:38",
        updatedTime: "17 Sep 2026 09:17:12",
        status: "Answered",
        callCount: 1,

        salary: "9.000.000",
        script: "selamat siang kak",
        location: "Yogyakarta",
        fullName: "Ayu Lestari",
        jobPosition: "Customer Service",
      },

      {
        id: 5,
        actionId: "1789453765-HJ3R9V5X7NKM-1",
        phone: "087812345678",
        campaign: "marketing",
        uploadedTime: "17 Sep 2026 09:08:52",
        updatedTime: "17 Sep 2026 09:09:26",
        status: "Not Answered",
        callCount: 1,

        salary: "6.800.000",
        script: "perkenalkan kami dari perusahaan",
        location: "Semarang",
        fullName: "Bagas Saputra",
        jobPosition: "Admin",
      },
    ],

    customers: [
      {
        id: 1,
        name: "Customer A",
        phone: "081234567890",
        status: "WAITING",
      },
      {
        id: 2,
        name: "Customer B",
        phone: "081298765432",
        status: "WAITING",
      },
    ],

    loading: false,
    error: null,
  }),

  getters: {
    totalCall: (state) => state.outboundCalls.length,

    connectedCall: (state) =>
      state.outboundCalls.filter((call) => call.status === "Answered").length,

    failedCall: (state) =>
      state.outboundCalls.filter((call) => call.status === "Not Answered")
        .length,

    pendingCall: (state) =>
      state.outboundCalls.filter((call) => call.status === "No such user")
        .length,

    totalCustomer: (state) => state.customers.length,

    waitingCustomer: (state) =>
      state.customers.filter((customer) => customer.status === "WAITING")
        .length,
  },

  actions: {
    addOutboundCall(call) {
      this.outboundCalls.push(call);
    },

    addCustomers(customers) {
      this.customers.push(...customers);

      customers.forEach((customer) => {
        this.outboundCalls.push({
          id: Date.now(),

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
        });
      });
    },

    updateCustomerStatus(id, status) {
      const customer = this.customers.find((item) => item.id === id);

      if (customer) {
        customer.status = status;
      }
    },

    updateCallStatus(id, status) {
      const call = this.outboundCalls.find((item) => item.id === id);

      if (call) {
        call.status = status;
      }
    },

    deleteOutboundCall(id) {
      this.outboundCalls = this.outboundCalls.filter((call) => call.id !== id);
    },
  },
});
