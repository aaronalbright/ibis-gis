import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import pkg from './package.json';

export default {
  input: 'src/index.js',
  external: [...Object.keys(pkg.dependencies), 'loadash/mapValues'],
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' }
  ],
  plugins: [
    babel({
      exclude: ['node_modules/**'],
      babelHelpers: 'runtime'
    }),
    resolve({
      modulesOnly: true
    })
  ]
};
