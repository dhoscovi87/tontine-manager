
import React, { useState, useMemo, useCallback } from 'react';
import { AppState, Participant, PaymentStatus, Payout, Frequency } from './types';
import { UsersIcon, CalendarIcon, ShuffleIcon, CheckCircleIcon, XCircleIcon, PlusIcon, Trash2Icon, EditIcon, SendIcon, ArrowRightIcon, ChevronUpIcon } from './components/icons';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
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
    onSave: (participant: Omit<Participant, 'id' | 'paymentStatus'>) => void;
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="John Doe" />
            </div>
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number (with country code)</label>
                <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="15551234567" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700">{participantToEdit ? 'Save Changes' : 'Add Participant'}</button>
            </div>
        </form>
    );
};

// --- CARD COMPONENT ---
interface CardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  step: number;
  isActive: boolean;
  isCompleted: boolean;
  onHeaderClick?: () => void;
  isOpen: boolean;
}

const StepCard: React.FC<CardProps> = ({ title, icon, children, step, isActive, isCompleted, onHeaderClick, isOpen }) => {
  const headerStyles = `flex justify-between items-center p-4 rounded-t-lg transition-colors ${isActive || isOpen ? 'bg-primary text-white' : isCompleted ? 'bg-gray-500 text-white' : 'bg-white text-gray-700'} ${onHeaderClick ? 'cursor-pointer' : ''}`;

  return (
      <div className={`bg-white rounded-lg shadow-md transition-all duration-300 ${isActive ? 'ring-2 ring-primary' : ''}`}>
        <div className={headerStyles} onClick={onHeaderClick}>
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-white ${isActive || isOpen ? 'bg-white text-primary' : isCompleted ? 'bg-gray-400' : 'bg-primary'}`}>{isCompleted ? <CheckCircleIcon/> : step}</div>
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
          {onHeaderClick && <ChevronUpIcon className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`} />}
        </div>
        {isOpen && (
            <div className="p-6 border-t border-gray-200">
                {children}
            </div>
        )}
    </div>
  );
};


