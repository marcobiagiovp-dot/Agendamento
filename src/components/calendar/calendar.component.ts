
import { Component, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-zinc-800">Selecione o Dia</h3>
        <div class="flex gap-2">
          <button (click)="prevMonth()" class="p-2 hover:bg-zinc-50 rounded-full transition-colors">
            <svg class="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <button (click)="nextMonth()" class="p-2 hover:bg-zinc-50 rounded-full transition-colors">
            <svg class="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-7 gap-1 mb-2">
        @for (day of weekDays; track day) {
          <div class="text-center text-xs font-medium text-zinc-400 py-2">{{ day }}</div>
        }
      </div>

      <div class="grid grid-cols-7 gap-1">
        @for (blank of blanks(); track $index) {
          <div class="aspect-square"></div>
        }
        @for (date of daysInMonth(); track date.getTime()) {
          <button 
            (click)="selectDate(date)"
            [class]="getDateClasses(date)"
          >
            {{ date.getDate() }}
          </button>
        }
      </div>
    </div>
  `
})
export class CalendarComponent {
  dateSelected = output<string>();
  
  viewDate = signal(new Date());
  selectedDate = signal(new Date());

  weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  blanks = computed(() => {
    const firstDay = new Array(new Date(this.viewDate().getFullYear(), this.viewDate().getMonth(), 1).getDay()).fill(0);
    return firstDay;
  });

  daysInMonth = computed(() => {
    const year = this.viewDate().getFullYear();
    const month = this.viewDate().getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => new Date(year, month, i + 1));
  });

  prevMonth() {
    const current = this.viewDate();
    this.viewDate.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  nextMonth() {
    const current = this.viewDate();
    this.viewDate.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  selectDate(date: Date) {
    this.selectedDate.set(date);
    const isoDate = date.toISOString().split('T')[0];
    this.dateSelected.emit(isoDate);
  }

  getDateClasses(date: Date): string {
    const isSelected = date.toDateString() === this.selectedDate().toDateString();
    const isToday = date.toDateString() === new Date().toDateString();
    
    let base = "aspect-square flex items-center justify-center text-sm rounded-xl transition-all ";
    
    if (isSelected) {
      base += "bg-rose-500 text-white font-bold shadow-md shadow-rose-200 scale-105";
    } else if (isToday) {
      base += "bg-zinc-100 text-rose-600 font-semibold";
    } else {
      base += "hover:bg-zinc-50 text-zinc-600";
    }
    
    return base;
  }
}
