<template>
  <v-app>

    <v-main>

      <!-- login -->
      <login-dialog/>

      <!-- erreurs -->
      <error-dialog/>

      <!-- popin detail-->
      <v-dialog
          overlay-color="#555"
          overlay-opacity="0.9"
          scrollable max-width="1000px"
          v-model="$manager.dialogOpen">
        <v-card dark v-if="$manager.selectedInstance" >
          <v-card-title>
            <div class="d-flex">
              {{ $manager.selectedInstance.name }}
              <v-btn text class="caption"
                     :href="$manager.selectedInstance.href"
                      :target="$manager.selectedInstance.href">
                {{ $manager.selectedInstance.href }}
              </v-btn>
            </div>

            <v-spacer/>
            <v-icon @click="$manager.dialogOpen=false;">mdi-close</v-icon>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="py-5">
            <instance-form
                :instance="$manager.selectedInstance"/>
          </v-card-text>
          <loading-layer v-if="$manager.selectedInstance._isLoading"/>
        </v-card>
      </v-dialog>

      <v-sheet dark height="100vh" >
          <v-data-table
              v-if="!$manager.displayLogin"
              class="the-table"
              @dblclick:row="clickRow"
              height="calc( 100vh - 80px - 85px)"
              fixed-header
              :headers="headers"
              :items="$db.instances"
              :search="search"
              :items-per-page="200"
              :footer-props="{
                'items-per-page-options': [50,100,200,500]
              }"
          >
            <!-- TOP ----------------------------------- -->
            <template v-slot:top>



              <div class="d-flex align-center pa-5 pl-0">

                <v-list dense shaped max-width="250" >
                  <v-list-item link @click="$manager._displayLogin=true;">
                    <v-list-item-content>
                      <v-list-item-title class="text-h6">
                        Serveurs
                        <span class="ml-2 grey--text">({{$db.apisConnected.length}}/{{$db.apis.length}})</span>
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        Instances
                        <span class="ml-2 grey--text">({{$db.instances.length}})</span>
                      </v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-icon>mdi-menu-down</v-icon>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>



                <!-- refresh-->
                <v-btn
                    fab class="mx-5" small
                    :loading="$db.isLoading"
                    @click="$db.refresh();">
                  <v-icon>mdi-sync</v-icon>
                </v-btn>
                <v-spacer/>
                <!--select colonnes-->
                <v-select
                    dense
                    class="mx-4"
                    style="max-width: 700px;"
                    v-model="headers"
                    :items="allHeaders"
                    item-text="text"
                    item-value="value"
                    label="Colonnes"
                    filled rounded
                    multiple
                    return-object
                    single-line
                    hide-details
                >
                  <template v-slot:selection="{ item, index }">
                    <span class="grey--text text-caption mr-4" v-if="index === 0">Afficher</span>
                    <v-chip v-if="index <= 3" x-small>
                      <span>{{ item.text }}</span>
                    </v-chip>
                    <span v-if="index === 4"
                          class="grey--text text-caption"
                    >
                      (+{{ headers.length - 4 }})
                    </span>
                  </template>
                </v-select>
                <!-- search-->
                <v-text-field
                    dense
                    v-model="search"
                    rounded filled single-line hide-details
                    append-icon="mdi-magnify" clearable
                    label="Rechercher"
                ></v-text-field>
                <!--nouvelle instance-->
                <v-btn class="ml-5" color="success" @click="ajouterInstance()">
                  <v-icon left>mdi-plus-circle</v-icon>
                  Nouvelle instance
                </v-btn>
              </div>
            </template>


            <!-- headers ----------------------------------- -->

            <!--header countReleves-->
            <template v-slot:header.countReleves="{ header }">
              <div>
                {{header.text}}
                <br>
                <code>{{$db.totalReleves}}</code>
              </div>
            </template>

            <!--header countHumains-->
            <template v-slot:header.countHumains="{ header }">
              <div>
                {{header.text}}
                <br>
                <code>{{$db.totalHumains}}</code>
              </div>
            </template>

            <!--header countEquipes-->
            <template v-slot:header.countEquipes="{ header }">
              <div>
                {{header.text}}
                <br>
                <code>{{$db.totalEquipes}}</code>
              </div>
            </template>

            <!--header countTDR-->
            <template v-slot:header.countTDR="{ header }">
              <div>
                {{header.text}}
                <br>
                <code>{{$db.totalTDR}}</code>
              </div>
            </template>

            <!--header dirSize-->
            <template v-slot:header.dirSize="{ header }">
              <div>
                {{header.text}}
                <br>
                <code>{{$utils.humanSize($db.totalDirSize)}}</code>
              </div>
            </template>

            <!-- colonnes ---------------------------------- -->

            <!--logo-->
            <template v-slot:item.hrefLogo="{ item }">
              <v-avatar tile color="#EEEEEE" size="100">
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
                <div class="text-no-wrap">
                  <v-icon color="success">mdi-check-circle</v-icon>
                  <v-btn class="numeric"
                         :target="item.href"
                         text :href="item.href">
                    {{item.href}}
                  </v-btn>
                </div>

              </template>
              <template v-else>
                <div class="subtitle-2 mb-3">{{item.name}}</div>
                <v-icon color="error">mdi-close-circle</v-icon>
              </template>
            </template>

            <!--contact email/adresse-->
            <template v-slot:item.email="{ item }">
              {{item.email}}
              <span class="ml-2 grey--text"
                    :title="`${item.totalInstancesForEmail} instances avec ce contact`"
                    x-small
                      v-if="item.totalInstancesForEmail>1">
                {{item.totalInstancesForEmail}}
              </span>
              <pre class="mt-2">{{item.adresse}}</pre>
            </template>

            <!--date-->
            <template v-slot:item.date="{ item }">
              <cell-date :date="item.date" />
            </template>

            <!--status-->
            <template v-slot:item.status="{ item }">
              <v-chip x-small
                      :color="$utils.statusToColor(item.status)">
                {{$utils.statusToLabel(item.status)}}</v-chip>
            </template>

            <!--payant-->
            <template v-slot:item.payant="{ item }">
              <v-chip x-small
                      :color="item.payant?'success':''">
                      {{item.payant?"payant":"gratuit"}}
              </v-chip>
            </template>

            <!--version-->
            <template v-slot:item.version="{ item }">
              <v-chip x-small
                      :color="item.version !== $db.masterVersion?'error':''">
                      {{item.version}}
              </v-chip>
            </template>

            <!--dernier relevé-->
            <template v-slot:item.lastReleve="{ item }">
              <cell-date :date="item.lastReleve" />
            </template>

            <!--comptes-->
            <template v-slot:item.countHumains="{ item }">
              <div>{{item.countHumains}}</div>
            </template>



            <!--dir size-->
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

            <!-- & url client-->
            <template v-slot:item.notes="{ item }">

              <v-btn v-if="item.urlSuivi"
                     class="mb-3"
                     small
                     color="success"
                    :target="item.urlSuivi"
                    :href="item.urlSuivi">
                <v-icon left>mdi-chart-box</v-icon>
                Suivi client

              </v-btn>

              <v-sheet
                  v-if="item.notes"
                  rounded color="#FFFF99" light class="pa-2">
                <pre>{{item.notes}}</pre>
              </v-sheet>
            </template>

          </v-data-table>
      </v-sheet>



    </v-main>

  </v-app>
