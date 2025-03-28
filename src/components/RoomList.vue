<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoomStore } from '../stores/roomStore';

const store = useRoomStore();

onMounted(() => {
  store.fetchRooms();
});
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Available Rooms</h2>
    <div v-if="store.loading" class="text-center">
      Loading...
    </div>
    <div v-else-if="store.error" class="text-red-500">
      {{ store.error }}
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="room in store.rooms" :key="room.id" class="bg-white rounded-lg shadow p-4">
        <h3 class="text-xl font-semibold">{{ room.name }}</h3>
        <p class="text-gray-600">{{ room.description }}</p>
        <div class="mt-2">
          <span class="text-sm font-medium">Capacity: {{ room.capacity }}</span>
        </div>
        <div class="mt-2">
          <h4 class="text-sm font-medium">Equipment:</h4>
          <ul class="list-disc list-inside">
            <li v-for="equipment in room.equipements" :key="equipment.name" class="text-sm">
              {{ equipment.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>