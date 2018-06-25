import { createStore, applyMiddleware } from 'redux'
import { AppInsights } from 'applicationinsights-js'

import {
  createAppInsightsMiddleware,
  createAppInsightsReducer,
  setup
} from '../src/redux-appinsights'

const middlewareAPIMock = {
  dispatch(fn) {
    return fn()
  },
  getState() {
    return {}
  }
}

describe('AppInsights Test', () => {
  it('middleware', () => {
    const testAction = jest.fn()
    const mid = createAppInsightsMiddleware(AppInsights)
    expect(mid).toBeTruthy()
    mid(middlewareAPIMock)(testAction)({ type: 'ACTION' })
    expect(testAction).toBeCalledWith({ type: 'ACTION' })
  })

  it('middleware accepts prop', () => {
    const testAction = jest.fn()
    const mid = createAppInsightsMiddleware(AppInsights, 'ai')
    expect(mid).toBeTruthy()
    mid(middlewareAPIMock)(testAction)({ type: 'ACTION' })
    expect(testAction).toBeCalledWith({ type: 'ACTION' })
  })

  it('reducer catches event', () => {
    const event = { method: 'trackPageView', data: ['myPage'] }
    const reducer = createAppInsightsReducer()
    expect(reducer).toBeTruthy()

    const state = reducer(undefined, { type: '', appinsights: event })
    expect(state.events).toContain(event)
  })

  it('reducer skips common action', () => {
    const reducer = createAppInsightsReducer('ai')
    const state = reducer({ events: [], key: null }, { type: 'ACTION', payload: null })

    expect(state.events.length).toBe(0)
  })

  it('integrates', () => {
    const store = createStore(
      createAppInsightsReducer(),
      applyMiddleware(createAppInsightsMiddleware(AppInsights))
    )
    const testAction = {
      type: 'app/SOME_ACTION',
      payload: {},
      appinsights: {
        method: 'trackPageView',
        data: ['Name', 'http://url.com/']
      }
    }
    store.dispatch(setup('AI_KEY'))
    expect(AppInsights.downloadAndSetup).toBeCalledWith({ instrumentationKey: 'AI_KEY' })
    store.dispatch(testAction)
    expect(AppInsights.trackPageView).toBeCalledWith('Name', 'http://url.com/')

    const state = store.getState()
    expect(state.events).toContain(testAction.appinsights)
  })
})
