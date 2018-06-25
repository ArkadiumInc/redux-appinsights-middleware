# Redux AppInsights Middleware ([Docs](https://arkadiuminc.github.io/redux-appinsights-middleware/))


[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Greenkeeper badge](https://badges.greenkeeper.io/ArkadiumInc/redux-appinsights-middleware.svg)](https://greenkeeper.io/)
[![Travis](https://img.shields.io/travis/ArkadiumInc/redux-appinsights-middleware.svg)](https://travis-ci.org/ArkadiumInc/redux-appinsights-middleware)
[![Coveralls](https://img.shields.io/coveralls/ArkadiumInc/redux-appinsights-middleware.svg)](https://coveralls.io/github/ArkadiumInc/redux-appinsights-middleware)

This middleware provides a more robust AppInsights API for Redux-based applications.

## Installation
At first, install the package:

```
$ npm install redux-appinsights-middleware
```

## Usage

Then use a middleware and reducer in your redux store:
```typescript
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { setup, createAppInsightsMiddleware, createAppInsightsReducer } from "redux-appinsights-middleware";
import { AppInsights } from "applicationinsights-js";

import * as reducers from "./reducers/";

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore<IState>(
    combineReducers<IState>({ ...reducers, appinsights: createAppInsightsReducer() }),
    composeEnhancers(applyMiddleware(createAppInsightsMiddleware(AppInsights) )),
);

// Now you can track events like this:
store.dispatch({
    type: "app/MY_ACTION",
    payload: { ... },
    appinsights: {
        method: "trackPageView",
        data: [ "Page Title", "http://page.url" ],
    }
});

// If you aren't dispatch this action, nothing will be sent to AppInsights
store.dispatch(setup(AI_KEY));
```
