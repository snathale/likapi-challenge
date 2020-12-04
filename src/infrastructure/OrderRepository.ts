import mongoose from "mongoose"
import Order from "../domain/Order";
import OrderModel from "../models/OrderModel";
import moment from "moment-timezone"
import IAggregatedOrder from "../domain/IAggregatedOrder";

const CREATE_ORDER_ERROR = "impossible save order on mongodb"
const GET_ORDER_ERROR = "impossible restore order on mongodb"
const REPOSITORY_CONNECTION_ERROR = "impossible restore order on mongodb"

export default class OrderRepository {

    private model: OrderModel

    constructor(model: OrderModel) {
        OrderRepository.connect()
            .catch((err) => {
                console.log(err)
                throw new Error(REPOSITORY_CONNECTION_ERROR)
            })
        this.model = model
    }

    private static async connect() {
        const url = process.env.MONGO_DB_URL!
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true,
            user: process.env.MONGO_DB_USER,
            pass: process.env.MONGO_DB_PASSWORD
        })
    }

    private async save(order: Order) {
        const day = ("0" + order.date.getUTCDate()).slice(-2)
        const month = ("0" + (order.date.getUTCMonth() + 1)).slice(-2)
        const year = order.date.getUTCFullYear()
        const initialDate = `${year}-${month}-${day} 00:00:00`
        const finalDate = `${year}-${month}-${day} 23:59:59`
        return this.model.model.updateOne(
            {
                createdAt: {
                    $gte: initialDate,
                    $lte: finalDate
                }
            },
            {
                $inc: {
                    value: order.value
                },
            },
            {
                upsert: true
            })
    }

    public async saveOrders(orders: Array<Order>): Promise<any[]> {
        return new Promise(async (resolve, reject) => {
            let resp: any[] = []
            await Promise.all(
                orders.map(async (order) => {
                    await this.save(order)
                        .then((user) => {
                            resp.push(user)
                        })
                        .catch((err) => {
                            console.log(err)
                            reject(new Error(CREATE_ORDER_ERROR))
                        })
                })
            )
            resolve(resp)
        })

    }

    public async getOrders(): Promise<IAggregatedOrder[]> {
        return new Promise(async (resolve, rejected) => {
                let resp: IAggregatedOrder[] = []
                let query = this.model.model.find().exec()
                return query.then((doc) => {
                    doc.map((value) => {
                        const v: IAggregatedOrder = {
                            _id: value.get('_id').toString(),
                            value: value.value,
                            createdAt: value.createdAt,
                            updatedAt: value.updatedAt,
                            __v: value.get('__v')
                        }
                        resp.push(v)
                    })
                    resolve(resp)
                }).catch((err) => {
                    console.log(err)
                    rejected(err)
                })
            }
        )
    }
}
