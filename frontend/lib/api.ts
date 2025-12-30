import axios from 'axios';

const API_URL =
	process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request interceptor to add auth token
api.interceptors.request.use(
	(config) => {
		if (typeof window !== 'undefined') {
			const token = localStorage.getItem('token');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

// Response interceptor for error handling
api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Unauthorized - clear token and redirect to login
			// Only redirect if not already on login page to avoid redirect loops
			if (typeof window !== 'undefined') {
				const currentPath = window.location.pathname;
				if (!currentPath.startsWith('/login')) {
					localStorage.removeItem('token');
					// Clear cookie as well
					document.cookie = 'token=; path=/; max-age=0; SameSite=Lax';
					window.location.href = '/login';
				}
			}
		}
		return Promise.reject(error);
	},
);

export default api;
