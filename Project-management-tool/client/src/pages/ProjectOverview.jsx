import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { API_URL } from '../apiConfig';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ProjectOverview = () => {
    const { selectedProject } = useContext(AppContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        if (!selectedProject) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/projects/${selectedProject._id}/stats`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 'success') {
                setStats(data.data.stats);
            } else if (data.status === 'fail') {
                // If access is denied, clear stats to show "No Selection/Access"
                setStats(null);
            }
        } catch (err) {
            console.error('Error fetching project stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [selectedProject]);

    if (!selectedProject) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-20 w-20 rounded-3xl bg-secondary-bg border border-border-color flex items-center justify-center mb-6">
                        <svg className="h-10 w-10 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                    </div>
                    <h2 className="text-xl font-bold text-text-primary">No Project Selected</h2>
                    <p className="text-text-secondary mt-2">Please select a project flow from the navbar to view analytics.</p>
                </div>
            </div>
        );
    }

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <div className="h-10 w-10 border-4 border-accent-color border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const chartData = {
        labels: ['Todo', 'Ongoing', 'Review', 'Done'],
        datasets: [
            {
                label: 'Tasks',
                data: stats?.chartData || [0, 0, 0, 0],
                backgroundColor: [
                    'rgba(245, 158, 11, 0.2)', // Amber (Todo)
                    'rgba(59, 130, 246, 0.2)',  // Blue (Ongoing)
                    'rgba(147, 51, 234, 0.2)',  // Purple (Review)
                    'rgba(16, 185, 129, 0.2)',  // Emerald (Done)
                ],
                borderColor: [
                    '#f59e0b',
                    '#3b82f6',
                    '#9333ea',
                    '#10b981',
                ],
                borderWidth: 2,
                hoverOffset: 15
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: 'var(--text-secondary)',
                    font: {
                        family: 'Inter',
                        weight: 'bold',
                        size: 11
                    },
                    padding: 20,
                    usePointStyle: true,
                }
            },
            tooltip: {
                backgroundColor: 'var(--secondary-bg)',
                titleColor: 'var(--text-primary)',
                bodyColor: 'var(--text-secondary)',
                titleFont: { family: 'Inter', weight: 'bold' },
                bodyFont: { family: 'Inter' },
                padding: 12,
                cornerRadius: 12,
                displayColors: false,
                borderColor: 'var(--border-color)',
                borderWidth: 1
            }
        },
        cutout: '65%',
        responsive: true,
        maintainAspectRatio: false
    };

    const barData = {
        labels: ['Sprint Metrics'],
        datasets: [
            {
                label: 'Assigned Work',
                data: [stats?.total || 0],
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                borderColor: '#3b82f6',
                borderWidth: 2,
                borderRadius: 8,
                barThickness: 60,
            },
            {
                label: 'In Progress',
                data: [stats?.ongoing || 0],
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                borderColor: '#f59e0b',
                borderWidth: 2,
                borderRadius: 8,
                barThickness: 60,
            },
            {
                label: 'Awaiting Review',
                data: [stats?.review || 0],
                borderColor: '#9333ea',
                backgroundColor: 'rgba(147, 51, 234, 0.15)',
                borderWidth: 2,
                borderRadius: 8,
                barThickness: 60,
            },
            {
                label: 'Approved Done',
                data: [stats?.completed || 0],
                backgroundColor: 'rgba(16, 185, 129, 0.25)',
                borderColor: '#10b981',
                borderWidth: 2,
                borderRadius: 8,
                barThickness: 60,
            }
        ]
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                display: false // Using custom legend for cleaner look
            },
            tooltip: {
                backgroundColor: 'var(--secondary-bg)',
                titleColor: 'var(--text-primary)',
                bodyColor: 'var(--text-secondary)',
                titleFont: { family: 'Inter', size: 13, weight: 'bold' },
                bodyFont: { family: 'Inter', size: 12 },
                padding: 16,
                cornerRadius: 12,
                borderColor: 'var(--border-color)',
                borderWidth: 1,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                    label: (context) => ` ${context.dataset.label}: ${context.raw} Tasks`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { 
                    color: 'var(--border-color)',
                    alpha: 0.1,
                    drawBorder: false
                },
                ticks: { 
                    color: 'var(--text-secondary)', 
                    stepSize: 1,
                    font: { family: 'Inter', size: 10 }
                }
            },
            x: {
                grid: { display: false },
                ticks: { display: false } 
            }
        }
    };

    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-bold text-text-primary">
                    Project <span className="text-accent-color">Overview</span>
                </h1>
                <p className="text-text-secondary">{selectedProject.name} — Real-time analytics and progress.</p>
            </header>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="rounded-2xl border border-border-color bg-secondary-bg p-6 shadow-card-shadow hover:border-accent-color/30 transition-all">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-4">Overall Progress</p>
                    <div className="flex items-end justify-between">
                        <span className="text-4xl font-black text-accent-color">{stats?.progress}%</span>
                    </div>
                    <div className="mt-6 h-2 w-full rounded-full bg-primary-bg overflow-hidden border border-border-color/50">
                        <div className="h-full bg-gradient-to-r from-accent-color/40 to-accent-color transition-all duration-1000" style={{ width: `${stats?.progress}%` }}></div>
                    </div>
                </div>

                <div className="rounded-2xl border border-border-color bg-secondary-bg p-6 shadow-card-shadow hover:border-accent-color/30 transition-all">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-4">Active Flows</p>
                    <div className="flex items-end justify-between">
                        <span className="text-4xl font-black text-text-primary">{stats?.ongoing}</span>
                        <span className="text-xs text-text-secondary font-bold mb-1">Development Phase</span>
                    </div>
                </div>

                <div className="rounded-2xl border border-border-color bg-secondary-bg p-6 shadow-card-shadow hover:border-accent-color/30 transition-all">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-4">Pending Review</p>
                    <div className="flex items-end justify-between">
                        <span className={`text-4xl font-black ${stats?.review > 0 ? 'text-purple-500 animate-pulse' : 'text-text-primary'}`}>
                            {stats?.review || 0}
                        </span>
                        <span className="text-xs text-text-secondary font-bold mb-1">Needs Approval</span>
                    </div>
                </div>

                <div className="rounded-2xl border border-border-color bg-secondary-bg p-6 shadow-card-shadow hover:border-accent-color/30 transition-all">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-4">Completed</p>
                    <div className="flex items-end justify-between">
                        <span className="text-4xl font-black text-emerald-500">{stats?.completed}</span>
                        <span className="text-xs text-text-secondary font-bold mb-1">Total {stats?.total} Tasks</span>
                    </div>
                </div>

                <div className="rounded-2xl border border-border-color bg-secondary-bg p-6 shadow-card-shadow hover:border-accent-color/30 transition-all">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary mb-4">Health Check</p>
                    <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse"></div>
                        <span className="text-xl font-bold text-text-primary tracking-tight">System Optimal</span>
                    </div>
                    <p className="text-[10px] text-text-secondary mt-4 font-bold">LATEST DEPLOYMENT: {new Date().toLocaleDateString()}</p>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2 rounded-2xl border border-border-color bg-secondary-bg p-8 flex flex-col shadow-card-shadow">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent-color mb-8">Task Distribution</h3>
                    <div className="flex-1 min-h-[300px] relative">
                        <Pie data={chartData} options={chartOptions} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-10">
                            <span className="text-3xl font-black text-text-primary">{stats?.total}</span>
                            <span className="text-[10px] font-bold text-text-secondary uppercase">Total Flows</span>
                        </div>
                    </div>
                </div>
                
                <div className="lg:col-span-3 rounded-2xl border border-border-color bg-secondary-bg p-8 flex flex-col shadow-card-shadow">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent-color">Production Velocity</h3>
                            <p className="text-[10px] text-text-secondary mt-1 uppercase font-bold tracking-widest">Comparative Flow Analysis</p>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-end max-w-[300px]">
                            {[
                                { label: 'Total', color: 'bg-blue-500', val: stats?.total },
                                { label: 'Active', color: 'bg-amber-500', val: stats?.ongoing },
                                { label: 'Review', color: 'bg-purple-500', val: stats?.review },
                                { label: 'Done', color: 'bg-emerald-500', val: stats?.completed }
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-2">
                                    <div className={`h-1.5 w-1.5 rounded-full ${item.color}`}></div>
                                    <span className="text-[9px] font-black text-text-secondary uppercase tracking-tighter">{item.label}</span>
                                    <span className="text-[10px] font-black text-text-primary">{item.val || 0}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex-1 min-h-[280px] w-full mt-auto">
                        {stats?.total > 0 ? (
                            <Bar data={barData} options={barOptions} />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-50">
                                <div className="h-16 w-16 mb-4 rounded-full border border-dashed border-border-color flex items-center justify-center">
                                    <svg className="h-6 w-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                </div>
                                <p className="text-xs font-black text-text-secondary uppercase tracking-widest">Insufficient Lifecycle Data</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectOverview;
