const axios = require('axios').default;
const md5 = require('md5');
export default class Api{
    /**
     *
     * @param {String} apiUrl Url point d'entrée de l'API serveur
     */
    constructor(apiUrl) {
        this.apiUrl=apiUrl;
        this.cleanPwd=localStorage.getItem("pwd");
    }

    _manageResponse(response,cbSuccess,cbError){
        console.log(response.data);
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
            console.error(error);
            cbError(error);
        })
        .then(function () {
            // always executed
        });
    }
    login(cb,cbError){
        this._call("get/login",{},
            ()=>{
            window.$manager.loggedIn=true;
            window.$db.refresh()
            localStorage.setItem("pwd",this.cleanPwd);
            },
            ()=>{
                localStorage.removeItem("pwd");
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