const babelJest = require('babel-jest');
const createConfig = require('./babel');

const config = createConfig();

module.exports = babelJest.createTransformer({
    plugins: config.plugins,
    presets: config.presets,
    babelrc: false,
    configFile: false,
});