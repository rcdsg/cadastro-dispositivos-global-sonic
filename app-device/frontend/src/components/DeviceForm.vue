<template>
  <form @submit.prevent="submit" class="flex gap-4">
    <input v-model="name" placeholder="Nome" class="border rounded px-8 py-8 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400" :style="{
      padding: '10px',
      borderRadius: '10px 0px 0px 10px'
      }"/>
    <input v-model="mac" placeholder="MAC" class="border rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400" :style="{
      padding: '10px'
      }"/>

    <button type="submit" class="px-4 py-2 rounded text-white hover:brightness-90 transition" :style="{
      backgroundColor: '#3e3edf',
      borderRadius: '0px 10px 10px 0px',
      padding: '14px 55px',
      color: '#fff',
      border: 'none'
      }">
      Cadastrar
    </button>
  </form>
  <br></br><br></br>
</template>

<script>
import { ref } from 'vue'
import axios from 'axios'
const API_URL = 'http://localhost:3000/api'

export default {
  emits: ['created'],
  setup(props, { emit }) {
    const name = ref('')
    const mac = ref('')

    const submit = async () => {
      if (!name.value || !mac.value) return alert('Nome e MAC são obrigatórios!')
      try {
        const res = await axios.post(`${API_URL}/devices`, { name: name.value, mac: mac.value })
        emit('created', res.data)
        name.value = ''
        mac.value = ''
      } catch (err) {
        alert(err.response?.data?.error || 'Erro ao criar dispositivo')
      }
    }

    return { name, mac, submit }
  }
}
</script>
