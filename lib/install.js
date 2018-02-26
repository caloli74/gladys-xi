module.exports = function install(){
    gladys.deviceType.getByID({id:1})
    .then(function(){
        console.log("XI install")
    })
    .catch(function(){
        console.log("Err")

    });
}