import React, { useState, useContext, useEffect } from "react";
import AuthModal from "./AuthModal";
import { AppContext } from "../AppContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../apiConfig';

const Navbar = ({ onSidebarToggle }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
	const { selectedProject, setSelectedProject, user, theme, toggleTheme } = useContext(AppContext);
	const [projects, setProjects] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchProjects = async () => {
			if (!user) return;
			try {
				const token = localStorage.getItem('token');
				const res = await fetch(`${API_URL}/projects`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				});
				const data = await res.json();
				if (data.status === 'success') {
					setProjects(data.data.projects);
					if (data.data.projects.length > 0 && !selectedProject) {
						setSelectedProject(data.data.projects[0]);
					}
				}
			} catch (err) {
				console.error("Failed to fetch projects", err);
			}
		};

		fetchProjects();
	}, [user, setSelectedProject]);

	return (
		<>
			<header className="sticky top-0 z-40 flex items-center justify-between border-b border-border-color bg-secondary-bg/80 px-4 md:px-8 py-3 md:py-4 backdrop-blur-md">
				{/* LEFT: Sidebar Hamburger Menu */}
				<button
					onClick={onSidebarToggle}
					className="md:hidden z-50 p-2 rounded-lg hover:bg-primary-bg/50 transition-colors"
					aria-label="Toggle Sidebar"
				>
					<svg className="h-6 w-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</button>

				{/* CENTER: Desktop Project Selector */}
				<div className="flex items-center gap-2 md:gap-4 min-w-0 flex-1">
					<div className="h-8 w-[2px] bg-accent-color/30 hidden md:block"></div>
					<div className="hidden md:flex flex-col min-w-0 flex-1 md:min-w-[200px]">
						<span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/60">Active Context</span>
						<select 
							className="bg-transparent text-sm font-bold text-text-primary outline-none cursor-pointer hover:text-accent-color transition-colors truncate"
							value={selectedProject?._id || ""}
							onChange={(e) => {
								const proj = projects.find(p => p._id === e.target.value);
								setSelectedProject(proj);
							}}
						>
							<option value="" disabled={projects.length > 0} className="bg-secondary-bg text-text-secondary">
								{projects.length === 0 ? "No Projects" : "Select Project..."}
							</option>
							{projects.map(project => (
								<option key={project._id} value={project._id} className="bg-secondary-bg text-text-primary">
									{project.name}
								</option>
							))}
						</select>
					</div>
				</div>

				{/* RIGHT: Desktop Navigation Items */}
				<div className="hidden md:flex items-center gap-3 md:gap-6">
					<button 
						onClick={toggleTheme}
						className="p-2 rounded-xl bg-primary-bg border border-border-color text-text-secondary hover:text-accent-color transition-all"
						title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
					>
						{theme === 'dark' ? (
							<svg className="h-4 md:h-5 w-4 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M7.757 6.364l.707.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
						) : (
							<svg className="h-4 md:h-5 w-4 md:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
						)}
					</button>

					<div className="flex items-center gap-2 rounded-full bg-primary-bg px-4 py-1.5 border border-border-color">
						<div className="h-2 w-2 animate-pulse rounded-full bg-accent-color"></div>
						<span className="text-xs font-medium text-text-secondary text-nowrap">System Active</span>
					</div>
					{user ? (
						<div className="flex items-center gap-3 md:gap-6">
							<button 
								onClick={() => navigate('/profile')}
								className="flex items-center gap-2 md:gap-3 group"
							>
								<div className="flex flex-col items-end">
									<span className="text-xs font-bold text-text-primary group-hover:text-accent-color transition-colors">{user.name}</span>
									<span className="text-[10px] uppercase text-accent-color font-bold tracking-tighter">{user.role}</span>
								</div>
								<div className="h-10 w-10 rounded-full bg-accent-color/20 border border-accent-color/50 flex items-center justify-center text-accent-color font-bold group-hover:bg-accent-color group-hover:text-primary-bg transition-all">
									{user.name.charAt(0)}
								</div>
							</button>
						</div>
					) : (
						<button
							onClick={() => setIsModalOpen(true)}
							className="group relative flex items-center justify-center overflow-hidden rounded-lg bg-accent-color px-6 py-2 text-sm font-bold text-primary-bg transition-all hover:shadow-[0_0_20px_rgba(0,245,212,0.4)]"
						>
							<span className="relative z-10">Sign In</span>
							<div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0"></div>
						</button>
					)}
				</div>

				{/* RIGHT: Mobile Navbar Menu Button */}
				<button
					onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
					className="md:hidden z-50 p-2 rounded-lg hover:bg-primary-bg/50 transition-colors relative"
					aria-label="Menu"
				>
					<svg className="h-6 w-6 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
					</svg>
				</button>
			</header>

			{/* Mobile Navbar Menu - Right Side Dropdown */}
			{isNavMenuOpen && (
				<div className="fixed top-[60px] right-0 md:hidden z-40 bg-secondary-bg border-l border-border-color w-72 max-w-[90vw] shadow-lg">
					<div className="p-4 space-y-4">
						{/* Project Selector on Mobile */}
						{projects.length > 0 && (
							<div>
								<label className="text-[10px] font-bold uppercase tracking-widest text-text-secondary/60 block mb-2">Select Project</label>
								<select 
									className="w-full bg-primary-bg border border-border-color rounded-lg text-sm font-bold text-text-primary outline-none cursor-pointer p-2"
									value={selectedProject?._id || ""}
									onChange={(e) => {
										const proj = projects.find(p => p._id === e.target.value);
										setSelectedProject(proj);
										setIsNavMenuOpen(false);
									}}
								>
									<option value="" disabled>Select Project</option>
									{projects.map(project => (
										<option key={project._id} value={project._id}>
											{project.name}
										</option>
									))}
								</select>
							</div>
						)}

						{/* Theme Toggle */}
						<button 
							onClick={() => {
								toggleTheme();
								setIsNavMenuOpen(false);
							}}
							className="w-full flex items-center gap-3 rounded-lg p-2.5 bg-primary-bg/50 hover:bg-primary-bg transition-all border border-border-color"
						>
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-bg">
								{theme === 'dark' ? (
									<svg className="h-4 w-4 text-accent-color" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 17.657l.707.707M7.757 6.364l.707.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
								) : (
									<svg className="h-4 w-4 text-accent-color" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
								)}
							</div>
							<span className="text-sm font-bold text-text-primary">
								{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
							</span>
						</button>

						{/* User Profile or Login */}
						{user ? (
							<button
								onClick={() => {
									navigate('/profile');
									setIsNavMenuOpen(false);
								}}
								className="w-full flex items-center gap-3 rounded-lg p-2.5 bg-primary-bg/50 hover:bg-primary-bg transition-all border border-border-color"
							>
								<div className="h-8 w-8 rounded-lg bg-accent-color/20 flex items-center justify-center text-accent-color font-bold">
									{user.name.charAt(0)}
								</div>
								<div className="text-left">
									<span className="text-sm font-bold text-text-primary block">{user.name}</span>
									<span className="text-xs uppercase text-accent-color">{user.role}</span>
								</div>
							</button>
						) : (
							<button
								onClick={() => {
									setIsModalOpen(true);
									setIsNavMenuOpen(false);
								}}
								className="w-full bg-accent-color text-primary-bg font-bold py-2 rounded-lg hover:shadow-lg transition-all"
							>
								Sign In
							</button>
						)}
					</div>
				</div>
			)}

			<AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
		</>
	);
};

export default Navbar;
