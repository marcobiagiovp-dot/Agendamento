
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SalonService } from '../../services/salon.service';

@Component({
  selector: 'app-customers',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Registration Form -->
      <div class="lg:col-span-4">
        <div class="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6 sticky top-6">
          <h3 class="text-lg font-semibold text-zinc-800 mb-6">Novo Cliente</h3>
          
          <form [formGroup]="customerForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Nome Completo</label>
              <input 
                type="text" 
                formControlName="name"
                placeholder="Ex: Ana Souza"
                class="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-sm"
              >
            </div>

            <div>
              <label class="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Telefone / WhatsApp</label>
              <input 
                type="text" 
                formControlName="phone"
                placeholder="(11) 99999-9999"
                class="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-sm"
              >
            </div>

            <div>
              <label class="block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5">Endereço</label>
              <textarea 
                formControlName="address"
                placeholder="Rua, número, bairro..."
                rows="3"
                class="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all text-sm resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              [disabled]="!customerForm.valid"
              class="w-full py-3 bg-zinc-900 text-white rounded-xl font-semibold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-zinc-200 mt-2"
            >
              Cadastrar Cliente
            </button>
          </form>
        </div>
      </div>

      <!-- Customer List -->
      <div class="lg:col-span-8">
        <div class="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
          <div class="p-6 border-b border-zinc-50 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-zinc-800">Clientes Cadastrados</h3>
            <span class="px-2.5 py-1 bg-zinc-100 text-zinc-500 text-xs font-bold rounded-full">
              {{ salonService.allCustomers().length }} Total
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="bg-zinc-50/50">
                  <th class="px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Nome</th>
                  <th class="px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Contato</th>
                  <th class="px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Endereço</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-zinc-50">
                @for (customer of salonService.allCustomers(); track customer.id) {
                  <tr class="hover:bg-zinc-50/30 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold">
                          {{ customer.name.charAt(0) }}
                        </div>
                        <span class="text-sm font-medium text-zinc-700">{{ customer.name }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="text-sm text-zinc-500">{{ customer.phone }}</span>
                    </td>
                    <td class="px-6 py-4">
                      <span class="text-sm text-zinc-400 line-clamp-1 max-w-[200px]">{{ customer.address }}</span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          
          @if (salonService.allCustomers().length === 0) {
            <div class="text-center py-20">
              <p class="text-zinc-400">Nenhum cliente cadastrado ainda.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class CustomersComponent {
  salonService = inject(SalonService);
  fb = inject(FormBuilder);

  customerForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    address: ['', Validators.required]
  });

  onSubmit() {
    if (this.customerForm.valid) {
      this.salonService.addCustomer({
        name: this.customerForm.value.name!,
        phone: this.customerForm.value.phone!,
        address: this.customerForm.value.address!
      });
      this.customerForm.reset();
      alert('Cliente cadastrado com sucesso!');
    }
  }
}
