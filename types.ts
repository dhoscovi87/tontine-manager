export enum PaymentStatus {
  Paid = 'Paid',
  Pending = 'Pending',
}

export enum MembershipStatus {
  Pending = 'Pending',
  Active = 'Active',
}

export interface Participant {
  id: string;
  name: string;
  phone: string;
  paymentStatus: PaymentStatus;
  membershipStatus: MembershipStatus;
  tontineId: string;
}

export interface Payout {
  date: Date;
  participant: Participant;
}

export type Frequency = 'weekly' | 'bi-weekly' | 'monthly';

export interface Tontine {
  id: string;
  name: string;
  organizerId: string;
  amount?: number;
  frequency: Frequency;
  enrollmentStatus: 'open' | 'closed' | string;
  startDate?: string;
}

export type AppState = 'home' | 'createTontine' | 'joinTontine' | 'login' | 'waitingRoom' | 'setup' | 'lottery' | 'scheduling' | 'active';