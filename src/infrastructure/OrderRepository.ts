import mongoose, {Connection} from "mongoose"
import Order from "../domain/Order";
import OrderModel from "../models/OrderModel";

export default class OrderRepository {

    private static async connect() {
        let url = process.env.MONGO_DB_URL!
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true
        });
    }

    public async saveOrders(orders: Array<Order>): Promise<any> {
        return new Promise(async () => {
            await OrderRepository.connect()
                .then(async () => {
                    await orders.map(async (order) => {
                        return await new OrderModel().model.create({
                            id: order.id,
                            number: order.number,
                            volumes: order.volumes,
                            value: order.value,
                            organization: order.organization,
                        }).then((resp) => {
                            console.log(resp)
                        })
                    })
                })

        })


    }

    public getOrders() {

    }
}
