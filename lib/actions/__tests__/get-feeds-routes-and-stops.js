/* global describe, expect, it */

describe('actions > getFeedsRoutesAndStops', () => {
  const nock = require('nock')
  const getFeedsRoutesAndStops = require('../get-feeds-routes-and-stops')

  it('should work when fetching via getAllRoutesAndStops and then getUnfetchedRoutes', async () => {
    const mockRoutes = [
      {
        route_id: '1',
        route_short_name: '1'
      }
    ]
    const mockResponse = {
      bundle: [
        {
          feeds: [
            {
              checksum: 'abcd',
              detailRoutes: mockRoutes,
              feed_id: '1',
              routes: mockRoutes,
              stops: [
                {
                  stop_id: '1'
                }
              ]
            }
          ]
        }
      ]
    }

    const nockHost = nock('http://mockhost.com/')
    nockHost.get(/^\/api\/graphql/)
      .reply(200, mockResponse)

    const getResult = getFeedsRoutesAndStops({ bundleId: 1 })

    // expect to receive increment action while making request
    expect(getResult[0]).toMatchSnapshot()

    // perform request
    const fetchResult = await getResult[1]

    // expect to receive decrement action upon fulfillment of request
    expect(fetchResult[0]).toMatchSnapshot()

    // parse response
    const parseResult = await fetchResult[1]

    // expect parse result to be what we desired
    expect(parseResult).toMatchSnapshot()

    // make request again, forcing fetching via getUnfetchedRoutes
    nockHost.get(/^\/api\/graphql/)
      .reply(200, mockResponse)

    const actionParams = {
      bundleId: 1,
      modifications: [
        {
          type: 'reroute',
          routes: ['2']
        }
      ]
    }
    const getResult2 = getFeedsRoutesAndStops(actionParams)

    // perform request
    const fetchResult2 = await getResult2[1]

    // parse response
    const parseResult2 = await fetchResult2[1]

    // expect parse result to be what we desired
    expect(parseResult2).toMatchSnapshot()
  })
})