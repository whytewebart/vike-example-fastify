<template>
  <div class="w-full mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200">System Health</h2>

      <button
        @click="handlePing"
        :disabled="loading"
        class="inline-flex items-center px-3 py-.5 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-sm font-medium rounded transition disabled:opacity-50"
      >
        <svg
          v-if="loading"
          class="animate-spin h-4 w-4 mr-2 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Ping Now
      </button>
    </div>

    <table class="min-w-full table-auto border border-gray-300 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200">
      <tbody>
        <tr class="border-t border-gray-200 dark:border-gray-700">
          <th class="text-left px-4 py-2 bg-gray-50 dark:bg-gray-800 w-40">Status</th>
          <td class="px-4 py-2">
            <span
              :class="[
                'inline-flex items-center px-2 py-0.5 rounded text-sm font-medium',
                status === 'healthy' ? 'bg-green-100 text-green-800' :
                status === 'unhealthy' ? 'bg-red-100 text-red-800' :
                status === 'checking' ? 'bg-yellow-100 text-yellow-800 animate-pulse' :
                'bg-gray-100 text-gray-800'
              ]"
            >
              {{ status }}
            </span>
          </td>
        </tr>

        <tr class="border-t border-gray-200 dark:border-gray-700">
          <th class="text-left px-4 py-2 bg-gray-50 dark:bg-gray-800">Last Checked</th>
          <td class="px-4 py-2">{{ lastPingTime }}</td>
        </tr>

        <tr
          v-if="error"
          class="border-t border-gray-200 dark:border-gray-700 text-red-600 dark:text-red-400"
        >
          <th class="text-left px-4 py-2 bg-gray-50 dark:bg-gray-800">Error</th>
          <td class="px-4 py-2">{{ error }}</td>
        </tr>

        <tr
          v-for="(value, key) in metadata"
          :key="key"
          class="border-t border-gray-200 dark:border-gray-700"
        >
          <th class="text-left px-4 py-2 bg-gray-50 dark:bg-gray-800 capitalize">{{ key }}</th>
          <td class="px-4 py-2">{{ value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const h = useHealth()
const { status, lastPingTime, error, metadata } = storeToRefs(h);
const loading = ref(false)

async function handlePing() {
  loading.value = true
  await h.ping()
  loading.value = false
}
</script>