import {default as axios} from "axios";

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
        this.countReleves=0
        this.lastReleve=""
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

    loadFromInstance(){
        // https://02.recap.tw/master/server/v/api/public-infos
        this.lastReleve=null;
        this.countReleves=null;
        let me=this;
        axios.post(`${this.server}/v/api/public-infos`,
            {},//{headers:h}
        )
            .then(function (response) {
                console.log("response",response)
                if(response.data.success){
                   me.lastReleve=response.data.json.lastReleve;
                   me.countReleves=response.data.json.countReleves;
                }
            })
            .catch(function (error) {
                console.error(error);
            })
            .then(function () {
                // always executed
            });
    }
}