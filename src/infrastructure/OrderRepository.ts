import mongoose from "mongoose"
import Order from "../domain/Order";
import OrderModel from "../models/OrderModel";

const CREATE_ORDER_ERROR = "impossible save order on mongodb"
const GET_ORDER_ERROR = "impossible restore order on mongodb"

export default class OrderRepository {

    private static async connect() {
        let url = process.env.MONGO_DB_URL!
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true,
            user: process.env.MONGO_DB_USER,
            pass: process.env.MONGO_DB_PASSWORD
        })
    }

    private static async save(order: Order) {
        await OrderRepository.connect()
        const day = order.date.getUTCDay()
        const month = order.date.getUTCMonth()
        const year = order.date.getUTCFullYear()
        const gte = new Date(Date.UTC(year, month, day, 0, 0, 0))
        const lte = new Date(Date.UTC(year, month, day, 23, 59, 59))
        return new OrderModel().model.update(
            {
                createdAt: {
                    $gte: gte,
                    $lte: lte
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

    public async saveOrders(orders: Array<Order>): Promise<OrderModel[]> {
        return new Promise(async (resolve, reject) => {
            let resp: OrderModel[] = []
            await Promise.all(
                orders.map(async (order) => {
                    await OrderRepository.save(order)
                        .then((user) => {
                            resp.push(user)
                        })
                        .catch((err) => {
                            reject(new Error(CREATE_ORDER_ERROR))
                        })
                })
            )
            resolve(resp)
        })

    }

    public async getOrders(): Promise<OrderModel[]> {
        return new Promise(async (resolve, reject) => {
            await OrderRepository.connect()
            let data = await new OrderModel().model.find()
                .then((model) => {
                    resolve(model)
                })
                .catch((err) => {
                    reject(new Error(GET_ORDER_ERROR))
                })
        })
    }
}
