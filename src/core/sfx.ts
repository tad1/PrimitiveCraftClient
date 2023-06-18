// Future api, not used
// In future api you can:
//  - define own parametrized SFX
//  - set local and global parameters to SFX
//  - will allow to use predefined effects
//  - will wrap WebAPI to minimalise cost

class _SFX{
    nodes: Record<string, AudioNode> = {};
    // TODO: move this to Audio, and instead move this to sfx AudioNode??
    audioContext: AudioContext = new AudioContext()


    load(record : Record<string, HTMLAudioElement>){
        for (const key in record){
            this.nodes[key] = this.audioContext.createMediaElementSource(record[key])
            this.nodes[key].connect(this.audioContext.destination);
        }
    }

    getSFX(key : string) : AudioNode{
        return this.nodes[key]
    }
}