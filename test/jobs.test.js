const sinon = require('sinon')
const chai = require('chai')
const { ux } = require('@cto.ai/sdk')
const { Octokit } = require('@octokit/rest')
const { inputReviewerName, addComment } = require('../prompts')
const {
  mergePR,
  approvePR,
  addReviewer,
  addPRComment,
  linkToReview,
} = require('../utils/jobs')

const sandbox = sinon.createSandbox()
const api = new Octokit()

describe('Unit testing job functions', () => {
  let print
  before(() => {
    print = sandbox.stub(ux, 'print')
    sandbox
      .stub(ux, 'prompt')
      .withArgs(inputReviewerName)
      .returns(
        Promise.resolve({
          reviewer: 'testuser',
        })
      )
      .withArgs(addComment)
      .returns(
        Promise.resolve({
          comment: 'test',
        })
      )
    sandbox.stub(api.pulls, 'merge').returns('success')
    sandbox.stub(api.pulls, 'createReview').returns('success')
    sandbox.stub(api.pulls, 'createReviewRequest').returns('success')
  })
  after(() => {
    sandbox.restore()
  })
  afterEach(() => {
    sandbox.resetHistory()
  })

  const selectedPR = {
    owner: 'test',
    repo: 'test',
    pull_number: 1,
  }
  it('mergePR returns the API response to request to merge', async () => {
    const res = await mergePR(api, selectedPR)
    chai.assert.strictEqual(res, 'success')
  })

  it('approvePR returns the API response to approve PR', async () => {
    const res = await approvePR(api, selectedPR)
    chai.assert.strictEqual(res, 'success')
  })

  it('addReviewer returns the API response to request to add a reviewer to PR', async () => {
    const res = await addReviewer(api, selectedPR)
    chai.assert.strictEqual(res, 'success')
  })

  it('addPRComment returns the API response to add a comment to a PR', async () => {
    const res = await addPRComment(api, selectedPR)
    chai.assert.strictEqual(res, 'success')
  })
  it('linkToReview prints the passed URL for the user', async () => {
    await linkToReview('testURL')
    sinon.assert.calledOnce(print)
    sinon.assert.calledWith(print, 'Go to: testURL')
  })
})
