import { World } from "./game_specifics/game_specifics";

export class RTCDispatcher {
    pc: RTCPeerConnection;
    dc: RTCDataChannel;
    world: World;

    constructor(world: World) {
        this.world = world;
        this.pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] }); //TODO: add configuration
        this.dc = this.pc.createDataChannel("my channel");
        this.dc.addEventListener("message", this.dispatch);
    }

    connect() {
        this.pc.createOffer()
            .then(offer => {
                this.pc.setLocalDescription(offer);

                return fetch(`http://91.236.137.7:1002/game/join`, {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(offer)
                });
            })
            .then(res => { console.log(res); return res.json(); })
            .then(res => this.pc.setRemoteDescription(res))
            .catch(alert);
    }

    dispatch(event: MessageEvent) {
        // get data, decide what entity it is
        console.log(event.data);

    }

}
