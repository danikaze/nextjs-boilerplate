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
- [Authentication](http://www.passportjs.org/)
- Testing, run by [Jest](https://jestjs.io/)
  - Unit testing (with [Jest](https://jestjs.io/) and [Sinon](https://sinonjs.org/))
  - Code coverage [Istanbul](by https://istanbul.js.org/)
- Support of static file imports via [url-loader](https://webpack.js.org/loaders/url-loader/) and [file-loader](https://webpack.js.org/loaders/file-loader/)
- [Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Planned

- Server settings read from filesystem
- Migrate to [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)
- Component testing
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

- Edit the [main/tsconfig.json](./tsconfig.json) file with the path aliases to be available.
- Add them also to the `no-implicit-dependencies` rule in the [tslint.yaml](./tslint.yaml) file.

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

This workaround is optional (to be applied in build time or not), and can be enabled or disabled in [global.js] changing the value of `I18N_OPTIMIZED_NAMESPACES_ENABLED`.

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

Because we want to use the logger outside the react components as well, not always can it be retrieved as a hook. For that, there's also the `getLogger(namespace)` function, which will use always the [global logger configuration](./logger.config.js) but it's accessible everywhere.

```ts
const logger = getLogger('API');
logger.debug('This debug line is for code outside react');
```

### Authentication

Most web-apps require some kind of user authentication, and this boilerplate provides everything you need to set it up, based on [passport](http://www.passportjs.org/).

#### Configuration

To enable authentication, just make sure `AUTH_ENABLED` is `true` in the [build-time-constants](./build-time-constants/data/global.js).

There are other values that can be customized:

| Constant                  | Notes                                                                                                                                                                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUTH_LOGIN_SUCCESS_PAGE   | The URL where the user is redirected after a successfully login attempt                                                                                                                                                                                             |
| AUTH_LOGIN_FAIL_PAGE      | The URL where the user is redirected after a failed login attempt                                                                                                                                                                                                   |
| AUTH_LOGOUT_PAGE          | The URL where the user is notified that their credentials are cleared ([logout](./pages/logout.tsx) is provided by default, but can be changed and/or customized)                                                                                                   |
| AUTH_DO_LOGOUT_URL        | This is the page that will clear all user credentials and redirect to `AUTH_LOGOUT_PAGE` (only the URL needs to be defined, the [page itself is already provided](./server/auth/strategies/local.ts))                                                               |
| AUTH_LOGIN_REDIRECT_PARAM | Parameter used (if defined) to provide the original URL for a redirection on a login success (currently [only working for the local strategy](https://github.com/danikaze/nextjs-boilerplate/issues/13))                                                            |
| AUTH_FORBIDDEN_PAGE       | When a logged-in user doesn't have enough permissions to access a page, it's redirected here (if set). If this is not set, a HTTP 401 Unauthorized error is sent. ([forbidden](./pages/forbidden.tsx) is provided by default, but can be changed and/or customized) |

##### Local Strategy

Local strategy is nothing more than applying a custom way of checking the user status, usually through a database, retrieving the user data and checking if the provided password checks at the login time. Then, in each request if the user exists, we just check its permission level.

In this example, the [User model](./model/user.ts) is identified by its `username` and an `id` field. It has a `password`, stored using a `salt` value for better security via [scrypt](https://nodejs.org/api/crypto.html#crypto_crypto_scrypt_password_salt_keylen_options_callback).

Because this boilerplate is agnostic on the used database, it's using mock-data defined in the [strategy configuration file](server/auth/strategies/local.ts), and the point **1** where the user data is retrieved, should be replaced with the proper implementation.

When checking the username and password, the strategy relies on those values coming from a form with that field names: `username` and `password`, as shown in the [Login form](components/login-form.tsx).

Customizable [constants](./build-time-constants/data/global.js) are:

| Constant                | Notes                                                                                                                                                                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUTH_LOCAL_DO_LOGIN_URL | This is the page that will receive the `username` and `password` parameters via `POST`, and redirects to `AUTH_SUCCESS_PAGE` or `AUTH_FAIL_PAGE` (only the URL needs to be defined, the [page itself is already provided](./server/auth/strategies/local.ts). |

##### Twitter Strategy

This is an example of using an external service to authenticate your users. This especifically uses [passport-twitter](https://github.com/jaredhanson/passport-twitter) for it, and requires to set some constants as well:

In [global.d.ts](./build-time-constants/global.d.ts):

| Constant                | Notes                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------ |
| AUTH_TWITTER_LOGIN_PAGE | Local route that will redirect to the twitter one when initializing the auth process |

In [server.d.ts](./build-time-constants/server.d.ts):

| Constant                      | Notes                                                             |
| ----------------------------- | ----------------------------------------------------------------- |
| AUTH_TWITTER_CALLBACK_ABS_URL | Route that will process the result when authenticated via twitter |
| AUTH_TWITTER_API_KEY          | Your [App](https://developer.twitter.com/) API Key                |
| AUTH_TWITTER_API_KEY_SECRET   | Your [App](https://developer.twitter.com/) API Key Secret         |

Make sure to place the values for `AUTH_TWITTER_API_KEY` and `AUTH_TWITTER_API_KEY_SECRET` in the [server-secret.js](./build-time-constants/data/server-secret.js) file instead of [server.js](./build-time-constants/data/server.js) so they won't be commited to the repository.

##### Other Strategies

Because passport is ready to be used, other authentication strategies such as [Github](https://github.com/cfsghost/passport-github), [Facebook](https://github.com/jaredhanson/passport-facebook) or [Google](https://github.com/jaredhanson/passport-google) among others, can be easily integrated as well just adding them to the [express server](./server/auth/index.ts) the same way it's done for [Twitter](./server/auth/strategies/twitter).

#### Usage

Pages you want to protect require `getServerSideProps`. This will disable your SSG but it's something logic to happen if you want the rendering to depend on the actual permissions of the current user. Define this function by using `userRequiredServerSideProps` or `adminRequiredServerSideProps` from [@utils/auth.ts](utils/auth.ts).

The `request` object provided by the [context object](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering) received in the `getServerSideProps` function will have a `user` property set to `false` if the user is not logged in, or the set object in the configured previously. The user data can be accessed with the hook `useUserData` from [@utils/auth.ts](utils/auth.ts).

The boilerplate example comes with a defined [User model](./model/user.ts) containing several data, but only information related to `{ id, username, role }` is provided in the authentication cookie -encrypted- (it doesn't do a call to the model to retrieve that information in that request, but just read the encoded cookie), which is the minimum required to make it work. If more information is required, you can retrieve it from your model.

If based on the values the user should not have access to the page, the request can be redirected to other URL.

_**NOTE:** A different approach can also be chosen without using `getServerSideProps` if it's OK to show the (empty) page to a user without credentials if the data is actually secure (fetched with a protected API)._

### Testing

Unit testing uses [Jest](https://jestjs.io/en) as a test runner. It also provides [assertion](https://jestjs.io/docs/en/expect) and [mock functions](https://jestjs.io/docs/en/mock-functions), but [Sinon](https://sinonjs.org/) is also available.

Executing `npm run test` will run all the tests and the linter, while `npm run test-debug` will keep jest running in `watch` mode and code can be inspected attaching the debugger to the process (`F5` in Visual Code, or browsing to `chrome://inspect`, etc.).

To run only one test, it can be passed as a parameter (or some by usign globs). Just remember that you need to append `--` to pass them when running `npm run`

```
npm run test-only -- utils/__test/auth.spec.ts
```

Every file named as `.spec.ts`, `.spec.tsx`, `.test.ts` or `.test.tsx` will be considered as test cases and loaded when running the tests, and by convention they are usually placed inside a [\_\_test](./utils/__test) folder where the feature is located.

When running the tests, a `.coverage` folder will be created (but not included in the repository) using [Istanbul](https://istanbul.js.org/), which you can use to check which part of your code is missing testing by browsing the [html reports](./.coverage/lcov-report/index.html).

Because tests add a `IS_TEST` [global build-time constant](./build-time-constants/build.d.ts), it's used to disable logging and prevent polluting the output when running the tests.

Note that because this repository already provides a [travis-ci configuration](./.travis.yml), you only need to enable your repository in your account to start checking your code sanity with each commit without further work (travis executes `npm run test` by default for [NodeJS projects](https://docs.travis-ci.com/user/languages/javascript-with-nodejs/#default-build-script)).

### Static file imports

This boilerplate handles generic static file imports by using [url-loader](https://webpack.js.org/loaders/url-loader/) and [file-loader](https://webpack.js.org/loaders/file-loader/).

Files can be imported as any other file and they will be resolved to their URL, so this is possible:

```tsx
import catImage from '@assets/images/cat.jpg';

<img src={catImage} />;
```

With the [default configuration](./build-tools/with-files.js), files less than 8kb will be imported as base64 inline images, while others will be included as external files.

This means there are two ways to import files:

- Using the default NextJS [public](./public) folder, which gives you direct access to the files placed there at build time. As described in the [NextJS documentation](https://nextjs.org/docs/basic-features/static-file-serving), all files here are available publicly in the root path of our application as `serverUrl/*`. Going with this approach makes you manage the URLs of each file manually.
- Using the [assets](./assets) folder, where files will be processed being copied to the dist folder (`.next/static/assets`) and renamed as `[name]-[hash].[ext]` so they are properly updated if the content is updated, to prevent problems with client side caching when they actually need to be reloaded. Files managed by this method can be accessed in an url as `serverUrl/_next/static/*` but is managed automatically so you just need to use the imported string.

While using one method or another, it's always a good idea to configure a different server than Express to server those static files (i.e. nginx or apache), which usually provide better performance.

This is an example of Apache configuration to redirect all the requests except the static files to the Node JS server, so the static files are served by Apache itself (note that `NEXTJS_PROJECT_PATH` and `EXPRESS_PORT` should be replaced by real values):

```
Alias /public /NEXTJS_PROJECT_PATH/public
<Directory /NEXTJS_PROJECT_PATH/public>
  Options -Indexes +FollowSymLinks +MultiViews
  AllowOverride All
  Require all granted
</Directory>

Alias /assets /NEXTJS_PROJECT_PATH/.next/static/assets

<Directory /NEXTJS_PROJECT_PATH/.next/static/assets>
  Options -Indexes +FollowSymLinks +MultiViews
  AllowOverride All
  Require all granted
</Directory>

ProxyPass /public !
ProxyPass /assets !
ProxyPass / http://localhost:EXPRESS_PORT/

<Proxy *>
  Require all granted
</Proxy>
```

### Bundle Analyzer

Just add `ANALYZE=true` in the environment variables to generate the report:

```
ANALYZE=true npm run build
```
