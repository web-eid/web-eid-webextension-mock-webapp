module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    "eslint:recommended"
  ],
  rules: {
    "quotes": ["error", "double", { "avoidEscape": true }],
    "semi": "off",
    "indent": ["error", 2],
    "brace-style": "error",
    "key-spacing": ["error", { "align": "value" }],
    "comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "always-multiline",
      "imports": "always-multiline",
      "exports": "always-multiline",
    }],
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": "error",
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2018
  }
};
