
import { Injectable, signal, computed } from '@angular/core';
import { Customer, Appointment, TimeSlot } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class SalonService {
  private customers = signal<Customer[]>(this.getInitialCustomers());
  private appointments = signal<Appointment[]>(this.getInitialAppointments());
  
  readonly allCustomers = this.customers.asReadonly();
  readonly allAppointments = this.appointments.asReadonly();

  readonly availableTimes = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  private getInitialCustomers(): Customer[] {
    return [
      { id: '1', name: 'Maria Silva', address: 'Rua das Flores, 123', phone: '(11) 98888-7777', createdAt: Date.now() },
      { id: '2', name: 'João Pereira', address: 'Av. Paulista, 1000', phone: '(11) 97777-6666', createdAt: Date.now() }
    ];
  }

  private getInitialAppointments(): Appointment[] {
    const today = new Date().toISOString().split('T')[0];
    return [
      { id: 'a1', customerId: '1', customerName: 'Maria Silva', date: today, time: '10:00', service: 'Corte e Escova', status: 'scheduled' }
    ];
  }

  addCustomer(customer: Omit<Customer, 'id' | 'createdAt'>) {
    const newCustomer: Customer = {
      ...customer,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    this.customers.update(prev => [...prev, newCustomer]);
    return newCustomer;
  }

  bookAppointment(appointment: Omit<Appointment, 'id' | 'status'>) {
    const newAppointment: Appointment = {
      ...appointment,
      id: Math.random().toString(36).substr(2, 9),
      status: 'scheduled'
    };
    this.appointments.update(prev => [...prev, newAppointment]);
  }

  cancelAppointment(id: string) {
    this.appointments.update(prev => prev.filter(a => a.id !== id));
  }

  getTimeSlotsForDate(date: string): TimeSlot[] {
    const dayApps = this.appointments().filter(a => a.date === date);
    return this.availableTimes.map(time => {
      const app = dayApps.find(a => a.time === time);
      return {
        time,
        isOccupied: !!app,
        appointment: app
      };
    });
  }
}
