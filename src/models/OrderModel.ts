import {Model, model, Schema} from "mongoose";

export default class OrderModel {
    public model: Model<any>

    constructor() {
        this.model = model('order', this.OrderSchema)
    }

    VolumeSchema = new Schema({
        service: {
            type: String
        },
        track_code: {
            type: String
        }
    })

    OrderSchema = new Schema({
        id: {
            type: Number,
            required: true
        },
        number: {
            type: String,
            required: true
        },
        volumes: [
            this.VolumeSchema
        ],
        value: {
            type: Number,
            required: true
        },
        organization: {
            type: String
        }
    })
}
