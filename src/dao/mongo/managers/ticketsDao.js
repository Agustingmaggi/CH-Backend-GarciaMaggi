import ticketModel from "../models/ticket.js";

export default class productsDao {

    getTicket = (params) => {
        return ticketModel.findOne(params).lean()
    }

    createTicket = (ticket) => {
        return ticketModel.create(ticket)
    }
}