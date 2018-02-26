module.exports = function install(){
    return 0
    .then(function(){
        console.log("XI install")
    })
    .catch(function(){
        console.log("Err")

    });
}