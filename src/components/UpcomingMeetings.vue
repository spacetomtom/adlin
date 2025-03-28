<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoomStore } from '../stores/roomStore';
import type { Reservation } from '../types/room';

const store = useRoomStore();
const upcomingMeetings = ref<Reservation[]>([]);

const fetchUpcomingMeetings = async () => {
  upcomingMeetings.value = await store.getUpcomingMeetings();
};

const formatDateTime = (dateTime: string) => {
  // Extract date parts directly from ISO string
  const [datePart, timePart] = dateTime.split('T');
  const [year, month, day] = datePart.split('-');
  const [hour, minute] = timePart.split(':');
  
  return `${day}/${month}/${year} ${hour}:${minute}`;
};

// Watch for changes in the refresh trigger
watch(() => store.refreshTrigger, () => {
  fetchUpcomingMeetings();
});

onMounted(() => {
  fetchUpcomingMeetings();
});
</script>

<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-semibold mb-4">Upcoming Meetings</h2>
    <div v-if="upcomingMeetings.length === 0" class="text-gray-500 text-center py-4">
      No upcoming meetings
    </div>
    <div v-else class="space-y-4">
      <div
        v-for="meeting in upcomingMeetings"
        :key="meeting.id"
        class="border-l-4 border-blue-500 pl-4 py-2"
      >
        <h3 class="font-medium text-lg">{{ meeting.title }}</h3>
        <p class="text-sm text-gray-600">
          {{ formatDateTime(meeting.start_time) }} - {{ formatDateTime(meeting.end_time) }}
        </p>
        <p class="text-sm text-blue-600 mt-1">
          Room: {{ meeting.rooms?.name }}
        </p>
        <p v-if="meeting.description" class="text-sm text-gray-500 mt-1">
          {{ meeting.description }}
        </p>
      </div>
    </div>
  </div>
</template>