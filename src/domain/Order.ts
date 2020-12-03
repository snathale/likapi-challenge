import Volume from "./Volume";

export default class Order {
    public id: number
    public number: string
    public volumes: Array<Volume>
    public value: number
    public organization: string

    constructor(id: number, number: string, volumes: Array<Volume>, value: number, organization: string) {
        this.id = id
        this.number = number
        this.volumes = volumes
        this.value = value
        this.organization = organization
    }
}
