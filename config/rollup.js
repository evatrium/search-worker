/*
    Builds modern es format libraries and apps
 */
// assets
import url from '@rollup/plugin-url';
import {string} from 'rollup-plugin-string';
import copy from 'rollup-plugin-copy';

// js
import replace from '@rollup/plugin-replace';
import aliasImports from '@rollup/plugin-alias';
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';

// html
import indexHTML from 'rollup-plugin-index-html';

// css
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

// serve
import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'

// misc
import rimraf from 'rimraf';
import glob from 'tiny-glob/sync'
import filesize from 'rollup-plugin-filesize';
import path from "path";

const clearDir = dir => new Promise(resolve => rimraf(dir, {}, resolve));

// --- might make this npm installable in the future
export const config = async (inputOptions) => {

    let {env: ENV, project: PROJECT, preset: PRESET} = process.env;

    const cwd = process.cwd();

    inputOptions = inputOptions || (require(path.join(cwd, 'package.json')) || {}).rollupConfig || {};

    let options = PROJECT && inputOptions.project && inputOptions.project[PROJECT] ? {
        ...inputOptions, ...inputOptions.project[PROJECT]
    } : inputOptions;

    let {preset, env} = options;

    ENV = ENV || env;

    let {
        input = 'src/index.js',
        html = 'src/index.html',
        output,
        copyFiles,
        importAsString,
        sourcemap = true,
        alias = {},
        APP_ENVS,
        babelConfig,
        devServer,
        external,
        context = 'window'
    } = options;

    let DEV = PRESET === 'dev' || preset === 'dev';
    let LIB = PRESET === 'lib' || preset === 'lib';
    let BUILD_APP = PRESET === 'build_app' || preset === 'build_app';

    if (![!!BUILD_APP, !!DEV, !!LIB].includes(true)) {
        throw new Error('You must pass a preset: build_app, dev, lib')
    }

    process.env.NODE_ENV = (BUILD_APP || LIB) ? 'production' : 'development';

    let joinPath = (file) => path.join(cwd, file);

    let files = [];

    [].concat(input).forEach(file => {
        files = [...files, ...glob(file, {cwd})]
    });

    files = files.map(f => joinPath(f));

    input = files.length < 2 ? files[0] : files;

    html = html && joinPath(html);

    let initial_output = output;
    output = joinPath(output || (LIB ? 'lib' : 'build'));

    let app_envs = APP_ENVS && APP_ENVS[ENV];

    const envs = {
        'process.env.NODE_ENV': `'${process.env.NODE_ENV}'`,
        ...(typeof app_envs !== 'object' ? {} :
            Object.keys(app_envs).reduce((acc, curr) =>
                (acc[`process.env.${curr}`] = `'${app_envs[curr]}'`, acc), {}))
    };

    if (!([cwd, './', '/', '.'].some(path=> [output, initial_output].includes(path)))) {
        await clearDir(output);
    }

    return {
        input,
        context,
        external,
        onwarn(message, warn) {
            if (message.code === 'CIRCULAR_DEPENDENCY') {
                return;
            }
            warn(message)
        },
        treeshake: {
            propertyReadSideEffects: false,
        },
        plugins: [].concat(
            replace(envs),

            alias && aliasImports({
                entries: Object.keys(alias).reduce((acc, curr) => {
                    acc[curr] = require.resolve(alias[curr]);
                    return acc;
                }, {})
            }),

            postcss({
                plugins: [
                    autoprefixer({
                        flexbox: true,
                    }),
                    cssnano({preset: 'default'}),
                ],
            }),

            (BUILD_APP || DEV) && html && indexHTML({indexHTML: html}),

            nodeResolve({
                mainFields: ['module', 'jsnext', 'main'],
                browser: true,
            }),

            commonjs({
                include: /\/node_modules\//,
            }),

            babel(babelConfig || require(path.resolve(__dirname, 'config/babel.js'))()),

            importAsString && string(importAsString),

            url({
                limit: 0,
                fileName: "[dirname][name][extname]"
            }),

            copyFiles && copy({
                copyOnce: true,
                targets: copyFiles.map((file) => ({
                    src: path.resolve(cwd, file),
                    dest: output
                }))
            }),

            (BUILD_APP || LIB) && terser({
                sourcemap: true,
                compress: {
                    keep_infinity: true,
                    passes: 10,
                    pure_getters: true,
                },
                output: {
                    comments: false,
                    wrap_func_args: false
                },
                ecma: 9,
                warnings: true,
                toplevel: true,
                safari10: true
            }),

            (DEV && !BUILD_APP) && serve({
                historyApiFallback: true,
                contentBase: output,
                port: 3000,
                ...devServer
            }),

            (DEV && !BUILD_APP) && livereload({
                watch: output
            }),

            (BUILD_APP || LIB) && filesize(),
        ).filter(Boolean),

        output: {
            dir: output,
            format: 'es',
            sourcemap,
            entryFileNames: (DEV || LIB) ? '[name].js' : '[name]-[hash].js',
            chunkFileNames: (DEV || LIB) ? '[name].js' : '[name]-[hash].js',
        },
    }
};