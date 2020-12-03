export default class Volume {
    private service: string
    private track_code: string

    constructor(service: string, track_code: string) {
        this.service = service
        this.track_code = track_code
    }
}
