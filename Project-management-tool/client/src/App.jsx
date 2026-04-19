import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ManagerDashboard from "./pages/ManagerDashboard";
import CreateProjectPage from "./pages/CreateProjectPage";
import ProfilePage from "./pages/ProfilePage";
import DevelopersPage from "./pages/DevelopersPage";
import TasksPage from "./pages/TasksPage";
import LoginPage from "./pages/LoginPage";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { AppContext } from "./AppContext";

const App = () => {
	const { user, loading } = useContext(AppContext);

	if (loading) {
		return (
			<div className="flex h-screen items-center justify-center bg-[#0a0a0c]">
				<div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	if (!user) {
		return (
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="*" element={<Navigate to="/login" replace />} />
			</Routes>
		);
	}

	return (
		<div className="flex h-screen overflow-hidden bg-primary-bg">
			<Sidebar />
			<div className="flex flex-1 flex-col overflow-hidden">
				<Navbar />
				<main className="flex-1 overflow-y-auto p-8">
					<Routes>
						<Route path="/" element={user.role === 'manager' ? <ManagerDashboard /> : <HomePage />} />
						<Route path="/overview" element={<HomePage />} />
						<Route path="/projects/new" element={user.role === 'manager' ? <CreateProjectPage /> : <Navigate to="/" />} />
						<Route path="/developers" element={user.role === 'manager' ? <DevelopersPage /> : <Navigate to="/" />} />
						<Route path="/profile" element={<ProfilePage />} />
						<Route path="/tasks" element={<TasksPage />} />
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</main>
			</div>
		</div>
	);
};

export default App;
