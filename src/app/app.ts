import express from "express";
import * as core from "express-serve-static-core";
import OrderRepository from "../infrastructure/OrderRepository";
import OrderController from "../controller/OrderController";
import DealService from "../infrastructure/service/DealService";
import OrderService from "../infrastructure/service/OrderService";

export default class App {
    server: core.Express
    repository: OrderRepository

    constructor() {
        this.server = express()
        this.repository = new OrderRepository()
    }

    public run() {
        this.registerRoutes()
        const port = process.env.SERVER_PORT || 3333
        this.server.listen(port)
    }

    private registerRoutes() {
        let routes = express.Router();
        const controller = new OrderController(this.repository, new OrderService, new DealService)
        routes.get("/v1/orders", controller.getOrders)
        routes.post('/v1/orders/sync', controller.createOrders)
        this.server.use(routes)
    }
}
