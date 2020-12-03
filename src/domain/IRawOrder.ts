import IRawVolume from "./IRawVolume";

export default interface IRawOrder {
    numero?: string,
    idPedido?: number,
    codigos_rastreamento?: any,
    volumes?: Array<IRawVolume>
}
