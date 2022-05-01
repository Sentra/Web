import http from './http-common';
import authHeader from "./auth-header";

class UrlProxy {
    async createUrl(data) {
        return await http.post(`/url`, data);
    }
    async createUrlsByList(data) {
        return await http.post(`/url/by/list`, data);
    }
    async searchUrl(urlId, userId) {
        let query = '?';
        if (userId) query += `${query.length === 1 ? `userId=${userId}` : `&userId=${userId}`}`;
        if (urlId) query += `${query.length === 1 ? `urlId=${urlId}` : `&urlId=${urlId}`}`;

        return await http.get(`/url${query}`);
    }
    async updateUrl(data) {
        return await http.put(`/url`, data);
    }
    async deleteUrl(id) {
        return await http.delete(`/url/${id}`);
    }
}

export default new UrlProxy();
