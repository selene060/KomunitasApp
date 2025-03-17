<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold">Pending Join Requests</h2>
    
    <div v-if="loading" class="text-center py-4">
      Loading requests...
    </div>
    
    <div v-else-if="error" class="text-red-600">
      {{ error }}
    </div>
    
    <div v-else-if="pendingRequests.length === 0" class="text-gray-600">
      No pending requests
    </div>
    
    <div v-else class="space-y-4">
      <div v-for="request in pendingRequests"
           :key="request.id"
           class="bg-white rounded-lg shadow p-4">
        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium">{{ request.user_name }}</p>
            <p class="text-sm text-gray-600">
              Requested: {{ new Date(request.requested_at).toLocaleDateString() }}
            </p>
            <p v-if="request.request_message" class="mt-2 text-gray-700">
              {{ request.request_message }}
            </p>
          </div>
          
          <div class="space-x-2">
            <button @click="handleAction(request.id, 'approve')"
                    class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Approve
            </button>
            <button @click="handleAction(request.id, 'reject')"
                    class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'  // Pastikan import onMounted
import { storeToRefs } from 'pinia'
import { useJoinRequestStore } from '~/stores/joinRequest'
import { useAllCommunityStore } from '~/stores/allcommunity'

const joinRequestStore = useJoinRequestStore()
const allCommunityStore = useAllCommunityStore()
const { pendingRequests, loading, error } = storeToRefs(joinRequestStore)

// Tambahkan onMounted di sini
onMounted(async () => {
  console.log('Component mounted')  // Debug log
  await joinRequestStore.fetchPendingRequests()
  console.log('Requests after fetch:', pendingRequests.value)  // Debug log
})

const handleAction = async (requestId, action) => {
  const success = await joinRequestStore.processRequest(requestId, action)
  if (success) {
    await allCommunityStore.fetchAllCommunities()
    await joinRequestStore.fetchPendingRequests()
  }
}

defineExpose({
  fetchRequests: joinRequestStore.fetchPendingRequests
})
</script>