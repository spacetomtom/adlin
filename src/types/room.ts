export interface Equipment {
  name: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  equipements: Equipment[];
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  room_id: string;
  start_time: string;
  end_time: string;
  title: string;
  description?: string;
  created_at: string;
  rooms?: {
    name: string;
  };
}