var DE = function (cost_func, bounds, popsize, mutationFactor, crossoverFactor, MAX_NFES) {
  console.log(bounds);
  //--- Inicializacija populacije
  const population = []
  for (let i = 0; i < popsize; i++) {
    let indv = []
    for (let j = 0; j < bounds.length; j++) {
      indv.push(bounds[j][0] + Math.random() * (bounds[j][1] - bounds[j][0]))
    }
    population.push(indv)
  }
  //console.log(population)
  for (let i = 0; i < MAX_NFES + 1; i++) {

    var results = []

    for (let j = 0; j < popsize; j++) {
      //--- Mutacija

      let candidates = Array.from(
        Array(Math.abs(popsize - 0)),
        (_, i) => 0 + i)
      candidates.splice(j, 1)
      let random_index = [];
      while (random_index.length < 3) {
        var r = Math.floor(Math.random() * candidates.length);
        if (random_index.indexOf(candidates[r]) === -1) random_index.push(candidates[r]);
      }

      let random1 = population[random_index[0]]
      let random2 = population[random_index[1]]
      let random3 = population[random_index[2]]
      let current = population[j]
      let difference = [];
      difference[0] = random3[0] - random2[0];
      difference[1] = random3[1] - random2[1];
      let mutated = [];
      mutated[0] = random1[0] + mutationFactor * difference[0];
      mutated[1] = random1[1] + mutationFactor * difference[1];
      //--- Preverjanje mej
      let vec_new = []
      for (let k = 0; k < mutated.length; k++) {

        if (mutated[k] < bounds[k][0]) {
          vec_new.push(bounds[k][0])
        }

        if (mutated[k] > bounds[k][1]) {
          vec_new.push(bounds[k][1])
        }

        if (bounds[k][0] <= mutated[k] <= bounds[k][1]) {
          vec_new.push(mutated[k])
        }
      }
      mutated = vec_new
      //--- Krizanje

      let newIndividual = []
      let rand = Math.floor(Math.random() * (current.length - 1))
      for (let i = 0; i < current.length; i++) {
        let crossover = Math.random()
        if (crossover <= crossoverFactor || rand == i) {
          newIndividual.push(mutated[i])
        } else {
          newIndividual.push(current[i])
        }
      }

      //--- Selekcija

      let newScore = cost_func(newIndividual)
      let currScore = cost_func(current)

      if (newScore < currScore) {
        population[j] = newIndividual
        results.push(newScore)
      } else {
        results.push(currScore)
      }
      if (newScore < 0.0000000001) {
        break
      }
    }


  }
  //--- Rezultati
  let avg = results.reduce((a, b) => a + b, 0) / popsize
  let best = Math.min(...results)
  let sol = population[results.indexOf(best)]
  var overallBest = []
  for(let i=0;i<bounds.length;i++) overallBest.push(10000000000)
  if (best < cost_func(overallBest)) {
    overallBest = sol
  }

  console.log('GENERATION AVERAGE:', avg)
  console.log('GENERATION BEST:', best)
  console.log('BEST SOLUTION:', sol);
  (function() {
    window.algoRes = {avg, best, sol};
  })()
}