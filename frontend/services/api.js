const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Helper to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data.error || data.detail || (data.email && data.email[0]) || "An error occurred";
    throw new Error(errorMsg);
  }
  return data;
};

// Register a new member
export const registerMember = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

// Register a new admin
export const registerAdmin = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register/admin/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

// Login member
export const loginMember = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

// Login admin
export const loginAdmin = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login/admin/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

// Store token securely (using localStorage for this scope)
export const storeToken = (tokenData) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", tokenData.access);
    localStorage.setItem("refreshToken", tokenData.refresh);
    localStorage.setItem("user", JSON.stringify(tokenData.user));
  }
};

// Clear tokens on logout
export const clearTokens = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
};

// Get the currently logged in user details
export const getCurrentUser = () => {
  if (typeof window !== "undefined") {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
};

// Get the authenticated user's access token
const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  };
};

// Fetch Dashboard Summary
export const getDashboardSummary = async () => {
  const response = await fetch(`${API_URL}/dashboard/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Update Task Status
export const updateTaskStatus = async (taskId, status) => {
  const response = await fetch(`${API_URL}/member/tasks/${taskId}/status/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
};

// Get Task Detail
export const getTaskDetail = async (taskId) => {
  const response = await fetch(`${API_URL}/member/tasks/${taskId}/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Logout User
export const logoutUser = async () => {
  const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;
  if (refreshToken) {
    try {
      await fetch(`${API_URL}/auth/logout/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ refresh: refreshToken }),
      });
    } catch (err) {
      console.error("Logout API failed", err);
    }
  }
  clearTokens();
};

// Fetch Admin Dashboard Summary
export const getAdminDashboardSummary = async () => {
  const response = await fetch(`${API_URL}/admin/dashboard/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Create a Task (Admin)
export const createTask = async (projectId, taskData) => {
  const response = await fetch(`${API_URL}/admin/projects/${projectId}/tasks/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(taskData),
  });
  return handleResponse(response);
};

// Fetch Admin Team Summary
export const getAdminTeamSummary = async () => {
  const response = await fetch(`${API_URL}/admin/team/`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Create a Project (Admin)
export const createProject = async (projectData) => {
  const response = await fetch(`${API_URL}/admin/projects/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(projectData),
  });
  return handleResponse(response);
};

// Add Team Member
export const addTeamMember = async (projectId, email, role) => {
  const response = await fetch(`${API_URL}/admin/projects/${projectId}/members/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, role }),
  });
  return handleResponse(response);
};

// Remove Team Member
export const removeTeamMember = async (projectId, userId) => {
  const response = await fetch(`${API_URL}/admin/projects/${projectId}/members/${userId}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (response.status === 204) return true;
  return handleResponse(response);
};
