const { expect } = require('chai')
const { agents } = require('../lib')

describe('root', function () {
  let agent

  before(function () {
    agent = agents.base()
  })

  it('responds with HTML', async function () {
    const r = await agent.get('/')
    expect(r.status).to.equal(200)
    expect(r.header['content-type']).to.equal('text/html')
  })
})
