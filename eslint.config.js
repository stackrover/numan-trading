import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";

export default [
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },

    pluginJs.configs.recommended,

    {
        files: ["resources/js/**/*.{js,jsx}"],
        plugins: {
            react: pluginReact,
        },
        rules: {
            ...pluginReact.configs["jsx-runtime"].rules,
            "react/jsx-uses-vars": "error",
            "no-unused-vars": "off",
        },
    },

    {
        files: ["resources/js/**/*.{js,jsx}"],
        plugins: {
            "jsx-a11y": pluginJsxA11y,
        },
        rules: {
            ...pluginJsxA11y.configs.recommended.rules,
        },
    },
];
