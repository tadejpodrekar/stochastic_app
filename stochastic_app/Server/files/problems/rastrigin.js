var rastrigin = function(x){
    return 10 * x.length + x.reduce((prev, current) => {
      return prev + Math.pow(current, 2) - 10 * Math.cos(2 * Math.PI * current);
    }, 0)
  }