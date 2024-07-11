// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      "node_modules/",
      "dist/",
      "coverage/",
      ".github/"
    ]
  }
);

// module.exports = {
//   languageOptions: {
//     parser: '@typescript-eslint/parser',
//   },
//   plugins: [
//     '@typescript-eslint',
//   ],
//   extends: [
//     'eslint:recommended',
//     'plugin:@typescript-eslint/recommended',
//   ],
//   ignores: [
//     "node_modules/",
//     "dist/",
//     "coverage/",
//     ".github/"
//   ]
// };