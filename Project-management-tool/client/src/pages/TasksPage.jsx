import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../AppContext';

const TasksPage = () => {
    const { selectedProject, user } = useContext(AppContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const fetchTasks = async () => {
        if (!selectedProject) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/tasks/project/${selectedProject._id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 'success') {
                setTasks(data.data.tasks);
            }
        } catch (err) {
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/tasks/${selectedTask._id}/status`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ status: newStatus })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setShowUpdateModal(false);
                fetchTasks(); // Refresh list
            }
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [selectedProject]);

    if (!selectedProject) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center">
                <div className="h-20 w-20 rounded-3xl bg-secondary-bg border border-border-color flex items-center justify-center mb-6">
                    <svg className="h-10 w-10 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <h2 className="text-xl font-bold text-text-primary">Selection Required</h2>
                <p className="text-text-secondary mt-2 max-w-xs">Please select a project context from the Navbar to view systemic tasks.</p>
            </div>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Not Set';
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="h-10 w-10 border-4 border-accent-color border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-8 pb-20">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">System <span className="text-accent-color">Tasks</span></h1>
                    <p className="text-text-secondary">Assigned flows for <span className="text-text-primary font-bold">{selectedProject.name}</span>.</p>
                </div>
                <div className="px-4 py-2 bg-secondary-bg border border-border-color rounded-xl text-xs font-bold text-text-secondary">
                    Total: {tasks.length} Flows
                </div>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {tasks.length > 0 ? tasks.map(task => (
                    <div key={task._id} className="group flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-border-color bg-secondary-bg p-6 transition-all hover:border-accent-color/40">
                        <div className="flex-1 min-w-[200px]">
                            <div className="flex items-center gap-3">
                                <span className={`h-2.5 w-2.5 rounded-full ${
                                    task.priority === 'Urgent' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse' : 
                                    task.priority === 'High' ? 'bg-orange-500' : 
                                    'bg-accent-color'
                                }`}></span>
                                <h3 className="font-bold text-text-primary group-hover:text-accent-color transition-colors">{task.title}</h3>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1.5">
                                    <svg className="h-3.5 w-3.5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <span className="text-xs text-text-secondary font-medium">Due {formatDate(task.deadline)}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <svg className="h-3.5 w-3.5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    <span className="text-xs text-text-secondary font-medium capitalize">{task.assignedTo?.name || 'Unassigned'}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-8">
                            <div className="flex flex-col text-right">
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">State</span>
                                <span className={`text-xs font-black uppercase tracking-widest ${
                                    task.status === 'Done' ? 'text-emerald-500' : 
                                    task.status === 'Review' ? 'text-blue-500' :
                                    'text-amber-500'
                                }`}>
                                    {task.status}
                                </span>
                            </div>
                            
                            {/* Manager Quick Approval Action */}
                            {user.role === 'manager' && task.status === 'Review' && (
                                <button 
                                    onClick={() => {
                                        setSelectedTask(task);
                                        handleUpdateStatus('Done');
                                    }}
                                    className="group/approve flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 transition-all hover:bg-emerald-500 hover:border-emerald-500 active:scale-95 shadow-sm"
                                >
                                    <svg className="h-4 w-4 text-emerald-500 group-hover/approve:text-primary-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 group-hover/approve:text-primary-bg">Approve Flow</span>
                                </button>
                            )}

                            <button 
                                onClick={() => {
                                    setSelectedTask(task);
                                    setShowUpdateModal(true);
                                }}
                                className="rounded-xl border border-border-color bg-primary-bg px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-text-primary transition-all hover:bg-accent-color hover:text-primary-bg hover:border-accent-color active:scale-95 shadow-sm"
                            >
                                Update Flow
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-secondary-bg/50 rounded-2xl border border-dashed border-border-color">
                        <p className="text-text-secondary italic">No assigned flows found for your profile in this project.</p>
                    </div>
                )}
            </div>

            {/* Update Status Modal */}
            {showUpdateModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
                    <div className="bg-secondary-bg border border-border-color w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-border-color">
                            <h2 className="text-xl font-bold text-text-primary">Update Flow State</h2>
                            <p className="text-sm text-text-secondary mt-1">{selectedTask?.title}</p>
                        </div>
                        <div className="p-8 space-y-4">
                            {['Todo', 'In-Progress', 'Review', 'Done'].map(status => {
                                const isDisabled = status === 'Done' && user.role !== 'manager';
                                return (
                                    <button
                                        key={status}
                                        disabled={isDisabled}
                                        onClick={() => handleUpdateStatus(status)}
                                        className={`w-full p-4 rounded-xl border text-left font-bold transition-all flex items-center justify-between group ${
                                            selectedTask?.status === status 
                                            ? 'bg-accent-color/10 border-accent-color text-accent-color' 
                                            : isDisabled
                                            ? 'bg-primary-bg border-border-color opacity-30 cursor-not-allowed'
                                            : 'bg-primary-bg border-border-color text-text-secondary hover:border-accent-color/50'
                                        }`}
                                    >
                                        <div className="flex flex-col">
                                            <span>{status}</span>
                                            {isDisabled && <span className="text-[10px] font-normal italic opacity-60">Manager approval required</span>}
                                        </div>
                                        {selectedTask?.status === status && (
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="p-8 bg-primary-bg/50 border-t border-border-color flex justify-end">
                            <button 
                                onClick={() => setShowUpdateModal(false)}
                                className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-text-primary transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TasksPage;
