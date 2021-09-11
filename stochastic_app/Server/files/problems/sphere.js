var sphere = function(x){
    return x.reduce((prev, current) => {
        return prev + Math.pow(current, 2);
    }, 0)
}