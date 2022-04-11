import Instance from "@/Instance";

export default class Db{
    /**
     *
     * @param {Api[]}apis
     */
    constructor(apis) {
        /**
         * Les apis qui correspondent aux différents serveurs
         * @type {Api[]}
         */
        this.apis=apis;
        /**
         * La liste des instances
         * @type {Instance[]}
         */
        this.instances=[];
        /**
         * Est on entrain de charger des données
         * @type {boolean}
         */
        this.isLoading=false;
        //this.refresh();

        /**
         * L'instance désignée comme étant master
         * @type {null|Object}
         */
        this.masterVersion=null;


    }

    /**
     * Toutes les APIs sont-elles logguées?
     * @return {boolean}
     */
    get allLoggedIn(){
        return this.apis.find(api=>api.loggedIn===false) === undefined;
    }
    /**
     * Au moins une API est-elle connectée?
     * @return {boolean}
     */
    get oneLoggedIn(){
        return this.apis.find(api=>api.loggedIn===true) !== undefined;
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
                this.instances.push(new Instance().load(inst));
            }else{
                existing.load(inst);
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
    refresh(cb=()=>{}){
        console.log("refreshh")
        this.isLoading=true;
        this.apis.forEach((api)=>{
            api.getInstances((data)=>{
                this.isLoading=false;
                //this.instances=data.body.instances;
                this._setInstances(data.body.instances);
                cb();
            })
        })

    }
    /**
     * Pour créer une instance
     * @param instance
     * @param cb
     * @param cbError
     */
    create(instance,cb=()=>{},cbError=()=>{}){

        let superviseur={
            email:instance.email,
            userNom:instance.userNom,
            userPrenom:instance.userPrenom,
            userPwd:instance.userPwd,
        }

        window.$api.create(
            instance,
            (data)=>{
                this._setInstances(data.body.instances);
                window.$manager.selectedInstance=this._getInstance(
                    data.body.newInstance.href
                );
                window.$manager.selectedInstance.createSuperviseur(superviseur,
                    ()=>{
                        this.refresh();
                        cb();
                    },()=>{
                        cbError();
                    },
                    )

            },
            ()=>{
                this.refresh();
                cbError();
            }
        );
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
     * @param {Instance} instance
     * @param cb
     * @param cbError
     */
    updateVersion(instance,cb=()=>{},cbError=()=>{}){
        instance._isLoading=true;
        window.$api.updateVersion(
            instance,
            (data)=>{
                this._setInstances(data.body.instances);
                cb();
            },
            ()=>{
                window.$manager.errors.push(`Erreur ajax pour updateVersion de ${instance.server}`)
                instance._isLoading=false;
                //this.refresh();
                cbError();
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

    /**
     * Tatal des relevés additionnés
     * @return {number}
     */
    get totalReleves(){
        let t=0;
        this.instances.forEach((i)=>{
            t+=i.countReleves;
        })
       return t;
    }
    /**
     * Tatal des relevés additionnés
     * @return {number}
     */
    get totalHumains(){
        let t=0;
        this.instances.forEach((i)=>{
            t+=i.countHumains;
        })
       return t;
    }
    /**
     * Tatal des équipes additionnées
     * @return {number}
     */
    get totalEquipes(){
        let t=0;
        this.instances.forEach((i)=>{
            t+=i.countEquipes;
        })
       return t;
    }
    /**
     * Tatal des équipes additionnées
     * @return {number}
     */
    get totalTDR(){
        let t=0;
        this.instances.forEach((i)=>{
            t+=i.countTDR;
        })
       return t;
    }
    /**
     * Tatal des poids additionnées
     * @return {number}
     */
    get totalDirSize(){
        let t=0;
        this.instances.forEach((i)=>{
            t+=i.dirSize;
        })
       return t;
    }

}