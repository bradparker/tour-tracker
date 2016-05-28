import React from 'react'
import sinon from 'sinon'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import { describe, before, after, it } from 'mocha'

import { mount } from 'enzyme'

chai.use(chaiEnzyme())

import Map from '../'

const setLatLngSpy = sinon.spy()
const leafletSetUp = () => {
  global.L = {
    map: sinon.spy(function () {
      return {
        addLayer () {},
        dragging: { disable () {} },
        touchZoom: { disable () {} },
        doubleClickZoom: { disable () {} },
        scrollWheelZoom: { disable () {} },
        keyboard: { disable () {} },
        on () {},
        fitBounds () {}
      }
    }),

    divIcon () {},

    point () {},

    tileLayer () {
      return {
        addTo () {}
      }
    },

    featureGroup () {
      return {
        addLayer () {}
      }
    },

    addLayer () {},

    polyline () {
      return {
        addTo () {}
      }
    },

    marker: sinon.spy(function () {
      return {
        bindPopup () { return this },
        setIcon () {},
        setLatLng: setLatLngSpy,
        addTo () {},

        _popup: {
          setContent () {}
        }
      }
    })
  }
}

const leafletTearDown = () => {
  global.L = undefined
}

const createSampleMap = (
  route = [
    { point: [0, 0], totalDistance: 0, bearing: 90 },
    { point: [0, 50], totalDistance: 5560000 }
  ],
  tourers = [
    { id: 1, distance_in_meters: 0 },
    { id: 2, distance_in_meters: 2780000 },
    { id: 3, distance_in_meters: 5560000 }
  ]
) => (
  mount(<Map
    route={route}
    tourers={tourers}
  />)
)

describe('Map', () => {
  before(() => {
    leafletSetUp()
  })

  after(() => {
    leafletTearDown()
  })

  it('creates a leaflet map on mount', () => {
    mount(<Map />)
    expect(global.L.map.called).to.be.ok
  })

  it('creates a leafter marker for each supplied tourer as well the start and finish points', () => {
    global.L.marker.reset()
    createSampleMap()
    expect(global.L.marker.callCount).to.eq(5)
  })

  it('positions the start marker at the first route point', () => {
    global.L.marker.reset()
    createSampleMap()
    expect(global.L.marker.getCall(0).args[0]).to.eql([0, 0])
  })

  it('positions the finish marker at the lasst route point', () => {
    global.L.marker.reset()
    createSampleMap()
    expect(global.L.marker.getCall(1).args[0]).to.eql([0, 50])
  })

  it('positions the rider\'s markers according to how far along the route they are', () => {
    global.L.marker.reset()
    createSampleMap()
    expect(global.L.marker.getCall(2).args[0]).to.eql([0, 0])
    expect(global.L.marker.getCall(3).args[0].map((n) => Math.round(n))).to.eql([0, 25])
    expect(global.L.marker.getCall(4).args[0]).to.eql([0, 50])
  })

  it('updates rider information as it\'s provided to props', () => {
    const map = createSampleMap()
    map.setProps({
      tourers: [
        { id: 1, distance_in_meters: 2780000 },
        { id: 2, distance_in_meters: 2780000 },
        { id: 3, distance_in_meters: 5560000 }
      ]
    })
    expect(setLatLngSpy.getCall(0).args[0].map((n) => Math.round(n))).to.eql([0, 25])
    expect(setLatLngSpy.getCall(1).args[0].map((n) => Math.round(n))).to.eql([0, 25])
    expect(setLatLngSpy.getCall(2).args[0]).to.eql([0, 50])
  })
})
