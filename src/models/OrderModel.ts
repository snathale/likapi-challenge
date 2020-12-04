import {Model, model, Schema, Types} from "mongoose";

export default class OrderModel {
    public model: Model<any>

    constructor() {
        this.model = model('order', this.OrderSchema)
    }

    OrderSchema = new Schema({
            createdAt: Date,
            updatedAt: Date,
            value: {
                type: Number,
                required: true
            }
        },
        {
            timestamps: true
        }
    )
}
