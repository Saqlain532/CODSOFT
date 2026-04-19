import React, { useState, useContext } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import { AppContext } from "../AppContext";

const Sidebar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const { user, setUser } = useContext(AppContext);
	const location = useLocation();
	const navigate = useNavigate();
	
	const isAuthenticated = user !== null; 

	const handleLogout = () => {
		localStorage.removeItem('token');
		setUser(null);
		navigate('/login');
	};

	const isActive = (href) => location.pathname === href;

	const managerItems = [
		{ label: "Dashboard", href: "/" },
		{ label: "Project Analysis", href: "/overview" },
		{ label: "Create Project", href: "/projects/new" },
		{ label: "Developers", href: "/developers" },
	];

	const developerItems = [
		{ label: "Project Analysis", href: "/" },
		{ label: "Task Section", href: "/tasks" },
	];

	// Safely determine nav items based on user role
	const navItems = user?.role === "manager" ? managerItems : developerItems;

	return (
		<>
			<button
				className="fixed top-4 left-4 z-40 md:hidden"
				onClick={() => setIsOpen(!isOpen)}
			>
				<svg
					className="h-6 w-6 text-text-primary"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M4 6h16M4 12h16m-7 6h7"
					></path>
				</svg>
			</button>
			<aside
				className={`fixed top-0 left-0 z-30 flex h-screen flex-col border-r border-border-color bg-secondary-bg transition-all duration-300 ease-in-out md:relative md:translate-x-0 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				} ${isCollapsed ? "w-20 px-3" : "w-72 px-6"} py-8`}
			>
				{/* Collapse Toggle for Desktop */}
				<button 
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="absolute -right-3 top-10 hidden h-6 w-6 items-center justify-center rounded-full border border-border-color bg-secondary-bg text-accent-color shadow-lg transition-transform hover:scale-110 md:flex"
				>
					<svg className={`h-4 w-4 transition-transform ${isCollapsed ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
					</svg>
				</button>

				{/* Background Overlay for mobile when sidebar is open */}
				{isOpen && (
					<div 
						className="fixed inset-0 z-[-1] bg-black/60 backdrop-blur-sm md:hidden"
						onClick={() => setIsOpen(false)}
					></div>
				)}
				<div className={`mb-10 flex flex-col transition-all ${isCollapsed ? "items-center px-0" : "items-start px-4"}`}>
					<div className={`group relative mb-6 flex items-center justify-center overflow-hidden rounded-xl bg-primary-bg shadow-sm border border-border-color/50 transition-all duration-300 hover:border-accent-color/30 ${isCollapsed ? "h-11 w-11" : "h-12 w-12"}`}>
						<img 
							src={Logo} 
							alt="Spring Flow Logo" 
							className="h-full w-full object-cover p-1.5 transition-transform duration-500 group-hover:scale-110" 
						/>
						{!isCollapsed && (
							<div className="absolute top-0 right-0 h-1.5 w-1.5 rounded-bl-full bg-accent-color/20 group-hover:bg-accent-color/40"></div>
						)}
					</div>
					{!isCollapsed && (
						<div className="flex flex-col space-y-0.5">
							<h1 className="text-lg font-bold tracking-tight text-text-primary">
								Spring Flow <span className="text-accent-color">.</span>
							</h1>
							<span className="text-[10px] font-medium uppercase tracking-[0.15em] text-text-secondary/60">
								Work Management
							</span>
						</div>
					)}

					{!isCollapsed && (
						<div className="mt-8 h-[2px] w-full bg-gradient-to-r from-accent-color/40 via-accent-color/10 to-transparent"></div>
					)}
				</div>	

				<nav className="flex-1 overflow-hidden">
					<ul className="space-y-2">
						{navItems.map((item) => (
							<li key={item.href}>
								<Link
									to={item.href}
									title={isCollapsed ? item.label : ""}
									className={`group relative flex items-center overflow-hidden rounded-xl py-2 text-sm font-semibold transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "gap-4 px-4"} ${
										isActive(item.href)
											? "bg-primary-bg text-accent-color shadow-sm"
											: "text-text-secondary hover:bg-primary-bg/50 hover:text-text-primary"
									}`}
								>
									{isActive(item.href) && !isCollapsed && (
										<div className="absolute left-0 h-4 w-1 rounded-r-full bg-accent-color"></div>
									)}
									<span
										className={`transition-all duration-300 ${
											isActive(item.href) 
												? "h-2 w-2 bg-accent-color shadow-[0_0_8px_#00f5d4] scale-125" 
												: "h-1.5 w-1.5 bg-border-color group-hover:bg-text-secondary"
										} rounded-full`}
									/>
									{!isCollapsed && <span>{item.label}</span>}
								</Link>
							</li>
						))}
					</ul>
				</nav>

				{/* User Profile Section */}
				<div className={`mt-auto pt-6 border-t border-border-color/50 transition-all ${isCollapsed ? "items-center px-0" : "px-2"}`}>
					{isAuthenticated ? (
						<Link 
							to="/profile" 
							className={`group flex items-center gap-3 rounded-xl p-2 transition-all hover:bg-primary-bg ${isCollapsed ? "justify-center" : ""}`}
						>
							<div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-color/10 font-bold text-accent-color border border-accent-color/20 transition-all group-hover:bg-accent-color group-hover:text-primary-bg">
								{user?.name?.charAt(0).toUpperCase()}
								<div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-secondary-bg bg-emerald-500"></div>
							</div>
							{!isCollapsed && (
								<div className="flex flex-col overflow-hidden text-left">
									<span className="truncate text-sm font-bold text-text-primary group-hover:text-accent-color transition-colors">
										{user.name}
									</span>
									<span className="truncate text-[10px] font-medium uppercase tracking-wider text-text-secondary/60">
										{user.role}
									</span>
								</div>
							)}
						</Link>
					) : (
						<div className={`flex flex-col gap-2 ${isCollapsed ? "items-center" : ""}`}>
							<div className="h-10 w-10 rounded-lg bg-border-color/20 animate-pulse"></div>
						</div>
					)}
					
					{isAuthenticated && (
						<button 
							onClick={handleLogout}
							className={`mt-4 group flex items-center gap-3 rounded-xl p-2.5 transition-all hover:bg-red-500/10 w-full ${isCollapsed ? "justify-center" : ""}`}
						>
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 group-hover:bg-red-500 group-hover:text-white transition-all">
								<svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
								</svg>
							</div>
							{!isCollapsed && (
								<span className="text-sm font-bold text-red-500/80 group-hover:text-red-500 transition-colors">
									Logout
								</span>
							)}
						</button>
					)}
				</div>
			</aside>
		</>
	);
};

export default Sidebar;
