import React, { createContext, useState, useEffect } from 'react';
import { API_URL } from './apiConfig';
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
	const [user, setUser] = useState(null); // Changed to null to check for auth
	const [selectedProject, setSelectedProject] = useState(null);
	const [projects, setProjects] = useState([]); // Static placeholder
	const [loading, setLoading] = useState(true);
	const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	}, [theme]);

	const toggleTheme = () => {
		setTheme(prev => prev === 'dark' ? 'light' : 'dark');
	};

	useEffect(() => {
		const checkLoggedIn = async () => {
			const token = localStorage.getItem('token');
			if (!token) {
				setLoading(false);
				return;
			}

			try {
				

				const res = await fetch(`${API_URL}/users/me`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				});
				const data = await res.json();
				if (data.status === 'success') {
					setUser(data.data.user);
				} else {
					localStorage.removeItem('token');
				}
			} catch (err) {
				console.error("Auth error", err);
				localStorage.removeItem('token');
			}
			setLoading(false);
		};

		checkLoggedIn();
	}, []);

	return (
		<AppContext.Provider value={{
			user,
			setUser,
			selectedProject,
			setSelectedProject,
			projects,
			loading,
			theme,
			toggleTheme
		}}>
			{children}
		</AppContext.Provider>
	);
};

export default AppProvider;
