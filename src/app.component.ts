
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingComponent } from './components/booking/booking.component';
import { CustomersComponent } from './components/customers/customers.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, BookingComponent, CustomersComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  activeTab = signal<'booking' | 'customers'>('booking');

  setTab(tab: 'booking' | 'customers') {
    this.activeTab.set(tab);
  }
}
