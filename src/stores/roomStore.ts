import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Room, Reservation } from '../types/room';
import { roomService, reservationService } from '../services/supabase';

export const useRoomStore = defineStore('room', () => {
  const rooms = ref<Room[]>([]);
  const reservations = ref<Reservation[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const refreshTrigger = ref(0);

  const fetchRooms = async () => {
    try {
      loading.value = true;
      rooms.value = await roomService.getAllRooms();
    } catch (err) {
      error.value = 'Failed to fetch rooms';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const createReservation = async (reservation: Omit<Reservation, 'id' | 'created_at'>) => {
    try {
      loading.value = true;
      const data = await reservationService.createReservation(reservation);
      reservations.value.push(data);
      refreshTrigger.value += 1; // Trigger refresh
      return data;
    } catch (err) {
      error.value = 'Failed to create reservation';
      console.error(err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const getAvailableRooms = async (startTime: string, endTime: string) => {
    try {
      loading.value = true;
      return await roomService.getAvailableRooms(startTime, endTime);
    } catch (err) {
      error.value = 'Failed to fetch available rooms';
      console.error(err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  const getUpcomingMeetings = async () => {
    try {
      loading.value = true;
      return await reservationService.getUpcomingMeetings();
    } catch (err) {
      error.value = 'Failed to fetch upcoming meetings';
      console.error(err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  return {
    rooms,
    reservations,
    loading,
    error,
    refreshTrigger,
    fetchRooms,
    createReservation,
    getAvailableRooms,
    getUpcomingMeetings,
  };
});