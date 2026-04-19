import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../AppContext';

const DevelopersPage = () => {
    const [developers, setDevelopers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { selectedProject } = useContext(AppContext);
    
    // Task Detail States
    const [expandedDev, setExpandedDev] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [viewingProfile, setViewingProfile] = useState(null);

    // Task Assignment State
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedDev, setSelectedDev] = useState(null);
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        deadline: ''
    });

    const fetchDevelopers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/users/developers', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 'success') {
                setDevelopers(data.data.developers);
            }
        } catch (err) {
            setError('Failed to load developers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevelopers();
    }, []);

    const handleAssignTask = async (e) => {
        e.preventDefault();
        if (!selectedProject) {
            alert('Please select a project first from the Navbar!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    ...taskData,
                    project: selectedProject._id,
                    assignedTo: selectedDev._id
                })
            });

            const data = await res.json();
            if (data.status === 'success') {
                alert(`Task assigned to ${selectedDev.name} successfully!`);
                setShowAssignModal(false);
                setTaskData({ title: '', description: '', priority: 'Medium', deadline: '' });
                fetchDevelopers(); // Refresh data to show new task
            } else {
                alert(data.message || 'Error assigning task');
            }
        } catch (err) {
            alert('Error assigning task');
        }
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
                    <h1 className="text-3xl font-bold text-text-primary">Developer <span className="text-accent-color">Fleet</span></h1>
                    <p className="text-text-secondary">Monitor team workload and task progress in real-time.</p>
                </div>
            </header>

            {error && <div className="text-red-500 bg-red-500/10 p-4 rounded-xl border border-red-500/20">{error}</div>}

            <div className="grid grid-cols-1 gap-8">
                {developers.map(dev => (
                    <div key={dev._id} className="group overflow-hidden rounded-2xl border border-border-color bg-secondary-bg transition-all hover:border-accent-color/30">
                        {/* Summary Header */}
                        <div className="flex flex-wrap items-center gap-6 p-6">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-bg font-black text-accent-color border border-border-color capitalize text-xl shrink-0">
                                {dev.name.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                                    {dev.name}
                                    <button 
                                        onClick={() => setViewingProfile(dev)}
                                        className="text-[10px] bg-accent-color/10 text-accent-color px-2 py-0.5 rounded-full hover:bg-accent-color hover:text-primary-bg transition-all"
                                    >
                                        Bio
                                    </button>
                                </h3>
                                <p className="text-xs text-text-secondary">{dev.email}</p>
                            </div>
                            
                            <div className="flex-1 max-w-[300px] min-w-[150px]">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">
                                    <span>Workload Progress</span>
                                    <span className="text-accent-color">{dev.progress}%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-primary-bg overflow-hidden border border-border-color/50">
                                    <div 
                                        className="h-full bg-gradient-to-r from-accent-color/40 to-accent-color transition-all duration-1000" 
                                        style={{ width: `${dev.progress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="text-right px-6 border-l border-border-color flex flex-col items-end">
                                <p className="text-lg font-bold text-text-primary">{dev.tasksCount}</p>
                                <p className="text-[10px] font-bold uppercase text-text-secondary">Assigned Flows</p>
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setExpandedDev(expandedDev === dev._id ? null : dev._id)}
                                    className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-xl border transition-all ${
                                        expandedDev === dev._id 
                                            ? "bg-accent-color text-primary-bg border-accent-color" 
                                            : "border-border-color text-text-secondary hover:border-accent-color hover:text-accent-color"
                                    }`}
                                >
                                    {expandedDev === dev._id ? 'Hide Tasks' : 'View Tasks'}
                                </button>
                                <button 
                                    onClick={() => {
                                        setSelectedDev(dev);
                                        setShowAssignModal(true);
                                    }}
                                    className="rounded-xl border border-border-color bg-primary-bg px-4 py-2 text-xs font-bold uppercase tracking-widest text-text-secondary hover:text-accent-color hover:border-accent-color transition-all"
                                >
                                    Assign
                                </button>
                            </div>
                        </div>

                        {/* Expandable Task List */}
                        {expandedDev === dev._id && (
                            <div className="border-t border-border-color bg-primary-bg/30 p-6 animate-in fade-in slide-in-from-top-4 duration-300">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-4 flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-accent-color"></span>
                                    Task Breakdown for {dev.name}
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {dev.tasks?.length > 0 ? dev.tasks.map(task => (
                                        <div 
                                            key={task._id}
                                            className="group/task rounded-xl border border-border-color bg-secondary-bg p-4 hover:border-accent-color/40 transition-all flex items-center justify-between"
                                        >
                                            <div onClick={() => setSelectedTask(task)} className="flex flex-col cursor-pointer flex-1">
                                                <span className="text-sm font-bold text-text-primary group-hover/task:text-accent-color transition-colors">{task.title}</span>
                                                <span className="text-[10px] text-text-secondary">Added: {new Date(task.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                    task.status === 'Done' ? 'bg-emerald-500/10 text-emerald-500' : 
                                                    task.status === 'Review' ? 'bg-blue-500/10 text-blue-500' :
                                                    'bg-amber-500/10 text-amber-500'
                                                }`}>
                                                    {task.status}
                                                </div>
                                                
                                                {/* QUICK APPROVE BUTTON IN DEVELOPER LIST */}
                                                {task.status === 'Review' && (
                                                    <button 
                                                        onClick={async (e) => {
                                                            e.stopPropagation();
                                                            const token = localStorage.getItem('token');
                                                            try {
                                                                const res = await fetch(`/api/tasks/${task._id}/status`, {
                                                                    method: 'PATCH',
                                                                    headers: { 
                                                                        'Content-Type': 'application/json',
                                                                        'Authorization': `Bearer ${token}` 
                                                                    },
                                                                    body: JSON.stringify({ status: 'Done' })
                                                                });
                                                                if (res.ok) fetchDevelopers();
                                                            } catch (err) { console.error(err); }
                                                        }}
                                                        className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-90"
                                                        title="Approve Task"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="col-span-full py-6 text-center text-text-secondary text-sm italic">
                                            No tasks assigned yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Task Progress Detail Modal */}
            {selectedTask && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[60] animate-in fade-in duration-300">
                    <div className="bg-secondary-bg border border-border-color w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-border-color flex justify-between items-start">
                            <div>
                                <span className="text-xs font-black uppercase text-accent-color tracking-[0.2em] mb-2 block">Task Insight</span>
                                <h2 className="text-3xl font-bold text-text-primary">{selectedTask.title}</h2>
                            </div>
                            <button 
                                onClick={() => setSelectedTask(null)}
                                className="p-2 rounded-lg bg-primary-bg border border-border-color text-text-secondary hover:text-white transition-colors"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-3 gap-8">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-text-secondary uppercase">Priority</span>
                                    <span className={`text-sm font-black ${
                                        selectedTask.priority === 'Urgent' ? 'text-rose-500' : 
                                        selectedTask.priority === 'High' ? 'text-orange-500' : 
                                        'text-accent-color'
                                    }`}>{selectedTask.priority}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-text-secondary uppercase">Current State</span>
                                    <span className="text-sm font-black text-text-primary">{selectedTask.status}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-bold text-text-secondary uppercase">Deadline</span>
                                    <span className="text-sm font-black text-text-primary">
                                        {selectedTask.deadline 
                                            ? new Date(selectedTask.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) 
                                            : 'No Date Set'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h5 className="text-[10px] font-black uppercase text-accent-color tracking-widest mb-3">Goal Objective</h5>
                                <p className="text-text-secondary leading-relaxed bg-primary-bg p-6 rounded-2xl border border-border-color italic">
                                    "{selectedTask.description || 'No description provided for this flow.'}"
                                </p>
                            </div>

                            <div className="pt-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-accent-color/10 border border-accent-color/30 text-accent-color font-bold">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-text-primary">Status verification active</span>
                                        <span className="text-[10px] text-text-secondary">Tracking real-time progress updates...</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedTask(null)}
                                    className="px-8 py-3 bg-accent-color text-primary-bg rounded-xl font-bold uppercase tracking-widest text-xs hover:shadow-lg hover:shadow-accent-color/20 transition-all"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Developer Profile View Modal */}
            {viewingProfile && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 z-[70] animate-in zoom-in-95 duration-300">
                    <div className="bg-secondary-bg border border-border-color w-full max-w-3xl rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="h-32 bg-gradient-to-r from-accent-color/20 to-accent-color/5 flex justify-end p-8">
                            <button 
                                onClick={() => setViewingProfile(null)}
                                className="h-12 w-12 rounded-2xl bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-all border border-white/10"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="px-10 pb-10 -mt-16">
                            <div className="flex items-end gap-6 mb-8">
                                <div className="h-32 w-32 rounded-3xl bg-primary-bg border-4 border-secondary-bg flex items-center justify-center text-5xl font-black text-accent-color shadow-xl">
                                    {viewingProfile.name.charAt(0)}
                                </div>
                                <div className="flex-1 pb-2">
                                    <h2 className="text-3xl font-black text-text-primary">{viewingProfile.name}</h2>
                                    <p className="text-accent-color font-bold uppercase tracking-widest text-xs mt-1">{viewingProfile.designation || 'Technical Associate'}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <section>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-color mb-3">Professional Bio</h3>
                                        <p className="text-sm text-text-primary leading-relaxed opacity-80">{viewingProfile.bio || 'This professional has not shared a biography yet.'}</p>
                                    </section>
                                    
                                    <section>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-color mb-3">Work History</h3>
                                        <div className="space-y-3">
                                            {viewingProfile.workHistory && viewingProfile.workHistory.length > 0 ? viewingProfile.workHistory.map((work, i) => (
                                                <div key={i} className="p-4 bg-primary-bg rounded-2xl border border-border-color">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-bold text-sm text-text-primary">{work.role}</h4>
                                                            <p className="text-[10px] text-accent-color font-medium uppercase">{work.company}</p>
                                                        </div>
                                                        <span className="text-[8px] font-black text-text-secondary uppercase">{work.duration}</span>
                                                    </div>
                                                </div>
                                            )) : (
                                                <p className="text-xs text-text-secondary italic">No employment history listed.</p>
                                            )}
                                        </div>
                                    </section>
                                </div>
                                
                                <div className="space-y-6">
                                    <section className="bg-primary-bg p-6 rounded-3xl border border-border-color">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-color mb-4">Tech Stack</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {viewingProfile.techStack && viewingProfile.techStack.length > 0 ? viewingProfile.techStack.map((tech, i) => (
                                                <span key={i} className="px-2.5 py-1.5 bg-secondary-bg border border-border-color rounded-lg text-[9px] font-bold text-text-primary uppercase tracking-wider">{tech}</span>
                                            )) : (
                                                <span className="text-xs text-text-secondary">No stack listed.</span>
                                            )}
                                        </div>
                                    </section>
                                    
                                    <section className="bg-primary-bg p-6 rounded-3xl border border-border-color">
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-color mb-2">Industrial Tenure</h3>
                                        <p className="text-xl font-black text-text-primary">{viewingProfile.experience || 'N/A'}</p>
                                    </section>

                                    <div className="flex gap-4 pt-4">
                                        {viewingProfile.socialLinks?.github && <a href={viewingProfile.socialLinks.github} target="_blank" className="p-3 bg-primary-bg rounded-xl border border-border-color text-text-secondary hover:text-accent-color"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>}
                                        {viewingProfile.socialLinks?.linkedin && <a href={viewingProfile.socialLinks.linkedin} target="_blank" className="p-3 bg-primary-bg rounded-xl border border-border-color text-text-secondary hover:text-accent-color"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.763z"/></svg></a>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Assignment Modal (Existing) */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-secondary-bg border border-border-color w-full max-w-md rounded-2xl p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold text-text-primary mb-6">Assign Task to {selectedDev?.name}</h2>
                        <form onSubmit={handleAssignTask} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-1.5">Task Title</label>
                                <input 
                                    type="text" 
                                    required
                                    placeholder="e.g. Implement API Endpoint"
                                    className="w-full bg-primary-bg border border-border-color rounded-xl px-4 py-2.5 text-text-primary outline-none focus:ring-2 focus:ring-accent-color/50 transition-all"
                                    value={taskData.title}
                                    onChange={e => setTaskData({...taskData, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-1.5">Description</label>
                                <textarea 
                                    placeholder="Detail the flow requirements..."
                                    className="w-full bg-primary-bg border border-border-color rounded-xl px-4 py-2.5 text-text-primary outline-none focus:ring-2 focus:ring-accent-color/50 h-24 transition-all"
                                    value={taskData.description}
                                    onChange={e => setTaskData({...taskData, description: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-1.5">Priority</label>
                                    <select 
                                        className="w-full bg-primary-bg border border-border-color rounded-xl px-4 py-2.5 text-text-primary outline-none focus:ring-2 focus:ring-accent-color/50 transition-all"
                                        value={taskData.priority}
                                        onChange={e => setTaskData({...taskData, priority: e.target.value})}
                                    >
                                        <option>Low</option>
                                        <option>Medium</option>
                                        <option>High</option>
                                        <option>Urgent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-text-secondary mb-1.5">Deadline</label>
                                    <input 
                                        type="date" 
                                        className="w-full bg-primary-bg border border-border-color rounded-xl px-4 py-2.5 text-text-primary outline-none focus:ring-2 focus:ring-accent-color/50 transition-all text-sm"
                                        value={taskData.deadline}
                                        onChange={e => setTaskData({...taskData, deadline: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-8">
                                <button 
                                    type="button"
                                    onClick={() => setShowAssignModal(false)}
                                    className="flex-1 py-3 rounded-xl border border-border-color text-text-secondary font-bold uppercase tracking-widest text-[10px] hover:bg-primary-bg transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-3 rounded-xl bg-accent-color text-primary-bg font-bold uppercase tracking-widest text-[10px] hover:shadow-lg hover:shadow-accent-color/20 transition-all"
                                >
                                    Confirm Assignment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DevelopersPage;
