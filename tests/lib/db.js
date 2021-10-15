const { expect } = require('chai')

const { Params } = require('./params.js')
const util = require('./util.js')

function path (params) {
  params = new Params(params)
  const orgName = params.string('orgName', process.env.TERMINUSDB_USER)
  const dbName = params.string('dbName', 'db-' + util.randomString())
  params.assertEmpty()

  return {
    path: `/api/db/${orgName}/${dbName}`,
    orgName: orgName,
    dbName: dbName,
  }
}

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
    verifyCreate(r)
    return r
  })()
}

function verifyDelete (r) {
  expect(r.status).to.equal(200)
  expect(r.body['@type']).to.equal('api:DbDeleteResponse')
  expect(r.body['api:status']).to.equal('api:success')
}

function verifyCreate (r) {
  expect(r.status).to.equal(200)
  expect(r.body['@type']).to.equal('api:DbCreateResponse')
  expect(r.body['api:status']).to.equal('api:success')
}

module.exports = {
  path,
  create,
  del,
  delUnverified,
  createAfterDel,
  verifyDelete,
  verifyCreate,
}
