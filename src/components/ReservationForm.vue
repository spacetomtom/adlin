<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoomStore } from '../stores/roomStore';
import { addMinutes, format } from 'date-fns';
import type { Room } from '../types/room';

const store = useRoomStore();
const startTime = ref('');
const duration = ref(30); // Default duration: 30 minutes
const selectedRoom = ref<Room | null>(null);
const title = ref('');
const description = ref('');

const availableRooms = ref<Room[]>([]);

const durations = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' }
];

const endTime = computed(() => {
  if (!startTime.value) return '';
  const start = new Date(startTime.value);
  const end = addMinutes(start, duration.value);
  return format(end, "yyyy-MM-dd'T'HH:mm");
});

const searchAvailableRooms = async () => {
  if (!startTime.value || !endTime.value) return;
  availableRooms.value = await store.getAvailableRooms(startTime.value, endTime.value);
};

const selectRoom = (room: Room) => {
  selectedRoom.value = room;
};

const selectDuration = (value: number) => {
  duration.value = value;
};

const createReservation = async () => {
  if (!selectedRoom.value || !startTime.value || !endTime.value || !title.value) return;
  
  await store.createReservation({
    room_id: selectedRoom.value.id,
    start_time: startTime.value,
    end_time: endTime.value,
    title: title.value,
    description: description.value
  });

  // Reset form
  startTime.value = '';
  selectedRoom.value = null;
  title.value = '';
  description.value = '';
  availableRooms.value = [];
};
</script>

<template>
  <div class="max-w-4xl mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4">Make a Reservation</h2>
    <form @submit.prevent="createReservation" class="space-y-6">
      <div>
        <label class="block text-sm font-medium mb-1">Start Time</label>
        <input
          type="datetime-local"
          v-model="startTime"
          class="w-full rounded border-gray-300 shadow-sm"
          required
        >
      </div>

      <div>
        <label class="block text-sm font-medium mb-2">Duration</label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div
            v-for="d in durations"
            :key="d.value"
            @click="selectDuration(d.value)"
            class="cursor-pointer rounded-lg border p-3 text-center transition-all duration-200"
            :class="{
              'border-blue-500 bg-blue-50 text-blue-700': duration === d.value,
              'border-gray-200 hover:border-blue-300': duration !== d.value
            }"
          >
            {{ d.label }}
          </div>
        </div>
      </div>

      <button
        type="button"
        @click="searchAvailableRooms"
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        :disabled="!startTime"
      >
        Search Available Rooms
      </button>

      <div v-if="availableRooms.length > 0" class="space-y-4">
        <h3 class="text-lg font-medium">Available Rooms</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="room in availableRooms"
            :key="room.id"
            @click="selectRoom(room)"
            class="cursor-pointer rounded-lg border p-4 transition-all duration-200"
            :class="{
              'border-blue-500 bg-blue-50': selectedRoom?.id === room.id,
              'border-gray-200 hover:border-blue-300': selectedRoom?.id !== room.id
            }"
          >
            <h4 class="text-lg font-semibold">{{ room.name }}</h4>
            <p class="text-gray-600 text-sm">{{ room.description }}</p>
            <div class="mt-2">
              <span class="text-sm font-medium">Capacity: {{ room.capacity }}</span>
            </div>
            <div class="mt-2">
              <h5 class="text-sm font-medium">Equipment:</h5>
              <ul class="list-disc list-inside">
                <li v-for="equipment in room.equipements" :key="equipment.name" class="text-sm">
                  {{ equipment.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Title</label>
        <input
          type="text"
          v-model="title"
          class="w-full rounded border-gray-300 shadow-sm"
          required
        >
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Description (Optional)</label>
        <textarea
          v-model="description"
          class="w-full rounded border-gray-300 shadow-sm"
          rows="3"
        ></textarea>
      </div>

      <button
        type="submit"
        class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        :disabled="!selectedRoom"
      >
        Create Reservation
      </button>
    </form>
  </div>
</template>