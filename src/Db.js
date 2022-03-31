export default class Db{
    constructor() {
        /**
         * La liste des instances
         * @type {*[]}
         */
        this.instances=[];
        this.isLoading=false;
        this.refresh();

        /**
         * L'ionstance désignée comme étant master
         * @type {null|Object}
         */
        this.masterVersion=null;

    }

    /**
     * Définit ou met à jour les instances
     * @private
     * @param instances
     */
    _setInstances(instances){
        instances.forEach(inst=>{
            let existing=this._getInstance(inst.href)
            if(!existing){
                this.instances.push(inst);
            }else{
                Object.assign(existing,inst);
            }
        });
        this.masterVersion=this._getMaster().version;
    }



    /**
     * Renvoie une instance à partir de son href
     * @private
     * @param href
     * @return {*}
     */
    _getInstance(href){
        return this.instances.find(i=>i.href===href);
    }

    /**
     * Met à jour toutes les données
     */
    refresh(){
        this.isLoading=true;
        window.$api.getInstances((data)=>{
            this.isLoading=false;
            //this.instances=data.body.instances;
            this._setInstances(data.body.instances);
        })
    }

    /**
     * Pour enregistrer des modifs sur une instance
     * @param instance
     * @param cb
     * @param cbError
     */
    store(instance,cb=()=>{},cbError=()=>{}){
        window.$api.store(
            instance,
            (data)=>{
                this._setInstances(data.body.instances);
                cb();
            },
            ()=>{
                this.refresh();
                cbError();
            }
        )
    }

    /**
     * Pour mettre à jour l'instance vers la nouvelle version
     * @param instance
     * @param cb
     * @param cbError
     */
    updateVersion(instance,cb=()=>{},cbError=()=>{}){
        setTimeout(()=>{
            window.$api.updateVersion(
                instance,
                (data)=>{
                    this._setInstances(data.body.instances);
                    cb();
                },
                ()=>{
                    this.refresh();
                    cbError();
                }
            )
        },3000)

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