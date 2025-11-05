

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AppState, Participant, PaymentStatus, Payout, Frequency, Tontine, MembershipStatus } from './types';
import { UsersIcon, CalendarIcon, ShuffleIcon, CheckCircleIcon, XCircleIcon, PlusIcon, Trash2Icon, EditIcon, SendIcon, ArrowRightIcon, ChevronUpIcon, Share2Icon, ClipboardIcon, QrCodeIcon, LogInIcon, CheckIcon, TvIcon, ShieldCheckIcon } from './components/icons';


// --- PARTICIPANT LIST COMPONENT ---
interface ParticipantListProps {
    participants: Participant[];
    onDelete?: (id: string) => void;
    onEdit?: (participant: Participant) => void;
    onApprove?: (id: string) => void;
    onToggleStatus?: (id: string) => void;
    isTontineActive: boolean;
    isOrganizerView: boolean;
    tontineStatus: string;
    lotteryOrder?: Participant[];
}

const ParticipantList: React.FC<ParticipantListProps> = ({ participants, onDelete, onEdit, onApprove, onToggleStatus, isTontineActive, isOrganizerView, tontineStatus, lotteryOrder }) => {
    const participantOrderMap = useMemo(() => {
        if (!lotteryOrder || lotteryOrder.length === 0) return new Map<string, number[]>();
        const map = new Map<string, number[]>();
        lotteryOrder.forEach((p, index) => {
            const positions = map.get(p.id) || [];
            positions.push(index + 1);
            map.set(p.id, positions);
        });
        return map;
    }, [lotteryOrder]);
    const showOrderColumn = participantOrderMap.size > 0;
    
    if (participants.length === 0) {
        return <p className="text-center text-text-muted py-4">No participants added yet.</p>;
    }

    return (
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full">
                <thead className="border-b border-base-300">
                  <tr>
                    {showOrderColumn && <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-text-main sm:pl-0">Order</th>}
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-text-main sm:pl-0">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-text-main">Shares</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-main">Phone</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-main">Membership</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-main">Status</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-text-main">Payment</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-300">
                  {participants.map((p) => {
                    const order = participantOrderMap.get(p.id);
                    return (
                        <tr key={p.id}>
                          {showOrderColumn && (
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-primary sm:pl-0">
                              {order ? order.map(o => `#${o}`).join(', ') : ''}
                            </td>
                          )}
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-text-main sm:pl-0">{p.name}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-text-muted text-center">{p.shares || 1}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-text-muted">{p.phone}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.membershipStatus === MembershipStatus.Active ? 'bg-accent-success/20 text-accent-success' : 'bg-accent-pending/20 text-accent-pending'}`}>
                                  {p.membershipStatus}
                              </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-500/20 text-sky-400">
                                  {tontineStatus}
                              </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                              {onToggleStatus && isTontineActive ? (
                                    <button onClick={() => onToggleStatus && onToggleStatus(p.id)} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-colors ${p.paymentStatus === PaymentStatus.Paid ? 'bg-accent-success/20 text-accent-success' : 'bg-accent-pending/20 text-accent-pending'}`}>
                                        {p.paymentStatus === PaymentStatus.Paid ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />}
                                        {p.paymentStatus}
                                    </button>
                              ) : (
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.paymentStatus === PaymentStatus.Paid ? 'bg-green-500/20 text-green-400' : 'bg-pink-500/20 text-pink-400'}`}>
                                        {p.paymentStatus}
                                    </span>
                              )}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                              {!isTontineActive && onEdit && onDelete && onApprove && isOrganizerView && (
                                 <div className="flex justify-end gap-3 items-center">
                                    {p.membershipStatus === MembershipStatus.Pending ? (
                                         <button onClick={() => onApprove(p.id)} className="flex items-center gap-1.5 px-3 py-1 text-sm bg-accent-success/20 text-accent-success rounded-md hover:bg-accent-success/30">
                                             <CheckIcon className="w-4 h-4" /> Approve
                                         </button>
                                    ) : (
                                        <>
                                            <button onClick={() => onEdit(p)} className="text-primary hover:text-purple-400"><EditIcon className="w-5 h-5"/></button>
                                            <button onClick={() => onDelete(p.id)} className="text-accent-pending hover:text-pink-400"><Trash2Icon className="w-5 h-5"/></button>
                                        </>
                                    )}
                                </div>
                              )}
                          </td>
                        </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    );
};


// --- MOCK DATABASE ---
// In a real app, this would be your backend database.
const MOCK_DATA = {
    tontines: [
        {
          id: 'TEST123',
          name: 'Office Lunch Club',
          organizerId: 'mock-1',
          amount: 20,
          frequency: 'weekly',
          enrollmentStatus: 'open',
          startDate: '2025-01-06',
        } as Tontine,
    ],
    participants: [
      { id: 'mock-1', tontineId: 'TEST123', name: 'Alice Organizer', phone: '1112223333', paymentStatus: PaymentStatus.Pending, membershipStatus: MembershipStatus.Active, shares: 1, totpSecret: 'JBSWY3DPEHPK3PXP', isTotpVerified: true },
      { id: 'mock-2', tontineId: 'TEST123', name: 'Bob Member', phone: '4445556666', paymentStatus: PaymentStatus.Pending, membershipStatus: MembershipStatus.Active, shares: 2 },
      { id: 'mock-3', tontineId: 'TEST123', name: 'Yeni', phone: '6667778888', paymentStatus: PaymentStatus.Pending, membershipStatus: MembershipStatus.Active, shares: 1 },
    ] as Participant[],
};
// ----------------------------


// --- HELPER FUNCTIONS ---
const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
};

const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// Generates a Base32-like secret for TOTP.
const generateTOTPSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 16; i++) {
        secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
};


// --- MODAL COMPONENT ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
      <div className="bg-base-200 border border-base-300 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-base-300 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-text-main">{title}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-main">
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};


// --- PARTICIPANT FORM ---
interface ParticipantFormProps {
    onSave: (participant: { name: string; phone: string; shares: number }) => void;
    onClose: () => void;
    participantToEdit?: Participant | null;
}

const ParticipantForm: React.FC<ParticipantFormProps> = ({ onSave, onClose, participantToEdit }) => {
    const [name, setName] = useState(participantToEdit?.name || '');
    const [phone, setPhone] = useState(participantToEdit?.phone || '');
    const [shares, setShares] = useState(participantToEdit?.shares || 1);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name.trim() || !phone.trim()) {
            setError('Name and Phone Number are required.');
            return;
        }
        if (!/^\d{10,15}$/.test(phone.replace(/\D/g, ''))) {
             setError('Please enter a valid phone number (10-15 digits).');
             return;
        }
        if (Number(shares) < 1) {
            setError('Shares must be at least 1.');
            return;
        }
        onSave({ name, phone, shares: Number(shares) });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-text-muted">Full Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm" placeholder="John Doe" />
                </div>
                <div>
                    <label htmlFor="shares" className="block text-sm font-medium text-text-muted">Shares</label>
                    <input type="number" id="shares" value={shares} onChange={(e) => setShares(Math.max(1, parseInt(e.target.value, 10) || 1))} min="1" className="mt-1 block w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm" placeholder="1" />
                </div>
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-text-muted">WhatsApp Number (with country code)</label>
                <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm" placeholder="15551234567" />
            </div>
            {error && <p className="text-sm text-accent-pending">{error}</p>}
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-base-300 text-text-main rounded-md hover:bg-gray-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-purple-500 transition-colors shadow-md hover:shadow-glow-primary">{participantToEdit ? 'Save Changes' : 'Add Participant'}</button>
            </div>
        </form>
    );
};

// --- CARD COMPONENT ---
interface CardProps {
  title: string;
  icon: React.ReactNode;
  step: number;
  isActive: boolean;
  isCompleted: boolean;
  onHeaderClick?: () => void;
  isOpen: boolean;
  children: React.ReactNode;
}

