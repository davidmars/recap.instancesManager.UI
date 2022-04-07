import {default as axios} from "axios";
import InstanceCompte from "@/InstanceCompte";
const md5 = require('md5');

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
        // https://02.recap.tw/master/server/v/api/public-infos
        this.lastReleve=null;
        this.countReleves=null;
        let me=this;
        axios.post(`${this.server}/v/im.api/public-infos`,
            {
                pwd:md5(window.$api.cleanPwd)
            },//{headers:h}
        )
            .then(function (response) {
                console.log("response",response)
                if(response.data.success){
                    const json=response.data.json;
                   me.lastReleve=json.lastReleve;
                   me.countReleves=json.countReleves;
                   me.countHumains=json.countHumains;
                   me.countEquipes=json.countEquipes;
                   me.countTDR=json.countTDR;
                   me.comptes=[];
                   if(json.comptes){
                       json.comptes.forEach((cpte)=>{
                           me.comptes.push(new InstanceCompte().load(cpte))
                       });
                   }

                }
            })
            .catch(function (error) {
                console.error(error);
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
        superviseurData.pwd=md5(window.$api.cleanPwd);
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
     * Met à jour le compte (humain)
     * @param compteData
     * @param cb
     * @param cbError
     */
    updateCompte(compteData,cb=()=>{},cbError=()=>{}){
        let me=this;
        compteData.pwd=md5(window.$api.cleanPwd);
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
}