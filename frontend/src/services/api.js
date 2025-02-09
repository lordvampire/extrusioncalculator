import axios from "axios";

const API_BASE_URL = "http://3.68.80.95:8000"; // FastAPI-Backend

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Extrusionsanlagen abrufen
export const getAnlagen = async () => {
  const response = await axios.get(`${API_BASE_URL}/extrusionsanlagen`);
  return response.data;
};

// ✅ Extrusionsanlage erstellen (Fehlende Funktion hinzufügen)
export const createAnlage = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/extrusionsanlagen`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

// ✅ Extrusionsanlage löschen
export const deleteAnlage = async (id) => {
  await axios.delete(`${API_BASE_URL}/extrusionsanlagen/${id}`);
};

// 🔹 Profile API
export const getProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
};

// 🔹 Oberflächenanforderungen API
export const getOberflaechen = async () => {
  const response = await api.get("/oberflaechen");
  return response.data;
};

export const createOberflaeche = async (data) => {
  return axios.post("/oberflaechen", JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateOberflaeche = async (id, data) => {
  const response = await api.put(`/oberflaechen/${id}`, data);
  return response.data;
};

export const deleteOberflaeche = async (id) => {
  await api.delete(`/oberflaechen/${id}`);
};

// 🔹 Anwendungsbereiche API
export const getAnwendungsbereiche = async () => {
  const response = await api.get("/anwendungsbereiche");
  return response.data;
};

export const createAnwendungsbereich = async (data) => {
  const response = await api.post("/anwendungsbereiche", data);
  return response.data;
};

export const updateAnwendungsbereich = async (id, data) => {
  const response = await api.put(`/anwendungsbereiche/${id}`, data);
  return response.data;
};

export const deleteAnwendungsbereich = async (id) => {
  await api.delete(`/anwendungsbereiche/${id}`);
};
