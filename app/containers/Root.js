if (process.env.NODE_ENV === 'hot') {
    console.log(1)
    module.exports = require('./Root.hot');
} else {
    console.log(2)
    module.exports = require('./Root.dev');
}