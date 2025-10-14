<template>
  <div class="font-sans min-h-screen flex flex-col items-center justify-start bg-gray-100 py-10">
    <div class="font-sans w-3/4 bg-white p-8 rounded-lg shadow-lg">
      <br></br>
      <h1 class="font-sans text-3xl font-bold text-center mb-6 text-gray-800">Dispositivos</h1>

      <br></br>

      <DeviceForm @created="onCreated" class="mb-6" />

      <DeviceTable :devices="devices" @toggle="toggleStatus" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { io } from 'socket.io-client'
import DeviceForm from './components/DeviceForm.vue'
import DeviceTable from './components/DeviceTable.vue'

const API_URL = 'http://localhost:3000/api'
const SOCKET_URL = 'http://localhost:3000'

export default {
  components: { DeviceForm, DeviceTable },
  setup() {
    const devices = ref([])
    const socket = io(SOCKET_URL)

    const fetchDevices = async () => {
      const res = await axios.get(`${API_URL}/devices`)
      devices.value = res.data
    }

    socket.on('device:created', (device) => {
      devices.value.unshift(device)
    })

    socket.on('device:status', ({ id, status }) => {
      const idx = devices.value.findIndex(d => d.id === id)
      if (idx !== -1) devices.value[idx].status = status
    })

    const onCreated = (device) => {
      devices.value.unshift(device)
    }

    const toggleStatus = async (id) => {
      await axios.patch(`${API_URL}/devices/${id}/status`)
    }

    onMounted(() => {
      fetchDevices()
    })

    return { devices, onCreated, toggleStatus }
  }
}
</script>