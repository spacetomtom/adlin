import { supabase } from '../lib/supabaseClient';
import type { Room, Reservation } from '../types/room';

export const roomService = {
  async getAllRooms() {
    const { data, error } = await supabase
      .from('rooms')
      .select('*');
    
    if (error) throw error;
    return data;
  },

  async getAvailableRooms(startTime: string, endTime: string) {
    // First, get all rooms
    const { data: allRooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*');

    if (roomsError) throw roomsError;

    // Get reservations that overlap with the requested time period
    const { data: conflictingReservations, error: reservationsError } = await supabase
      .from('reservations')
      .select('room_id').or(`and(start_time.lt.${endTime},end_time.gt.${startTime})`);

    if (reservationsError) throw reservationsError;

    // Filter out rooms that have conflicting reservations
    const reservedRoomIds = new Set(conflictingReservations?.map(r => r.room_id));
    return allRooms?.filter(room => !reservedRoomIds.has(room.id)) || [];
  }
};

export const reservationService = {
  async createReservation(reservation: Omit<Reservation, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('reservations')
      .insert([{
        room_id: reservation.room_id,
        start_time: reservation.start_time,
        end_time: reservation.end_time,
        title: reservation.title,
        description: reservation.description
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getUpcomingMeetings() {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        rooms (
          name
        )
      `)
      .gte('start_time', now)
      .order('start_time', { ascending: true })
      .limit(5);

    if (error) throw error;
    return data;
  }
};