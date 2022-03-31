<template>
<div>
  <v-avatar tile color="#EEEEEE" size="200" class="my-5">
    <v-img
        aspect-ratio="1"
        contain
        :src="instance.hrefLogo"/>
  </v-avatar>

  <v-text-field
      label="Société"
      v-model="instance.societe"
      @input="modified=true"
      filled
  />
  <v-text-field
      label="Email client"
      v-model="instance.email"
      @input="modified=true"
      filled
  />
  <v-text-field
      filled
      label="Google Analytics"
      v-model="instance.googleAnalytics"
      @input="modified=true"
  />
  <v-textarea
      filled
      label="Adresse"
      v-model="instance.adresse"
      @input="modified=true"
  />
  <v-switch
      label="Payant"
      color="success"
      v-model="instance.payant"
      @input="modified=true"
      filled
  />
  <v-select
      label="Status"
      v-model="instance.status"
      :items="['valid','warning','disabled']"
      @input="modified=true"
      filled
      persistent-hint
      :hint="instance.status"
  />

  <v-textarea
      filled
      label="Warning"
      v-model="instance.warning"
      placeholder="Message à afficher si inactif"
      @input="modified=true"
  />
  <v-row>
    <v-col cols="">
      Version
      <v-chip
          class="mx-5"
          :color="isVersionOk?'':'error'">
        {{instance.version}}
      </v-chip>
      <v-btn
          v-if="!isVersionOk"
          @click="$db.updateVersion(instance)"
          color="error">Mettre à jour</v-btn>
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
      saving:false
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