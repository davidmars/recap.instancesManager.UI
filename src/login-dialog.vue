<template>
  <v-dialog
      v-model="$manager.displayLogin"
      persistent
      max-width="400"
  >      <v-card>
    <v-card-title class="text-h6">
      Connexion
      <v-spacer/>
      <!-- on peut virer la fenêtre si au moin un serveur est logué-->
      <v-icon
          v-if="$db.oneLoggedIn"
          @click="$manager._displayLogin=false;">mdi-close</v-icon>
    </v-card-title>
    <v-divider/>
    <v-card-text>
    <v-form
        class="pt-5"
        v-for="api in $db.apis" :key="api.apiUrl"
        @submit.prevent="()=>{api.login()}">
          <v-text-field
              v-model="api.cleanPwd"
              :label="api.apiUrl"
              placeholder="******"
              persistent-hint
              :hint="api.loggedIn?`Connecté: ${api.totalInstances} instances / ${$utils.humanSize(api.totalDirSize)}`:null"
              :error-messages="api.loggedIn?null:'Non connecté'"
              type="password">
            <template v-slot:append-outer>
              <v-switch color="success" v-model="api.loggedIn" :key="api.vueKey"/>
            </template>
          </v-text-field>
    </v-form>
    </v-card-text>
  </v-card>
  </v-dialog>

</template>

<script>
export default {
  name: "login-dialog",
  methods:{
    /**
     *
     * @param {Api} api
     */
    change(a,b){
      console.log(a,b)
    }
  }
}
</script>

<style scoped>

</style>