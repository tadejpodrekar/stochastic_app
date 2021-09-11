var ackley = function(x){
    let sum1 = -0.2 * Math.sqrt(0.5 * (Math.pow(x[0], 2) + Math.pow(x[1], 2)))
    let sum2 = 0.5 * (Math.cos(2 * Math.PI * x[0]) + Math.cos(2 * Math.PI * x[1]))
    return Math.E - 20 * Math.exp(sum1) - Math.exp(sum2) + 20
  }