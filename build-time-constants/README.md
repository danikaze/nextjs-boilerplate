# Build-time constants

> **Note:** Environment variables are [well provided by NextJs out of the box](https://nextjs.org/docs/basic-features/environment-variables), but this way is more complete, flexible and typed.

This folder contains the definitions for the data defined in build-time. This data will be available as global constants in their specified context, depending on the file where it's declared.

| File                                     | custom-server | NextJs server | NextJs client | git |
| ---------------------------------------- | ------------- | ------------- | ------------- | --- |
| [global](./data/global.js)               | ✔             | ✔             | ✔             | ✔   |
| [global-secret](./data/global-secret.js) | ✔             | ✔             | ✔             |     |
| [server](./data/server.js)               | ✔             | ✔             |               | ✔   |
| [server-secret](./data/server-secret.js) | ✔             | ✔             |               |     |
| [client](./data/client.js)               |               |               | ✔             | ✔   |
| [client-secret](./data/client-secret.js) |               |               | ✔             |     |
| [build](./data/build.d.ts)               | ✔             | ✔             | ✔             | ✔   |

Each context consist of 2 files:

- Declaration file: a `.d.ts` file describing the data type of each constant.
- Definition file: a `.js` file defining the value of each constant

Furthermore, if a `.js` file ends in `-secret` (i.e. `main-secret.js`) it won't be included in the repository, being useful for declaring secret keys, passwords, etc.

The definitions of the `-secret` file must be in the same declaration file as the non-secret one (i.e. type declarations for `global-secret.js` **and** `global.js` will be specified both in `global.d.ts`)

Note that because of its isomorphic nature, NextJs server and NextJs client definitions will be available for the TypeScript compiler, but not their value, which will be provided correctly in each build.

i.e: The **declaration** for a server-exclusive value will be visible in the client side, but their **values** will be `undefined` resulting in an compilation error if wrongly used.

Precedence for the values goes as the table is described, from low to high (i.e. values with the same name declared in `client.js` or `server.js` will override values of `global.js`).

Also, the build process add the values defined in [build.d.ts](./build.d.ts) and they can't be overriden.

This values will be replaced in the code in the same way that `#define` work in C/C++ (they will not be declared as constants anywhere), so better not to use build time constants to declare big values used everywhere (it would be ok if declared but reassigned to a constant somewhere in the code, and then that constant imported from other files).

The only difference is for the custom server code ([/server](../server)), where values will be imported because this build doesn't go through webpack.

## Environment variables

### PRINT_CONSTANTS

To output in the console the values used in the build, just use the environment variable `PRINT_CONSTANTS` to `true` when executing `npm run build` or `npm run dev` like this:

```
PRINT_CONSTANTS=true npm run build
```

```
PRINT_CONSTANTS=true npm run dev
```

### CONSTANTS_SUBFOLDERS

By default, the values used for the constants are loaded from [build-time-constants/data](./data), but that can be configuring by setting the `CONSTANTS_SUBFOLDERS` environment variable.

Since it accepts a comma-separated list of folders relative to the `build-time-constants` one (being just `data` the default value), specifying more than one folder is allowed:

```
CONSTANTS_SUBFOLDERS=base,prod npm run build
```

In this case, the files from the first one will be used as base, the files in the second one will overwrite the first one, and so on. This allow defining common data in one folder and then use specific configuration for different environments (such as _staging_ or _production_)

While the actual provided values can be customized, the data definition (types) will always be read from the `.d.ts` files placed in the [build-time-constants](./) folder, and will be always the same for any environment.
