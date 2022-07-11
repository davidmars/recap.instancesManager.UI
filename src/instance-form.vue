<template>
<div>
  <v-row>
    <v-col cols="4">
      <v-avatar tile color="#EEEEEE" size="300">
        <v-img :src="instance.hrefLogo" contain v-if="existe">
          <v-btn fab style="right: 10px;position: absolute;bottom: 10px;">
            <v-icon >mdi-cloud-upload</v-icon>
          </v-btn>
          <!-- HTML5 Input Form Elements -->
          <input class="fileupload-transparent"
              type="file" accept="image/*"
              name="fileupload"
              @change="upload"
          />
        </v-img>
      </v-avatar>

    </v-col>
    <v-col cols="8">
      <v-select
          v-if="!existe"
          label="Serveur"
          :items="$db.apis"
          item-text="name"
          return-object
          v-model="instance.imApi"
          filled
      ></v-select>
      <v-text-field
          autocomplete="new-password"
          label="Société"
          v-model="instance.societe"
          @input="modified=true"
          filled
      />
      <v-text-field
          autocomplete="new-password"
          label="Email client"
          :background-color="!existe?'#676':''"
          v-model="instance.email"
          @input="modified=true"
          filled
      />
      <template v-if="!existe">
        <v-text-field
            background-color="#676"
            autocomplete="new-password"
            label="Nom superviseur"
            v-model="instance.userNom"
            @input="modified=true"
            filled
        />
        <v-text-field
            background-color="#676"
            autocomplete="new-password"
            label="Prénom superviseur"
            v-model="instance.userPrenom"
            @input="modified=true"
            filled
        />
        <v-text-field
            background-color="#676"
            autocomplete="new-password"
            label="Mot de passe superviseur"
            v-model="instance.userPwd"
            @input="modified=true"
            filled
        />
      </template>

      <v-textarea
          autocomplete="new-password"
          filled
          label="Adresse"
          v-model="instance.adresse"
          @input="modified=true"
          rows="3"
      />
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="4">
      <v-select
          rounded
          label="Status"
          :background-color="$utils.statusToColor(instance.status)"
          v-model="instance.status"
          :items="[
          {
            value:'valid',
            text:$utils.statusToLabel('valid')
            },
          {
            value:'warning',
            text:$utils.statusToLabel('warning')
            },
          {
            value:'disabled',
            text:$utils.statusToLabel('disabled')
            },
          ]"
          @input="modified=true"
          filled
      />
      <v-switch
          label="Payant"
          color="success"
          v-model="instance.payant"
          @input="modified=true"
          filled
      />
    </v-col>


    <v-col cols="8">
      <v-textarea
          filled
          label="Warning"
          v-model="instance.warning"
          placeholder="Message à afficher..."
          @input="modified=true"
          auto-grow
      />
    </v-col>

    <v-col cols="4">
      <v-text-field
          filled
          label="Google Analytics"
          v-model="instance.googleAnalytics"
          @input="modified=true"
      />

      <!-- version et mise à jour-->
      <div v-if="existe" class="d-flex justify-space-between">
        Version
        <v-chip
            class="mx-5"
            small
            :color="isVersionOk?'':'error'">
          {{instance.version}}
        </v-chip>
        <v-btn

            zzzv-if="!isVersionOk"
            @click="updatingVersion=true;$db.updateVersion(
                instance,
                ()=>{
                  updatingVersion=false;
                },
                ()=>{
                  updatingVersion=false;
                },
            )"
            :loading="updatingVersion"
            color="error" small>
          Mettre à jour
        </v-btn>

      </div>
    </v-col>
    <v-col cols="8">
      <v-text-field
          filled
          label="Url du suivi client"
          placeholder="https://...."
          v-model="instance.urlSuivi"
          @input="modified=true"
      />
      <v-textarea
          solo
          label="Notes"
          auto-grow
          background-color="#FFFF99"
          color="#222222" light
          v-model="instance.notes"
          placeholder="..."
          @input="modified=true"
      />
    </v-col>

  </v-row>


  <v-row>
    <v-col cols="">

    </v-col>
    <v-col class="d-flex">
      <v-spacer/>
      <v-btn
          v-if="existe"
          :disabled="!modified"
          :loading="saving"
          @click="saving=true;$db.store(instance,()=>{
            modified=false;
            saving=false;
          })"
          color="success">Enregistrer</v-btn>
      <v-btn
          v-else
          :disabled="!modified || !instance.imApi"
          :loading="saving"
          @click="saving=true;$db.create(
              instance,
              ()=>{
                modified=false;
                saving=false;
              },
              ()=>{
                saving=false;
              }
          )"
          color="success">Créer</v-btn>
    </v-col>
  </v-row>

  <v-data-table
      v-if="instance.comptes"
      class="my-5"
      :items="instance.comptes"
      :items-per-page="-1"
      :headers="[
          {'value':'name',text:'Compte'},
          {'value':'email',text:'Email'},
          {'value':'issuperviseur',text:'Superviseur'},
          {'value':'etat',text:'État','width':200},
          ]"
      hide-default-footer
  >
    <template v-slot:item.issuperviseur="{ item }">
      <v-simple-checkbox
          :ripple="false"
          @input="instance.updateCompte(item);"
          v-model="item.issuperviseur"
         color="success"/>
    </template>
    <template v-slot:item.etat="{ item }">
      <v-select
          :background-color="$utils.statusToColor(item.etat)"
          hide-details
          @input="instance.updateCompte(item);"
          filled rounded dense
          v-model="item.etat"
          :items="[
            'en ligne',
            'brouillon',
            'archive'
            ]"
      />
    </template>
  </v-data-table>


  <v-data-table
      v-if="instance.admins"
      class="my-5"
      :items="instance.admins"
      :headers="[
          {'value':'email',text:'Administrateur'},
          ]"
      hide-default-footer
  >
  </v-data-table>

  <!--pre>{{instance}}</pre-->

</div>
</template>

<script>
export default {
  name: "instance-form",
  data:()=>{
    return{
      modified:false,
      saving:false,
      updatingVersion:false
    }
  },
  props:{
    instance:{
      type:Object
    }
  },
  computed:{
    existe(){
      return this.instance.version
    },
    isVersionOk(){
      return this.instance.version === this.$db.masterVersion;
    }
  },
  methods:{
    upload(a){
      let file=a.target.files[0];
      this.instance.uploadLogo(file);
    }
  }

}
</script>

<style lang="less">
.fileupload-transparent{
  left: 0;
  position: absolute;
  top:0px;
  width: 100%;
  height: 100%;
  opacity: 0;
}
</style>