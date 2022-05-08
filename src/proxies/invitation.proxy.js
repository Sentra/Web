import http from './http-common';
import authHeader from "./auth-header";

class InvitationProxy {
    async createInvitation(data) {
        return await http.post(`/invitation`, data, { headers: authHeader() });
    }
    async searchInvitation(managerId, guestId, guestEmail) {
        let query = '?';
        if (managerId) query += `${query.length === 1 ? `managerId=${managerId}` : `&managerId=${managerId}`}`;
        if (guestId) query += `${query.length === 1 ? `guestId=${guestId}` : `&guestId=${guestId}`}`;
        if (guestEmail) query += `${query.length === 1 ? `guestEmail=${guestEmail}` : `&guestEmail=${guestEmail}`}`;

        return await http.get(`/invitation${query}`, { headers: authHeader() });
    }
    async updateInvitation(invitationId, userId, status, data) {
        return await http.put(`/invitation/${invitationId}/${userId}/${status}`, data, { headers: authHeader() });
    }
    async deleteInvitation(id) {
        return await http.delete(`/invitation/${id}`, { headers: authHeader() });
    }
}

export default new InvitationProxy();
