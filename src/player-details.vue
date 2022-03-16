<template>
<div>
  <div v-if="details" class="pa-4">

    <v-row>
      <v-col cols="4">

        <label class="white--text">Score</label>
        <div class="numeric subtitle-1 mb-5">{{$utils.numFmt(player.points)}} pts</div>


        <label class="white--text">Classement</label>
        <div class="numeric subtitle-1 mb-5">{{$utils.numFmt(player.classementClean)}}</div>


        <label class="white--text">Vitesse maximum</label>
        <div class="numeric subtitle-1"
        :style="{
          color:colorSpeed(details.vitesseMax)
        }"
        >{{$utils.numFmt(details.vitesseMax)}} Km/h</div>

      </v-col>
      <v-col cols="2">
        <v-switch
            label="Tricheur"
            v-model="player.triche" color="red" hide-details
            @change="$db.save(player)"
        />
        <v-switch
            label="Espionner"
            v-model="player.up" color="red"
            @change="$db.save(player)"
        />
      </v-col>
      <v-col cols="2">

        <v-text-field
            label="Bonus"
            filled
            v-model="player.bonus"
            @change="$db.save(player)"
            type="number"></v-text-field>
      </v-col>
      <v-col cols="4">
        <v-textarea
            class="mx-n3 elevation-0"
            label="notes"
            rows="1"
            auto-grow
            filled hide-details
            v-model="player.notes"
            @change="$db.save(player)" />
      </v-col>

    </v-row>

    <hr class="my-5">

    <h4 class="my-5">Catches</h4>

    <v-data-table
        :items="details.lines"
        :headers="headers"
        :items-per-page="-1"
        dense
    >
      <template v-slot:item.img="{ item }">
              <v-img v-if="item.img" height="80" width="80" contain class="my-2"
                     :src="photoUrl(item.img)"
              />
      </template>
      <template v-slot:item.kmh="{ item }">
              <span
                  :style="{
                    color:colorSpeed(item.kmh)
                  }">
                {{$utils.numFmt(item.kmh)}}
              </span> <span style="opacity:0.5">km/h</span>
      </template>
      <template v-slot:item.distance="{ item }">
              <span>
                {{$utils.numFmt(item.distance)}}
              </span> <span style="opacity:0.5">m</span>
      </template>
      <template v-slot:item.temps="{ item }">
              <span>
                {{$utils.numFmt(item.temps)}}
              </span> <span style="opacity:0.5"> sec</span>
      </template>
    </v-data-table>

    <hr class="my-5">

    <v-row>
      <v-col cols="3" v-for="p of details.photos" :key="p">
        <v-img min-width="100" min-height="100" contain :src="photoUrl(p)" class="elevation-10"/>
      </v-col>
    </v-row>



  </div>
  <!--
  <pre class="">{{player}}</pre>
  <pre>{{details}}</pre>
  -->
</div>
</template>

<script>
export default {
  name: "player-details",
  data:function(){
    return{
      details:null,
      headers:[
        {
          text: 'img',
          align: 'start',
          sortable: true,
          value: 'img',
        },
        {
          text: 'Quand ?',
          align: 'start numeric text-no-wrap',
          sortable: true,
          value: 'moment',
        },
        {
          text: 'Temps entre les catchs',
          align: 'start numeric',
          sortable: true,
          value: 'temps',
        },
        {
          text: 'Distance',
          align: 'start numeric',
          sortable: true,
          value: 'distance',
        },

        {
          text: 'Vitesse',
          align: 'start numeric',
          sortable: true,
          value: 'kmh',
        },
        {
          text: 'Dept',
          align: 'start numeric',
          sortable: true,
          value: 'departement',
        },
        {
          text: 'Géo',
          align: 'start numeric',
          sortable: true,
          value: 'latlng',
        },
      ]
    }
  },
  props:{
    player:{
      type:Object
    }
  },
  mounted() {
    let me=this;
    this.$api.details(this.player,function(data){
      me.details=data.body
    })
  },
  methods:{
    photoUrl(p){
      return this.$api.im(this.player,p);
    },
    auth(){
      this.$utils.winOpen(this.photoUrl(this.details.photos[0]))
    },
    colorSpeed(kmh){
      switch (true){
        case kmh>400:
          return "#FF0000";
        case kmh>200:
          return "#FF8800";
        case kmh>100:
          return "#BBAA33";
        case kmh>80:
          return "#5b6956";
        default:
          return "#00FF00";
      }
    }
  }
}
</script>

<style scoped>

</style>