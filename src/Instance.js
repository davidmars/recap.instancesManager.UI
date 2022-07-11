import {default as axios} from "axios";
import InstanceCompte from "@/InstanceCompte";
import InstanceAdmin from "@/InstanceAdmin";

export default class Instance{
    constructor() {
        this.name=""
        this.server=""
        this.isValid=""
        this.hrefLogo=""
        this.societe=""
        this.email=""
        this.urlSuivi=""
        this.date=""
        this.status=""
        this.payant=""
        this.warning=""
        this.version=""

        this.dirSize=0;
        this.dirSizeDetails={
            cache: 0,
            db: 0,
            logs: 0,
            tmp: 0,
            trash: 0,
            uploads: 0
        }
        this.googleAnalytics=""
        this.notes=""

        //--------vient de l'instance en direct--------

        this.countReleves=0
        this.countHumains=0
        this.countEquipes=0
        this.countTDR=0
        this.lastReleve=""
        /**
         *
         * @type {InstanceCompte[]}
         */
        this.comptes=[];

        this._isLoading=false;
    }

    /**
     * Le nom du serveur
     * @return {String|string}
     */
    get serverName(){
        if(this.imApi){
            return this.imApi.name;
        }
        return "???";
    }
    /**
     * L'api Manager qui correspond au serveur de cette instance
     * @return {Api|null}
     */
    get imApi(){
        for(let api of window.$db.apis){
         if(this.server.indexOf(api.serverUrl)===0){
             return api;
         }
        }
        return null;
    }


    /**
     *
     * @param json
     * @return {Instance}
     */
    load(json){
        Object.assign(this,json);
        this.loadFromInstance();
        return this;
    }
    /**
     * Met à jour les données depuis l'instance
     */
    loadFromInstance(){
        if(!this.imApi){
            console.warn("no imApi",this.server);
            return;
        }
        this._isLoading=true;
        // https://02.recap.tw/master/server/v/api/public-infos
        this.lastReleve=null;
        this.countReleves=null;
        let me=this;
        axios.post(`${this.server}/v/im.api/public-infos`,
            {
                pwd:this.imApi.hashedPwd
            },//{headers:h}
        )
            .then(function (response) {
                me._isLoading=false;
                if(response.data.success){
                    const json=response.data.json;
                   me.lastReleve=json.lastReleve;
                   me.countReleves=json.countReleves;
                   me.countHumains=json.countHumains;
                   me.countEquipes=json.countEquipes;
                   me.countTDR=json.countTDR;
                   me.comptes=[];
                   me.admins=[];
                   if(json.comptes){
                       json.comptes.forEach((cpte)=>{
                           me.comptes.push(new InstanceCompte().load(cpte))
                       });
                   }
                    if(json.admins){
                        json.admins.forEach((admin)=>{
                            me.admins.push(new InstanceAdmin().load(admin))
                        });
                    }
                }
            })
            .catch(function (error) {
                console.error(error);
                window.$manager.errors.push(`Erreur ajax pour ${me.server}/v/im.api/public-infos`)
                me._isLoading=false;
            })
            .then(function () {
                // always executed
            });

    }

    /**
     * Créer un superviseur sur une instance
     * @param superviseurData
     * @param cb
     * @param cbError
     */
    createSuperviseur(superviseurData,cb,cbError){
        superviseurData.pwd=this.imApi.hashedPwd;
        axios.post(
            `${this.server}/v/im.api/create-superviseur`,
            superviseurData,
            //{headers:h}
        )
        .then(function (response) {
            console.log("response createSuperviseur",response)
            if(response.data.success){
                cb();
            }else{

                cbError();
            }
        })
        .catch(function (error) {
            console.error(error);
            cbError();
        })
        .then(function () {
            // always executed
        });
    }

    /**
     * Save -- Met à jour le compte (humain)
     * @param compteData
     * @param cb
     * @param cbError
     */
    updateCompte(compteData,cb=()=>{},cbError=()=>{}){
        let me=this;
        compteData.pwd=this.imApi.hashedPwd;
        this._isLoading=true;
        axios.post(
            `${this.server}/v/im.api/update-humain`,
            compteData,
            //{headers:h}
        )
        .then(function (response) {
            console.log("response update-humain",response)
            if(response.data.success){
                me.loadFromInstance();
                cb();
            }else{
                cbError();
            }
        })
        .catch(function (error) {
            console.error(error);
            cbError();
        })
        .then(function () {
            // always executed
        });
    }

    /**
     * Le nombre d'instances
     * @return {number}
     */
    get totalInstancesForEmail(){
        if(!this.email){
            return 0;
        }
        return window.$db.instances.filter(i=>i.email===this.email).length;
    }

    /**
     *
     * @param {File} file
     */
    uploadLogo(file){
        let me=this;
        console.log("upload file",file);
        this._isLoading=true;
        let formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);
        formData.append("pwd",this.imApi.hashedPwd)

        axios.post(`${this.server}/v/im.api/update-logo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(function (response) {
            if(response.data.success){
                window.$db.refresh(
                    function(){
                        me._isLoading=false;
                    }
                );
            }else{
                console.error(response.data.errors);
                response.data.errors.forEach((err=>{
                    window.$manager.errors.push(err)
                }))
                me._isLoading=false;
            }
        }).catch(function (error) {
                console.error(error);
                window.$manager.errors.push(`Erreur ajax pour ${me.server}/v/im.api/update-logo`)
                me._isLoading=false;
        })

    }


}