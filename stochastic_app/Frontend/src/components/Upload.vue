<template>
  <div id="app">
    <p style="font-size: 22px">File upload</p>
    <p />
    <v-file-input
      dense
      outlined
      clearable
      id="finput"
      accept="*"
      label="File input"
      v-model="currentFile"
      @change="selectFile"
    ></v-file-input>
    <v-radio-group id="radio" v-model="radios" dense row mandatory>
      <v-radio label="Problem" value="problem" checked></v-radio>
      <v-radio label="Algorithm" value="algorithm"></v-radio>
    </v-radio-group>
    <v-btn class="mr-4" @click="upload"> upload </v-btn><br />
    <v-alert v-if="message" color="blue lighten-4" style="margin-top: 10px">
      {{ message }}
    </v-alert>
    <p style="font-size: 22px; margin-top: 10px">Configure the variables</p>
    <p />
    <v-select
      :items="problemInfos"
      item-text="name"
      label="Problem"
      dense
      clearable
      v-model="problem"
    ></v-select>
    <v-select
      :items="algoInfos"
      item-text="name"
      label="Algorithm"
      dense
      clearable
      v-model="algorithm"
    ></v-select>
    <v-row>
      <v-col cols="3" sm="4">
        <v-text-field
          type="number"
          max="10"
          min="1"
          label="MaxNFES"
          value="100"
          v-model="maxNFES"
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="3" sm="4">
        <v-text-field
          type="number"
          max="10000"
          min="1"
          label="Population"
          value="200"
          v-model="population"
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="3" sm="4">
        <v-text-field
          label="Total runs"
          value="10"
          type="number"
          v-model="runs"
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" sm="4">
        <v-text-field
          type="number"
          max="10"
          min="1"
          label="Mutation factor"
          value="0.5"
          v-model="mutationFactor"
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="3" sm="4">
        <v-text-field
          type="number"
          max="1"
          min="0"
          label="Crossover"
          value="0.8"
          v-model="crossoverFactor"
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="3" sm="4">
        <v-text-field
          type="number"
          label="Stop value"
          value="-10"
          hint="1 to the power of stop value"
          v-model="stopValue"
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" sm="4">
        <v-text-field
          type="number"
          label="Bounds min"
          value="-100"
          v-model="boundsMin"
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="3" sm="4">
        <v-text-field
          type="number"
          label="Bounds max"
          value="100"
          v-model="boundsMax"
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="3" sm="4">
        <v-text-field
          label="Dimensions"
          value="2"
          type="number"
          v-model="dimensions"
          clearable
        ></v-text-field>
      </v-col>
    </v-row>
    <v-alert v-if="messagePost" color="blue lighten-4" style="margin-top: 10px">
      {{ messagePost }}
    </v-alert>
    <v-btn class="mr-4" color="success" @click="submit"> post </v-btn>
  </div>
</template>

<style scoped>
#app {
  margin: auto;
  margin-top: 30px;
  padding: 20px;
  width: 450px;
  border: solid black 1px;
}

#card {
  margin-top: 10px;
  margin-left: auto;
  margin-right: auto;
  width: 300px;
}
#row {
  width: 300px;
}
</style>
<script>
import UploadFilesService from "../services/UploadFilesService";
import UploadService from "../services/UploadFilesService";
export default {
  name: "Upload",
  mounted() {
    UploadService.checkPerms(localStorage.getItem("token"))
      .then(() => {})
      .catch((err) => {
        console.log(err.message), this.$router.push({ name: "Entry" });
      });

    UploadService.getProblems(localStorage.getItem("token"))
      .then((response) => {
        this.problemInfos = response.data;
      })
      .catch((err) => {
        console.log(err.message);
      });

    UploadService.getAlgos(localStorage.getItem("token"))
      .then((response) => {
        this.algoInfos = response.data;
      })
      .catch((err) => {
        console.log(err.message);
      });
  },
  methods: {
    selectFile(file) {
      this.currentFile = file;
    },
    upload() {
      if (!this.currentFile) {
        this.message = "Please select a file!";
        return;
      }

      this.message = "";
      UploadService.upload(
        this.currentFile,
        this.radios,
        localStorage.getItem("token")
      )
        .then((response) => {
          this.message = response.data.message;
          if (this.radios == "problem") {
            return UploadService.getProblems(localStorage.getItem("token"));
          } else if (this.radios == "algorithm") {
            return UploadService.getAlgos(localStorage.getItem("token"));
          }
        })
        .then((files) => {
          if (this.radios == "problem") {
            this.problemInfos = files.data;
          } else if (this.radios == "algorithm") {
            this.algoInfos = files.data;
          }
          this.currentFile = null;
        })
        .catch((e) => {
          console.log(e.message);
          this.message = "Could not upload the file!";
          this.currentFile = null;
        });
    },
    submit() {
      if (
        !this.problem ||
        !this.algorithm ||
        !this.maxNFES ||
        !this.population ||
        !this.runs ||
        !this.mutationFactor ||
        !this.crossoverFactor ||
        !this.stopValue ||
        !this.boundsMin ||
        !this.boundsMax ||
        !this.dimensions
      ) {
        this.messagePost = "Missing parameters";
        return;
      }
      let obj = {
        problem: this.problem,
        algorithm: this.algorithm,
        maxNFES: this.maxNFES,
        population: this.population,
        runs: this.runs,
        mutationFactor: this.mutationFactor,
        crossoverFactor: this.crossoverFactor,
        stopValue: this.stopValue,
        boundsMin: this.boundsMin,
        boundsMax: this.boundsMax,
        dimensions: this.dimensions,
      };
      console.log(obj);
      UploadFilesService.createTest(obj, localStorage.getItem("token"))
        .then((response) => {
          console.log(response);
          this.messagePost = response.data.message;
        })
        .catch((err) => {
          this.messagePost = err.message;
          console.log(err.message);
        });
    },
  },
  data: () => ({
    currentFile: null,
    message: "",
    messagePost: "",
    radios: "",
    algoInfos: [],
    problemInfos: [],
    problem: null,
    algorithm: null,
    maxNFES: null,
    population: null,
    runs: null,
    mutationFactor: null,
    crossoverFactor: null,
    stopValue: null,
    boundsMin: null,
    boundsMax: null,
    dimensions: null,
  }),
};
</script>