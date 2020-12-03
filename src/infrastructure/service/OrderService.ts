import axios, {AxiosPromise, AxiosResponse} from "axios";
import {js2xml} from "xml-js";
import IRawDeal from "../../domain/IRawDeal";
import Order from "../../domain/Order";
import IRawOrder from "../../domain/IRawOrder";
import Volume from "../../domain/Volume";

const CREATE_SOLICITATION_ERROR = "impossible create order"

export default class OrderService {

    public async createSolicitation(deals: Array<IRawDeal>): Promise<Array<Order>> {

        return new Promise(async (resolve, reject) => {
            let resp: Array<Order> = []
            await Promise.all(deals.map(async (deal: IRawDeal) => {
                await OrderService.saveOrder(deal)
                    .then((response: AxiosResponse) => {
                        const order = response.data.retorno.pedidos
                        if (order) {
                            console.log('befor', order[0])
                            // return OrderService.hydrateOrder(order[0].pedido, deal.value, deal.org_name)
                            resp.push(OrderService.hydrateOrder(order[0].pedido, deal.value, deal.org_name))
                            // console.log('push', resp)
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                        reject(new Error(CREATE_SOLICITATION_ERROR))
                    })
            }))
            resolve(resp)
        })

    }

    private static saveOrder(deals: IRawDeal): AxiosPromise {
        const blingTokenApi = process.env.BLING_API_TOKEN
        const blingDomain = process.env.BLING_DOMAIN
        const order = {
            pedido: {
                cliente: {
                    nome: deals.owner_name,
                },
                itens: {
                    item: {
                        codigo: deals.id + "97952",
                        descricao: deals.title,
                        vlr_unit: deals.value,
                        vlr: "1"
                    }
                }
            }
        }
        const orderXml = js2xml(order, {compact: true, spaces: 4})
        return axios.post(`${blingDomain}pedido/json/?apikey=${blingTokenApi}&xml=${orderXml}`)
    }

    private static hydrateOrder(rawOrder: IRawOrder, value?: number, organization?: string): Order {
        let volumes: Array<Volume> = []
        const rawVolume = rawOrder.volumes ?? []
        rawVolume.forEach((value) => {
            const volume = new Volume(value.servico ?? '', value.codigoRastreamento ?? '')
            volumes.push(volume)
        })
        return new Order(rawOrder.idPedido ?? 0, rawOrder.numero ?? '', volumes, value ?? 0, organization ?? '')
    }
}

