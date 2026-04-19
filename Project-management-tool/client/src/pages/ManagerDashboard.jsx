import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../AppContext';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const { setSelectedProject, user } = useContext(AppContext);
    const navigate = useNavigate();

    const fetchAllProjectStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/projects/all-stats', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 'success') {
                setProjects(data.data.projects);
            }
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'manager') {
            fetchAllProjectStats();
        }
    }, [user]);

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="h-10 w-10 border-4 border-accent-color border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10 pb-20">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Manager <span className="text-accent-color">Control Center</span></h1>
                    <p className="text-text-secondary mt-1 tracking-tight font-medium uppercase text-[10px]">Strategic overview of all supervised lifecycles</p>
                </div>
                <button 
                    onClick={() => navigate('/projects/new')}
                    className="bg-accent-color text-primary-bg px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent-color/20"
                >
                    New Project
                </button>
            </header>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length > 0 ? projects.map(project => (
                    <div 
                        key={project._id} 
                        className="group bg-secondary-bg border border-border-color rounded-2xl p-6 transition-all hover:border-accent-color/40 hover:shadow-xl shadow-accent-color/5"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-color transition-colors">{project.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className={`h-1.5 w-1.5 rounded-full ${
                                        project.status === 'active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'
                                    }`}></div>
                                    <span className="text-[10px] font-black uppercase text-text-secondary tracking-widest">{project.status}</span>
                                </div>
                            </div>
                            <span className="text-2xl font-black text-accent-color">{project.progress}%</span>
                        </div>

                        {/* Mini Stats Grid */}
                        <div className="grid grid-cols-3 gap-2 mb-6">
                            <div className="bg-primary-bg/50 p-3 rounded-xl border border-border-color/50 text-center">
                                <p className="text-[9px] font-bold text-text-secondary uppercase mb-1">Total</p>
                                <p className="text-sm font-black text-text-primary">{project.total}</p>
                            </div>
                            <div className="bg-primary-bg/50 p-3 rounded-xl border border-border-color/50 text-center">
                                <p className="text-[9px] font-bold text-purple-500 uppercase mb-1">Review</p>
                                <p className="text-sm font-black text-purple-500">{project.review}</p>
                            </div>
                            <div className="bg-primary-bg/50 p-3 rounded-xl border border-border-color/50 text-center">
                                <p className="text-[9px] font-bold text-emerald-500 uppercase mb-1">Done</p>
                                <p className="text-sm font-black text-emerald-500">{project.completed}</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-primary-bg rounded-full overflow-hidden mb-8 border border-border-color/50">
                            <div 
                                className="h-full bg-accent-color transition-all duration-1000" 
                                style={{ width: `${project.progress}%` }}
                            ></div>
                        </div>

                        <button 
                            onClick={() => {
                                setSelectedProject(project);
                                navigate('/overview');
                            }}
                            className="w-full py-3 rounded-xl border border-border-color bg-primary-bg text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary group-hover:bg-accent-color group-hover:text-primary-bg group-hover:border-accent-color transition-all"
                        >
                            Deep Dive Analysis
                        </button>
                    </div>
                )) : (
                    <div className="col-span-full py-20 text-center bg-secondary-bg/50 rounded-3xl border border-dashed border-border-color">
                        <div className="h-16 w-16 bg-primary-bg rounded-full flex items-center justify-center mx-auto mb-4 border border-border-color">
                            <svg className="h-8 w-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <h3 className="text-lg font-bold text-text-primary">No Projects Found</h3>
                        <p className="text-text-secondary text-sm">You haven't initialized any lifecycles yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagerDashboard;