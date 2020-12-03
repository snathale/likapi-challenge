import {Request, Response} from "express";
import OrderRepository from "../infrastructure/OrderRepository";
import DealService from "../infrastructure/service/DealService";
import OrderService from "../infrastructure/service/OrderService";
import {json2xml} from "xml-js";

export default class OrderController{
    private repository: OrderRepository
    private solicitationService: OrderService
    private dealService: DealService

    constructor(repository: OrderRepository, solicitationService: OrderService, dealService: DealService) {
        this.repository = repository
        this.solicitationService = solicitationService
        this.dealService = dealService
    }

    getOrders = async (req: Request, res: Response) => {
        // try {
        //     // let deals = await this.repository.
        //     let orders = await this.solicitationService.createSolicitation(deals)
        // } catch (err) {
        //     console.log(err)
        //     res.status(400).json({message: "error"})
        // }
    }

    createOrders = async (req: Request, res: Response) => {
        try {
            let deals = await this.dealService.getAllWonDials()
            let orders = await this.solicitationService.createSolicitation(deals)
            console.log('depois')
            let saved = await this.repository.saveOrders(orders)
            console.log(saved)
        } catch (err) {
            console.log(err)
            res.status(400).json({message: "error"})
        }
    }

}
