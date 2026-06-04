import axios from "axios";

console.log("API URL:", import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const uploadDataset = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const trainModel = () => api.post("/train");
export const getDashboardSummary = () => api.get("/dashboard/summary");
export const predictBatch = () => api.post("/predict/batch");
export const getHistory = () => api.get("/history");
export const predictCustomer = (payload) => api.post("/predict", payload);
export const getRootMessage = () => api.get("/");

export default api;