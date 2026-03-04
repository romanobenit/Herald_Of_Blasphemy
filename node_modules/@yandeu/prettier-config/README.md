# @yandeu/prettier-config

```console
npm i -D @yandeu/prettier-config
```

```json
// .prettierrc
"@yandeu/prettier-config"
```

```json
// package.json
"scripts": {
  "format:check": "prettier --check src",
  "format": "prettier --write src"
}
```

## Configuration

```js
// .prettierrc.cjs (instead of .prettierrc)
module.exports = {
  ...require('@yandeu/prettier-config')
  // my options
}
```

## GitHub Actions

```yml
- name: Run Prettier
  run: npm run format
```

## Integrating with ESLint

Install [@yandeu/eslint-config](https://github.com/yandeu/eslint-config).

## VSCode

Using VSCode? Install the [Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

## License

[MIT](https://github.com/yandeu/prettier-config/blob/main/LICENSE)
