const { expect } = require('chai')
const { Params } = require('./params.js')

function create (agent, path, params) {
  params = new Params(params)
  const comment = params.string('comment', 'default comment')
  const label = params.string('label', 'default label')
  params.assertEmpty()

  return agent
    .post(path)
    .send({
      comment: comment,
      label: label,
    })
}

function del (agent, path) {
  return agent.delete(path)
}

function delUnverified (agent, path) {
  return agent.delete(path).ok((r) => r.status === 200 || r.status === 404)
}

function createAfterDel (agent, path, params) {
  return (async () => {
    await delUnverified(agent, path)
    const r = await create(agent, path, params)
    verifyCreateSuccess(r)
    return r
  })()
}

function verifyCreateSuccess (r) {
  expect(r.status).to.equal(200)
  expect(r.body['api:status']).to.equal('api:success')
  expect(r.body['@type']).to.equal('api:DbCreateResponse')
}

function verifyCreateFailure (r) {
  expect(r.status).to.equal(400)
  expect(r.body['@type']).to.equal('api:DbCreateErrorResponse')
  expect(r.body['api:status']).to.equal('api:failure')
}

function verifyDeleteSuccess (r) {
  expect(r.status).to.equal(200)
  expect(r.body['api:status']).to.equal('api:success')
  expect(r.body['@type']).to.equal('api:DbDeleteResponse')
}

function verifyDeleteFailure (r) {
  expect(r.status).to.equal(400)
  expect(r.body['api:status']).to.equal('api:failure')
  expect(r.body['@type']).to.equal('api:DbDeleteErrorResponse')
}

function verifyDeleteNotFound (r) {
  expect(r.status).to.equal(404)
  expect(r.body['api:status']).to.equal('api:not_found')
  expect(r.body['@type']).to.equal('api:DbDeleteErrorResponse')
}

module.exports = {
  create,
  del,
  delUnverified,
  createAfterDel,
  verifyCreateSuccess,
  verifyCreateFailure,
  verifyDeleteSuccess,
  verifyDeleteFailure,
  verifyDeleteNotFound,
}
