import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ReservationForm from '../../components/ReservationForm.vue';
import { useRoomStore } from '../../stores/roomStore';

describe('ReservationForm.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders duration options correctly', () => {
    const wrapper = mount(ReservationForm);
    const durations = wrapper.findAll('.grid-cols-2 > div');
    
    expect(durations.length).toBe(4);
    expect(durations[0].text()).toContain('15 minutes');
    expect(durations[1].text()).toContain('30 minutes');
  });

  it('updates selected duration when clicking duration option', async () => {
    const wrapper = mount(ReservationForm);
    const durationOptions = wrapper.findAll('.grid-cols-2 > div');
    
    await durationOptions[0].trigger('click');
    expect(wrapper.vm.duration).toBe(15);
  });

  it('disables search button when start time is not set', () => {
    const wrapper = mount(ReservationForm);
    const searchButton = wrapper.find('button[type="button"]');
    
    expect(searchButton.attributes('disabled')).toBeDefined();
  });

  it('calls createReservation when form is submitted with valid data', async () => {
    const wrapper = mount(ReservationForm);
    const store = useRoomStore();
    const mockCreateReservation = vi.fn();
    store.createReservation = mockCreateReservation;
  
    // Accès aux refs internes via wrapper.vm (car pas exposées via props)
    (wrapper.vm as any).startTime = '2025-03-28T10:00';
    (wrapper.vm as any).selectedRoom = {
      id: '1',
      name: 'Test Room',
      description: '',
      capacity: 10,
      equipements: [],
      created_at: '',
      updated_at: ''
    };
    (wrapper.vm as any).title = 'Test Meeting';
  
    await wrapper.find('form').trigger('submit.prevent');
  
    expect(mockCreateReservation).toHaveBeenCalled();
  });
});