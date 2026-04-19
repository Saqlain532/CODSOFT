import React, { useState } from "react";

const AuthModal = ({ isOpen, onClose }) => {
	const [isLogin, setIsLogin] = useState(true);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
			<div className="w-full max-w-md rounded-2xl border border-border-color bg-secondary-bg p-8 shadow-2xl">
				<div className="flex justify-end">
					<button
						onClick={onClose}
						className="text-text-secondary transition-colors hover:text-accent-color"
					>
						<svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<h2 className="mb-2 text-center text-2xl font-bold tracking-tight text-text-primary">
					{isLogin ? "Welcome Back" : "Create Account"}
				</h2>
				<p className="mb-8 text-center text-sm text-text-secondary">
					{isLogin ? "Access your Spring Flow control panel" : "Join the next generation of flow-based management"}
				</p>
				
				<form className="space-y-5">
					{!isLogin && (
						<>
							<div>
								<label className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-secondary">
									Full Name
								</label>
								<input
									type="text"
									placeholder="John Doe"
									className="w-full rounded-xl border border-border-color bg-primary-bg p-3.5 text-sm text-text-primary transition-all focus:border-accent-color/50 focus:outline-none focus:ring-1 focus:ring-accent-color/50"
								/>
							</div>
							<div>
								<label className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-secondary">
									Account Role
								</label>
								<select
									className="w-full rounded-xl border border-border-color bg-primary-bg p-3.5 text-sm text-text-primary transition-all focus:border-accent-color/50 focus:outline-none focus:ring-1 focus:ring-accent-color/50 appearance-none"
									defaultValue="developer"
								>
									<option value="developer" className="bg-secondary-bg">Developer</option>
									<option value="manager" className="bg-secondary-bg">Project Manager</option>
								</select>
							</div>
						</>
					)}
					<div>
						<label className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-secondary">
							Email Address
						</label>
						<input
							type="email"
							placeholder="name@company.com"
							className="w-full rounded-xl border border-border-color bg-primary-bg p-3.5 text-sm text-text-primary transition-all focus:border-accent-color/50 focus:outline-none focus:ring-1 focus:ring-accent-color/50"
						/>
					</div>
					<div>
						<label className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-secondary">
							Password
						</label>
						<input
							type="password"
							placeholder="••••••••"
							className="w-full rounded-xl border border-border-color bg-primary-bg p-3.5 text-sm text-text-primary transition-all focus:border-accent-color/50 focus:outline-none focus:ring-1 focus:ring-accent-color/50"
						/>
					</div>
					
					<button
						type="submit"
						className="w-full rounded-xl bg-accent-color py-4 text-sm font-black uppercase tracking-widest text-primary-bg transition-all hover:shadow-[0_0_20px_rgba(0,245,212,0.4)] active:scale-[0.98]"
					>
						{isLogin ? "Sign In" : "Sign Up"}
					</button>
				</form>

				<div className="mt-8 text-center">
					<p className="text-sm text-text-secondary">
						{isLogin ? "New to the platform?" : "Already have an account?"}
						<button
							onClick={() => setIsLogin(!isLogin)}
							className="ml-2 font-bold text-accent-color transition-colors hover:text-accent-color/80"
						>
							{isLogin ? "Sign Up" : "Login"}
						</button>
					</p>
				</div>
			</div>
		</div>
	);
};

export default AuthModal;