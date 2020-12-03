import {Request, Response} from "express";
import OrderRepository from "../infrastructure/OrderRepository";
import DealService from "../infrastructure/service/DealService";
import OrderService from "../infrastructure/service/OrderService";

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
        // try {
        //     // let deals = await this.repository.
        //     let orders = await this.orderService.createSolicitation(deals)
        // } catch (err) {
        //     console.log(err)
        //     res.status(400).json({message: "error"})
        // }
    }

    createOrders = async (req: Request, res: Response) => {
        try {
            let deals = await this.dealService.getAllWonDials()
            let orders = await this.orderService.createOrder(deals)
            let saved = await this.repository.saveOrders(orders)
            const data = {status: 'success', data: (saved)? saved: null}
            res.status(200).json(data)
        } catch (err) {
            console.log(err)
            res.status(500).json({status:'error', message: err.message})
        }
    }

}
