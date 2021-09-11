<template>
  <v-app id="app">
    <v-app-bar app color="primary" dark>
      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            @click="
              () => {
                this.$router.push({ name: 'Contribute' });
              }
            "
          >
            <v-list-item-title>Contribute</v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="
              () => {
                this.$router.push({ name: 'Upload' });
              }
            "
          >
            <v-list-item-title>Upload test</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-toolbar-title>Stochastic algorithm testing</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="this.$route.name!='Entry'" right color="error" @click="logout">Logout</v-btn>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
      <router-view name="dialog"></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "app",
  data: () => ({ drawer: null }),
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push({ name: "Entry" });
    },
  },
};
</script>
