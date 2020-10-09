# nextjs-boilerplate

A boilerplate to use in projects with NextJs and TypeScript.

## Features

### Ready

- TypeScript support
- TypeScript source path aliases support
- [Prettier](https://prettier.io/)
- [Linting](https://palantir.github.io/tslint/)
- [Git hooks](https://github.com/typicode/husky)
- Advanced [build time constants](./build-time-constants/README.md) (including [git revisions](https://www.npmjs.com/package/git-revision-webpack-plugin) and secrets)
- [Redux](https://redux.js.org/) integration with hooks and compatible with
  - [Redux Devtools Extension](https://github.com/zalmoxisus/redux-devtools-extension)
  - [redux-thunk](https://github.com/reduxjs/redux-thunk)
  - [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware)
  - [redux-immutable-state-invariant](https://github.com/leoasis/redux-immutable-state-invariant)

### Planned

- [Material UI](https://material-ui.com/)
- Server settings read from filesystem
- Isomorphic server and client logs
- i18n
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
