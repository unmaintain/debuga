# debuga

Do your debug workflow more visible on local server.

## Install

```
npm i -D debuga
```

## Use with `browser-sync`

```js
var debuga = require('debuga');
var bs = require('browser-sync');

bs.init({
    files: ['dist/**/*'],
    reloadOnRestart: true,
    server: {
        baseDir: [
            'app/resources',
            'dist'
        ],
        directory: false,
        middleware: [debuga()]
    }
})

```

## Options

### `favicon`

Default: `null` | `String`. If `null` then set debug default favicon ![debug](debug.ico), else you can set custom path to favicon.

```js
debuga({
    favicon: 'path/to/favicon.ico'
})
```

### `titlePrefix`

Default: `DEBUG — ` | `String`. Set title prefix.

```js
debuga({
    titlePrefix: 'DEBUG — '
})
```

### `dist`

Default: `dist` | `String`. Set serving folder with HTML files.

```js
debuga({
    dist: 'path/to/html/files'
})
```

## License

MIT.
