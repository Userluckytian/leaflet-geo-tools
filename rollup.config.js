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
      terser({
        compress: {
          drop_console: true,           // ✅ 删除所有console语句
          // drop_console: ['log', 'info'], // 或：只删除特定console方法
          pure_funcs: ['console.log', 'console.info', 'console.debug'], // 另一种方式
        },
        format: {
          comments: false               // ✅ 删除注释
        }
      })
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
      }),
      terser({
        compress: {
          drop_console: true, // ✅ ESM版本也删除console
        },
        mangle: false, // 可选：不混淆变量名，便于调试
        format: {
          comments: false
        }
      })
    ],
    external: ['leaflet', '@turf/turf']
  }
];