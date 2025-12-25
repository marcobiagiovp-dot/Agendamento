
import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SalonService } from '../../services/salon.service';
import { CalendarComponent } from '../calendar/calendar.component';

@Component({
  selector: 'app-booking',
  imports: [CommonModule, ReactiveFormsModule, CalendarComponent],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Calendar and Slots -->
      <div class="lg:col-span-8 space-y-6">
        <app-calendar (dateSelected)="onDateSelected($event)"></app-calendar>

        <div class="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-zinc-800">Horários para {{ formattedSelectedDate() }}</h3>
            <div class="flex gap-4 text-xs">
              <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-zinc-100"></span> Livre</div>
              <div class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-rose-100"></span> Ocupado</div>
            </div>
          </div>

          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            @for (slot of currentSlots(); track slot.time) {
              <button 
                (click)="selectSlot(slot)"
                [disabled]="slot.isOccupied"
                [class]="getSlotClasses(slot)"
              >
                <span class="text-sm font-medium">{{ slot.time }}</span>
                @if (slot.isOccupied) {
                   <span class="text-[10px] opacity-70">Ocupado</span>
                } @else {
                   <span class="text-[10px] opacity-70">Disponível</span>
                }
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Booking Form -->
      <div class="lg:col-span-4">
        <div class="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 sticky top-6">
          <h3 class="text-lg font-semibold text-zinc-800 mb-6">Confirmar Agendamento</h3>
          
          @if (selectedTimeSlot()) {
            <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()" class="space-y-4">
              <div>
                <label class="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Horário Selecionado</label>
                <div class="flex items-center gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                   <svg class="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                   <span class="text-zinc-700 font-semibold">{{ selectedDate() }} às {{ selectedTimeSlot() }}</span>
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Cliente</label>
                <select formControlName="customerId" class="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-sm">
                  <option value="">Selecione um cliente...</option>
                  @for (c of salonService.allCustomers(); track c.id) {
                    <option [value]="c.id">{{ c.name }}</option>
                  }
                </select>
              </div>

              <div>
                <label class="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Serviço</label>
                <select formControlName="service" class="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-sm">
                  <option value="Corte Feminino">Corte Feminino</option>
                  <option value="Corte Masculino">Corte Masculino</option>
                  <option value="Escova">Escova</option>
                  <option value="Coloração">Coloração</option>
                  <option value="Hidratação">Hidratação</option>
                  <option value="Manicure">Manicure</option>
                </select>
              </div>

              <button 
                type="submit" 
                [disabled]="!bookingForm.valid"
                class="w-full py-3 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-zinc-200 mt-2"
              >
                Agendar Horário
              </button>
            </form>
          } @else {
            <div class="text-center py-12 px-6">
              <div class="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-rose-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <p class="text-zinc-500 text-sm">Selecione um horário no calendário para iniciar o agendamento.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class BookingComponent {
  salonService = inject(SalonService);
  fb = inject(FormBuilder);

  selectedDate = signal(new Date().toISOString().split('T')[0]);
  selectedTimeSlot = signal<string | null>(null);

  bookingForm = this.fb.group({
    customerId: ['', Validators.required],
    service: ['Corte Feminino', Validators.required]
  });

  currentSlots = computed(() => this.salonService.getTimeSlotsForDate(this.selectedDate()));

  formattedSelectedDate() {
    const [year, month, day] = this.selectedDate().split('-');
    return `${day}/${month}/${year}`;
  }

  onDateSelected(date: string) {
    this.selectedDate.set(date);
    this.selectedTimeSlot.set(null);
  }

  selectSlot(slot: any) {
    if (!slot.isOccupied) {
      this.selectedTimeSlot.set(slot.time);
    }
  }

  getSlotClasses(slot: any): string {
    const isSelected = this.selectedTimeSlot() === slot.time;
    let base = "flex flex-col items-center justify-center py-3 rounded-xl border transition-all ";
    
    if (slot.isOccupied) {
      base += "bg-rose-50 border-rose-100 text-rose-400 cursor-not-allowed";
    } else if (isSelected) {
      base += "bg-zinc-900 border-zinc-900 text-white shadow-lg scale-105 z-10";
    } else {
      base += "bg-white border-zinc-100 text-zinc-600 hover:border-rose-300 hover:bg-rose-50/30";
    }
    
    return base;
  }

  onSubmit() {
    if (this.bookingForm.valid && this.selectedTimeSlot()) {
      const customerId = this.bookingForm.value.customerId!;
      const customer = this.salonService.allCustomers().find(c => c.id === customerId);
      
      this.salonService.bookAppointment({
        customerId,
        customerName: customer?.name || 'Cliente',
        date: this.selectedDate(),
        time: this.selectedTimeSlot()!,
        service: this.bookingForm.value.service!
      });

      this.selectedTimeSlot.set(null);
      this.bookingForm.reset({ service: 'Corte Feminino', customerId: '' });
      alert('Agendamento realizado com sucesso!');
    }
  }
}
