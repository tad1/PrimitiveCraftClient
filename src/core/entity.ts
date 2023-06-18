import { HandledAction } from "src/RTCDispatcher"
import {Point} from "./point.js"
import { Change } from "../game_specifics/change.js"
import { World } from "../game_specifics/World.js"

// A game object that goes brrrr....
//! Q: should Entity bechaviour downloaded from server? Yes. Will it be in WebAssembly?
export interface Entity{
    id: number //! What type of id?

    // TODO, move that to movable entity
    set_velocity : Point // last known velocity unit/ms??
    position_error : Point // error calculated on previously fetched data

    set_position : Point // last known position
    position : Point // predicted position 

    _renderer : HTMLCanvasElement | HTMLImageElement
    render_size : Point
    // TODO: remove coupling, add adapter
    events: Array<Change>
    world : World

    // A time-fixed update...
    //TODO: make that working
    tick(): void

    //? I think that I should better name that.. for now applying terminology
    //NOTE: fixed update is update between ticks.
    // It shouldn't have any logic, it just should interlope and fix position
    
    //No operator overloading :(
        //! Q: should velocity describe unit/second or unit/tick?
    // TODO: 
    fixedUpdate(): void

    //Renders once is nesseacary??? No? Because of animations?
    //* What about animations?
    render(): void
    // This is more difficult.
    // First, we need to know what game tick data comes from.
    
    //! Q: Does the server fires messeages? Or is that more query, response?
    //! Q: Should game tick, and server tick be the same?

}