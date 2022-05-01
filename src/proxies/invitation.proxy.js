import http from './http-common';
import authHeader from "./auth-header";

class InvitationProxy {
    async createInvitation(data) {
        return await http.post(`/invitation`, data);
    }
    async searchInvitation(managerId, guestId) {
        let query = '?';
        if (managerId) query += `${query.length === 1 ? `managerId=${managerId}` : `&managerId=${managerId}`}`;
        if (guestId) query += `${query.length === 1 ? `guestId=${guestId}` : `&guestId=${guestId}`}`;

        return await http.get(`/invitation${query}`);
    }
    async updateInvitation(invitationId, userId, status) {
        return await http.put(`/invitation/${invitationId}/${userId}/${status}`);
    }
    async deleteInvitation(id) {
        return await http.delete(`/invitation/${id}`);
    }
}

export default new InvitationProxy();
