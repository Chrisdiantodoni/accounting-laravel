module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    env: {
        browser: true,
        node: true,
        es6: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:prettier/recommended",
    ],
    plugins: ["react", "react-hooks", "prettier"],
    rules: {
        "react/jsx-first-prop-new-line": [2, "multiline"],
        "react/jsx-max-props-per-line": [2, { maximum: 1, when: "multiline" }],
        "react/jsx-indent-props": [2, 2],
        "react/jsx-closing-bracket-location": [2, "tag-aligned"],
        "prettier/prettier": ["error"],
        "react/react-in-jsx-scope": "off", // Jika kamu pakai React 17+
        "no-console": "warn",
    },
};
