import axios from "axios";
const API_BASE_URL = "/api";
const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
/**
 * Health check endpoint
 */
export const healthCheck = async () => {
    const response = await client.get("/health");
    return response.data;
};
/**
 * Article endpoints
 */
export const articlesAPI = {
    /**
     * Create a new article
     */
    create: async (data) => {
        const response = await client.post("/articles", data);
        return response.data;
    },
    /**
     * Get article by ID
     */
    getById: async (id) => {
        const response = await client.get(`/articles/${id}`);
        return response.data;
    },
    /**
     * List articles with pagination
     */
    list: async (limit = 20, offset = 0) => {
        const response = await client.get("/articles", {
            params: { limit, offset },
        });
        return response.data;
    },
};
/**
 * Analysis endpoints
 */
export const analysisAPI = {
    /**
     * Analyze text or URL (async processing)
     */
    analyzeText: async (data) => {
        const response = await client.post("/analysis/text", data);
        return response.data;
    },
    /**
     * Analyze image with OCR and vision model
     */
    analyzeImage: async (data) => {
        const formData = new FormData();
        formData.append("file", data.file);
        if (data.personHint) {
            formData.append("personHint", data.personHint);
        }
        const response = await client.post("/analysis/image", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },
    /**
     * Get analysis by ID with full tool call logs
     */
    getById: async (id) => {
        const response = await client.get(`/analysis/${id}`);
        return response.data;
    },
    /**
     * Get recent analyses
     */
    getRecent: async (limit = 10, offset = 0) => {
        const response = await client.get("/analysis", {
            params: { limit, offset },
        });
        return response.data;
    },
    /**
     * Get dashboard stats
     */
    getStats: async () => {
        const response = await client.get("/analysis/stats/summary");
        return response.data;
    },
};
export default client;
