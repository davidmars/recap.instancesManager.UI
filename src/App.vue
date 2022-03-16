<template>
  <v-app>

    <v-main>

      <!-- popin detail-->
      <v-dialog
          scrollable max-width="1000px"
          v-model="dialog">
        <v-card dark v-if="selectedPlayer">
          <v-card-title class="text-h5">
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{selectedPlayer.name}}</v-list-item-title>
                  <v-list-item-subtitle>{{selectedPlayer.email}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-spacer/>
            <v-icon @click="dialog=false;">mdi-close</v-icon>
          </v-card-title>
          <v-card-text>
            <v-divider></v-divider>
            <player-details :player="selectedPlayer"/>
          </v-card-text>

        </v-card>
      </v-dialog>

      <v-sheet dark>
        <v-container fluid>
          <v-card-title>
            Instances
            <v-spacer></v-spacer>
            <v-btn
                fab class="mx-5" small
                :loading="$db.isLoading"
                @click="$db.refresh();">
              <v-icon>mdi-sync</v-icon>
            </v-btn>

            <!-- search-->
            <v-text-field
                v-model="search"
                rounded filled
                clearable
                append-icon="mdi-magnify"
                label="Rechercher"
                single-line
                hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
              :headers="headers"
              :items="$db.instances"
              :search="search"
              :items-per-page="200"
              :footer-props="{
                'items-per-page-options': [50,100,200,500]
              }"
              dense
          >
            <!--logo-->
            <template v-slot:item.hrefLogo="{ item }">
              <v-avatar tile color="#EEEEEE" size="100" class="my-5">
                <v-img
                    aspect-ratio="1"
                    contain
                    :src="item.hrefLogo"/>
              </v-avatar>
            </template>

            <!--société-->
            <template v-slot:item.societe="{ item }">
              <template v-if="item.isValid">
                <div class="subtitle-2 mb-3">{{item.societe}}</div>
                <v-icon color="success">mdi-check-circle</v-icon>
                <v-btn class="numeric"
                       :target="item.href"
                       text :href="item.href">
                  {{item.href}}
                </v-btn>
              </template>
              <template v-else>
                <div class="subtitle-2 mb-3">{{item.name}}</div>
                <v-icon color="error">mdi-close-circle</v-icon>
              </template>
            </template>

            <template v-slot:item.version="{ item }">
              <v-chip x-small
                      :color="item.version !== $db.masterVersion?'error':''">{{
                  item.version
                }}</v-chip>
            </template>


            <template v-slot:item.dirSize="{ item }">
              <div class="d-flex justify-space-between mb-2">
                <div>Total</div>
                <div>{{$utils.humanSize(item.dirSize)}}</div>
              </div>
              <div v-for="(value, name) in item.dirSizeDetails"
                :key="name"
                 class="d-flex justify-space-between">
                <div>{{name}}</div>
                <div>{{$utils.humanSize(value)}}</div>
              </div>


            </template>

            <template v-slot:item.actions="{ item }">
              <v-btn color="yellow" light @click.prevent="details(item)">Details</v-btn>
            </template>
          </v-data-table>
        </v-container>
      </v-sheet>



    </v-main>

  </v-app>
</template>

<script>



import PlayerDetails from "@/player-details";
export default {
  name: 'App',
  components: {PlayerDetails},
  data: () => ({
    search:'',
    dialog:false,
    selectedPlayer:null
  }),
  computed:{
    headers() {
      return [
        {
          text: 'Logo',
          align: 'start',
          sortable: true,
          value: 'hrefLogo',
          width: '100px'
        },
        {
          text: 'Société',
          align: 'start',
          sortable: true,
          value: 'societe',
          width: '400px'
        },
        {
          text: 'Date',
          align: 'start numeric',
          sortable: true,
          value: 'date',
          width: '200px'
        },
        {
          text: 'Version',
          align: 'start numeric',
          sortable: true,
          value: 'version',
          width: '200px'
        },
        {
          text: 'Taille',
          align: 'start numeric',
          sortable: true,
          value: 'dirSize',
          width: '200px'
        },
        {
          text: 'Analytics',
          align: 'start numeric',
          sortable: true,
          value: 'googleAnalytics',
          zzwidth: '200px'
        },
        {
          text: '...',
          value: 'actions',
          sortable: false,
          width: '200px'
        },
      ]
    }
  },
  watch:{
    dialog(){
      if(this.dialog === false){
        this.selectedPlayer=false;
      }
    }
  },
  methods:{
    details(player){
      this.selectedPlayer=player;
      this.dialog=true;
      console.log(player)
    }
  }
};
</script>
<style lang="less">
#app{
  .numeric{
    font-size: 11px;
    font-family: 'Roboto Mono', monospace !important;
  }
}
</style>
