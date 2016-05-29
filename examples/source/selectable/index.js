import React from 'react'
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { connect } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'

import createConnected from '../../../source/container'
import reducer from '../../../source/reducer'
import { selectTourer } from '../../../source/actions'

const TourTracker = createConnected()

const store = createStore(
  reducer,
  {},
  applyMiddleware(thunk, logger())
)

const WAYPOINTS = [
  [-27.465245, 153.028644],
  [-31.953573, 115.857006]
]

const TOURERS = [
  { id: '1', distance: 1000000 },
  { id: '2', distance: 2000000 }
]

const SELECTED_ICON = {
  iconSize: [32, 32],
  className: '',
  html: '<div style="background-color: blue; width: 100%; height: 100%" />'
}

const UNSELECTED_ICON = {
  iconSize: [32, 32],
  className: '',
  html: '<div style="background-color: grey; width: 100%; height: 100%" />'
}

const assignIcon = (selected) => (tourer) => {
  if (tourer.id === selected) {
    return ({
      ...tourer,
      icon: SELECTED_ICON
    })
  } else {
    return ({
      ...tourer,
      icon: UNSELECTED_ICON
    })
  }
}

const mapDispatch = (dispatch) => ({
  selectTourer: (id) => dispatch(selectTourer(id))
})
const mapState = ({ selected }) => ({ selected })

const Selectable = ({
  waypoints = [],
  tourers = [],
  selected = '',
  selectTourer
}) => {
  const decoratedTourers = tourers.map(assignIcon(selected))

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <TourTracker
        tourers={decoratedTourers}
        waypoints={waypoints}
        selected={selected}
      />
      <select
        value={selected}
        onChange={(e) => selectTourer(e.target.value)}
        style={{
          position: 'absolute',
          right: '1em',
          top: '1em'
        }}>
        <option value='1'>One</option>
        <option value='2'>Two</option>
      </select>
    </div>
  )
}

const Example = connect(
  mapState,
  mapDispatch
)(Selectable)

export default () => (
  <Provider store={store}>
    <Example
      waypoints={WAYPOINTS}
      tourers={TOURERS}
    />
  </Provider>
)
