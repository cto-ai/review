const { ux } = require('@cto.ai/sdk');
const { addComment, inputReviewerName } = require('../prompts');
const { handleError } = require('./helpers');

/**
 * mergePR
 *
 * @param {typeof Octokit} api  GitHub Octokit object
 * @param {object} selectedPR  The PR detailed info object
 *
 * @return {object} The response body from addPRComment request
 */
const mergePR = async (api, selectedPR) => {
  try {
    const res = api.pulls.merge({
      owner: selectedPR.owner,
      repo: selectedPR.name,
      pull_number: selectedPR.number
    });
    return res;
  } catch (err) {
    await handleError(err, '❗️  Failed to merge in selected PR');
  }
};

/**
 * approvePR
 *
 * @param {typeof Octokit} api  GitHub Octokit object
 * @param {object} selectedPR  The PR detailed info object
 *
 * @return {object} The response body from addPRComment request
 */
const approvePR = async (api, selectedPR) => {
  try {
    const res = api.pulls.createReview({
      owner: selectedPR.owner,
      repo: selectedPR.name,
      pull_number: selectedPR.number,
      event: 'APPROVE'
    });
    return res;
  } catch (err) {
    await handleError(err, '❗  Failed to approve selected PR');
  }
};

/**
 * addReviewer
 *
 * @param {typeof Octokit} api  GitHub Octokit object
 * @param {object} selectedPR  The PR detailed info object
 *
 * @return {object} The response body from addPRComment request
 */
const addReviewer = async (api, selectedPR) => {
  try {
    const { reviewer } = await ux.prompt(inputReviewerName);
    const res = api.pulls.createReviewRequest({
      owner: selectedPR.owner,
      repo: selectedPR.name,
      pull_number: selectedPR.number,
      reviewers: [reviewer]
    });
    return res;
  } catch (err) {
    await handleError(err, '❗️  Failed to add reviewer to PR selected');
  }
};

/**
 * addPRComment creates a new comment on the PR
 *
 * @param {typeof Octokit} api  GitHub Octokit object
 * @param {object} selectedPR  The PR detailed info object
 *
 * @return {object} The response body from addPRComment request
 */
const addPRComment = async (api, selectedPR) => {
  const { comment } = await ux.prompt(addComment);
  // This function needs to specify the path of the diff where we want to add the comment.
  try {
    const res = await api.pulls.createReview({
      owner: selectedPR.owner,
      repo: selectedPR.name,
      pull_number: selectedPR.number,
      event: 'COMMENT',
      body: comment
    });
    return res;
  } catch (err) {
    await handleError(err, '❗️ Failed to add comment to PR');
  }
};

/**
 * linkToReview some comment here
 *
 * @param {string} url The link to PR on web
 *
 */
const linkToReview = async url => {
  await ux.print(`Go to: ${url}`);
};

/**
 * runSelectedJob runs the user's selected job.
 *
 * @param {typeof Octokit} api  GitHub Octokit object
 * @param {string} job   The job selected by the user
 * @param {object} selectedPR  The PR detailed info object
 *
 * @return {object} The jobs response body
 */
const runSelectedJob = async (api, job, selectedPR) => {
  let res = '';
  if (selectedPR) {
    switch (job) {
      case 'Merge':
        res = await mergePR(api, selectedPR);
        return res;
      case 'Approve':
        res = await approvePR(api, selectedPR);
        return res;
      case 'Add reviewer':
        res = await addReviewer(api, selectedPR);
        return res;
      case 'Comment':
        res = await addPRComment(api, selectedPR);
        return res;
      case 'View in browser':
        await linkToReview(selectedPR.url);
        return 'Success';
      default:
        await linkToReview(selectedPR.url);
        return 'Success';
    }
  } else {
    await handleError(
      new Error('Unable to match selectedPR'),
      '❗️  Failed to look up selected PR'
    );
  }
};

module.exports = {
  mergePR,
  approvePR,
  addReviewer,
  addPRComment,
  linkToReview,
  runSelectedJob
};
