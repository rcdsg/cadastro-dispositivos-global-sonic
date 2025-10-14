<template>
  <table class="w-full border-collapse shadow-md">
    <thead>
      <tr class="bg-gray-200">
        <th class="border px-4 py-2 text-left">ID</th>
        <th class="border px-4 py-2 text-left">Nome</th>
        <th class="border px-4 py-2 text-left">MAC</th>
        <th class="border px-4 py-2 text-center">Status</th>
        <th class="border px-4 py-2 text-center">Ação</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="device in devices" :key="device.id" class="hover:bg-gray-100">
        <td class="border px-4 py-2">{{ device.id }}</td>
        <td class="border px-4 py-2">{{ device.name }}</td>
        <td class="border px-4 py-2">{{ device.mac }}</td>
        <td class="border px-4 py-2 text-center">
          <span :class="device.status === 'ATIVO' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
            {{ device.status }}
          </span>
        </td>
        <td class="border px-4 py-2 text-center">
          <button @click="$emit('toggle', device.id)" class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors">
            Alternar
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ['devices'],
  emits: ['toggle']
}
</script>