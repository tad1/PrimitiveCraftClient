import { Player } from "./entities/player.js";
import { EntityFactory } from "./game_specifics/entity_factory.js";
import { Chunk, World } from "./game_specifics/game_specifics.js";

// TODO: single responsibility
export class RTCDispatcher {
    pc: RTCPeerConnection;
    connected : boolean = false

    player_actions : RTCDataChannel = null
    preload : RTCDataChannel = null
    handled_actions : RTCDataChannel = null

    world: World;
    entity_factory : EntityFactory

    constructor(world: World, entity_factory : EntityFactory) {
        this.world = world;
        this.entity_factory = entity_factory;
        this.pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] }); //TODO: add configuration
        
        //?NOTE: Funny, it appears that I have to create at least one DataChannel to make sending offer work.
        this.player_actions = this.pc.createDataChannel("PlayerActions");
        
        this.pc.ondatachannel = (ev) => {
            if(ev.channel.label == "HandledActions"){
                this.handled_actions = ev.channel;
                console.log("HandledActions created!");

                // TODO: simplify
                this.handled_actions.addEventListener("message", this.dispatch_changes.bind(this));
                this.send_player_action(new ServerAction(ServerActionType.Join, 0,"", {X: 0,Y: 0},0));
            } else if(ev.channel.label == "Preload"){
                this.preload = ev.channel;
                this.preload.addEventListener("message", this.dispatch.bind(this));
            }
        }
    }

    send_player_action(action : ServerAction){
        if (this.player_actions.readyState == 'open'){
            this.player_actions.send(JSON.stringify(action));
        }
    }


    async connect(login : string, secret: string) : Promise<string> {
        let playerId : string = null
        await this.pc.createOffer()
            .then(offer => {
                this.pc.setLocalDescription(offer);

                return fetch(`http://localhost:10002/game/join`, {
                    method: 'post',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    // So this must be passed by user
                    body: JSON.stringify({
                            login: login,
                            secret: secret,
                            offer: offer
                        })
                });
            })
            .then(res => { console.log(res); return res.json(); })
            .then(res => {console.log(res); this.pc.setRemoteDescription(res["WebrtcData"]); playerId=res["PlayerId"]; this.connected = true})
            .catch(alert);
            
        return playerId
    }

    dispatch(event : MessageEvent){
        const enc = new TextDecoder("utf-8");
        let data = JSON.parse(enc.decode(event.data));
        console.log(data);
        let pos = `${data.Id.X}@${data.Id.Y}`
        // check if there's chunk
        if (!this.world.chunks[pos]){
            this.world.chunks[pos] = new Chunk()
        }

        // Load entities
        for (const entityId in data.Entities){
            // TODO: remove responsibility
            if(!this.world.entities[entityId]){
                this.entity_factory.create_from_server(entityId, data.Entities[entityId])
            }
        }

    }

    dispatch_changes(event: MessageEvent) {
        // get data, decide what entity it is
        const enc = new TextDecoder("utf-8");
        let action : HandledAction = JSON.parse(enc.decode(event.data))
        if (!this.world.entities[action.Source.EntityId]){
            // There's no such an entity, we need to create one
            console.log(action)
            // TODO: remove this responsibility
            if(action.Source.TypeName == "entity_player"){
                this.world.entities[action.Source.EntityId] = new Player()
            }
        }

        this.world.entities[action.Source.EntityId].events.push(action)

    }

}


export enum ServerActionType {
    Move = 0,
    Attack = 1,
	Use,
	Place,
	PlaceAt,
	Pickup,

    Join,
    Disconnect,
    Tick
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