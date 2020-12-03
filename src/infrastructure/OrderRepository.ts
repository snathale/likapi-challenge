import mongoose from "mongoose"
import Order from "../domain/Order";
import OrderModel from "../models/OrderModel";

const CREATE_ORDER_ERROR = "impossible create order on mongodb"

export default class OrderRepository {

    private static async create(order: Order) {
        let url = process.env.MONGO_DB_URL!
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true,
            user: process.env.MONGO_DB_USER,
            pass: process.env.MONGO_DB_PASSWORD
        })
        return await new OrderModel().model.create({
            order_id: order.id,
            number: order.number,
            volumes: order.volumes,
            value: order.value,
            organization: order.organization,
        })
    }

    public async saveOrders(orders: Array<Order>): Promise<Array<OrderModel>> {
        return new Promise(async (resolve, reject) => {
            let users: OrderModel[] = []
            await Promise.all(
                orders.map(async (order) => {
                    await OrderRepository.create(order)
                        .then((user) => {
                            users.push(user)
                        })
                        .catch((err) => {
                            reject(new Error(CREATE_ORDER_ERROR))
                        })
                })
            )
            resolve(users)
        })

    }

    public getOrders() {

    }
}
