export default class Db{
    constructor() {
        this.instances=[];
        this.refresh();
        this.isLoading=false;
        this.masterVersion=null;

    }
    refresh(){
        let me=this;
        me.isLoading=true;
        window.$api.getInstances(function(data){
            me.isLoading=false;
            me.instances=data.body.instances;
            me.masterVersion=me.getMaster().version;
        })
    }
    save(item){
        let me=this;
        window.$api.store(
            item,
            function(){
                me.refresh();
            }
        )
    }

    /**
     *
     * @return {T}
     */
    getMaster(){
        return this.instances.find(i=> i.name==="master" );
    }
}