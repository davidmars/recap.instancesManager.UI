<template>
<div :title="date">
{{dateHuman}}<br>
{{dateAgo}}
</div>
</template>

<script>
export default {
  name: "cell-date",
  props:{
    date:{
      type:String
    }
  },
  computed:{
    dateObj(){
      let d=null;
      if(this.date){
        d= new Date(this.date.replace(" ","T")+"+02:00");
        if(isNaN(d.getMilliseconds())){
          d=null;
        }
      }
      return d;
    },
    dateHuman(){
      let d=this.dateObj;
      if(d===null){
        return  "..."
      }
      return window.$utils.date.format(d,"dd/MM/yyyy");
    },
    dateAgo(){
      let d=this.dateObj;
      if(d===null){
        return  "..."
      }
      console.log(this.date,d,new Date())
      let str=window.$utils.date.formatDistance(d,new Date(),{locale:"fr"});
      str=str.replace("environ ","");
      return str;
    }
  }
}
</script>

<style>

</style>