const StepCard: React.FC<CardProps> = ({ title, icon, children, step, isActive, isCompleted, onHeaderClick, isOpen }) => {
  const headerStyles = `flex justify-between items-center p-4 rounded-t-lg transition-all duration-300 ${onHeaderClick ? 'cursor-pointer' : ''}`;
  const statusStyles = isCompleted ? 'bg-secondary' : 'bg-primary';

  return (
      <div className={`bg-base-200/80 backdrop-blur-sm rounded-lg border border-base-300/50 transition-all duration-300 ${isActive ? 'shadow-glow-primary' : ''}`}>
        <div className={headerStyles} onClick={onHeaderClick}>
          <div className="flex items-center gap-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-lg ${statusStyles}`}>{isCompleted ? <CheckCircleIcon className="w-5 h-5"/> : step}</div>
            <h2 className="text-xl font-semibold text-text-main">{title}</h2>
          </div>
          {onHeaderClick && <ChevronUpIcon className={`w-6 h-6 text-text-muted transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`} />}
        </div>
        {isOpen && (
            <div className="p-6 border-t border-base-300/50">
                {children}
            </div>
        )}
    </div>
  );
};

// --- CREATE TONTINE FORM ---
interface CreateTontineFormProps {
    onCreate: (details: Omit<Tontine, 'id' | 'organizerId' | 'enrollmentStatus'> & { organizerName: string; organizerPhone: string; joinDeadline?: string; }) => void;
    onBack: () => void;
}
const CreateTontineForm: React.FC<CreateTontineFormProps> = ({ onCreate, onBack }) => {
    const [name, setName] = useState('');
    const [organizerName, setOrganizerName] = useState('');
    const [organizerPhone, setOrganizerPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [frequency, setFrequency] = useState<Frequency>('monthly');
    const [joinDeadline, setJoinDeadline] = useState('');
    const [startDate, setStartDate] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !organizerName.trim() || !organizerPhone.trim()) {
            setError('Tontine Name, Your Full Name, and Your WhatsApp Number are required.');
            return;
        }
        if (!/^\d{10,15}$/.test(organizerPhone.replace(/\D/g, ''))) {
             setError('Please enter a valid WhatsApp number (10-15 digits).');
             return;
        }
        onCreate({
            name,
            organizerName,
            organizerPhone,
            amount: amount ? parseFloat(amount) : undefined,
            frequency,
            joinDeadline: joinDeadline || undefined,
            startDate: startDate || undefined
        });
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-base-200/80 backdrop-blur-sm rounded-lg border border-base-300/50">
                <div className="p-4 border-b border-base-300/50">
                    <h2 className="text-xl font-semibold text-text-main">Create a New Tontine</h2>
                    <p className="text-sm text-text-muted mt-1">Fill in the details for your new tontine group. Fields marked with <span className="text-accent-pending">*</span> are required.</p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label htmlFor="tontineName" className="block text-sm font-medium text-text-muted">Tontine Name <span className="text-accent-pending">*</span></label>
                        <input type="text" id="tontineName" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm" placeholder="e.g., Family Savings Goal" />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="organizerName" className="block text-sm font-medium text-text-muted">Your Full Name <span className="text-accent-pending">*</span></label>
                            <input type="text" id="organizerName" value={organizerName} onChange={e => setOrganizerName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm" placeholder="e.g., Jane Doe" />
                        </div>
                        <div>
                            <label htmlFor="organizerPhone" className="block text-sm font-medium text-text-muted">Your WhatsApp Number <span className="text-accent-pending">*</span></label>
                            <input type="tel" id="organizerPhone" value={organizerPhone} onChange={e => setOrganizerPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm" placeholder="15551234567" />
                        </div>
                    </div>
                    {error && <p className="text-sm text-accent-pending">{error}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-base-300/50 pt-6">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-text-muted">Contribution Amount ($)</label>
                            <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm" placeholder="e.g., 100" />
                        </div>
                        <div>
                            <label htmlFor="create-frequency" className="block text-sm font-medium text-text-muted">Payment Frequency</label>
                            <select id="create-frequency" value={frequency} onChange={e => setFrequency(e.target.value as Frequency)} className="mt-1 block w-full pl-3 pr-10 py-2 bg-base-100 border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                <option value="weekly">Weekly</option>
                                <option value="bi-weekly">Bi-weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="joinDeadline" className="block text-sm font-medium text-text-muted">Enrollment Deadline</label>
                            <input type="date" id="joinDeadline" value={joinDeadline} onChange={e => setJoinDeadline(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"/>
                        </div>
                        <div>
                             <label htmlFor="create-startDate" className="block text-sm font-medium text-text-muted">Tontine Start Date</label>
                            <input type="date" id="create-startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"/>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-base-300/50">
                        <button type="button" onClick={onBack} className="px-4 py-2 bg-base-300 text-text-main rounded-md hover:bg-gray-600 transition-colors">Back</button>
                        <button type="submit" className="px-5 py-2 flex items-center gap-2 bg-primary text-white font-semibold rounded-md hover:bg-purple-500 transition-colors shadow-md hover:shadow-glow-primary">
                            Next: Secure Account <ArrowRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

type JoinResult = 'success' | 'invalid_id' | 'is_organizer';

// --- JOIN TONTINE FORM ---
interface JoinTontineFormProps {
    onJoin: (details: { tontineId: string; name: string; phone: string }) => JoinResult;
    onBack: () => void;
    initialTontineId?: string;
}
const JoinTontineForm: React.FC<JoinTontineFormProps> = ({ onJoin, onBack, initialTontineId = '' }) => {
    const [tontineId, setTontineId] = useState(initialTontineId);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!tontineId.trim() || !name.trim() || !phone.trim()) {
            setError('All fields are required.');
            return;
        }
        if (!/^\d{10,15}$/.test(phone.replace(/\D/g, ''))) {
             setError('Please enter a valid WhatsApp number (10-15 digits).');
             return;
        }
        
        const result = onJoin({ tontineId, name, phone });

        if (result === 'invalid_id') {
            setError('Invalid Tontine ID. Please check the ID and try again.');
        } else if (result === 'is_organizer') {
            setError('You are the organizer of this tontine. You cannot join it again as a participant.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-base-200/80 backdrop-blur-sm rounded-lg border border-base-300/50">
                <div className="p-4 border-b border-base-300/50">
                    <h2 className="text-xl font-semibold text-text-main">Join an Existing Tontine</h2>
                    <p className="text-sm text-text-muted mt-1">Enter the Tontine ID and your details to join the group.</p>
                    <p className="text-xs text-secondary mt-1">Psst! Try using the ID <code className="bg-base-100 p-1 rounded-sm font-mono">TEST123</code> to join a sample group.</p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label htmlFor="tontineId" className="block text-sm font-medium text-text-muted">Tontine ID <span className="text-accent-pending">*</span></label>
                        <input type="text" id="tontineId" value={tontineId} onChange={e => setTontineId(e.target.value.toUpperCase())} className="mt-1 block w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary sm:text-sm" placeholder="e.g., AB12CD" />
                    </div>
                    <div>
                        <label htmlFor="joinName" className="block text-sm font-medium text-text-muted">Your Full Name <span className="text-accent-pending">*</span></label>
                        <input type="text" id="joinName" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary sm:text-sm" placeholder="Jane Smith" />
                    </div>
                    <div>
                        <label htmlFor="joinPhone" className="block text-sm font-medium text-text-muted">Your WhatsApp Number (with country code) <span className="text-accent-pending">*</span></label>
                        <input type="tel" id="joinPhone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary sm:text-sm" placeholder="15551234567" />
                    </div>
                    {error && <p className="text-sm text-accent-pending mt-1">{error}</p>}
                    <div className="flex justify-end gap-3 pt-4 border-t border-base-300/50">
                        <button type="button" onClick={onBack} className="px-4 py-2 bg-base-300 text-text-main rounded-md hover:bg-gray-600 transition-colors">Back</button>
                        <button type="submit" className="px-5 py-2 flex items-center gap-2 bg-secondary text-white font-semibold rounded-md hover:bg-teal-500 transition-colors shadow-md hover:shadow-glow-secondary">
                            Join Tontine <ArrowRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- PARTICIPANT LOGIN FORM ---
interface ParticipantLoginFormProps {
    onLogin: (phone: string) => boolean;
    onBack: () => void;
}
const ParticipantLoginForm: React.FC<ParticipantLoginFormProps> = ({ onLogin, onBack }) => {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!phone.trim()) {
            setError('Phone number is required.');
            return;
        }
        if (!/^\d{10,15}$/.test(phone.replace(/\D/g, ''))) {
             setError('Please enter a valid WhatsApp number (10-15 digits).');
             return;
        }
        
        const success = onLogin(phone);
        if (!success) {
            setError('No tontine found for this phone number. Please check the number or join a group.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-base-200/80 backdrop-blur-sm rounded-lg border border-base-300/50">
                <div className="p-4 border-b border-base-300/50">
                    <h2 className="text-xl font-semibold text-text-main">Participant Login</h2>
                    <p className="text-sm text-text-muted mt-1">Enter your WhatsApp phone number to view your active groups.</p>
                     <p className="text-xs text-secondary mt-1">Psst! Try logging in with <code className="bg-base-100 p-1 rounded-sm font-mono">4445556666</code> to view the participant dashboard.</p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label htmlFor="loginPhone" className="block text-sm font-medium text-text-muted">Your WhatsApp Number (with country code) <span className="text-accent-pending">*</span></label>
                        <input type="tel" id="loginPhone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm" placeholder="15551234567" />
                    </div>
                    {error && <p className="text-sm text-accent-pending mt-1">{error}</p>}
                    <div className="flex justify-end gap-3 pt-4 border-t border-base-300/50">
                        <button type="button" onClick={onBack} className="px-4 py-2 bg-base-300 text-text-main rounded-md hover:bg-gray-600 transition-colors">Back</button>
                        <button type="submit" className="px-5 py-2 flex items-center gap-2 bg-primary text-white font-semibold rounded-md hover:bg-purple-500 transition-colors shadow-md hover:shadow-glow-primary">
                            Find My Tontine <ArrowRightIcon className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- ORGANIZER LOGIN FORM ---
interface OrganizerLoginFormProps {
    onLogin: (phone: string, totpCode: string) => boolean;
    onBack: () => void;
}
const OrganizerLoginForm: React.FC<OrganizerLoginFormProps> = ({ onLogin, onBack }) => {
    const [phone, setPhone] = useState('');
    const [totpCode, setTotpCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!phone.trim() || !totpCode.trim()) {
            setError('Phone number and authenticator code are required.');
            return;
        }
        if (!/^\d{6}$/.test(totpCode)) {
            setError('Please enter a valid 6-digit authenticator code.');
            return;
        }
        
        const success = onLogin(phone, totpCode);
        if (!success) {
            setError('Login failed. Please check your phone number and authenticator code.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-base-200/80 backdrop-blur-sm rounded-lg border border-base-300/50">
                <div className="p-4 border-b border-base-300/50">
                    <h2 className="text-xl font-semibold text-text-main">Organizer Login</h2>
                    <p className="text-sm text-text-muted mt-1">Enter your phone number and the 6-digit code from your authenticator app.</p>
                    <p className="text-xs text-secondary mt-1">Psst! Try logging in with phone <code className="bg-base-100 p-1 rounded-sm font-mono">1112223333</code> and any 6-digit code.</p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label htmlFor="loginPhone" className="block text-sm font-medium text-text-muted">Your WhatsApp Number (with country code) <span className="text-accent-pending">*</span></label>
                        <input type="tel" id="loginPhone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm" placeholder="15551234567" />
                    </div>
                    <div>
                        <label htmlFor="totpCode" className="block text-sm font-medium text-text-muted">6-Digit Authenticator Code <span className="text-accent-pending">*</span></label>
                        <input type="text" id="totpCode" value={totpCode} onChange={e => setTotpCode(e.target.value)} maxLength={6} className="mt-1 block w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm" placeholder="123456" />
                    </div>
                    {error && <p className="text-sm text-accent-pending mt-1">{error}</p>}
                    <div className="flex justify-end gap-3 pt-4 border-t border-base-300/50">
                        <button type="button" onClick={onBack} className="px-4 py-2 bg-base-300 text-text-main rounded-md hover:bg-gray-600 transition-colors">Back</button>
                        <button type="submit" className="px-5 py-2 flex items-center gap-2 bg-primary text-white font-semibold rounded-md hover:bg-purple-500 transition-colors shadow-md hover:shadow-glow-primary">
                           <LogInIcon className="w-5 h-5"/> Secure Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// --- SHARE MODAL ---
interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    tontine: Tontine;
}
const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, tontine }) => {
    const [copied, setCopied] = useState('');
    const joinLink = `${window.location.origin}${window.location.pathname}?join=${tontine.id}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(joinLink)}`;

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(''), 2000);
    };
    
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Invite others to "${tontine.name}"`}>
            <div className="space-y-6">
                <p className="text-text-muted text-sm">Share this information with participants so they can join your tontine group.</p>
                <div>
                    <label className="block text-sm font-medium text-text-muted">Tontine ID</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input type="text" readOnly value={tontine.id} className="block w-full px-3 py-2 bg-base-100 border border-base-300 rounded-l-md sm:text-sm" />
                        <button onClick={() => handleCopy(tontine.id, 'id')} className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-base-300 bg-base-300/50 text-text-muted hover:bg-base-300">
                           {copied === 'id' ? <CheckCircleIcon className="w-5 h-5 text-accent-success" /> : <ClipboardIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-text-muted">Shareable Link</label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                        <input type="text" readOnly value={joinLink} className="block w-full px-3 py-2 bg-base-100 border border-base-300 rounded-l-md sm:text-sm" />
                        <button onClick={() => handleCopy(joinLink, 'link')} className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-base-300 bg-base-300/50 text-text-muted hover:bg-base-300">
                            {copied === 'link' ? <CheckCircleIcon className="w-5 h-5 text-accent-success" /> : <ClipboardIcon className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-4 p-4 bg-base-100 rounded-lg">
                    <QrCodeIcon className="w-8 h-8 text-text-muted"/>
                    <img src={qrCodeUrl} alt="Tontine Join Link QR Code" className="rounded-md border border-base-300"/>
                    <p className="text-xs text-text-muted">Scan to get join link</p>
                </div>
            </div>
        </Modal>
    );
};

// --- LOTTERY TYPE MODAL ---
interface LotteryTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (type: 'automatic' | 'live') => void;
}
const LotteryTypeModal: React.FC<LotteryTypeModalProps> = ({ isOpen, onClose, onSelect }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Choose Lottery Type">
            <div className="grid grid-cols-1 gap-4">
                <button onClick={() => onSelect('automatic')} className="text-left p-4 bg-base-100 rounded-lg border-2 border-base-300 hover:border-primary transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/20 p-3 rounded-full">
                           <ShuffleIcon className="w-6 h-6 text-primary"/>
                        </div>
                        <div>
                           <h3 className="text-lg font-semibold text-text-main">Automatic Lottery</h3>
                           <p className="text-sm text-text-muted">Instantly and randomly generate the payout order. Quick and easy.</p>
                        </div>
                    </div>
                </button>
                <button onClick={() => onSelect('live')} className="text-left p-4 bg-base-100 rounded-lg border-2 border-base-300 hover:border-secondary transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="bg-secondary/20 p-3 rounded-full">
                           <TvIcon className="w-6 h-6 text-secondary"/>
                        </div>
                        <div>
                           <h3 className="text-lg font-semibold text-text-main">Live Lottery</h3>
                           <p className="text-sm text-text-muted">Schedule a date for the event. Share an invite and run the lottery live.</p>
                        </div>
                    </div>
                </button>
            </div>
        </Modal>
    );
};


// --- LIVE LOTTERY WHEEL ---
const LiveLotteryWheel: React.FC<{ entries: {id: string, name: string}[], rotation: number, isSpinning: boolean }> = ({ entries, rotation, isSpinning }) => {
    const numEntries = entries.length;
    if (numEntries === 0) {
        return <div className="relative w-96 h-96 rounded-full bg-base-300 flex items-center justify-center text-text-main font-bold text-xl">Lottery Complete!</div>;
    }

    const angle = 360 / numEntries;
    const colors = ['#9333ea', '#14b8a6', '#f472b6', '#4ade80', '#f59e0b', '#3b82f6'];

    return (
        <div className="relative w-96 h-96">
            <div 
                className="absolute inset-0 rounded-full transition-transform duration-[4000ms] ease-out"
                style={{ 
                    transform: `rotate(${rotation}deg)`,
                    background: `conic-gradient(${entries.map((_, i) => `${colors[i % colors.length]} ${i * angle}deg, ${colors[i % colors.length]} ${(i + 1) * angle}deg`).join(', ')})`
                }}
            />
            {entries.map((entry, i) => {
                 const entryAngle = (i * angle) + (angle / 2);
                 const textRotation = entryAngle > 90 && entryAngle < 270 ? 180 : 0;
                 return (
                    <div 
                        key={`${entry.id}-${i}`}
                        className="absolute w-full h-full"
                        style={{ transform: `rotate(${entryAngle}deg)`}}
                    >
                        <span className="absolute left-1/2 top-4 -translate-x-1/2 text-white font-bold text-sm" style={{ transform: `translateX(-50%) rotate(${textRotation}deg)`}}>
                           {entry.name}
                        </span>
                    </div>
                 );
            })}
        </div>
    );
};


export default function App() {
    // This state simulates our backend database.
    const [db, setDb] = useState(MOCK_DATA);

    const [appState, setAppState] = useState<AppState>('home');
    const [tontine, setTontine] = useState<Tontine | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [currentUser, setCurrentUser] = useState<Participant | null>(null);
    const [lotteryOrder, setLotteryOrder] = useState<Participant[]>([]);
    const [payoutSchedule, setPayoutSchedule] = useState<Payout[]>([]);
    const [frequency, setFrequency] = useState<Frequency>('monthly');
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [joiningTontineId, setJoiningTontineId] = useState('');

    const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
    const [openStep, setOpenStep] = useState(1);
    
    // State for managing deadline editing
    const [isEditingDeadline, setIsEditingDeadline] = useState(false);
    const [deadlineType, setDeadlineType] = useState<'open' | 'closed' | 'date'>('open');
    const [deadlineDate, setDeadlineDate] = useState('');

    // State for new lottery flow
    const [isLotteryTypeModalOpen, setIsLotteryTypeModalOpen] = useState(false);
    const [lotteryType, setLotteryType] = useState<'automatic' | 'live' | null>(null);
    const [liveLotteryDate, setLiveLotteryDate] = useState('');
    const [copiedLiveLink, setCopiedLiveLink] = useState(false);
    
    // State for Live Lottery feature
    const [presentParticipants, setPresentParticipants] = useState<Set<string>>(new Set());
    const [wheelEntries, setWheelEntries] = useState<{ id: string; name: string; }[]>([]);
    const [spinResult, setSpinResult] = useState<{ position: number; participant: { id: string; name: string; } }[]>([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [wheelRotation, setWheelRotation] = useState(0);


    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const joinId = urlParams.get('join');
        if (joinId) {
            setJoiningTontineId(joinId.toUpperCase());
            setAppState('joinTontine');
        }
    }, []);

    const resetTontine = () => {
        setAppState('home');
        setTontine(null);
        setParticipants([]);
        setLotteryOrder([]);
        setPayoutSchedule([]);
        setCurrentUser(null);
        setFrequency('monthly');
        setStartDate(new Date().toISOString().split('T')[0]);
        setOpenStep(1);
        setJoiningTontineId('');
        setLotteryType(null);
        setLiveLotteryDate('');
        window.history.pushState({}, document.title, window.location.pathname);
    };

    const handleCreateTontine = (details: Omit<Tontine, 'id' | 'organizerId' | 'enrollmentStatus'> & { organizerName: string; organizerPhone: string; joinDeadline?: string; }) => {
        const { organizerName, organizerPhone, joinDeadline, ...tontineDetails } = details;
        const organizerId = `org-${Date.now()}`;
        const newTontine: Tontine = {
            ...tontineDetails,
            id: Math.random().toString(36).substring(2, 8).toUpperCase(),
            organizerId,
            enrollmentStatus: joinDeadline || 'open',
        };
        const organizerParticipant: Participant = {
            id: organizerId,
            tontineId: newTontine.id,
            name: organizerName,
            phone: organizerPhone,
            paymentStatus: PaymentStatus.Pending,
            membershipStatus: MembershipStatus.Active,
            shares: 1,
            totpSecret: generateTOTPSecret(),
            isTotpVerified: false,
        };

        setDb(prev => ({
            tontines: [...prev.tontines, newTontine],
            participants: [...prev.participants, organizerParticipant],
        }));

        setTontine(newTontine);
        setParticipants([organizerParticipant]);
        setCurrentUser(organizerParticipant);
        setAppState('organizerSetupTOTP');
    };

    const handleJoinTontine = (joinData: { tontineId: string; name: string; phone: string }): JoinResult => {
        const requestedId = joinData.tontineId.toUpperCase();
        
        if (tontine && requestedId === tontine.id) {
            return 'is_organizer';
        }

        const targetTontine = db.tontines.find(t => t.id === requestedId);
        if (targetTontine) {
            const initialParticipants = db.participants.filter(p => p.tontineId === requestedId);
            const newParticipant: Participant = {
                id: new Date().getTime().toString(),
                name: joinData.name,
                phone: joinData.phone,
                paymentStatus: PaymentStatus.Pending,
                membershipStatus: MembershipStatus.Pending,
                tontineId: requestedId,
                shares: 1,
            };
            // Simulate adding the user to the DB for this session
            setDb(prev => ({ ...prev, participants: [...prev.participants, newParticipant] }));
            
            setTontine(targetTontine);
            setParticipants([...initialParticipants, newParticipant]);
            setCurrentUser(newParticipant);
            setAppState('waitingRoom');
            return 'success';
        }
        
        return 'invalid_id';
    };
    
    const handleParticipantLogin = (phone: string): boolean => {
        const user = db.participants.find(p => p.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''));
        if (!user) {
            return false;
        }
        
        const userTontine = db.tontines.find(t => t.id === user.tontineId);
        if (!userTontine) {
            return false;
        }
        
        const allParticipants = db.participants.filter(p => p.tontineId === userTontine.id);

        if (user.id === userTontine.organizerId) {
             // Organizers must use the new secure login
             return false;
        }
        
        setTontine(userTontine);
        setParticipants(allParticipants);
        setCurrentUser(user);
        setAppState('waitingRoom');
        return true;
    };
    
    const handleOrganizerLogin = (phone: string, totpCode: string): boolean => {
        const user = db.participants.find(p => p.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''));
        if (!user || !user.isTotpVerified) return false;

        const userTontine = db.tontines.find(t => t.id === user.tontineId && t.organizerId === user.id);
        if (!userTontine) return false;

        // In a real app, you would verify the TOTP code against the secret.
        // For this simulation, we'll just check if it's a 6-digit number.
        if (!/^\d{6}$/.test(totpCode)) return false;

        const allParticipants = db.participants.filter(p => p.tontineId === userTontine.id);
        setTontine(userTontine);
        setParticipants(allParticipants);
        setCurrentUser(user);
        setFrequency(userTontine.frequency);
        if (userTontine.startDate) {
            setStartDate(userTontine.startDate);
        }
        setAppState('setup');
        setOpenStep(1);
        return true;
    };

    const handleVerifyTOTP = (code: string): boolean => {
        if (!currentUser) return false;
        // For this simulation, we just check the format.
        // A real app would verify the code using the secret.
        if (!/^\d{6}$/.test(code)) return false;

        const updatedUser = { ...currentUser, isTotpVerified: true };
        setCurrentUser(updatedUser);

        setDb(prev => ({
            ...prev,
            participants: prev.participants.map(p => p.id === updatedUser.id ? updatedUser : p)
        }));
        
        if (tontine) {
            setFrequency(tontine.frequency);
            if (tontine.startDate) {
                setStartDate(tontine.startDate);
            }
        }

        setAppState('setup');
        setOpenStep(1);
        return true;
    };

    const handleAddParticipant = (participantData: { name: string; phone: string; shares: number; }) => {
        if (!tontine) return;
        const newParticipant: Participant = {
            ...participantData,
            id: new Date().getTime().toString(),
            paymentStatus: PaymentStatus.Pending,
            membershipStatus: MembershipStatus.Active,
            tontineId: tontine.id,
        };
        setParticipants(prev => [...prev, newParticipant]);
        setDb(prev => ({ ...prev, participants: [...prev.participants, newParticipant] }));
        setIsParticipantModalOpen(false);
    };

    const handleUpdateParticipant = (participantData: { name: string; phone: string; shares: number; }) => {
        if (!editingParticipant) return;
        const participantIdToUpdate = editingParticipant.id;

        const updatedParticipants = participants.map(p =>
            p.id === participantIdToUpdate ? { ...p, ...participantData } : p
        );
        setParticipants(updatedParticipants);

        setDb(prevDb => ({
            ...prevDb,
            participants: prevDb.participants.map(p =>
                p.id === participantIdToUpdate ? { ...p, ...participantData } : p
            )
        }));

        setEditingParticipant(null);
        setIsParticipantModalOpen(false);
    };
    
    const handleDeleteParticipant = (id: string) => {
        if (window.confirm('Are you sure you want to remove this participant?')) {
            setParticipants(prev => prev.filter(p => p.id !== id));
            setDb(prevDb => ({
                ...prevDb,
                participants: prevDb.participants.filter(p => p.id !== id)
            }));
        }
    };
    
    const handleApproveParticipant = (id: string) => {
        const updateStatus = (p: Participant) => ({ ...p, membershipStatus: MembershipStatus.Active });

        setParticipants(prev => prev.map(p => (p.id === id ? updateStatus(p) : p)));
        setDb(prevDb => ({
            ...prevDb,
            participants: prevDb.participants.map(p => (p.id === id ? updateStatus(p) : p))
        }));
    };

    const handleTogglePaymentStatus = (id: string) => {
        const toggleStatus = (p: Participant) => ({
             ...p, 
             paymentStatus: p.paymentStatus === PaymentStatus.Paid ? PaymentStatus.Pending : PaymentStatus.Paid
        });

        setParticipants(prev => prev.map(p => (p.id === id ? toggleStatus(p) : p)));
        setDb(prevDb => ({
            ...prevDb,
            participants: prevDb.participants.map(p => (p.id === id ? toggleStatus(p) : p))
        }));
    };

    const handleSelectLotteryType = (type: 'automatic' | 'live') => {
        setLotteryType(type);
        if (type === 'live' && !liveLotteryDate) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setLiveLotteryDate(tomorrow.toISOString().split('T')[0]);
        }
        setLotteryOrder([]);
        setPayoutSchedule([]);
        setAppState('lottery');
        setOpenStep(2);
        setIsLotteryTypeModalOpen(false);
    };

    const runLottery = useCallback(() => {
        const activeParticipants = participants.filter(p => p.membershipStatus === MembershipStatus.Active);
        const expandedParticipants = activeParticipants.flatMap(p => 
            Array.from({ length: p.shares || 1 }, () => p)
        );
        setLotteryOrder(shuffleArray(expandedParticipants));
    }, [participants]);

    const startLiveLotteryFlow = () => {
        setPresentParticipants(new Set());
        setSpinResult([]);
        setWheelEntries([]);
        setIsSpinning(false);
        setWheelRotation(0);
        setAppState('liveCheckIn');
    };

    const generateSchedule = useCallback(() => {
        if (!startDate || lotteryOrder.length === 0) return;
        
        const schedule: Payout[] = [];
        let currentDate = new Date(startDate + 'T00:00:00');

        lotteryOrder.forEach(participant => {
            schedule.push({ date: new Date(currentDate), participant });

            switch (frequency) {
                case 'weekly':
                    currentDate.setDate(currentDate.getDate() + 7);
                    break;
                case 'bi-weekly':
                    currentDate.setDate(currentDate.getDate() + 14);
                    break;
                case 'monthly':
                    currentDate.setMonth(currentDate.getMonth() + 1);
                    break;
            }
        });
        setPayoutSchedule(schedule);
    }, [startDate, lotteryOrder, frequency]);
    
    const nextPayout = useMemo(() => {
        if (appState !== 'active') return null;
        const today = new Date();
        today.setHours(0,0,0,0);
        return payoutSchedule.find(p => p.date >= today) || payoutSchedule[payoutSchedule.length - 1];
    }, [appState, payoutSchedule]);


    const sendWhatsAppReminder = (payout: Payout) => {
        const message = `Hi ${payout.participant.name}, this is a reminder that your tontine payment for "${tontine?.name}" is due on ${formatDate(payout.date)}. Please send your contribution.`;
        const whatsappUrl = `https://wa.me/${payout.participant.phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const openModalForNew = () => {
        setEditingParticipant(null);
        setIsParticipantModalOpen(true);
    };

    const openModalForEdit = (participant: Participant) => {
        setEditingParticipant(participant);
        setIsParticipantModalOpen(true);
    };

    const handleEditDeadline = () => {
        if (!tontine) return;
        const { enrollmentStatus } = tontine;
        if (enrollmentStatus === 'open' || enrollmentStatus === 'closed') {
            setDeadlineType(enrollmentStatus);
            setDeadlineDate('');
        } else {
            setDeadlineType('date');
            setDeadlineDate(enrollmentStatus);
        }
        setIsEditingDeadline(true);
    };

    const handleSaveDeadline = () => {
        if (!tontine) return;
        let newStatus: string;
        if (deadlineType === 'date') {
            if (!deadlineDate) return; 
            newStatus = deadlineDate;
        } else {
            newStatus = deadlineType;
        }
        const updatedTontine = { ...tontine, enrollmentStatus: newStatus };
        setTontine(updatedTontine);
        setDb(prev => ({
            ...prev,
            tontines: prev.tontines.map(t => t.id === updatedTontine.id ? updatedTontine : t)
        }));
        setIsEditingDeadline(false);
    };

    const isSetupComplete = participants.filter(p => p.membershipStatus === MembershipStatus.Active).length > 1;
    const isLotteryComplete = lotteryOrder.length > 0;
    const isSchedulingComplete = payoutSchedule.length > 0;

    const isEnrollmentClosed = useMemo(() => {
        if (!tontine) return false;
        const { enrollmentStatus } = tontine;
        if (enrollmentStatus === 'closed') return true;
        if (enrollmentStatus === 'open') return false;
        
        const deadlineDate = new Date(enrollmentStatus + 'T23:59:59'); // Check against end of day
        return !isNaN(deadlineDate.getTime()) && deadlineDate < new Date();
    }, [tontine]);


    const tontineStatus = useMemo(() => {
        switch (appState) {
            case 'setup':
            case 'waitingRoom':
                return 'Enrollment';
            case 'lottery':
            case 'liveCheckIn':
            case 'liveLottery':
                return 'Lottery';
            case 'scheduling':
                return 'Scheduling';
            case 'active':
                return 'In Progress';
            default:
                return 'N/A';
        }
    }, [appState]);
    
    const isOrganizerView = ['setup', 'lottery', 'scheduling', 'active', 'liveCheckIn', 'liveLottery', 'organizerSetupTOTP'].includes(appState);

    const enrollmentDeadlineComponent = (
      <div className="mb-6">
        {tontine && (
            !isEditingDeadline ? (
            <div className="text-center">
                <div className="flex items-center justify-center gap-4 py-2">
                    <p className="text-lg text-text-muted">
                        Enrollment Status:
                        <span className={`font-bold ml-2 px-3 py-1 rounded-full text-sm ${isEnrollmentClosed ? 'bg-accent-pending/20 text-accent-pending' : 'bg-accent-success/20 text-accent-success'}`}>
                            {isEnrollmentClosed ? 'Closed' : 'Open'}
                        </span>
                    </p>
                    {isOrganizerView && !['liveCheckIn', 'liveLottery'].includes(appState) && (
                        <button onClick={handleEditDeadline} className="text-primary hover:text-purple-400">
                            <EditIcon className="w-5 h-5"/>
                        </button>
                    )}
                </div>
                 {tontine.enrollmentStatus !== 'open' && tontine.enrollmentStatus !== 'closed' && (
                     <p className="text-sm text-text-muted -mt-1">
                        (Deadline: {formatDate(new Date(tontine.enrollmentStatus + 'T00:00:00'))})
                    </p>
                )}
            </div>
        ) : (
            <div className="bg-base-200/50 p-4 rounded-lg border border-base-300 max-w-lg mx-auto space-y-4">
                <h3 className="font-semibold text-lg text-center">Set Enrollment Status</h3>
                <div className="flex justify-center gap-4 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="deadlineType" checked={deadlineType === 'open'} onChange={() => setDeadlineType('open')} className="form-radio bg-base-100 border-base-300 text-primary focus:ring-primary"/> Open</label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="deadlineType" checked={deadlineType === 'closed'} onChange={() => setDeadlineType('closed')} className="form-radio bg-base-100 border-base-300 text-primary focus:ring-primary"/> Close</label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="deadlineType" checked={deadlineType === 'date'} onChange={() => setDeadlineType('date')} className="form-radio bg-base-100 border-base-300 text-primary focus:ring-primary"/> Set Date</label>
                </div>
                 {deadlineType === 'date' && (
                    <div className="flex justify-center">
                        <input type="date" value={deadlineDate} onChange={(e) => setDeadlineDate(e.target.value)} className="block w-full max-w-xs px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"/>
                    </div>
                )}
                <div className="flex justify-center gap-3 pt-2">
                    <button onClick={() => setIsEditingDeadline(false)} className="px-4 py-2 bg-base-300 text-text-main rounded-md hover:bg-gray-600 text-sm">Cancel</button>
                    <button onClick={handleSaveDeadline} className="px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-purple-500 transition-colors shadow-md hover:shadow-glow-primary text-sm">Save</button>
                </div>
            </div>
        )
        )}
      </div>
    );
    
    return (
        <div className="min-h-screen bg-base-100 text-text-main p-4 sm:p-6 lg:p-8">
            <header className="py-4 px-4 sm:px-6 lg:px-8 grid grid-cols-3 items-center mb-8">
                <div className="flex justify-start">
                  {isOrganizerView && tontine && ['setup', 'lottery', 'scheduling', 'active'].includes(appState) && (
                    <button onClick={() => setIsShareModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-secondary text-white font-semibold rounded-md hover:bg-teal-500 transition-colors shadow-md hover:shadow-glow-secondary">
                      <Share2Icon className="w-5 h-5" />
                      Invite
                    </button>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-center text-text-main tracking-tight">
                  {tontine ? tontine.name : 'Tontine Manager'}
                </h1>
                <div className="flex justify-end">
                  {appState !== 'home' && (
                    <button onClick={resetTontine} className="px-4 py-2 bg-base-300 text-text-main rounded-md hover:bg-gray-600">Start Over</button>
                  )}
                </div>
            </header>

            <main className="max-w-7xl mx-auto">
                {appState === 'home' && (
                    <div className="max-w-xl mx-auto text-center">
                        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Welcome to Tontine Manager</h2>
                        <p className="mt-4 text-xl text-text-muted">The easiest way to organize your savings group.</p>
                        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <button onClick={() => setAppState('createTontine')} className="flex flex-col items-center justify-center p-6 bg-primary/20 border-2 border-primary rounded-lg hover:bg-primary/30 transition-all duration-300 transform hover:scale-105">
                                <PlusIcon className="w-10 h-10 text-primary mb-2"/>
                                <span className="text-xl font-semibold">Create a Tontine</span>
                                <span className="text-sm text-text-muted">For Organizers</span>
                            </button>
                            <button onClick={() => setAppState('login')} className="flex flex-col items-center justify-center p-6 bg-secondary/20 border-2 border-secondary rounded-lg hover:bg-secondary/30 transition-all duration-300 transform hover:scale-105">
                                <LogInIcon className="w-10 h-10 text-secondary mb-2"/>
                                <span className="text-xl font-semibold">Join or Login</span>
                                <span className="text-sm text-text-muted">For All Users</span>
                            </button>
                        </div>
                    </div>
                )}

                {appState === 'login' && (
                    <div className="max-w-xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-2">Access Your Tontine</h2>
                        <p className="text-text-muted mb-8">Choose your role to continue.</p>
                        <div className="space-y-4">
                            <button onClick={() => setAppState('organizerLogin')} className="w-full text-left p-4 bg-base-100 rounded-lg border-2 border-base-300 hover:border-primary transition-colors group flex items-center gap-4">
                                 <ShieldCheckIcon className="w-8 h-8 text-primary"/>
                                 <div>
                                    <h3 className="text-lg font-semibold text-text-main">Organizer Login</h3>
                                    <p className="text-sm text-text-muted">Manage your tontine group securely.</p>
                                 </div>
                            </button>
                            <button onClick={() => setAppState('participantLogin')} className="w-full text-left p-4 bg-base-100 rounded-lg border-2 border-base-300 hover:border-secondary transition-colors group flex items-center gap-4">
                                <LogInIcon className="w-8 h-8 text-secondary"/>
                                 <div>
                                    <h3 className="text-lg font-semibold text-text-main">Participant Login</h3>
                                    <p className="text-sm text-text-muted">View your active group status.</p>
                                 </div>
                            </button>
                             <button onClick={() => setAppState('joinTontine')} className="w-full text-left p-4 bg-base-100 rounded-lg border-2 border-base-300 hover:border-accent-success transition-colors group flex items-center gap-4">
                                <UsersIcon className="w-8 h-8 text-accent-success"/>
                                 <div>
                                    <h3 className="text-lg font-semibold text-text-main">Join a Tontine</h3>
                                    <p className="text-sm text-text-muted">Enter an invite code to join a new group.</p>
                                 </div>
                            </button>
                        </div>
                        <button onClick={() => setAppState('home')} className="mt-8 text-sm text-text-muted hover:text-text-main">← Back to Home</button>
                    </div>
                )}

                {appState === 'createTontine' && <CreateTontineForm onCreate={handleCreateTontine} onBack={() => setAppState('home')} />}
                {appState === 'joinTontine' && <JoinTontineForm onJoin={handleJoinTontine} onBack={() => setAppState('login')} initialTontineId={joiningTontineId} />}
                {appState === 'participantLogin' && <ParticipantLoginForm onLogin={handleParticipantLogin} onBack={() => setAppState('login')} />}
                {appState === 'organizerLogin' && <OrganizerLoginForm onLogin={handleOrganizerLogin} onBack={() => setAppState('login')} />}

                {appState === 'organizerSetupTOTP' && currentUser && currentUser.totpSecret && (
                    <div className="max-w-lg mx-auto bg-base-200/80 p-8 rounded-lg border border-base-300/50 text-center">
                        <h2 className="text-2xl font-bold">Secure Your Account</h2>
                        <p className="text-text-muted mt-2 mb-6">Scan the QR code with your authenticator app (e.g., Google Authenticator), then enter the 6-digit code to verify.</p>
                        <div className="bg-white p-4 inline-block rounded-lg">
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/Tontine:${currentUser.phone}?secret=${currentUser.totpSecret}&issuer=TontineManager`} alt="TOTP QR Code" />
                        </div>
                        <div className="mt-6">
                            <label htmlFor="totp-verify" className="block text-sm font-medium text-text-muted">Verification Code</label>
                            <input
                                type="text"
                                id="totp-verify"
                                maxLength={6}
                                className="mt-1 w-full max-w-xs mx-auto text-center tracking-[0.5em] text-2xl font-mono px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="123456"
                                onChange={(e) => {
                                    if (e.target.value.length === 6) {
                                        const success = handleVerifyTOTP(e.target.value);
                                        if (!success) {
                                            alert('Invalid code. Please try again.');
                                            e.target.value = '';
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}
                
                {appState === 'waitingRoom' && tontine && currentUser && (
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-base-200/80 p-8 rounded-lg border border-base-300/50 text-center">
                             <h2 className="text-3xl font-bold">You're In!</h2>
                             <p className="mt-2 text-xl text-text-muted">You have joined "{tontine.name}".</p>
                             
                             {currentUser.membershipStatus === MembershipStatus.Pending ? (
                                 <div className="mt-6 bg-accent-pending/20 text-accent-pending p-4 rounded-lg">
                                     <h3 className="font-semibold">Your membership is pending approval.</h3>
                                     <p className="text-sm">The organizer will approve your entry soon. Once approved, you'll see the full tontine dashboard here.</p>
                                 </div>
                             ) : (
                                  <div className="mt-6 bg-accent-success/20 text-accent-success p-4 rounded-lg">
                                     <h3 className="font-semibold">Your membership is active!</h3>
                                     <p className="text-sm">The organizer is setting things up. The tontine will start soon. Check back later!</p>
                                 </div>
                             )}
                             <div className="mt-8 border-t border-base-300/50 pt-6">
                                <h3 className="text-lg font-semibold mb-4">Participants</h3>
                                <ParticipantList participants={participants} isTontineActive={false} isOrganizerView={false} tontineStatus="Enrollment" />
                             </div>
                        </div>
                    </div>
                )}
                
                {['setup', 'lottery', 'scheduling', 'active'].includes(appState) && (
                     <div className="max-w-5xl mx-auto space-y-6">
                        {enrollmentDeadlineComponent}
                        <div className="space-y-4">
                            {/* Step 1: Setup */}
                            <StepCard title="Setup Participants" icon={<UsersIcon />} step={1} isActive={openStep === 1} isCompleted={isSetupComplete} isOpen={openStep === 1} onHeaderClick={() => setOpenStep(1)}>
                                <ParticipantList participants={participants} onDelete={handleDeleteParticipant} onEdit={openModalForEdit} onApprove={handleApproveParticipant} isTontineActive={false} isOrganizerView={isOrganizerView} tontineStatus={tontineStatus}/>
                                {isOrganizerView && (
                                    <div className="mt-4 flex justify-end">
                                        <button onClick={openModalForNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-md hover:bg-purple-500 transition-colors shadow-md hover:shadow-glow-primary">
                                            <PlusIcon className="w-5 h-5"/> Add Participant
                                        </button>
                                    </div>
                                )}
                                {isSetupComplete && (
                                    <div className="mt-6 pt-4 border-t border-base-300/50 text-center">
                                        <button 
                                            onClick={() => { setIsLotteryTypeModalOpen(true); }}
                                            disabled={!isEnrollmentClosed}
                                            className="px-5 py-2 flex items-center justify-center mx-auto gap-2 bg-primary text-white font-semibold rounded-md hover:bg-purple-500 transition-colors shadow-md hover:shadow-glow-primary disabled:bg-base-300 disabled:text-text-muted disabled:cursor-not-allowed"
                                        >
                                           Next: Set up Lottery <ArrowRightIcon className="w-5 h-5"/>
                                        </button>
                                        {!isEnrollmentClosed && (
                                            <p className="text-xs text-text-muted mt-2">The lottery can be set up once the enrollment period has ended.</p>
                                        )}
                                    </div>
                                )}
                            </StepCard>

                            {/* Step 2: Lottery */}
                            <StepCard title="Lottery" icon={<ShuffleIcon />} step={2} isActive={openStep === 2} isCompleted={isLotteryComplete} isOpen={openStep === 2} onHeaderClick={() => setOpenStep(2)}>
                               {lotteryOrder.length > 0 ? (
                                   <>
                                        <h3 className="text-lg font-semibold mb-2">Lottery Results</h3>
                                        <ParticipantList participants={participants} lotteryOrder={lotteryOrder} isTontineActive={false} isOrganizerView={isOrganizerView} tontineStatus={tontineStatus}/>
                                        <div className="mt-6 pt-4 border-t border-base-300/50 text-center">
                                            <button onClick={() => { generateSchedule(); setOpenStep(3); }} className="px-5 py-2 flex items-center justify-center mx-auto gap-2 bg-primary text-white font-semibold rounded-md hover:bg-purple-500 transition-colors shadow-md hover:shadow-glow-primary">
                                               Next: Create Schedule <ArrowRightIcon className="w-5 h-5"/>
                                            </button>
                                        </div>
                                   </>
                               ) : lotteryType === 'automatic' ? (
                                    <div className="text-center">
                                        <p className="text-text-muted mb-4">Click below to randomly generate the payout order.</p>
                                        <button onClick={runLottery} className="px-5 py-2 flex items-center justify-center mx-auto gap-2 bg-secondary text-white font-semibold rounded-md hover:bg-teal-500 transition-colors shadow-md hover:shadow-glow-secondary">
                                           <ShuffleIcon className="w-5 h-5"/> Run Automatic Lottery
                                        </button>
                                    </div>
                               ) : lotteryType === 'live' ? (
                                    <div className="text-center">
                                        <p className="text-text-muted mb-2">A live lottery is scheduled.</p>
                                        <div className="flex items-center justify-center gap-4 mb-4">
                                            <label htmlFor="live-date" className="font-semibold">Event Date:</label>
                                            <input type="date" id="live-date" value={liveLotteryDate} onChange={e => setLiveLotteryDate(e.target.value)} className="px-3 py-1 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"/>
                                        </div>
                                        <button onClick={startLiveLotteryFlow} className="px-5 py-2 flex items-center justify-center mx-auto gap-2 bg-secondary text-white font-semibold rounded-md hover:bg-teal-500 transition-colors shadow-md hover:shadow-glow-secondary">
                                            <TvIcon className="w-5 h-5"/> Start Live Lottery
                                        </button>
                                    </div>
                               ) : <p className="text-center text-text-muted">Complete Step 1 and close enrollment to proceed.</p> }
                            </StepCard>

                            {/* Step 3: Scheduling */}
                            <StepCard title="Payment Schedule" icon={<CalendarIcon />} step={3} isActive={openStep === 3} isCompleted={isSchedulingComplete} isOpen={openStep === 3} onHeaderClick={() => setOpenStep(3)}>
                                {payoutSchedule.length > 0 ? (
                                    <>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full">
                                                <thead className="border-b border-base-300">
                                                    <tr>
                                                        <th className="py-2 px-4 text-left text-sm font-semibold text-text-main">Payout Date</th>
                                                        <th className="py-2 px-4 text-left text-sm font-semibold text-text-main">Participant</th>
                                                        <th className="py-2 px-4 text-left text-sm font-semibold text-text-main">Phone</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-base-300">
                                                {payoutSchedule.map((payout, index) => (
                                                    <tr key={index}>
                                                        <td className="py-3 px-4 text-sm font-semibold text-primary">{formatDate(payout.date)}</td>
                                                        <td className="py-3 px-4 text-sm text-text-main">{payout.participant.name}</td>
                                                        <td className="py-3 px-4 text-sm text-text-muted">{payout.participant.phone}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-base-300/50 text-center">
                                            <button onClick={() => setAppState('active')} className="px-5 py-2 flex items-center justify-center mx-auto gap-2 bg-accent-success text-white font-semibold rounded-md hover:bg-green-500 transition-colors shadow-md hover:shadow-lg">
                                               Finalize and Start Tontine <CheckCircleIcon className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-4 max-w-md mx-auto">
                                        <div>
                                            <label htmlFor="start-date" className="block text-sm font-medium text-text-muted">First Payout Date</label>
                                            <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"/>
                                        </div>
                                        <div>
                                            <label htmlFor="frequency" className="block text-sm font-medium text-text-muted">Payment Frequency</label>
                                            <select id="frequency" value={frequency} onChange={e => setFrequency(e.target.value as Frequency)} className="mt-1 block w-full pl-3 pr-10 py-2 bg-base-100 border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                                <option value="weekly">Weekly</option>
                                                <option value="bi-weekly">Bi-weekly</option>
                                                <option value="monthly">Monthly</option>
                                            </select>
                                        </div>
                                         <div className="pt-2 text-center">
                                            <button onClick={generateSchedule} className="px-5 py-2 flex items-center justify-center mx-auto gap-2 bg-secondary text-white font-semibold rounded-md hover:bg-teal-500 transition-colors shadow-md hover:shadow-glow-secondary">
                                               <CalendarIcon className="w-5 h-5"/> Generate Schedule
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </StepCard>
                        </div>
                     </div>
                )}

                {appState === 'liveCheckIn' && tontine && (
                    <div className="max-w-3xl mx-auto bg-base-200/80 p-6 sm:p-8 rounded-lg border border-base-300/50 text-center">
                        <h2 className="text-3xl font-bold mb-2">Live Lottery Check-in</h2>
                        <p className="text-text-muted mb-6">Mark participants who are present for the live draw.</p>
                        <div className="space-y-3 text-left max-w-md mx-auto mb-8">
                            {participants.filter(p => p.membershipStatus === MembershipStatus.Active).map(p => (
                                <label key={p.id} className="flex items-center gap-4 p-3 bg-base-100 rounded-md cursor-pointer hover:bg-base-300/50 transition-colors">
                                    <input 
                                        type="checkbox" 
                                        checked={presentParticipants.has(p.id)}
                                        onChange={() => {
                                            const newSet = new Set(presentParticipants);
                                            if (newSet.has(p.id)) {
                                                newSet.delete(p.id);
                                            } else {
                                                newSet.add(p.id);
                                            }
                                            setPresentParticipants(newSet);
                                        }}
                                        className="h-5 w-5 rounded bg-base-300 border-gray-500 text-secondary focus:ring-secondary"
                                    />
                                    <span className="font-medium text-text-main">{p.name}</span>
                                </label>
                            ))}
                        </div>
                        <button 
                            disabled={presentParticipants.size < 2}
                            onClick={() => {
                                const checkedIn = participants.filter(p => presentParticipants.has(p.id));
                                const expanded = checkedIn.flatMap(p => 
                                    Array.from({ length: p.shares || 1 }, () => ({ id: p.id, name: p.name }))
                                );
                                setWheelEntries(shuffleArray(expanded));
                                setAppState('liveLottery');
                            }} 
                            className="w-full max-w-md mx-auto px-5 py-3 flex items-center justify-center gap-2 bg-secondary text-white font-semibold rounded-md hover:bg-teal-500 transition-colors shadow-md hover:shadow-glow-secondary disabled:bg-base-300 disabled:text-text-muted disabled:cursor-not-allowed">
                           <TvIcon className="w-5 h-5"/> Start Lottery with {presentParticipants.size} members
                        </button>
                    </div>
                )}
                
                {appState === 'liveLottery' && tontine && (
                    <div className="max-w-5xl mx-auto flex flex-col items-center gap-8">
                        <div className="relative flex items-center justify-center">
                            <LiveLotteryWheel entries={wheelEntries} rotation={wheelRotation} isSpinning={isSpinning} />
                            <div className="absolute w-8 h-8 -top-1 left-1/2 -translate-x-1/2 bg-transparent border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[20px] border-t-red-500"></div>
                        </div>

                        <div className="w-full max-w-md text-center">
                             {wheelEntries.length > 0 && (
                                <button 
                                    onClick={() => {
                                        if (isSpinning) return;
                                        setIsSpinning(true);
                                        
                                        const winnerIndex = Math.floor(Math.random() * wheelEntries.length);
                                        const winner = wheelEntries[winnerIndex];
                                        const segmentAngle = 360 / wheelEntries.length;
                                        const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.8;
                                        const targetRotation = 360 * 5 - (winnerIndex * segmentAngle) - (segmentAngle / 2) + randomOffset;
                                        
                                        setWheelRotation(prev => prev + targetRotation);

                                        setTimeout(() => {
                                            setSpinResult(prev => [...prev, { position: prev.length + 1, participant: winner }]);
                                            setWheelEntries(prev => prev.filter((_, i) => i !== winnerIndex));
                                            setIsSpinning(false);
                                        }, 4100);
                                    }}
                                    disabled={isSpinning}
                                    className="w-full px-5 py-3 text-lg flex items-center justify-center gap-2 bg-primary text-white font-semibold rounded-md hover:bg-purple-500 transition-colors shadow-md hover:shadow-glow-primary disabled:bg-base-300 disabled:text-text-muted disabled:cursor-not-allowed"
                                >
                                    <ShuffleIcon className="w-6 h-6"/> {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
                                </button>
                             )}
                             {wheelEntries.length === 0 && spinResult.length > 0 && (
                                <button 
                                    onClick={() => {
                                        const finalOrder = spinResult.map(r => participants.find(p => p.id === r.participant.id)).filter(Boolean) as Participant[];
                                        setLotteryOrder(finalOrder);
                                        setAppState('scheduling');
                                        setOpenStep(3);
                                    }}
                                    className="w-full px-5 py-3 text-lg flex items-center justify-center gap-2 bg-accent-success text-white font-semibold rounded-md hover:bg-green-500 transition-colors shadow-md hover:shadow-lg"
                                >
                                    <CheckCircleIcon className="w-6 h-6"/> Finalize Lottery Order
                                </button>
                             )}
                        </div>
                        
                        {spinResult.length > 0 && (
                            <div className="w-full max-w-md bg-base-200/80 p-4 rounded-lg border border-base-300/50">
                                <h3 className="text-xl font-bold mb-4 text-center">Lottery Results</h3>
                                <ol className="list-decimal list-inside space-y-2">
                                    {spinResult.map(res => (
                                        <li key={res.position} className="text-lg font-semibold text-text-main">
                                            <span className="inline-block text-primary w-8">#{res.position}</span> {res.participant.name}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>
                )}

                {tontine && <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} tontine={tontine} />}
                <LotteryTypeModal isOpen={isLotteryTypeModalOpen} onClose={() => setIsLotteryTypeModalOpen(false)} onSelect={handleSelectLotteryType} />
                <Modal isOpen={isParticipantModalOpen} onClose={() => { setIsParticipantModalOpen(false); setEditingParticipant(null); }} title={editingParticipant ? 'Edit Participant' : 'Add New Participant'}>
                    <ParticipantForm onSave={editingParticipant ? handleUpdateParticipant : handleAddParticipant} onClose={() => { setIsParticipantModalOpen(false); setEditingParticipant(null); }} participantToEdit={editingParticipant} />
                </Modal>
            </main>
        </div>
    );
}
