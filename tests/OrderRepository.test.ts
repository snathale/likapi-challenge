import mongoose from "mongoose";
import OrderRepository from "../src/infrastructure/OrderRepository";
import Order from "../src/domain/Order";
import Volume from "../src/domain/Volume";
import * as assert from "assert";
import OrderModel from "../src/models/OrderModel";
import moment from "moment-timezone"
import IAggregatedOrder from "../src/domain/IAggregatedOrder";

describe('orderController', () => {
    const orderModel = new OrderModel()
    beforeEach(async () => {
        process.env.MONGO_DB_URL = 'mongodb://mongo.db.service:27017/admin'
        process.env.MONGO_DB_USER = 'root'
        process.env.MONGO_DB_PASSWORD = 'dummyPass'
        await mongoose.connect("mongodb://mongo.db.service:27017/admin", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true,
            user: 'root',
            pass: 'dummyPass'
        }).then(async () => {
            await mongoose.connection.dropCollection('orders').then(() => {
            }).catch(() => {
            })
        })

    });
    afterEach(async () => {
        await mongoose.disconnect()
    })
    it('create order', async () => {
        const order1 = new Order(1, "1", [], 2, 'FakeOrganization', new Date())
        const volumes: Volume[] = [
            new Volume("Service Test", "TrackCode Test")
        ]
        const date = moment().tz('UTC')
        const order2 = new Order(1, "1", volumes, 6, 'FakeOrganization', date.toDate())
        const newDate = moment().tz('UTC').add(2,'days')
        const order3 = new Order(1, "1", volumes, 3, 'FakeOrganization', newDate.toDate())
        const repository = new OrderRepository(orderModel)
        const resp = await repository.saveOrders([order1, order2, order3])
        assert.strictEqual(resp[0].nModified, 0)
        assert.strictEqual(resp[1].nModified, 0)
        assert.strictEqual(resp[2].nModified, 1)
        let model = mongoose.model('order')
        const find = await model.find()
        assert.strictEqual(find.length, 2)
        assert.strictEqual(find[0].get('value'), 8)
        assert.strictEqual(find[1].get('value'), 3)
    })
    it('get orders', async () => {
        await orderModel.model.create({value: 5})
        await orderModel.model.create({value: 4})
        const repository = new OrderRepository(orderModel)
        const resp = await repository.getOrders()
        const assert1:IAggregatedOrder = {
            _id: resp[0]._id,
            value: 5,
            createdAt: resp[0].createdAt,
            updatedAt: resp[0].updatedAt,
            __v: 0
        }
        const assert2:IAggregatedOrder = {
            _id: resp[1]._id,
            value: 4,
            createdAt: resp[1].createdAt,
            updatedAt: resp[1].updatedAt,
            __v: 0
        }
        assert.deepStrictEqual(resp[0], assert1)
        assert.deepStrictEqual(resp[1], assert2)


    })
})
