import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import RoomList from '../../components/RoomList.vue';
import { useRoomStore } from '../../stores/roomStore';

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('RoomList.vue', () => {
  let store: ReturnType<typeof useRoomStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useRoomStore();
  });

  it('displays loading state', async () => {
    vi.spyOn(store, 'fetchRooms').mockImplementation(() => {
      store.loading = true;
      return Promise.resolve();
    });

    const wrapper = mount(RoomList);
    await flushPromises();

    expect(wrapper.text()).toContain('Loading...');
  });

  it('displays error message when there is an error', async () => {
    vi.spyOn(store, 'fetchRooms').mockImplementation(() => {
      store.error = 'Failed to fetch rooms';
      store.loading = false;
      return Promise.resolve();
    });

    const wrapper = mount(RoomList);
    await flushPromises();

    expect(wrapper.text()).toContain('Failed to fetch rooms');
  });

  it('displays rooms when loaded successfully', async () => {
    const mockRooms = [{
      id: '1',
      name: 'Test Room',
      description: 'Test Description',
      capacity: 10,
      equipements: [{ name: 'Projector' }],
      created_at: '2025-03-28T10:00:00Z',
      updated_at: '2025-03-28T10:00:00Z'
    }];

    vi.spyOn(store, 'fetchRooms').mockImplementation(() => {
      store.rooms = mockRooms;
      store.loading = false;
      return Promise.resolve();
    });

    const wrapper = mount(RoomList);
    await flushPromises();

    expect(wrapper.text()).toContain('Test Room');
    expect(wrapper.text()).toContain('Test Description');
    expect(wrapper.text()).toContain('Capacity: 10');
    expect(wrapper.text()).toContain('Projector');
  });

  it('calls fetchRooms on mount', async () => {
    const mockFetch = vi.fn().mockResolvedValue(undefined);
    store.fetchRooms = mockFetch;

    mount(RoomList);
    await flushPromises();

    expect(mockFetch).toHaveBeenCalled();
  });
});