</template>

<script>




import InstanceForm from "@/instance-form";
import ErrorDialog from "@/error-dialog";
import LoginDialog from "@/login-dialog";
import CellDate from "@/table/cell-date";
import LoadingLayer from "@/loading-layer";
export default {
  name: 'App',
  components: {LoadingLayer, CellDate, LoginDialog, ErrorDialog, InstanceForm},
  data: () => ({
    search:'',
    dialog:false,
    /**
     * @type {Instance}
     */
    selectedInstance:null,
    /**
     * Tous les headers (même ceux qu'on affiche pas)
     */
    allHeaders:[
      {
        text: 'Logo',
        align: 'start',
        sortable: true,
        value: 'hrefLogo',
        width: '100px',
        display:true,
      },
      {
        text: 'Société',
        align: 'start',
        sortable: true,
        value: 'societe',
        width: '350px',
        display:true,
      },
      {
        text: 'Contact', //email adresse
        align: 'start',
        sortable: true,
        value: 'email',
        width: '300px',
        display:true,
      },
      {
        text: 'Date d\'installation',
        align: 'start numeric',
        sortable: true,
        value: 'date',
        width: '100px',
        display:true,
      },
      {
        text: 'Serveur',
        align: 'start numeric',
        sortable: true,
        value: 'serverName',
        width: '100px',
        display:true,
      },
      {
        text: 'Status',
        align: 'start numeric',
        sortable: true,
        value: 'status',
        width: '100px',
        display:true,
      }, {
        text: 'Payant',
        align: 'start numeric',
        sortable: true,
        value: 'payant',
        width: '100px',
        display:true,
      },
      {
        text: 'Warning',
        align: 'start numeric',
        sortable: true,
        value: 'warning',
        width: '200px',
        display:true,
      },
      {
        text: 'Version',
        align: 'start numeric',
        sortable: true,
        value: 'version',
        width: '100px',
        display:true,
      },
      {
        text: 'Relevés',
        align: 'start numeric',
        sortable: true,
        value: 'countReleves',
        width: '100px',
        display:true,
      },
      {
        text: 'Dernier relevé',
        align: 'start numeric',
        sortable: true,
        value: 'lastReleve',
        width: '100px',
        display:true,
      },
      {
        text: 'Membres',
        align: 'start numeric',
        sortable: true,
        value: 'countHumains',
        width: '100px',
        display:true,
      },
      {
        text: 'Équipes',
        align: 'start numeric',
        sortable: true,
        value: 'countEquipes',
        width: '100px',
        display:true,
      },
      {
        text: 'Thématiques de risque',
        align: 'start numeric',
        sortable: true,
        value: 'countTDR',
        width: '100px',
        display:true,
      },
      {
        text: 'Taille',
        align: 'start numeric',
        sortable: true,
        value: 'dirSize',
        width: '200px',
        display:true,
      },
      {
        text: 'Analytics',
        align: 'start numeric',
        sortable: true,
        value: 'googleAnalytics',
        width: '200px',
        display:true,
      },
      {
        text: 'Notes',
        align: 'start',
        sortable: false,
        value: 'notes',
        zzzwidth: '200px',
        display:true,
      }
    ]
  }),
  mounted() {
    //en fonction du local storage quel header masquer ou montrer
    for(let i=0;i<this.allHeaders.length;i++){
      this.allHeaders[i].display=this.$utils.ls.getBool( this.allHeaders[i].value,this.allHeaders[i].display);
    }
  },
  computed:{
    /**
     * Les headers à afficher
     * @return {[]}
     */
    headers:{
      get:function(){
        return this.allHeaders.filter(h=>h.display===true);
      },
      set:function(headers){
        console.log("set headers",headers);
        for(let i=0;i<this.allHeaders.length;i++){
          if(headers.find(h=>h.value===this.allHeaders[i].value)){
            this.allHeaders[i].display=true;
            this.$utils.ls.setBool(this.allHeaders[i].value,true)
          }else{
            this.allHeaders[i].display=false;
            this.$utils.ls.setBool(this.allHeaders[i].value,false)
          }
        }
      },
    },
  },
  watch:{
    dialog(){
      if(this.dialog === false){
        this.selectedInstance=false;
      }
    }
  },
  methods:{
    clickRow(event,line){
      const instance=line.item;
      this.$manager.selectedInstance=instance;
      this.$manager.dialogOpen=true;
    },
    ajouterInstance(){
      let instance={};
      this.$manager.selectedInstance=instance;
      this.$manager.dialogOpen=true;
    }
  }
};
</script>
<style lang="less">
html{
  overflow-y: auto;
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(128, 128, 128,0.5);
    border-radius: 20px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(255, 0, 0, 0);

  }

}
#app{
  .numeric{
    font-size: 11px;
    font-family: 'Roboto Mono', monospace !important;
  }
  .the-table{
    td,th{
      vertical-align: top;
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
}
</style>
