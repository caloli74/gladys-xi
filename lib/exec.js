module.exports = function exec(params) {

    return new Promise(function (resolve, reject) {
        console.log(params);
        return resolve('success');
    })
}