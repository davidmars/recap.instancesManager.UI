<template>
<div>
  <v-row>
    <v-col cols="4">
      <v-avatar tile color="#EEEEEE" size="300" >
        <v-img :src="instance.hrefLogo" contain/>
      </v-avatar>
    </v-col>
    <v-col cols="8">
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
          v-model="instance.email"
          @input="modified=true"
          filled
      />
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
      />
    </v-col>

    <v-col cols="4">
      <v-text-field
          filled
          label="Google Analytics"
          v-model="instance.googleAnalytics"
          @input="modified=true"
      />
      <div class="d-flex justify-space-between">
        Version
        <v-chip
            class="mx-5"
            small
            :color="isVersionOk?'':'error'">
          {{instance.version}}
        </v-chip>

        <v-btn
            small
            v-if="!isVersionOk"
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
            color="error">
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
          :disabled="!modified"
          @click="saving=true;$db.store(instance,()=>
          {
            modified=false;
            saving=false;
          }
          )"
          :loading="saving"
          color="success">Enregistrer</v-btn>
    </v-col>
  </v-row>
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
    isVersionOk(){
      return this.instance.version === this.$db.masterVersion;
    }
  }

}
</script>

<style scoped>

</style>