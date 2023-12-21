import userModel from "../models/user.js"

export default class userDao {

    get = () => {
        return userModel.find()
    }

    getBy = (param) => {
        return userModel.findOne(param).lean()
    }

    create = async (user) => {
        const result = await userModel.create(user)
        return result.toObject()
    }

    updateUser = (id, user) => {
        return userModel.updateOne({ _id: id }, user)
    }

    deleteUser = (id) => {
        return userModel.deleteOne({ _id: id })
    }
}

