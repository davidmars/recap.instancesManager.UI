<template>
  <v-dialog
      v-model="$manager.displayLogin"
      persistent
      max-width="400"
  >      <v-card>
    <v-card-title class="text-h6">
      Identification {{$manager.displayLogin}}
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
              <v-btn rounded color="primary" type="submit">
                <v-icon>mdi-keyboard-return</v-icon>
              </v-btn>
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