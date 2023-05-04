//* Not used, left for using indexedDB reference
export class AssetLoader {
    db : IDBDatabase
    storeName : string = "assets"
    indexes : Array<string> = []


    async localdb_connect(){
        //JS Hoisting! Let's go!!
        const that = this;
        return new Promise(function(resolve: () => any) {
            const request = window.indexedDB.open("primitive-craft",3);
            request.onerror = (event) => {
                throw new Error("AssetLoader: Couldn't open indexedDB");
            }
            request.onupgradeneeded = (event : any) => {
                that.db = event.target.result;
                try {
                    that.db.createObjectStore(that.storeName, {keyPath: "name"});
                } catch (error) {
                    console.log(error);
                }
            }
            request.onsuccess = (event : any) => {
                that.db = event.target.result;
                return resolve();
            }

        }.bind(this));
    }

    async localdb_init(){
        const that = this;
        return new Promise(function(resolve: any){
            var transaction = that.db.transaction([that.storeName]);
            var index_request = transaction.objectStore(that.storeName).getAllKeys();
            index_request.onsuccess = () => {
                //@ts-ignore
                that.indexes = index_request.result;
                return resolve();
            }
        });
    }

}