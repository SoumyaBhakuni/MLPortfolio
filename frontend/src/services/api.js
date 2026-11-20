import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

function extractErrorMessage(err) {
  if (err?.response?.data?.message) return String(err.response.data.message);
  if (err?.response?.data?.error) return String(err.response.data.error);
  if (err?.message) return String(err.message);
  return "Unexpected backend communication error.";
}

async function requestData(requestPromise) {
  try {
    const response = await requestPromise;
    return response.data;
  } catch (err) {
    throw new Error(extractErrorMessage(err), { cause: err });
  }
}

export function fetchHealth() {
  return requestData(apiClient.get("/api/health"));
}

export async function fetchTasks() {
  const payload = await requestData(apiClient.get("/api/tasks"));
  return payload?.data || [];
}

export async function fetchTask01EDA(exportStats = false) {
  const payload = await requestData(
    apiClient.get("/api/task01/eda", {
      params: { export: exportStats ? "true" : "false" },
    })
  );
  return payload?.data;
}

export async function fetchTask01Scatter(xCol, yCol) {
  const payload = await requestData(
    apiClient.get("/api/task01/scatter", {
      params: { x: xCol, y: yCol },
    })
  );
  return payload?.data;
}

export async function predictLinearRegression(areaSqft) {
  const payload = await requestData(
    apiClient.post("/api/task02/predict", { area_sqft: areaSqft })
  );
  return payload?.data;
}

export async function classifyImage({ imageBase64 = null, filename = null, file = null }) {
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    const payload = await requestData(
      apiClient.post("/api/task03/classify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    );
    return payload?.data;
  }

  const payload = await requestData(
    apiClient.post("/api/task03/classify", {
      image_base64: imageBase64,
      filename,
    })
  );
  return payload?.data;
}

export async function runKMeans(nClusters) {
  const payload = await requestData(
    apiClient.post("/api/task04/cluster", { n_clusters: nClusters })
  );
  return payload?.data;
}

export async function predictDecisionTree(features, maxDepth) {
  const payload = await requestData(
    apiClient.post("/api/task05/predict", {
      features,
      max_depth: maxDepth,
    })
  );
  return payload?.data;
}

export async function predictNaiveBayes(message) {
  const payload = await requestData(
    apiClient.post("/api/task06/predict", { message })
  );
  return payload?.data;
}

export async function transformPca(nComponents) {
  const payload = await requestData(
    apiClient.post("/api/task07/transform", { n_components: nComponents })
  );
  return payload?.data;
}

export async function predictNeuralNetwork(pixels) {
  const payload = await requestData(
    apiClient.post("/api/task08/predict", { pixels })
  );
  return payload?.data;
}

export async function forecastArima(steps, order) {
  const payload = await requestData(
    apiClient.post("/api/task09/forecast", { steps, order })
  );
  return payload?.data;
}

export async function predictSvm({ features, kernel, cValue, gamma }) {
  const payload = await requestData(
    apiClient.post("/api/task10/predict", {
      features,
      kernel,
      C: cValue,
      gamma,
    })
  );
  return payload?.data;
}

export default apiClient;