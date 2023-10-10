import userModel from "../models/user.js"

export default class userManger {

    get = () => {
        return userModel.find().lean()
    }

    getBy = (param) => {
        return userModel.findOne(param).lean()
    }

    create = (user) => {
        return userModel.create(user)
    }

    updateUser = (id, user) => {
        return userModel.updateOne({ _id: id }, user)
    }

    deleteUser = (id) => {
        return userModel.deleteOne({ _id: id })
    }
}

