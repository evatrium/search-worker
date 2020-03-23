
/*
    References
    https://github.com/preactjs/preact-cli/blob/master/packages/cli/babel/index.js
 */
module.exports = function (env, options = {}) {

    const isProd = (process.env.BABEL_ENV || process.env.NODE_ENV) === 'production';

    const isTest = (process.env.BABEL_ENV || process.env.NODE_ENV) === 'test';

    return {
        babelrc: false,
        configFile: false,
        "exclude": "node_modules/**",
        "presets": [
            [
                isTest ? "@babel/preset-env" : "@babel/preset-modules",
                {
                    "modules": isTest ? 'commonjs' : false,
                    "loose": true,
                    "useBuiltIns": false,
                    ...(isTest ? {targets:{browsers: 'node 10'}} : {"targets": {"esmodules": true}}),
                    "exclude": [
                        "transform-regenerator",
                        "transform-async-to-generator",
                        "@babel/plugin-transform-template-literals"
                    ]
                }
            ]
        ],
        "plugins": [
            "@iosio/babel-plugin-jcss",
            "@iosio/babel-plugin-minify-literals",
            "@babel/plugin-syntax-dynamic-import",
            ["@babel/plugin-transform-react-jsx", {"pragma": "h", "pragmaFrag": "Fragment"}],
            isProd && "babel-plugin-transform-react-remove-prop-types",
            ["@babel/plugin-proposal-class-properties", {"loose": true}],
            "babel-plugin-macros"
        ].filter(Boolean)
    }
};