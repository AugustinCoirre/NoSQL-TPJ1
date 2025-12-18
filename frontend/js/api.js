const API_URL = 'http://localhost:3000';

// Utility functions
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Une erreur est survenue');
    }
    return response.json();
};

const apiCall = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        return handleResponse(response);
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Directors API
const directorsAPI = {
    getAll: () => apiCall('/directors'),
    
    getById: (id) => apiCall(`/directors/${id}`),
    
    create: (data) => apiCall('/directors', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    
    update: (id, data) => apiCall(`/directors/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    
    delete: (id) => apiCall(`/directors/${id}`, {
        method: 'DELETE',
    }),
};

// Movies API
const moviesAPI = {
    getAll: () => apiCall('/movies'),
    
    getById: (id) => apiCall(`/movies/${id}`),
    
    create: (data) => apiCall('/movies', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    
    update: (id, data) => apiCall(`/movies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    
    delete: (id) => apiCall(`/movies/${id}`, {
        method: 'DELETE',
    }),
};

// Reviews API
const reviewsAPI = {
    getAll: () => apiCall('/reviews'),
    
    getById: (id) => apiCall(`/reviews/${id}`),
    
    create: (data) => apiCall('/reviews', {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    
    update: (id, data) => apiCall(`/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
    
    delete: (id) => apiCall(`/reviews/${id}`, {
        method: 'DELETE',
    }),
};