<script setup lang="ts">
import ReservationForm from './components/ReservationForm.vue';
import UpcomingMeetings from './components/UpcomingMeetings.vue';

</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4">
        <h1 class="text-3xl font-bold text-gray-900">Meeting Room Reservation System</h1>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <ReservationForm />
          <!-- RoomList / -->
        </div>
        <div>
          <UpcomingMeetings />
        </div>
      </div>
    </main>
  </div>
</template>