import 'applicationinsights-js'
import { Dispatch, Middleware, AnyAction } from 'redux'

type InsightsEvent = {
  method: keyof Microsoft.ApplicationInsights.IAppInsights
  data: any
}

const SETUP = 'appinsights/SETUP'

export function setup(key: string) {
  return { type: SETUP, payload: key }
}

/**
 * Middleware's creator
 * @param ai AppInsights instance
 * @param propName Property name to read from your Actions
 */
export function createAppInsightsMiddleware(
  ai: Microsoft.ApplicationInsights.IAppInsights,
  propName = 'appinsights'
): Middleware {
  return ({ dispatch, getState }) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    if (action.type === SETUP && ai.downloadAndSetup) {
      ai.downloadAndSetup({ instrumentationKey: action.payload })
    }
    const params: InsightsEvent = action[propName]
    if (params) {
      ;(ai as any)[params.method](...params.data)
    }
    next(action)
  }
}

/**
 * Reducer's creator
 * @param propName Property name to read from your Actions
 */
export function createAppInsightsReducer(propName = 'appinsights') {
  return (state = { events: [] as InsightsEvent[], key: null }, action: AnyAction) => {
    if (action[propName]) {
      return { events: state.events.concat(action[propName]) }
    } else {
      return state
    }
  }
}
