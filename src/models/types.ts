
export interface Customer {
  id: string;
  name: string;
  address: string;
  phone: string;
  createdAt: number;
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  service: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface TimeSlot {
  time: string;
  isOccupied: boolean;
  appointment?: Appointment;
}
