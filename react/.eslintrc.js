module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "react-hooks"
    ],
    "rules": {
        "indent": [
            "error",
            "tab",
            {
                "SwitchCase": 1
            }
        ],
        "linebreak-style": "off",
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "react/forbid-foreign-prop-types": "warn",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn"
    },
    "settings": {
        "import/resolver": {
            "node": {
                "paths": ["./src"]
            }
        },
        "react": {
            "version": "detect"
        }
    }
};