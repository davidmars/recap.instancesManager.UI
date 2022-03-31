const axios = require('axios').default;
export default class Api{
    /**
     *
     * @param {String} apiUrl Url point d'entrée de l'API serveur
     */
    constructor(apiUrl) {
        this.apiUrl=apiUrl;
    }

    _manageResponse(response,cbSuccess,cbError){
        console.log(response.data);
        if(response.data){
            if(!response.data.success){
                console.error('api error',response.data);
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
        params.pwd="15468971";
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

    getInstances(cb,cbError){
        this._call("get/instances",{
        },cb,cbError);
    }
    store(instance,cb,cbError){
        this._call("set/store-instance",{
            instance:instance
        },cb,cbError);
    }
    updateVersion(instance,cb,cbError){
        this._call("set/update-version",{
            instance:instance
        },cb,cbError);
    }





}