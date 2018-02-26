module.exports = function install(){
    console.log("XI install")
    .then(function(){
        console.log("OK")
    })
    .catch(function(err){
        console.log(err)

    });
}