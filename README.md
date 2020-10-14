# nextjs-boilerplate

A boilerplate to use in projects with NextJs and TypeScript.

[![Build Status](https://travis-ci.org/danikaze/nextjs-boilerplate.svg?branch=master)](https://travis-ci.org/danikaze/nextjs-boilerplate)

## Features

### Ready

- TypeScript support (with path aliases support)
- [Debug](https://nextjs.org/docs/advanced-features/debugging) in vscode ready
- [Prettier](https://prettier.io/)
- [Linting](https://palantir.github.io/tslint/)
- [Git hooks](https://github.com/typicode/husky)
- Advanced [build time constants](./build-time-constants/README.md) (including [git revisions](https://www.npmjs.com/package/git-revision-webpack-plugin) and secrets)
- [Redux](https://redux.js.org/) integration with hooks and compatible with
  - [Redux Devtools Extension](https://github.com/zalmoxisus/redux-devtools-extension)
  - [redux-thunk](https://github.com/reduxjs/redux-thunk)
  - [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware)
  - [redux-immutable-state-invariant](https://github.com/leoasis/redux-immutable-state-invariant)
- [Material-UI](https://material-ui.com/) with [tree shaking](https://material-ui.com/guides/minimizing-bundle-size/)
- i18n ([internationalization](https://github.com/isaachinman/next-i18next))
- Isomorphic [server](https://github.com/winstonjs/winston) and client logs

### Planned

- Server settings read from filesystem
- Migrate to [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)
- Unit testing
- Visual regression testing

## Setup

Points **1** and **2** can be combined if using this repository as a template when creating a new one.

1. Clone this repository

```
git clone https://github.com/danikaze/nextron-boilerplate.git PROJECT_FOLDER
```

2. Change the origin to the new repository

```
cd PROJECT_FOLDER
git remote rm origin
git remote add origin YOUR_REMOTE_REPOSITORY.git
git push -u origin master
```

3. Change the `name`, `description` and `version` if needed in [package.json].

4. Install the needed packages

```
npm install
```

## Configuration

### TypeScript path aliases

- For path aliases to be available in the main process, edit the [main/tsconfig.json](./main/tsconfig.json) file.
- For path aliases to be available in the renderer process, edit the [renderer/tsconfig.json](./renderer/tsconfig.json) file.
- Add the union of all the added aliases to the `no-implicit-dependencies` rule in the [tslint.yaml](./tslint.yaml) file.

## Development notes

### Debugging

While running `npm run dev`, just hit `F5` in vscode and it will attach automatically to the nextjs server process, making breakpoints available.

Alternatively you can also debug in chrome just going to [chrome://inspect](chrome://inspect)

### Redux

Redux code is basically contained inside the [store](./store) folder. The [index.ts](./store/index.ts) file basically exports the `wrapper` function used by [next-redux-wrapper](https://github.com/kirill-konshin/next-redux-wrapper), so there's no need to modify it.

What it is important, are the three subfolders, which are described in the following subsections of this document:

- [actions](./store/actions.ts)
- [model](./store/model.ts)
- [reducers](./store/reducers.ts)

#### Actions

Actions in the app use the [Flux Standard Action convention](https://redux.js.org/style-guide/style-guide#write-actions-using-the-flux-standard-action-convention) which basically follows the defined [AppAction interface](./store/actions/index.ts):

```ts
export interface AppAction<T extends string, P = never, M = never> {
  type: T;
  payload?: P;
  meta?: M;
  error?: boolean;
}
```

Basically because it's the format required by the [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware), which expects the data to be inside the `action.payload` field.

The [actions/index.ts](./store/actions/index.ts) describe this interface and also has an internal type called `AppActionList` which is the one which should be modified, adding the extra actions available in the real app. This allows to properly type the list of actions you can create and use in the reducer.

In the end, the real action list exported is just this list plus the [HydrateAction](./store/actions/hydrate.ts), used again by [next-redux-wrapper](https://github.com/kirill-konshin/next-redux-wrapper).

The idea is to have actions of one context/component grouped in one file inside the folder, like the ones provided as an example in [counter.ts](./store/actions/counter.ts). This file provides basically three things:

- A grouped type of all provided actions (`CounterAction`).
- Interfaces for each action (`IncreaseCounterAction` and `DecreaseCounterAction`).
- [Action creators](https://redux.js.org/style-guide/style-guide#use-action-creators) (`increaseCount` and `decreaseCount`).

#### Model

The model is basically the type definition of the Redux Store State. [model/index.ts](./store/model/index.ts) provides the `State` interface, which should be modified with the definition of your app state. Usually composed by other interfaces as shown in the example.

Each of this interfaces are initially grouped in the code example in folders, one for each context/component offering two files:

- [module/index.ts](./store/model/counter/index.ts), which provides the interface for that part of the state.
- [module/selectors](./store/model/counter/selectors.ts), that groups the different selectors to access data of that interface.

Remember that it's recommended to have multiple selectors accessing small pieces of data instead of having only one returning a big object.

#### Reducers

Reducers here works with the standard [combineReducers](https://redux.js.org/api/combinereducers) from redux.

The only thing to do in [reducers/index.ts](./store/reducers/index.ts) which provides the global reducer file, is to fill the `combinedReducer` with the list of your context/container reducers.

The resulting reducer will be combined with the special [hydrateReducer](./store/reducers/hydrate.ts) which is required by [next-redux-wrapper](https://github.com/kirill-konshin/next-redux-wrapper#state-reconciliation-during-hydration).

### Material-UI

Material-UI is supported including [server side rendering](https://material-ui.com/guides/server-rendering/) as recommended in the [library documentation](https://github.com/mui-org/material-ui/tree/master/examples/nextjs). It generates style sheets in server side which are removed later in client side on the first render of the page.

The theme used by the app can be customized editing the files in [@themes](./themes/index.ts).

The package [clsx](https://github.com/lukeed/clsx) is available by default if the preferred option is `makeStyles` but using `withStyles` is also an alternative to avoid dealing with classnames.

Because [tree shaking is enabled via Babel](https://material-ui.com/guides/minimizing-bundle-size/), it is safe to import all the components in one line from `@material-ui/core` like the following code shows:

```ts
// ✔️ Without tree-shaking this would be needed
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

// ✔️ Because tree-shaking is enabled, this is safe and still fast!
import { Button, TextField } from '@material-ui/core';
```

### i18n

Translations work with [next-i18next](https://github.com/isaachinman/next-i18next/) as is the de-facto standard for Next JS i18n.

Code splitting in localized data is enabled by default, meaning that only the needed translations will be provided when the page is rendered, and other required ones will be loaded when needed dynamically.

For this, localizations are split in namespaces (manually, depending on your application):

- All localization files are in [public/static/locales/LANG/NAMESPACE.json](./public/static/locales).
- `AVAILABLE_LANGUAGES` will be a [build-time constant](./build-time-constants/build.d.ts) automatically generated from the folders in that location.
- `AVAILABLE_LANGUAGE_TYPE` will be a type automatically generated matching the values for `AVAILABLE_LANGUAGE`.
- Namespace `common` is always loaded. Common translations across all the app can be placed here, but better maintain this file as light as possible.
- For each page, you need to define `namespacesRequired` to a list of namespaces to be loaded from the beginning (SSR) in the `Page.defaultProps`.

#### Caveats

Because the new data fetching method (from NextJS 9) [getServerSideProps](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering) is [not fully supported](https://github.com/isaachinman/next-i18next/issues/652), if a page requires dynamic initial props, there's the need to apply a workaround, which disables SSG ([Static Site Generation](https://nextjs.org/blog/next-9-3#next-gen-static-site-generation-ssg-support)) making every page to work with SSR ([Server Side Rendering](https://nextjs.org/docs/basic-features/pages#server-side-rendering)).

This workaround is optional (to be applied in build time or not), and can be enabled or disabled in [global.js] changing the value of `ENABLE_I18N_OPTIMIZED_NAMESPACES`.

If set to `true`:

- i18n will send only the required namespaces to each page, keeping the initial render faster
- SSG will be disabled (meaning every page will be SSR)

If set to `false`:

- i18n will send **all** namespaces to each page
- SSG will be enabled

By default this workaround is enabled, but it might be a good idea to disable it if:

- Your localized data is small, or there's not much difference in loading all namespaces.
- There's not much dynamic data and it's worth to have SSG instead of SSR.

### Logging

This setup provides isomorphic logging, meaning that the same code is available in server and client side for simplicity.

When a logging call is executed in server side, it will be outputted to the [logs](./logs) folder (or any configured transport). If the same line is executed in client side, it will be outputted in the browser console. That is, depending on the log call level and the provided options.

Since different logging libraries provide different logging levels, and somewhat it's confusing on how to use them, this setup takes an opinionated approach and defines it here (however, feel free to use them in the way it better fits your needs):

| method  | priority | usage                                                                 |
| ------- | -------- | --------------------------------------------------------------------- |
| error   | 0        | errors affecting the operation/service                                |
| warn    | 1        | recuperable error or unexpected things                                |
| info    | 2        | processes taking place (start, stop, etc.) to follow the app workflow |
| verbose | 3        | detailed info, not important                                          |
| debug   | 4        | debug messages                                                        |

By default, each page will receive a field `logger` in their props, initialized with a namespace like `FoobarPage` if the page is called `Foobar`.

You can define get extra namespaces just calling the hook `useLogger('namespace')` from your components anytime, defined in [./utils/logger](./utils/logger/index.ts).

Usually only one global logger would be used in an app, and its options can be customized by editing [logger.config.js](./logger.config.js) (interface and default values are [specified here](./utils/logger/index.ts)), but if required, you can wrap other parts of your code with `Logger` component (a `React.Provider`) since the `useLogger` hook will access the deeper one, meaning you can do things like this:

```ts
const Page: AppPage({ logger }) => {
  logger.info('Page rendered');

  return (
    <Logger value={new IsomorphicLogger(customLoggerConfiguration)}>
      <Component />
    </Logger>
  )
}

const Component = () => {
  const logger = useLogger('Component');
  logger.info('This will be logged with the custom logger');

  return (
    <div>Component contents</div>
  );
}
```
