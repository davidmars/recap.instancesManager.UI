<template>
  <v-dialog
      v-model="$manager.hasErrors"
      persistent
      max-width="290"
  >
    <v-card>
      <v-card-title class="text-h6">
        Oups...
      <v-spacer/>
        <v-chip x-small color="error">{{$manager.errors.length}}</v-chip>
      </v-card-title>
      <v-card-text>{{$manager.error}}</v-card-text>
      <v-divider/>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="error"
            text
            @click="$manager.killError()"
        >
          compris
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "error-dialog"
}
</script>
