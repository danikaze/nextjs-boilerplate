# Build-time constants

> **Note:** Environment variables are [well provided by NextJs out of the box](https://nextjs.org/docs/basic-features/environment-variables), but this way is more complete, flexible and typed.

This folder contains the definitions for the data defined in build-time. This data will be available as global constants in their specified context, depending on the file where it's declared.

| File                                | custom-server | NextJs server | NextJs client | git |
| ----------------------------------- | ------------- | ------------- | ------------- | --- |
| [global](./global.js)               | ✔             | ✔             | ✔             | ✔   |
| [global-secret](./global-secret.js) | ✔             | ✔             | ✔             |     |
| [server](./server.js)               | ✔             | ✔             |               | ✔   |
| [server-secret](./server-secret.js) | ✔             | ✔             |               |     |
| [client](./client.js)               |               |               | ✔             | ✔   |
| [client-secret](./client-secret.js) |               |               | ✔             |     |
| [build](./build.d.ts)               | ✔             | ✔             | ✔             | ✔   |

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

**Note:** To output in the console the values used in the build, just use the environment variable `PRINT_CONSTANTS` to `true` when executing `npm run build` or `npm run dev` like this:

```
PRINT_CONSTANTS=true npm run build
```

```
PRINT_CONSTANTS=true npm run dev
```
