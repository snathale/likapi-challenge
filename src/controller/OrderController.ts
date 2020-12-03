import {Request, Response} from "express";
import OrderRepository from "../infrastructure/OrderRepository";
import DealService from "../infrastructure/service/DealService";
import OrderService from "../infrastructure/service/OrderService";
import jsend from "jsend"

export default class OrderController {
    private repository: OrderRepository
    private orderService: OrderService
    private dealService: DealService

    constructor(repository: OrderRepository, orderService: OrderService, dealService: DealService) {
        this.repository = repository
        this.orderService = orderService
        this.dealService = dealService
    }

    getOrders = async (req: Request, res: Response) => {
        try {
            const orders = await this.repository.getOrders()
            res.status(200).json(jsend.success(orders))
        } catch (err) {
            console.log(err)
            res.status(500).json(jsend.fail(err.message))
        }
    }

    createOrders = async (req: Request, res: Response) => {
        try {
            let deals = await this.dealService.getAllWonDials()
            let orders = await this.orderService.createOrder(deals)
            await this.repository.saveOrders(orders)
            res.status(200).json(jsend.success(orders))
        } catch (err) {
            console.log(err)
            res.status(500).json(jsend.fail(err.message))
        }
    }

}
