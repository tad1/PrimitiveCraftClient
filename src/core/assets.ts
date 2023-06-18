import { AssetType, Asset } from "../config/config.js";

class _Assets {
    sprites : Record<string, any> = {};
    audio : Record<string, HTMLAudioElement> = {};

    //Errors to handle:
    //  No assets.json
    //  No server connection
    //  Can't fetch certain asset
    //  Can't store asset, type mish mash
    //  Ran out of memory
    async fetch(){
        //Get assets.json
        //!NOTE: Here I will use API instead
        const response = await fetch("resources/assets.json")
        if(!response.ok)
            throw new Error("Couldn't fetch assets.json")
        const asset_list = await response.json() as Array<Asset>;
        if(asset_list == null || asset_list == undefined)
            throw new Error("Failed parsing assets.json")
            
        //Paraller loading
        await Promise.all(asset_list.map(async (asset) => {
            const response = await fetch(asset.url);
            await this.load(asset, response);
        }))
    }

    //Responsible for loading data was fetched
    //Errors to handle:
    //  Can't handle such a type of asset
    //  Invalid response
    //  Invalid data
    //  Can't process data (external processing error)
    async load(asset : Asset, response : Response){
        if(!response.ok)
            throw new Error(`Could not fetch ${asset.url}, response code: ${response.status}`)

        //A magic switch???
        //* Make sure that enum corresponds to asset type
        if(asset.type == AssetType.Sprite){

            //*NOTE: The following code violates Content Security Protocol if it's not set in HTML meta header
            //see: https://stackoverflow.com/questions/59484216/refused-to-load-the-image-blob-because-it-violates-the-following-content-s
            let img = new Image();
            const blob = await response.blob();
            img.src = URL.createObjectURL(blob);
            this.sprites[asset.id] = img
        } else if(asset.type == AssetType.Audio){
            let audio = new Audio();
            const blob = await response.blob();
            audio.src = URL.createObjectURL(blob);
            this.audio[asset.id] = audio
        }
    }


    load_from_path(key : string, path : string){
        var img = new Image();


        var d = new Promise(function (resolve: (arg0: HTMLImageElement) => void, reject: (arg0: string) => void) {
            img.onload = function(){
                this.sprites[key] = img;
                resolve(img);
            }.bind(this);

            img.onerror = function () {
                reject('Could not load image: '+path)
            }.bind(this);
        }.bind(this));

        img.src = path;
        return d
    }

    getImage(key : string) {
        return (key in this.sprites) ? this.sprites[key] : null
    }

    getAudio(key: string) : HTMLAudioElement {
        return (key in this.audio) ? this.audio[key] : null
    }
    playSFX(key: string){
        if(key in this.audio){
            (this.audio[key].cloneNode() as HTMLAudioElement).play()
        }
    }

}

export const Assets : _Assets = new _Assets();