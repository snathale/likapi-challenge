import axios, {AxiosPromise, AxiosResponse} from "axios";
import {js2xml} from "xml-js";
import IRawDeal from "../../domain/IRawDeal";
import Order from "../../domain/Order";
import IRawOrder from "../../domain/IRawOrder";
import Volume from "../../domain/Volume";

const CREATE_SOLICITATION_ERROR = "impossible create order on bling service"

export default class OrderService {

    public async createOrder(deals: Array<IRawDeal>): Promise<Order[]> {
        return new Promise(async (resolve, reject) => {
            let resp: Order[] = []
            await Promise.all(deals.map(async (deal: IRawDeal) => {
                await OrderService.saveOrder(deal)
                    .then((response: AxiosResponse) => {
                        const order = response.data.retorno.pedidos
                        if (order) {
                            resp.push(OrderService.hydrateOrder(order[0].pedido, deal.value, deal.org_name, deal.won_time))
                        }
                    })
                    .catch((err) => {
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
                        codigo: deals.id + "979668",
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

    private static hydrateOrder(rawOrder: IRawOrder, value?: number, organization?: string, won_date?:string): Order {
        let volumes: Array<Volume> = []
        const rawVolume = rawOrder.volumes ?? []
        rawVolume.forEach((value) => {
            const volume = new Volume(value.servico ?? '', value.codigoRastreamento ?? '')
            volumes.push(volume)
        })
        const date = new Date(won_date??'')
        return new Order(rawOrder.idPedido ?? 0, rawOrder.numero ?? '', volumes, value ?? 0, organization ?? '',date)
    }
}

