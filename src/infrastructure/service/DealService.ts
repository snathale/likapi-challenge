import axios, {AxiosPromise, AxiosResponse} from "axios";
import IRawDeal from "../../domain/IRawDeal";

const GET_DEALS_ERROR = "impossible to read deals on pipedrive service"

export default class DealService {

    public async getAllWonDials(): Promise<IRawDeal[]> {
        return DealService.getDealsByStatus("won")
            .then((response: AxiosResponse) => {
                const {data} = response.data
                return data
            })
            .catch((err) => {
                throw new Error(GET_DEALS_ERROR)
            })
    }

    private static getDealsByStatus(status: string): AxiosPromise {
        const pipeDriveTokenApi = process.env.PIPE_DRIVE_API_TOKEN
        const pipeDriveDomain = process.env.PIPE_DRIVE_DOMAIN
        return axios.get(`${pipeDriveDomain}/deals?status=${status}&api_token=${pipeDriveTokenApi}`)
    }

}
