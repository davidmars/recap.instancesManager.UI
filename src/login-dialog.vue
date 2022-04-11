<template>
  <v-dialog
      v-model="$manager.displayLogin"
      persistent
      max-width="400"
  >      <v-card>
    <v-card-title class="text-h6">
      Identification
      <v-spacer/>
      <v-icon @click="$manager._displayLogin=false;">mdi-close</v-icon>
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
              :success-messages="api.loggedIn?'Connecté':null"
              :error-messages="api.loggedIn?null:'Non connecté'"
              type="password">
            <template v-slot:append-outer>
              <template v-if="api.loggedIn">
                <v-btn rounded color="error" fab small @click="api.logout()">
                  <v-icon>mdi-logout</v-icon>
                </v-btn>
              </template>
              <template v-else>
                <v-btn rounded color="primary" type="submit" fab small>
                  <v-icon>mdi-keyboard-return</v-icon>
                </v-btn>
              </template>

            </template>
          </v-text-field>
    </v-form>
    </v-card-text>
  </v-card>
  </v-dialog>

</template>

<script>
export default {
  name: "login-dialog"
}
</script>

<style scoped>

</style>