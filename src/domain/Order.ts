import Volume from "./Volume";

export default class Order {
    public code: number
    public number: string
    public volumes: Volume[]
    public value: any
    public organization: string
    public date: Date

    constructor(code: number, number: string, volumes: Volume[], value: number, organization: string, date: Date) {
        this.code = code
        this.number = number
        this.volumes = volumes
        this.value = value
        this.organization = organization
        this.date = date
    }
}
