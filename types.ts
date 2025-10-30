
export enum PaymentStatus {
  Paid = 'Paid',
  Pending = 'Pending',
}

export interface Participant {
  id: string;
  name: string;
  phone: string;
  paymentStatus: PaymentStatus;
}

export interface Payout {
  date: Date;
  participant: Participant;
}

export type Frequency = 'weekly' | 'bi-weekly' | 'monthly';

export type AppState = 'setup' | 'lottery' | 'scheduling' | 'active';
