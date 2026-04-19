import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';

const ProfilePage = () => {
    const { user, setUser } = useContext(AppContext);
    const [isEditing, setIsEditing] = useState(!user?.profileCreated);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        designation: user?.designation || '',
        bio: user?.bio || '',
        experience: user?.experience || '',
        techStack: user?.techStack?.join(', ') || '',
        socialLinks: {
            github: user?.socialLinks?.github || '',
            linkedin: user?.socialLinks?.linkedin || '',
            portfolio: user?.socialLinks?.portfolio || ''
        },
        workHistory: user?.workHistory || []
    });

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            import { API_URL } from '../apiConfig';
// ... existing code ...
            const res = await fetch(`${API_URL}/users/update-profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    techStack: formData.techStack.split(',').map(s => s.trim()).filter(s => s !== '')
                })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setUser(data.data.user);
                setIsEditing(false);
            }
        } catch (err) {
            console.error('Error updating profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const addWorkHistory = () => {
        setFormData({
            ...formData,
            workHistory: [...formData.workHistory, { company: '', role: '', duration: '', description: '' }]
        });
    };

    const updateWorkHistory = (index, field, value) => {
        const newHistory = [...formData.workHistory];
        newHistory[index][field] = value;
        setFormData({ ...formData, workHistory: newHistory });
    };

    const removeWorkHistory = (index) => {
        const newHistory = formData.workHistory.filter((_, i) => i !== index);
        setFormData({ ...formData, workHistory: newHistory });
    };

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-500">
            <header className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">
                        {user.role === 'manager' ? 'Executive' : 'Professional'} <span className="text-accent-color">Profile</span>
                    </h1>
                    <p className="text-text-secondary mt-1">Manage your professional identity and workspace credentials.</p>
                </div>
                {!isEditing && (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2.5 bg-secondary-bg border border-border-color rounded-xl text-xs font-black uppercase tracking-widest text-text-primary hover:border-accent-color hover:text-accent-color transition-all"
                    >
                        Edit Profile
                    </button>
                )}
            </header>

            {isEditing ? (
                <form onSubmit={handleSave} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-secondary-bg p-8 rounded-3xl border border-border-color">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Full Name</label>
                            <input disabled value={user.name} className="w-full bg-primary-bg border border-border-color p-3 rounded-xl text-sm text-text-secondary opacity-50" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Specific Tech Role (e.g. SWE, Full Stack)</label>
                            <input 
                                required
                                value={formData.designation} 
                                onChange={(e) => setFormData({...formData, designation: e.target.value})}
                                placeholder="Full Stack Engineer" 
                                className="w-full bg-primary-bg border border-border-color p-3 rounded-xl text-sm text-text-primary focus:border-accent-color outline-none transition-all" 
                            />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Professional Bio</label>
                            <textarea 
                                required
                                value={formData.bio} 
                                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                rows="4" 
                                placeholder="Tell us about your technical journey..." 
                                className="w-full bg-primary-bg border border-border-color p-3 rounded-xl text-sm text-text-primary focus:border-accent-color outline-none transition-all resize-none"
                            ></textarea>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Years of Experience</label>
                            <input 
                                value={formData.experience} 
                                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                                placeholder="3+ Years" 
                                className="w-full bg-primary-bg border border-border-color p-3 rounded-xl text-sm text-text-primary focus:border-accent-color outline-none transition-all" 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-text-secondary">Tech Stack (comma separated)</label>
                            <input 
                                value={formData.techStack} 
                                onChange={(e) => setFormData({...formData, techStack: e.target.value})}
                                placeholder="React, Node.js, MongoDB" 
                                className="w-full bg-primary-bg border border-border-color p-3 rounded-xl text-sm text-text-primary focus:border-accent-color outline-none transition-all" 
                            />
                        </div>
                    </div>

                    <div className="bg-secondary-bg p-8 rounded-3xl border border-border-color space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black uppercase tracking-widest text-accent-color">Work Experience</h3>
                            <button type="button" onClick={addWorkHistory} className="text-[10px] font-black text-text-secondary hover:text-accent-color uppercase tracking-widest transition-colors">+ Add Position</button>
                        </div>
                        {formData.workHistory.map((work, index) => (
                            <div key={index} className="p-6 bg-primary-bg/50 border border-border-color rounded-2xl relative group">
                                <button type="button" onClick={() => removeWorkHistory(index)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input placeholder="Company" value={work.company} onChange={(e) => updateWorkHistory(index, 'company', e.target.value)} className="bg-secondary-bg border border-border-color p-3 rounded-xl text-sm focus:border-accent-color outline-none" />
                                    <input placeholder="Role" value={work.role} onChange={(e) => updateWorkHistory(index, 'role', e.target.value)} className="bg-secondary-bg border border-border-color p-3 rounded-xl text-sm focus:border-accent-color outline-none" />
                                    <input placeholder="Duration" value={work.duration} onChange={(e) => updateWorkHistory(index, 'duration', e.target.value)} className="bg-secondary-bg border border-border-color p-3 rounded-xl text-sm focus:border-accent-color outline-none" />
                                    <input placeholder="Short Description" value={work.description} onChange={(e) => updateWorkHistory(index, 'description', e.target.value)} className="bg-secondary-bg border border-border-color p-3 rounded-xl text-sm focus:border-accent-color outline-none" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-secondary-bg p-8 rounded-3xl border border-border-color space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-accent-color">Social & External Links</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <input placeholder="GitHub URL" value={formData.socialLinks.github} onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, github: e.target.value}})} className="bg-primary-bg border border-border-color p-3 rounded-xl text-sm focus:border-accent-color outline-none" />
                            <input placeholder="LinkedIn URL" value={formData.socialLinks.linkedin} onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, linkedin: e.target.value}})} className="bg-primary-bg border border-border-color p-3 rounded-xl text-sm focus:border-accent-color outline-none" />
                            <input placeholder="Portfolio URL" value={formData.socialLinks.portfolio} onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, portfolio: e.target.value}})} className="bg-primary-bg border border-border-color p-3 rounded-xl text-sm focus:border-accent-color outline-none" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button 
                            type="button"
                            onClick={() => user?.profileCreated ? setIsEditing(false) : null}
                            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${user?.profileCreated ? 'text-text-secondary hover:text-text-primary' : 'hidden'}`}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-accent-color text-primary-bg rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent-color/20"
                        >
                            {loading ? 'Synchronizing...' : 'Finalize Profile'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-8">
                    {/* View Profile UI */}
                    <div className="bg-secondary-bg rounded-3xl border border-border-color overflow-hidden shadow-2xl">
                        <div className="h-32 bg-gradient-to-r from-accent-color/10 to-accent-color/5"></div>
                        <div className="px-10 pb-10 -mt-16">
                            <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
                                <div className="h-32 w-32 rounded-3xl bg-primary-bg border-4 border-secondary-bg flex items-center justify-center text-5xl font-black text-accent-color shadow-xl">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="flex-1 pb-2">
                                    <h2 className="text-3xl font-black text-text-primary">{user.name}</h2>
                                    <p className="text-accent-color font-bold uppercase tracking-widest text-xs mt-1">{user.designation}</p>
                                </div>
                                <div className="flex gap-3 pb-2">
                                    {user.socialLinks?.github && <a href={user.socialLinks.github} target="_blank" className="p-3 bg-primary-bg rounded-xl border border-border-color text-text-secondary hover:text-accent-color transition-all"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>}
                                    {user.socialLinks?.linkedin && <a href={user.socialLinks.linkedin} target="_blank" className="p-3 bg-primary-bg rounded-xl border border-border-color text-text-secondary hover:text-accent-color transition-all"><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.763z"/></svg></a>}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <div className="md:col-span-2 space-y-8">
                                    <section>
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent-color mb-4">Biography</h3>
                                        <p className="text-text-primary leading-relaxed opacity-80">{user.bio}</p>
                                    </section>
                                    
                                    <section>
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent-color mb-4">Work History</h3>
                                        <div className="space-y-4">
                                            {user.workHistory?.map((work, i) => (
                                                <div key={i} className="p-5 bg-primary-bg rounded-2xl border border-border-color">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-bold text-text-primary">{work.role}</h4>
                                                            <p className="text-xs text-accent-color font-medium">{work.company}</p>
                                                        </div>
                                                        <span className="text-[10px] font-black text-text-secondary uppercase">{work.duration}</span>
                                                    </div>
                                                    <p className="text-sm text-text-secondary mt-3 leading-relaxed">{work.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>
                                
                                <div className="space-y-8">
                                    <section className="bg-primary-bg p-6 rounded-3xl border border-border-color">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent-color mb-6">Expertise</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {user.techStack?.map((tech, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-secondary-bg border border-border-color rounded-lg text-[10px] font-bold text-text-primary uppercase tracking-wider">{tech}</span>
                                            ))}
                                        </div>
                                    </section>
                                    
                                    <section className="bg-primary-bg p-6 rounded-3xl border border-border-color">
                                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent-color mb-4">Experience</h3>
                                        <p className="text-2xl font-black text-text-primary">{user.experience || 'Not Listed'}</p>
                                        <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest mt-1">Industrial Tenure</p>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;