import {defineConfig} from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import googleStyle from 'eslint-config-google';

export default defineConfig([
  googleStyle,
  {files: ['**/*.{js,mjs,cjs}']},
  {files: ['**/*.js'], languageOptions: {sourceType: 'commonjs'}},
  {
    rules: {
      'valid-jsdoc': 'off',
      'require-jsdoc': 'off',
      'max-len': 'off',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {globals: {...globals.browser, ...globals.node}},
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {js},
    extends: ['js/recommended'],
  },
]);
