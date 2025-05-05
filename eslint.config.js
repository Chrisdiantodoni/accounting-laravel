import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs,jsx}"],
        plugins: { js },
        extends: ["js/recommended"],
        rules: {
            "react/react-in-jsx-scope": "off",
            "react/jsx-uses-react": "off", // Menonaktifkan pemeriksaan penggunaan React di JSX
            "react/prop-types": "off", // Menonaktifkan pemeriksaan PropTypes
            "react/require-default-props": "off", // Menonaktifkan pemeriksaan default props
        },
    },

    {
        files: ["**/*.{js,mjs,cjs,jsx}"],
        languageOptions: {
            globals: {
                ...globals.browser, // Menambahkan globals untuk browser
                route: "readonly", // Menambahkan 'route' sebagai global variable
            },
        },
    },

    pluginReact.configs.flat.recommended,
]);
