# Build-time constants

This folder contains the definitions for the data defined in build-time. This data will be available as global constants in their specified context, depending on the file where it's declared.

| File          | Server | Client |
| ------------- | ------ | ------ |
| global        | ✔      | ✔      |
| global-secret | ✔      | ✔      |
| server        | ✔      |        |
| server-secret | ✔      |        |
| client        |        | ✔      |
| client-secret |        | ✔      |

Each context consist of 2 (or 3) files:

- Declaration file: a `.d.ts` file describing the data type of each constant.
- Definition file: a `.js` file defining the value of each constant

Furthermore, if a `.js` file ends in `-secret` (i.e. `main-secret.js`) it won't be included in the repository, being useful for declaring secret keys, passwords, etc.

The definitions of the `-secret` file must be in the same declaration file as the non-secret one (i.e. type declarations for `global-secret.js` **and** `global.js` will be specified both in `global.d.ts`)

Note that server and client definitions will be available for the TypeScript compiler, but not their value, which will be provided correctly in each build.

i.e: The **declaration** for a server-exclusive value will be visible in the client side, but their **values** will be `undefined` resulting in an compilation error if wrongly used.

Precedence for the values goes as the table is described, from low to high (values with the same name declared in `client.js` or `server.js` will override values of `global.js`).

This values will be replaced in the code in the same way `#define` work in C/C++ (they will not be declared as constants anywhere), so better not to use build time constants to declare big values used everywhere (it would be ok if declared but reassigned to a constant somewhere in the code, and then that constant imported from other files).

This functionality is [well provided by NextJs out of the box](https://nextjs.org/docs/basic-features/environment-variables), but this way is more flexible and typed.
