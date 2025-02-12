import api from "../utils/api";

// Create a new resume
export const createResume = async (resumeData) => {
  const response = await api.post("/resume/create", resumeData);
  return response.data;
};

// Get a resume by ID
export const getResume = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }
  const response = await api.get(`/resume/${userId}`);
  console.log(response.data);
  return response.data;
};

// Update a resume
export const updateResume = async (id, resumeData) => {
  const response = await api.put(`/resume/${id}`, resumeData);
  return response.data;
};

// Delete a resume
export const deleteResume = async (id) => {
  const response = await api.delete(`/resume/${id}`);
  return response.data;
};
