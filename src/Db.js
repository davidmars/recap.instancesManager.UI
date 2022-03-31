export default class Db{
    constructor() {
        /**
         * La liste des instances
         * @type {*[]}
         */
        this.instances=[];
        this.refresh();
        this.isLoading=false;
        /**
         * L'ionstance désignée comme étant master
         * @type {null|Object}
         */
        this.masterVersion=null;

    }

    /**
     * Met à jour toutes les données
     */
    refresh(){
        this.isLoading=true;
        window.$api.getInstances((data)=>{
            this.isLoading=false;
            //this.instances=data.body.instances;
            data.body.instances.forEach(inst=>{
                let existing=this.getInstance(inst.href)
                if(!existing){
                    this.instances.push(inst);
                }else{
                    Object.assign(existing,inst);
                }
            });
            this.masterVersion=this._getMaster().version;
        })
    }

    getInstance(href){
        return this.instances.find(i=>i.href===href);
    }

    /**
     * Pour enregistrer des modifs sur une instance
     * @param instance
     * @param cb
     */
    store(instance,cb=()=>{}){
        window.$api.store(
            instance,()=>{
                this.refresh();
                cb();
            }
        )
    }

    /**
     * Pour mettre à jour l'instance vers la nouvelle version
     * @param instance
     */
    updateVersion(instance){
        window.$api.store(
            instance,()=>{
                this.refresh();
            }
        )
    }

    /**
     * Renvoie l'instance master
     * @private
     * @return {T}
     */
    _getMaster(){
        return this.instances.find(i=> i.name==="master" );
    }
}