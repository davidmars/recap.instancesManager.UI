<template>
  <v-dialog
      v-model="$manager.displayLogin"
      persistent
      max-width="290"
  >
    <v-form @submit.prevent="()=>{$api.login()}">
      <v-card>
        <v-card-title class="text-h6">
          Identification
        </v-card-title>
        <v-card-text>
          <v-text-field
              v-model="$api.cleanPwd"
              label="mot de passe"
              append-icon=""
              hide-details
              placeholder="******"
              type="password"/>
        </v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              type="submit"
              text
          >
            Connexion
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>

</template>

<script>
export default {
  name: "login-dialog",
  mounted(){
    if(window.$api.cleanPwd){
      window.$api.login(()=>{},()=>{
        setTimeout(()=>{
          window.$api.cleanPwd="";
          this.$manager.errors=[]
        },100)

      });
    }
  }
}
</script>

<style scoped>

</style>