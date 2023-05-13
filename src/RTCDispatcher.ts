import { World } from "./game_specifics/game_specifics.js";

// TODO: single responsibility
export class RTCDispatcher {
    pc: RTCPeerConnection;

    player_actions : RTCDataChannel = null
    preload : RTCDataChannel = null
    handled_actions : RTCDataChannel = null

    world: World;

    constructor(_world: World) {
        this.world = _world;
        this.pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] }); //TODO: add configuration
        
        //?NOTE: Funny, it appears that I have to create at least one DataChannel to make sending offer work.
        this.player_actions = this.pc.createDataChannel("PlayerActions");
        
        this.pc.ondatachannel = (ev) => {
            if(ev.channel.label == "HandledActions"){
                this.handled_actions = ev.channel;
                console.log("HandledActions created!");
                this.handled_actions.addEventListener("message", this.dispatch_changes.bind(this));
            } else if(ev.channel.label == "Preload"){
                this.preload = ev.channel;
                this.preload.addEventListener("message", this.dispatch.bind(this));
            }
        }
    }

    send_player_action(action : ServerAction){
        
        this.player_actions.send(JSON.stringify(action))
    }


    connect() {
        this.pc.createOffer()
            .then(offer => {
                this.pc.setLocalDescription(offer);

                return fetch(`http://localhost:1002/game/join`, {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                            login: "test",
                            secret: "pass",
                            offer: offer
                        })
                });
            })
            .then(res => { console.log(res); return res.json(); })
            .then(res => this.pc.setRemoteDescription(res))
            .catch(alert);
            
    }

    dispatch(event : MessageEvent){
        console.log(event.data);
    }

    dispatch_changes(event: MessageEvent) {
        // get data, decide what entity it is
        const enc = new TextDecoder("utf-8");
        let action : HandledAction = JSON.parse(enc.decode(event.data))
        this.world.entities[action.Source.EntityId].events.push(action)

    }

}


export enum ServerActionType {
    Move = 0,
    Attack,
	Use,
	Place,
	PlaceAt,
	Pickup,
    Join,
    Disconnect,
}

export class ServerAction {
    constructor(action : ServerActionType, slotid : number, target : string, position : {X: number, Y:number}, arg: number){
        this.Action = action
        this.SlotId = slotid
        this.Target = target
        this.Position = position
        this.Arg = arg
    }

	Action: ServerActionType 
	SlotId: number // what is selected
	Target: string
	Position: {X : number, Y: number}
	Arg: number
}

export interface HandledAction {
    Source : any // it not always player that is source of event
	Tick: number
	Successful: boolean
	Action: any
	Changes: any
}