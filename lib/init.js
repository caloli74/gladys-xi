module.exports = function init() {

    return new Promise(function (resolve, reject) {
        console.log('init');
        return resolve('success');
    })
}