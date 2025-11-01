

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AppState, Participant, PaymentStatus, Payout, Frequency, Tontine, MembershipStatus } from './types';
import { UsersIcon, CalendarIcon, ShuffleIcon, CheckCircleIcon, XCircleIcon, PlusIcon, Trash2Icon, EditIcon, SendIcon, ArrowRightIcon, ChevronUpIcon, Share2Icon, ClipboardIcon, QrCodeIcon, LogInIcon, CheckIcon } from './components/icons';


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
}

const ParticipantList: React.FC<ParticipantListProps> = ({ participants, onDelete, onEdit, onApprove, onToggleStatus, isTontineActive, isOrganizerView, tontineStatus }) => {
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
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-text-main sm:pl-0">Name</th>
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
                  {participants.map((p) => (
                    <tr key={p.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-text-main sm:pl-0">{p.name}</td>
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
                  ))}
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
      { id: 'mock-1', tontineId: 'TEST123', name: 'Alice Organizer', phone: '1112223333', paymentStatus: PaymentStatus.Pending, membershipStatus: MembershipStatus.Active },
      { id: 'mock-2', tontineId: 'TEST123', name: 'Bob Member', phone: '4445556666', paymentStatus: PaymentStatus.Pending, membershipStatus: MembershipStatus.Active },
      { id: 'mock-3', tontineId: 'TEST123', name: 'Yeni', phone: '6667778888', paymentStatus: PaymentStatus.Pending, membershipStatus: MembershipStatus.Active },
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
    onSave: (participant: Omit<Participant, 'id' | 'paymentStatus' | 'tontineId' | 'membershipStatus'>) => void;
    onClose: () => void;
    participantToEdit?: Participant | null;
}

const ParticipantForm: React.FC<ParticipantFormProps> = ({ onSave, onClose, participantToEdit }) => {
    const [name, setName] = useState(participantToEdit?.name || '');
    const [phone, setPhone] = useState(participantToEdit?.phone || '');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim()) {
            setError('Name and Phone Number are required.');
            return;
        }
        if (!/^\d{10,15}$/.test(phone.replace(/\D/g, ''))) {
             setError('Please enter a valid phone number (10-15 digits).');
             return;
        }
        onSave({ name, phone });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-muted">Full Name</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm" placeholder="John Doe" />
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
                            Create Tontine <ArrowRightIcon className="w-5 h-5" />
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

// --- LOGIN FORM ---
interface LoginFormProps {
    onLogin: (phone: string) => boolean;
    onBack: () => void;
}
const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onBack }) => {
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
                    <h2 className="text-xl font-semibold text-text-main">Find Your Tontine</h2>
                    <p className="text-sm text-text-muted mt-1">Enter your WhatsApp phone number to view your active groups.</p>
                     <p className="text-xs text-secondary mt-1">Psst! Try logging in with <code className="bg-base-100 p-1 rounded-sm font-mono">1112223333</code> (organizer) or <code className="bg-base-100 p-1 rounded-sm font-mono">4445556666</code> (participant).</p>
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
                            Find Tontine <ArrowRightIcon className="w-5 h-5" />
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
        };

        setDb(prev => ({
            tontines: [...prev.tontines, newTontine],
            participants: [...prev.participants, organizerParticipant],
        }));

        setTontine(newTontine);
        setParticipants([organizerParticipant]);
        setCurrentUser(organizerParticipant);
        setFrequency(newTontine.frequency);
        if (newTontine.startDate) {
            setStartDate(newTontine.startDate);
        }
        setAppState('setup');
        setOpenStep(1);
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
    
    const handleLogin = (phone: string): boolean => {
        const user = db.participants.find(p => p.phone.replace(/\D/g, '') === phone.replace(/\D/g, ''));
        if (!user) {
            return false;
        }
        
        const userTontine = db.tontines.find(t => t.id === user.tontineId);
        if (!userTontine) {
            return false;
        }
        
        const allParticipants = db.participants.filter(p => p.tontineId === userTontine.id);
        setTontine(userTontine);
        setParticipants(allParticipants);
        setCurrentUser(user);
        
        if (user.id === userTontine.organizerId) {
            // User is the organizer, send to management view
            setAppState('setup');
            setOpenStep(1); // Start at participant management
        } else {
            // User is a participant, send to waiting room
            setAppState('waitingRoom');
        }
        
        return true;
    };


    const handleAddParticipant = (participantData: Omit<Participant, 'id' | 'paymentStatus' | 'tontineId' | 'membershipStatus'>) => {
        if (!tontine) return;
        const newParticipant: Participant = {
            ...participantData,
            id: new Date().getTime().toString(),
            paymentStatus: PaymentStatus.Pending,
            membershipStatus: MembershipStatus.Active,
            tontineId: tontine.id,
        };
        setParticipants(prev => [...prev, newParticipant]);
        setIsParticipantModalOpen(false);
    };

    const handleUpdateParticipant = (participantData: Omit<Participant, 'id' | 'paymentStatus' | 'tontineId' | 'membershipStatus'>) => {
        if (editingParticipant) {
            setParticipants(prev => prev.map(p => p.id === editingParticipant.id ? { ...p, ...participantData } : p));
            setEditingParticipant(null);
            setIsParticipantModalOpen(false);
        }
    };
    
    const handleDeleteParticipant = (id: string) => {
        if (window.confirm('Are you sure you want to remove this participant?')) {
            setParticipants(prev => prev.filter(p => p.id !== id));
        }
    };
    
    const handleApproveParticipant = (id: string) => {
        const update = (p: Participant[]) => p.map(participant => 
            participant.id === id ? { ...participant, membershipStatus: MembershipStatus.Active } : participant
        );
        setParticipants(update);
        setDb(prev => ({...prev, participants: update(prev.participants)}));
    };

    const handleTogglePaymentStatus = (id: string) => {
        setParticipants(prev => prev.map(p => 
            p.id === id ? { ...p, paymentStatus: p.paymentStatus === PaymentStatus.Paid ? PaymentStatus.Pending : PaymentStatus.Paid } : p
        ));
    };

    const runLottery = useCallback(() => {
        const activeParticipants = participants.filter(p => p.membershipStatus === MembershipStatus.Active);
        setLotteryOrder(shuffleArray(activeParticipants));
    }, [participants]);

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
                return 'Lottery';
            case 'scheduling':
                return 'Scheduling';
            case 'active':
                return 'In Progress';
            default:
                return 'N/A';
        }
    }, [appState]);
    
    const isOrganizerView = ['setup', 'lottery', 'scheduling', 'active'].includes(appState);

    const enrollmentDeadlineComponent = (
      <div className="mb-6">
        {tontine && (
            !isEditingDeadline ? (
            <div className="flex items-center justify-center gap-4 py-2">
                <p className="text-lg text-text-muted">
                    Status: <span className="font-bold text-text-main capitalize">
                        {tontine.enrollmentStatus === 'open' || tontine.enrollmentStatus === 'closed'
                            ? tontine.enrollmentStatus
                            : formatDate(new Date(tontine.enrollmentStatus + 'T00:00:00'))}
                    </span>
                </p>
                {isOrganizerView && (
                    <button onClick={handleEditDeadline} className="text-primary hover:text-purple-400">
                        <EditIcon className="w-5 h-5"/>
                    </button>
                )}
            </div>
        ) : (
            <div className="bg-base-200/50 p-4 rounded-lg border border-base-300 max-w-lg mx-auto space-y-4">
                <h3 className="font-semibold text-lg text-center">Set Enrollment Status</h3>
                <div className="flex justify-center gap-4 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="deadlineType" checked={deadlineType === 'open'} onChange={() => setDeadlineType('open')} className="form-radio bg-base-100 border-base-300 text-primary focus:ring-primary"/> Open</label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="deadlineType" checked={deadlineType === 'closed'} onChange={() => setDeadlineType('closed')} className="form-radio bg-base-100 border-base-300 text-primary focus:ring-primary"/> Close</label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="deadlineType" checked={deadlineType === 'date'} onChange={() => setDeadlineType('date')} className="form-radio bg-base-100 border-base-300 text-primary focus:ring-primary"/> Date</label>
                </div>
                {deadlineType === 'date' && (
                    <div className="flex flex-col items-center">
                      <input type="date" value={deadlineDate} onChange={e => setDeadlineDate(e.target.value)} className="w-full max-w-xs px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"/>
                    </div>
                )}
                <div className="flex justify-center gap-3 pt-2">
                    <button onClick={() => setIsEditingDeadline(false)} className="px-4 py-2 text-sm bg-base-300 text-text-main rounded-md hover:bg-gray-600 transition-colors">Cancel</button>
                    <button onClick={handleSaveDeadline} className="px-4 py-2 text-sm bg-primary text-white font-semibold rounded-md hover:bg-purple-500 transition-colors">Save</button>
                </div>
            </div>
        )
      )}
      </div>
    );
    
    const renderHomePage = () => (
        <div className="flex flex-col items-center justify-center text-center py-10 md:py-20">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
                Welcome to Tontine Manager
            </h1>
            <p className="max-w-2xl text-md md:text-lg text-text-muted mb-12">
                The modern, secure, and transparent way to manage your savings group. Create a new tontine or join an existing one to get started.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                <div className="bg-base-200/80 backdrop-blur-sm rounded-lg border border-primary/50 p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-primary hover:shadow-glow-primary">
                    <div className="bg-primary/20 p-4 rounded-full mb-6">
                        <PlusIcon className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-2xl font-semibold text-text-main mb-3">Create a New Tontine</h2>
                    <p className="text-text-muted mb-8 flex-grow">
                        Start from scratch. Invite members, set the rules, and run the lottery to determine the payout order.
                    </p>
                    <button onClick={() => setAppState('createTontine')} className="w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold text-white rounded-md transition-all duration-300 shadow-lg bg-primary hover:bg-purple-500 hover:shadow-glow-primary">
                        Get Started <ArrowRightIcon className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="bg-base-200/80 backdrop-blur-sm rounded-lg border border-secondary/50 p-8 flex flex-col items-center text-center transition-all duration-300 hover:border-secondary hover:shadow-glow-secondary">
                    <div className="bg-secondary/20 p-4 rounded-full mb-6">
                        <UsersIcon className="w-10 h-10 text-secondary" />
                    </div>
                    <h2 className="text-2xl font-semibold text-text-main mb-3">Join an Existing Group</h2>
                    <p className="text-text-muted mb-8 flex-grow">
                        Have an invite code? Join a tontine group your friends or family have already set up.
                    </p>
                    <button onClick={() => setAppState('joinTontine')} className="w-full flex items-center justify-center gap-2 px-5 py-3 font-semibold text-white rounded-md transition-all duration-300 shadow-lg bg-secondary hover:bg-teal-500 hover:shadow-glow-secondary">
                        Join Group
                    </button>
                </div>
            </div>
             <div className="mt-12">
                <p className="text-text-muted">
                    Already in a group?{' '}
                    <button onClick={() => setAppState('login')} className="font-semibold text-primary hover:text-purple-400 inline-flex items-center gap-2">
                       <LogInIcon className="w-5 h-5" /> Find your tontine
                    </button>
                </p>
            </div>
        </div>
    );

    const renderWaitingRoom = () => {
        const isPendingApproval = currentUser?.membershipStatus === MembershipStatus.Pending;

        if (isPendingApproval) {
             return (
                <div className="max-w-3xl mx-auto text-center">
                    <div className="bg-base-200/80 backdrop-blur-sm rounded-lg border border-base-300/50 p-8">
                        <UsersIcon className="w-16 h-16 text-accent-pending mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-text-main">Request Sent!</h2>
                        <p className="text-text-muted mt-2 mb-6">You have requested to join "{tontine?.name}". Your request is now pending approval from the organizer. You will be able to see the group details once you are approved.</p>
                        <div className="mt-8">
                            <button onClick={resetTontine} className="px-4 py-2 text-sm font-semibold bg-base-300 text-text-main rounded-md hover:bg-gray-600 transition-colors">
                                Go Back Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        const activeParticipants = participants.filter(p => p.membershipStatus === MembershipStatus.Active);

        return (
            <div className="max-w-3xl mx-auto">
                {enrollmentDeadlineComponent}
                <div className="bg-base-200/80 backdrop-blur-sm rounded-lg border border-base-300/50 p-8 text-center">
                    <CheckCircleIcon className="w-16 h-16 text-accent-success mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-text-main">You're In!</h2>
                    <p className="text-text-muted mt-2 mb-6">You have successfully joined the "{tontine?.name}" tontine. The organizer will start the lottery and schedule once all participants have joined.</p>
                    <div className="text-left">
                        <h3 className="text-lg font-semibold text-text-main mb-4">Current Participants:</h3>
                        <ParticipantList participants={activeParticipants} isTontineActive={true} isOrganizerView={false} tontineStatus={tontineStatus}/>
                    </div>
                     <div className="mt-8">
                        <button onClick={resetTontine} className="px-4 py-2 text-sm font-semibold bg-base-300 text-text-main rounded-md hover:bg-gray-600 transition-colors">
                            Leave Waiting Room
                        </button>
                    </div>
                </div>
            </div>
        );
    };


    const renderActiveDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-base-200/80 backdrop-blur-sm border border-base-300/50 p-5 rounded-lg shadow-lg">
                <h3 className="text-sm font-medium text-text-muted">Total Participants</h3>
                <p className="mt-1 text-3xl font-semibold text-text-main">{participants.length}</p>
            </div>
            <div className="bg-base-200/80 backdrop-blur-sm border border-base-300/50 p-5 rounded-lg shadow-glow-primary">
                <h3 className="text-sm font-medium text-text-muted">Next Payout</h3>
                {nextPayout ? (
                    <>
                        <p className="mt-1 text-3xl font-semibold text-primary">{nextPayout.participant.name}</p>
                        <p className="text-sm text-text-muted">{formatDate(nextPayout.date)}</p>
                    </>
                ) : <p className="mt-1 text-lg text-text-muted">Tontine complete!</p>}
            </div>
            <div className="bg-base-200/80 backdrop-blur-sm border border-base-300/50 p-5 rounded-lg shadow-lg">
                <h3 className="text-sm font-medium text-text-muted">Tontine Duration</h3>
                <p className="mt-1 text-3xl font-semibold text-text-main">{payoutSchedule.length} {frequency}s</p>
            </div>
        </div>
    );
    
    const renderSetupWizard = () => {
        if(appState === 'active') {
            return (
                <div className="space-y-6">
                    {renderActiveDashboard()}
                    <div className="bg-base-200/80 backdrop-blur-sm rounded-lg border border-base-300/50 shadow-lg">
                        <div className="p-4 border-b border-base-300/50">
                            <h2 className="text-xl font-semibold text-text-main">Payout Schedule & Reminders</h2>
                        </div>
                        <div className="p-4">
                            <ul className="space-y-3">
                                {payoutSchedule.map((payout, index) => (
                                    <li key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-base-100/50 rounded-md border border-base-300/30">
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-primary text-lg">{index + 1}.</span>
                                            <div>
                                                <p className="font-semibold text-text-main">{payout.participant.name}</p>
                                                <p className="text-sm text-text-muted">{formatDate(payout.date)}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => sendWhatsAppReminder(payout)} className="mt-2 sm:mt-0 flex items-center gap-2 px-3 py-1.5 bg-secondary text-white font-semibold rounded-md hover:bg-teal-500 text-sm transition-colors shadow-md hover:shadow-glow-secondary">
                                            <SendIcon className="w-4 h-4" /> Send Reminder
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                     <div className="bg-base-200/80 backdrop-blur-sm rounded-lg border border-base-300/50 shadow-lg">
                        <div className="p-4 border-b border-base-300/50">
                            <h2 className="text-xl font-semibold text-text-main">Payment Status</h2>
                        </div>
                        <div className="p-4">
                             <ParticipantList participants={participants} onToggleStatus={handleTogglePaymentStatus} isTontineActive={true} isOrganizerView={isOrganizerView} tontineStatus={tontineStatus} />
                        </div>
                    </div>
                </div>
            );
        }

        const buttonClasses = "w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 font-semibold text-white rounded-md transition-all duration-300 shadow-lg";
        const primaryButtonClasses = `${buttonClasses} bg-primary hover:bg-purple-500 hover:shadow-glow-primary`;
        const secondaryButtonClasses = `${buttonClasses} bg-secondary hover:bg-teal-500 hover:shadow-glow-secondary disabled:bg-base-300 disabled:shadow-none disabled:cursor-not-allowed`;


        return (
            <div className="space-y-6">
                {enrollmentDeadlineComponent}
                <StepCard title="Manage Participants" icon={<UsersIcon />} step={1} isActive={appState==='setup'} isCompleted={isSetupComplete} isOpen={openStep === 1} onHeaderClick={isSetupComplete ? () => setOpenStep(1) : undefined}>
                    <ParticipantList participants={participants} onDelete={handleDeleteParticipant} onEdit={openModalForEdit} onApprove={handleApproveParticipant} isTontineActive={false} isOrganizerView={isOrganizerView} tontineStatus={tontineStatus}/>
                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                         <button onClick={openModalForNew} className={primaryButtonClasses}>
                            <PlusIcon className="w-5 h-5" /> Add Participant
                        </button>
                        {appState === 'setup' && (
                             <button onClick={() => { setAppState('lottery'); setOpenStep(2);}} disabled={!isSetupComplete || !isEnrollmentClosed} className={secondaryButtonClasses}>
                                Proceed to Lottery <ArrowRightIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    {!isSetupComplete && <p className="text-sm text-text-muted mt-3 text-center sm:text-left">Approve at least 2 participants to proceed.</p>}
                    {isSetupComplete && !isEnrollmentClosed && <p className="text-sm text-text-muted mt-3 text-center sm:text-right">Enrollment must be closed or deadline passed to proceed.</p>}
                </StepCard>

                <StepCard title="Run Lottery" icon={<ShuffleIcon />} step={2} isActive={appState==='lottery'} isCompleted={isLotteryComplete} isOpen={openStep === 2} onHeaderClick={isLotteryComplete ? () => setOpenStep(2) : undefined}>
                     {appState === 'lottery' && (
                        <>
                           <div className="flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-4 mb-6">
                                <button onClick={runLottery} className={primaryButtonClasses}>
                                    <ShuffleIcon className="w-5 h-5" /> {isLotteryComplete ? 'Re-shuffle Order' : 'Run Lottery'}
                                </button>
                                {isLotteryComplete && (
                                    <button onClick={() => { setAppState('scheduling'); setOpenStep(3); }} className={secondaryButtonClasses}>
                                        Confirm Order & Schedule <ArrowRightIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                           {isLotteryComplete && (
                               <ul className="space-y-2">
                                   {lotteryOrder.map((p, i) => (
                                       <li key={p.id} className="flex items-center gap-4 p-3 bg-base-100/50 rounded-md">
                                           <span className="font-bold text-primary text-lg">{i + 1}.</span>
                                           <span className="text-text-main">{p.name}</span>
                                       </li>
                                   ))}
                               </ul>
                           )}
                        </>
                    )}
                    {appState !== 'lottery' && isSetupComplete && <p className="text-text-muted">Lottery order will be determined here.</p>}
                    {!isSetupComplete && <p className="text-text-muted">Complete Step 1 to run the lottery.</p>}
                </StepCard>

                <StepCard title="Schedule Tontine" icon={<CalendarIcon />} step={3} isActive={appState==='scheduling'} isCompleted={isSchedulingComplete} isOpen={openStep === 3} onHeaderClick={undefined}>
                     {appState === 'scheduling' && (
                         <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-text-muted">Start Date</label>
                                    <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-base-100 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"/>
                                </div>
                                <div>
                                    <label htmlFor="frequency" className="block text-sm font-medium text-text-muted">Payment Frequency</label>
                                    <select id="frequency" value={frequency} onChange={e => setFrequency(e.target.value as Frequency)} className="mt-1 block w-full pl-3 pr-10 py-2 bg-base-100 border-base-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                        <option value="weekly">Weekly</option>
                                        <option value="bi-weekly">Bi-weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-start items-center gap-4">
                                <button onClick={generateSchedule} className={primaryButtonClasses}>
                                    <CalendarIcon className="w-5 h-5" /> Generate Calendar
                                </button>
                                {isSchedulingComplete && (
                                     <button onClick={() => setAppState('active')} className={secondaryButtonClasses}>
                                        Start Tontine!
                                    </button>
                                )}
                            </div>
                             {isSchedulingComplete && (
                                <div className="mt-4">
                                     <h3 className="text-lg font-medium text-text-main mb-2">Generated Schedule:</h3>
                                     <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                        {payoutSchedule.map((p, i) => (
                                             <li key={p.participant.id} className="flex items-center gap-4 p-3 bg-base-100/50 rounded-md">
                                                <span className="font-semibold text-primary w-32">{formatDate(p.date)}:</span>
                                                <span className="text-text-main">{p.participant.name}</span>
                                            </li>
                                        ))}
                                     </ul>
                                </div>
                             )}
                        </div>
                     )}
                     {appState !== 'scheduling' && <p className="text-text-muted">Payout dates will be scheduled here.</p>}
                </StepCard>

            </div>
        );
    }
    
    const renderContent = () => {
        switch (appState) {
            case 'home':
                return renderHomePage();
            case 'createTontine':
                return <CreateTontineForm onCreate={handleCreateTontine} onBack={resetTontine} />;
            case 'joinTontine':
                return <JoinTontineForm onJoin={handleJoinTontine} onBack={resetTontine} initialTontineId={joiningTontineId} />;
            case 'login':
                return <LoginForm onLogin={handleLogin} onBack={resetTontine} />;
            case 'waitingRoom':
                return renderWaitingRoom();
            case 'setup':
            case 'lottery':
            case 'scheduling':
            case 'active':
                return renderSetupWizard();
            default:
                return renderHomePage();
        }
    };
    
    return (
        <div className="min-h-screen">
            <header className="shadow-md backdrop-blur-lg sticky top-0 z-10 border-b border-primary/20 bg-base-100/80">
                <div className="max-w-7xl mx-auto py-5 px-4 sm:px-6 lg:px-8 flex justify-end items-center relative h-16">
                     <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-text-main absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-max">
                        {['setup', 'lottery', 'scheduling', 'waitingRoom'].includes(appState) ? 'Enrolment deadline' : (tontine ? tontine.name : 'Tontine Manager')}
                     </h1>
                     <div className="flex items-center gap-4">
                        {tontine && appState !== 'active' && isOrganizerView && (
                             <button onClick={() => setIsShareModalOpen(true)} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold bg-secondary/20 text-secondary rounded-md hover:bg-secondary/30 transition-colors border border-secondary/50">
                                <Share2Icon className="w-4 h-4" /> <span className="hidden sm:inline">Share</span>
                            </button>
                        )}
                         {(isOrganizerView || appState === 'waitingRoom' || appState === 'login') && (
                            <button onClick={resetTontine} className="px-4 py-2 text-sm font-semibold bg-base-200 text-text-main rounded-md hover:bg-base-300 transition-colors border border-base-300 hover:border-primary/50">
                                Start Over
                            </button>
                         )}
                     </div>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                   {renderContent()}
                </div>
            </main>
            <Modal isOpen={isParticipantModalOpen} onClose={() => setIsParticipantModalOpen(false)} title={editingParticipant ? 'Edit Participant' : 'Add New Participant'}>
                <ParticipantForm 
                    onSave={editingParticipant ? handleUpdateParticipant : handleAddParticipant}
                    onClose={() => setIsParticipantModalOpen(false)}
                    participantToEdit={editingParticipant}
                />
            </Modal>
            {tontine && (
                <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} tontine={tontine} />
            )}
        </div>
    );
}
