const axios = require('axios').default;
const md5 = require('md5');
export default class Api{
    /**
     *
     * @param {String} serverUrl Url du serveur
     */
    constructor(serverUrl) {
        this.serverUrl=serverUrl;
        this.apiUrl=serverUrl+"/im.api/api";
        this.cleanPwd=window.$utils.ls.getString(`${this.apiUrl}-pwd`);
        this.loggedIn=false;
        /**
         * Fonction à appeler après un login
         * @type {null}
         */
        this.onLoginCB=null;
        if(this.cleanPwd){
            this.login();
        }
    }

    /**
     * Nom du server
     * @return {*}
     */
    get name(){
        return this.serverUrl.replace("https://","");
    }

    /**
     * Le mot de passe hashé
     * @return {string}
     */
    get hashedPwd(){
        return md5(this.cleanPwd);
    }

    /**
     * Sauvegarde le pwd en local storage
     * @private
     */
    saveCleanPwd(){
        window.$utils.ls.setString(`${this.apiUrl}-pwd`,this.cleanPwd);
    }
    /**
     * Reset le pwd en local storage
     * @private
     */
    resetCleanPwd(){
        window.$utils.ls.remove(`${this.apiUrl}-pwd`);
    }

    _manageResponse(response,cbSuccess,cbError){
        //console.log(response.data);
        if(response.data){
            if(!response.data.success){
                console.error('api error',response.data);
                response.data.errors.forEach((err)=>{
                    console.log("ok");
                    window.$manager.errors.push(err.message);
                });
                cbError(response.data);
            }else{
                cbSuccess(response.data);
            }
        }else{
            console.error('api CORE error',response);
            cbError(response.data);
        }
    }

    _call(action,params,cbSuccess,cbError=function(){}){
        let me=this;
        params.pwd=md5(this.cleanPwd);
        axios.post(`${this.apiUrl}/${action}`,
            params,//{headers:h}
        )
        .then(function (response) {
            me._manageResponse(response,cbSuccess,cbError);
        })
        .catch(function (error) {
            console.error("api action",error);
            cbError(error);
        })
        .then(function () {
            // always executed
        });
    }
    login(cb,cbError){
        this._call("get/login",{},
            ()=>{
                //ok on est logué
                this.loggedIn=true;
                //on save le pwd en LS
                this.saveCleanPwd();
                window.$db.refreshServer(this,)
            },
            ()=>{
                this.resetCleanPwd();
                cbError();
            }
        );
    }
    getInstances(cb,cbError){
        this._call("get/instances",{
        },cb,cbError);
    }
    store(instance,cb,cbError){
        this._call("set/store-instance",{
            instance:instance
        },cb,cbError);
    }
    create(instance,cb,cbError){
        this._call("set/create-instance",{
            societe:instance.societe,
            email:instance.email,
            userNom:instance.userNom,
            userPrenom:instance.userPrenom,
            userPwd:instance.userPwd,
            instance:instance
        },cb,cbError);
    }
    updateVersion(instance,cb,cbError){

        this._call("set/update-version",{
            instance:instance
        },cb,cbError);
    }





}