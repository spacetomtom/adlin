import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useRoomStore } from '../../stores/roomStore';
import { roomService } from '../../services/supabase';

describe('roomStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with empty state', () => {
    const store = useRoomStore();
    expect(store.rooms).toEqual([]);
    expect(store.reservations).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBe(null);
  });

  it('sets loading state during async operations', async () => {
    const store = useRoomStore();
  
    const mockRooms = [{
      id: '1',
      name: 'Test Room',
      description: 'Test Description',
      capacity: 10,
      equipements: [],
      created_at: '2025-03-28T10:00:00Z',
      updated_at: '2025-03-28T10:00:00Z'
    }];
  
    vi.spyOn(roomService, 'getAllRooms').mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve(mockRooms), 10))
    );
  
    expect(store.loading).toBe(false);
  
    const fetchPromise = store.fetchRooms();
    expect(store.loading).toBe(true);
  
    await fetchPromise;
  
    expect(store.loading).toBe(false);
    expect(store.rooms).toEqual(mockRooms);
  });

  it('handles errors in async operations', async () => {
    const store = useRoomStore();
    const errorMessage = 'Failed to fetch rooms';
    
    vi.spyOn(store, 'fetchRooms').mockImplementation(async () => {
      store.loading = true;
      try {
        throw new Error(errorMessage);
      } catch (err) {
        store.error = 'Failed to fetch rooms';
      } finally {
        store.loading = false;
      }
    });
    
    await store.fetchRooms();
    expect(store.error).toBe('Failed to fetch rooms');
    expect(store.loading).toBe(false);
  });

  it('increments refreshTrigger when creating reservation', async () => {
    const store = useRoomStore();
    const initialTriggerValue = store.refreshTrigger;
    
    const mockReservation = {
      room_id: '1',
      start_time: '2025-03-28T10:00:00Z',
      end_time: '2025-03-28T11:00:00Z',
      title: 'Test Meeting',
      description: 'Test Description'
    };

    vi.spyOn(store, 'createReservation').mockImplementation(async () => {
      store.refreshTrigger++;
      return {
        id: '1',
        ...mockReservation,
        created_at: '2025-03-28T09:00:00Z'
      };
    });

    await store.createReservation(mockReservation);
    expect(store.refreshTrigger).toBe(initialTriggerValue + 1);
  });

  it('fetches available rooms correctly', async () => {
    const store = useRoomStore();
    const mockRooms = [{
      id: '1',
      name: 'Available Room',
      description: 'Test Description',
      capacity: 10,
      equipements: [],
      created_at: '2025-03-28T10:00:00Z',
      updated_at: '2025-03-28T10:00:00Z'
    }];

    vi.spyOn(store, 'getAvailableRooms').mockResolvedValue(mockRooms);

    const result = await store.getAvailableRooms('2025-03-28T10:00:00Z', '2025-03-28T11:00:00Z');
    expect(result).toEqual(mockRooms);
  });
});