<template>
  <div id="app">
    <v-row style="margin-top: 10px">
      <v-col v-for="t in tests" :key="t._id">
        <v-card class="mx-auto" id="card" max-width="344" outlined>
          <v-card-text>
            <div class="text--primary">
              Problem:<b> {{ t.problem }}</b>
            </div>
            <div class="text--primary">
              Algorithm: <b>{{ t.algorithm }}</b>
            </div>
            <div class="text--primary">
              Total runs: <b>{{ t.runs }}</b>
            </div>
            <div class="text--primary">
              Runs completed: <b>{{ t.doneRuns }}</b>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn outlined text dense color="info" @click="contribute(t)">
              Contribute
            </v-btn>
          </v-card-actions>
          <v-alert v-if="runMessage&&t._id==contId" color="blue lighten-4" style="margin-top: 10px">
      {{ runMessage }}
    </v-alert>
        </v-card>
      </v-col>
    </v-row>
    <v-overlay :value="overlay"></v-overlay>
  </div>
</template>

<style scoped>
#app {
  margin: auto;
  margin-top: 30px;
  padding: 10px;
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
import UploadService from "../services/UploadFilesService";
export default {
  name: "Contribute",
  mounted() {
    UploadService.checkPerms(localStorage.getItem("token"))
      .then(() => {})
      .catch((err) => {
        console.log(err.message), this.$router.push({ name: "Entry" });
      });

    UploadService.getAlgos(localStorage.getItem("token"))
      .then((response) => {
        this.algos = response.data;
        this.algos.forEach((element) => {
          UploadService.get(element.url, localStorage.getItem("token"))
            .then((response) => {
              console.log(response);
              //Create script tag with algorithm function
              let plugin = document.createElement("script");
              plugin.id = element.function;
              plugin.setAttribute("type", "application/javascript");
              plugin.text = response.data;
              document.head.appendChild(plugin);
            })
            .catch((err) => {
              console.log(err.message);
            });
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
    UploadService.getProblems(localStorage.getItem("token"))
      .then((response) => {
        this.problems = response.data;
        this.problems.forEach((element) => {
          UploadService.get(element.url, localStorage.getItem("token"))
            .then((response) => {
              console.log(response);
              //Create script tag with problem function
              let plugin = document.createElement("script");
              plugin.id = element.function;
              plugin.setAttribute("type", "application/javascript");
              plugin.text = response.data;
              document.head.appendChild(plugin);
            })
            .catch((err) => {
              console.log(err.message);
            });
        });
      })
      .catch((err) => {
        console.log(err.message);
      });

    UploadService.getTests(localStorage.getItem("token"))
      .then((response) => {
        console.log(response);
        this.tests = response.data.tests;
      })
      .catch((err) => {
        console.log(err.message);
      });
  },
  watch: {
    done: function () {
      this.overlay = false;
      this.probRes = window.algoRes;
      UploadService.post(
        "http://localhost:5000/testResult",
        { res: this.probRes, id: this.contId },
        localStorage.getItem("token")
      )
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
  },
  methods: {
    contribute(testInstance) {
      this.runMessage = null
      this.overlay = !this.overlay;
      this.contId = testInstance._id;
      console.log(testInstance);
      //Run the problem with selected algorithm and delete tags after
      const run = document.createElement("script");
      run.setAttribute("type", "application/javascript");
      run.id = "testIdrun";
      var bounds = "[";
      for (let i = 0; i < testInstance.dimensions; i++) {
        console.log(bounds);
        bounds = bounds + "[";
        bounds = bounds + String(testInstance.boundsMin);
        bounds = bounds + ",";
        bounds = bounds + String(testInstance.boundsMax);
        bounds = bounds + "]";
        if (i < testInstance.dimensions - 1) bounds = bounds + ",";
      }
      bounds = bounds + "]";
      console.log(bounds);
      run.text = `${testInstance.algorithm.substring(
        0,
        testInstance.algorithm.indexOf(".")
      )}(${testInstance.problem.substring(
        0,
        testInstance.problem.indexOf(".")
      )},${bounds},${testInstance.population},${testInstance.mutationFactor},${
        testInstance.crossoverFactor
      },${testInstance.maxNFES})`;
      document.head.appendChild(run);
      //document.getElementById("testIdrun").remove();
      this.runMessage = "Run completed"
      this.done = !this.done;
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
      UploadService.createTest(obj, localStorage.getItem("token"))
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
    runMessage: null,
    overlay: false,
    contId: null,
    probRes: null,
    done: false,
    tests: [],
    problems: [],
    algos: [],
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