export default function App() {
    const [appState, setAppState] = useState<AppState>('setup');
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [lotteryOrder, setLotteryOrder] = useState<Participant[]>([]);
    const [payoutSchedule, setPayoutSchedule] = useState<Payout[]>([]);
    const [frequency, setFrequency] = useState<Frequency>('monthly');
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
    const [openStep, setOpenStep] = useState(1);

    const handleAddParticipant = (participantData: Omit<Participant, 'id' | 'paymentStatus'>) => {
        const newParticipant: Participant = {
            ...participantData,
            id: new Date().getTime().toString(),
            paymentStatus: PaymentStatus.Pending,
        };
        setParticipants(prev => [...prev, newParticipant]);
        setIsModalOpen(false);
    };

    const handleUpdateParticipant = (participantData: Omit<Participant, 'id' | 'paymentStatus'>) => {
        if (editingParticipant) {
            setParticipants(prev => prev.map(p => p.id === editingParticipant.id ? { ...p, ...participantData } : p));
            setEditingParticipant(null);
            setIsModalOpen(false);
        }
    };
    
    const handleDeleteParticipant = (id: string) => {
        if (window.confirm('Are you sure you want to remove this participant?')) {
            setParticipants(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleTogglePaymentStatus = (id: string) => {
        setParticipants(prev => prev.map(p => 
            p.id === id ? { ...p, paymentStatus: p.paymentStatus === PaymentStatus.Paid ? PaymentStatus.Pending : PaymentStatus.Paid } : p
        ));
    };

    const runLottery = useCallback(() => {
        setLotteryOrder(shuffleArray(participants));
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
        const message = `Hi ${payout.participant.name}, this is a reminder that your tontine payment is due on ${formatDate(payout.date)}. Please send your contribution.`;
        const whatsappUrl = `https://wa.me/${payout.participant.phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const openModalForNew = () => {
        setEditingParticipant(null);
        setIsModalOpen(true);
    };

    const openModalForEdit = (participant: Participant) => {
        setEditingParticipant(participant);
        setIsModalOpen(true);
    };

    const isSetupComplete = participants.length > 1;
    const isLotteryComplete = lotteryOrder.length > 0;
    const isSchedulingComplete = payoutSchedule.length > 0;
    
    const renderActiveDashboard = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Total Participants</h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{participants.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Next Payout</h3>
                {nextPayout ? (
                    <>
                        <p className="mt-1 text-3xl font-semibold text-gray-900">{nextPayout.participant.name}</p>
                        <p className="text-sm text-gray-500">{formatDate(nextPayout.date)}</p>
                    </>
                ) : <p className="mt-1 text-lg text-gray-500">Tontine complete!</p>}
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-sm font-medium text-gray-500">Tontine Duration</h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{payoutSchedule.length} {frequency}s</p>
            </div>
        </div>
    );
    
    const renderContent = () => {
        if(appState === 'active') {
            return (
                <div className="space-y-6">
                    {renderActiveDashboard()}
                    <div className="bg-white rounded-lg shadow-md">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">Payout Schedule & Reminders</h2>
                        </div>
                        <div className="p-4">
                            <ul className="space-y-3">
                                {payoutSchedule.map((payout, index) => (
                                    <li key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-50 rounded-md">
                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-primary">{index + 1}.</span>
                                            <div>
                                                <p className="font-semibold text-gray-900">{payout.participant.name}</p>
                                                <p className="text-sm text-gray-600">{formatDate(payout.date)}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => sendWhatsAppReminder(payout)} className="mt-2 sm:mt-0 flex items-center gap-2 px-3 py-1.5 bg-secondary text-white rounded-md hover:bg-emerald-600 text-sm">
                                            <SendIcon className="w-4 h-4" /> Send Reminder
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                     <div className="bg-white rounded-lg shadow-md">
                        <div className="p-4 border-b">
                            <h2 className="text-xl font-semibold text-gray-800">Payment Status</h2>
                        </div>
                        <div className="p-4">
                             <ParticipantList participants={participants} onToggleStatus={handleTogglePaymentStatus} isTontineActive={true}/>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                <StepCard title="Manage Participants" icon={<UsersIcon />} step={1} isActive={appState==='setup'} isCompleted={isSetupComplete} isOpen={openStep === 1} onHeaderClick={isSetupComplete ? () => setOpenStep(1) : undefined}>
                    <ParticipantList participants={participants} onDelete={handleDeleteParticipant} onEdit={openModalForEdit} isTontineActive={false} />
                    <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                         <button onClick={openModalForNew} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700">
                            <PlusIcon className="w-5 h-5" /> Add Participant
                        </button>
                        {appState === 'setup' && (
                             <button onClick={() => { setAppState('lottery'); setOpenStep(2);}} disabled={!isSetupComplete} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-white rounded-md hover:bg-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                Proceed to Lottery <ArrowRightIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    {!isSetupComplete && <p className="text-sm text-gray-500 mt-2 text-center sm:text-left">Add at least 2 participants to proceed.</p>}
                </StepCard>

                <StepCard title="Run Lottery" icon={<ShuffleIcon />} step={2} isActive={appState==='lottery'} isCompleted={isLotteryComplete} isOpen={openStep === 2} onHeaderClick={isLotteryComplete ? () => setOpenStep(2) : undefined}>
                     {appState === 'lottery' && (
                        <>
                           <div className="flex flex-col sm:flex-row justify-center sm:justify-start items-center gap-4 mb-4">
                                <button onClick={runLottery} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700">
                                    <ShuffleIcon className="w-5 h-5" /> {isLotteryComplete ? 'Re-shuffle Order' : 'Run Lottery'}
                                </button>
                                {isLotteryComplete && (
                                    <button onClick={() => { setAppState('scheduling'); setOpenStep(3); }} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-white rounded-md hover:bg-emerald-600">
                                        Confirm Order & Schedule <ArrowRightIcon className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                           {isLotteryComplete && (
                               <ul className="space-y-2">
                                   {lotteryOrder.map((p, i) => (
                                       <li key={p.id} className="flex items-center gap-4 p-2 bg-gray-50 rounded">
                                           <span className="font-bold text-primary">{i + 1}.</span>
                                           <span className="text-gray-800">{p.name}</span>
                                       </li>
                                   ))}
                               </ul>
                           )}
                        </>
                    )}
                    {appState !== 'lottery' && <p className="text-gray-500">Lottery order will be determined here.</p>}
                </StepCard>

                <StepCard title="Schedule Tontine" icon={<CalendarIcon />} step={3} isActive={appState==='scheduling'} isCompleted={isSchedulingComplete} isOpen={openStep === 3} onHeaderClick={undefined}>
                     {appState === 'scheduling' && (
                         <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                                    <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"/>
                                </div>
                                <div>
                                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Payment Frequency</label>
                                    <select id="frequency" value={frequency} onChange={e => setFrequency(e.target.value as Frequency)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                                        <option value="weekly">Weekly</option>
                                        <option value="bi-weekly">Bi-weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-start items-center gap-4">
                                <button onClick={generateSchedule} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700">
                                    <CalendarIcon className="w-5 h-5" /> Generate Calendar
                                </button>
                                {isSchedulingComplete && (
                                     <button onClick={() => setAppState('active')} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-white rounded-md hover:bg-emerald-600">
                                        Start Tontine!
                                    </button>
                                )}
                            </div>
                             {isSchedulingComplete && (
                                <div className="mt-4">
                                     <h3 className="text-lg font-medium text-gray-800 mb-2">Generated Schedule:</h3>
                                     <ul className="space-y-2 max-h-60 overflow-y-auto">
                                        {payoutSchedule.map((p, i) => (
                                             <li key={p.participant.id} className="flex items-center gap-4 p-2 bg-gray-50 rounded">
                                                <span className="font-bold text-primary w-12">{formatDate(p.date)}:</span>
                                                <span className="text-gray-800">{p.participant.name}</span>
                                            </li>
                                        ))}
                                     </ul>
                                </div>
                             )}
                        </div>
                     )}
                     {appState !== 'scheduling' && <p className="text-gray-500">Payout dates will be scheduled here.</p>}
                </StepCard>

            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-slate-100 font-sans text-gray-900">
            <header className="bg-primary shadow-md">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Tontine Manager</h1>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                   {renderContent()}
                </div>
            </main>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingParticipant ? 'Edit Participant' : 'Add New Participant'}>
                <ParticipantForm 
                    onSave={editingParticipant ? handleUpdateParticipant : handleAddParticipant}
                    onClose={() => setIsModalOpen(false)}
                    participantToEdit={editingParticipant}
                />
            </Modal>
        </div>
    );
}

interface ParticipantListProps {
    participants: Participant[];
    onDelete?: (id: string) => void;
    onEdit?: (participant: Participant) => void;
    onToggleStatus?: (id: string) => void;
    isTontineActive: boolean;
}

const ParticipantList: React.FC<ParticipantListProps> = ({ participants, onDelete, onEdit, onToggleStatus, isTontineActive }) => {
    if (participants.length === 0) {
        return <p className="text-center text-gray-500 py-4">No participants added yet.</p>;
    }

    return (
        <div className="flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {participants.map((p) => (
                    <tr key={p.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{p.name}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{p.phone}</td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                          {onToggleStatus ? (
                                <button onClick={() => onToggleStatus(p.id)} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${p.paymentStatus === PaymentStatus.Paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {p.paymentStatus === PaymentStatus.Paid ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />}
                                    {p.paymentStatus}
                                </button>
                          ) : (
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.paymentStatus === PaymentStatus.Paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {p.paymentStatus}
                                </span>
                          )}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                          {!isTontineActive && onEdit && onDelete && (
                             <div className="flex justify-end gap-2">
                                <button onClick={() => onEdit(p)} className="text-primary hover:text-blue-700"><EditIcon className="w-5 h-5"/></button>
                                <button onClick={() => onDelete(p.id)} className="text-red-600 hover:text-red-800"><Trash2Icon className="w-5 h-5"/></button>
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
