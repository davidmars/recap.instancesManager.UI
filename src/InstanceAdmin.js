/**
 * Un compte admin sur une instance
 */
export default class InstanceAdmin{
    constructor() {
        this.email=null;
    }

    /**
     *
     * @param json
     * @return {InstanceAdmin}
     */
    load(json){
        Object.assign(this,json);
        return this;
    }
}