import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'umd',
      name: 'LeafletGeoTools',
      globals: {
        'leaflet': 'L',
        '@turf/turf': 'turf'
      }
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ 
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist/types',
        outputToFilesystem: false
      }),
      terser()
    ],
    external: ['leaflet', '@turf/turf']
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'esm'
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ 
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: 'dist/types',
        outputToFilesystem: false
      })
    ],
    external: ['leaflet', '@turf/turf']
  }
];