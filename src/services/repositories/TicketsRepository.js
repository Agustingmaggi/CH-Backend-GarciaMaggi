export default class TicketsRepository {
    constructor(dao) {
        this.dao = dao;
    }
    createTicket = (ticket) => {
        return this.dao.createTicket(ticket)
    }
    getTicket = (params) => {
        return this.dao.getTicket(params)
    }
}