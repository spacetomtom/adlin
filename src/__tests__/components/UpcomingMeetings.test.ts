import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import UpcomingMeetings from '../../components/UpcomingMeetings.vue';
import { useRoomStore } from '../../stores/roomStore';

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('UpcomingMeetings.vue', () => {
  let store: ReturnType<typeof useRoomStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useRoomStore();
  });

  it('displays "No upcoming meetings" when there are no meetings', async () => {
    vi.spyOn(store, 'getUpcomingMeetings').mockResolvedValue([]);
    
    const wrapper = mount(UpcomingMeetings);
    await flushPromises();

    expect(wrapper.text()).toContain('No upcoming meetings');
  });

  it('displays upcoming meetings correctly', async () => {
    const mockMeetings = [{
      id: '1',
      room_id: '1',
      title: 'Test Meeting',
      start_time: '2025-03-28T10:00:00Z',
      end_time: '2025-03-28T11:00:00Z',
      description: 'Test Description',
      created_at: '2025-03-28T09:00:00Z',
      rooms: {
        name: 'Test Room'
      }
    }];

    vi.spyOn(store, 'getUpcomingMeetings').mockResolvedValue(mockMeetings);

    const wrapper = mount(UpcomingMeetings);
    await flushPromises();

    expect(wrapper.text()).toContain('Test Meeting');
    expect(wrapper.text()).toContain('Test Room');
    expect(wrapper.text()).toContain('Test Description');
  });

  it('formats date and time correctly', () => {
    const wrapper = mount(UpcomingMeetings);
    const formattedDateTime = (wrapper.vm as any).formatDateTime('2025-03-28T10:30:00Z');
    expect(formattedDateTime).toBe('28/03/2025 10:30');
  });

  it('refreshes meetings when refreshTrigger changes', async () => {
    const mockGetUpcomingMeetings = vi.fn().mockResolvedValue([]);
    store.getUpcomingMeetings = mockGetUpcomingMeetings;

    const wrapper = mount(UpcomingMeetings);
    await flushPromises();

    // simulate refresh trigger change
    store.refreshTrigger++;
    await flushPromises();

    expect(mockGetUpcomingMeetings).toHaveBeenCalledTimes(2); // once on mount + once on refresh
  });
});
