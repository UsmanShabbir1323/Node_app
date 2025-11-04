export default [
  {
    files: ["**/*.js", "**/*.jsx"],
    ignores: [
      "node_modules/**",
      "dist/**",
      "build/**",
      "coverage/**"
    ],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs"
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    rules: {
      // Keep empty to avoid non-essential warnings; syntax errors will still fail
    }
  }
];


