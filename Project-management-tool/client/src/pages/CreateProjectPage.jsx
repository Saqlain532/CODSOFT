import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { API_URL } from '../apiConfig';

const CreateProjectPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		status: "planning",
		endDate: "",
		techStack: "",
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		
		const projectData = {
			...formData,
			techStack: formData.techStack.split(',').map(item => item.trim()).filter(item => item !== "")
		};

		try {
			const token = localStorage.getItem('token');
			const response = await fetch(`${API_URL}/projects`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify(projectData)
			});

			const data = await response.json();

			if (data.status === 'success') {
				alert("Project created successfully!");
				setFormData({
					name: "",
					description: "",
					status: "planning",
					endDate: "",
					techStack: "",
				});
			} else {
				alert(data.message || "Failed to create project");
			}
		} catch (error) {
			console.error("Error creating project:", error);
			alert("An error occurred. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mx-auto max-w-3xl">
			<div className="mb-8">
				<h1 className="text-3xl font-bold tracking-tight text-text-primary">
					Launch New <span className="text-accent-color">Project</span>
				</h1>
				<p className="mt-2 text-text-secondary">
					Initialize a new workspace and define your flow objective.
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border-color bg-secondary-bg p-8 shadow-xl">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="space-y-2">
						<label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
							Project Name
						</label>
						<input
							type="text"
							name="name"
							required
							value={formData.name}
							onChange={handleChange}
							placeholder="e.g. Q2 Marketing Sprint"
							className="w-full rounded-xl border border-border-color bg-primary-bg p-4 text-sm text-text-primary transition-all focus:border-accent-color/50 focus:outline-none focus:ring-1 focus:ring-accent-color/50"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
							Initial Status
						</label>
						<select
							name="status"
							value={formData.status}
							onChange={handleChange}
							className="w-full rounded-xl border border-border-color bg-primary-bg p-4 text-sm text-text-primary transition-all focus:border-accent-color/50 focus:outline-none focus:ring-1 focus:ring-accent-color/50 appearance-none"
						>
							<option value="planning">Phase 1: Planning</option>
							<option value="In progress development">Phase 2: In progress development</option>
							<option value="testing phase">Phase 3: testing phase</option>
							<option value="completed">Completed</option>
							<option value="on-hold">On Hold</option>
						</select>
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
						Brief Description
					</label>
					<textarea
						name="description"
						required
						value={formData.description}
						onChange={handleChange}
						rows="4"
						placeholder="Describe the core goals and deliverables of this flow..."
						className="w-full rounded-xl border border-border-color bg-primary-bg p-4 text-sm text-text-primary transition-all focus:border-accent-color/50 focus:outline-none focus:ring-1 focus:ring-accent-color/50"
					></textarea>
				</div>

				<div className="space-y-2">
					<label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
						Tech Stack
					</label>
					<input
						type="text"
						name="techStack"
						value={formData.techStack}
						onChange={handleChange}
						placeholder="e.g. React, Node.js, MongoDB, Tailwind (comma separated)"
						className="w-full rounded-xl border border-border-color bg-primary-bg p-4 text-sm text-text-primary transition-all focus:border-accent-color/50 focus:outline-none focus:ring-1 focus:ring-accent-color/50"
					/>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="space-y-2">
						<label className="text-xs font-bold uppercase tracking-wider text-text-secondary">
							Target Deadline
						</label>
						<input
							type="date"
							name="endDate"
							value={formData.endDate}
							onChange={handleChange}
							className="w-full rounded-xl border border-border-color bg-primary-bg p-4 text-sm text-text-primary transition-all focus:border-accent-color/50 focus:outline-none focus:ring-1 focus:ring-accent-color/50"
						/>
					</div>
					
					<div className="flex items-end">
						<button
							type="submit"
							disabled={loading}
							className="group relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-accent-color py-4 text-sm font-black uppercase tracking-widest text-primary-bg transition-all hover:shadow-[0_0_25px_rgba(0,245,212,0.4)] active:scale-[0.98] disabled:opacity-70"
						>
							{loading ? "Initializing..." : "Create Project Flow"}
							<div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0"></div>
						</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default CreateProjectPage;
