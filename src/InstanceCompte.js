/**
 * Un compte sur une instance
 */
export default class InstanceCompte{
    constructor() {
        this.email=null;
        this.issuperviseur=null;
        this.name=null;
        this.etat=null;
    }

    /**
     *
     * @param json
     * @return {InstanceCompte}
     */
    load(json){
        Object.assign(this,json);
        return this;
    }
}