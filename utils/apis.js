const { ux } = require('@cto.ai/sdk')
const { Octokit } = require('@octokit/rest')
const { ASSIGNED_STR, CREATED_STR } = require('../constants')
const { handleError } = require('./helpers')

/**
 * initializeAPIs initializes GitHub APIs
 *
 * @param {string} token  The token used to authenticate to the API
 *
 * @return {typeof Octokit} GitHub Octokit object
 */
const initializeAPIs = token => {
  const github = new Octokit({
    auth: token,
  })
  return github
}

/**
 * getUserData retrieves an object with main user info
 *
 * @param {typeof Octokit} api  GitHub Octokit object
 *
 * @return {string} The user name
 */
const getUserData = async api => {
  try {
    const { data } = await api.users.getAuthenticated()
    return data.login
  } catch (err) {
    await handleError(err, '❗️  Failed to authenticate GitHub token')
  }
}

/**
 * retrieveRepos returns all repos available from API (uses pagination with 100 results per page)
 *
 * @param {typeof Octokit} api  GitHub Octokit object
 *
 * @return {array} The repos name, owner and Id
 */
const retrieveRepos = async api => {
  // This API request is using octokit github SDK.
  try {
    const repos = await api.paginate('/user/repos', {}, response =>
      response.data.map(repo => {
        return {
          owner: repo.owner.login,
          name: repo.name,
          Id: repo.id,
        }
      })
    )
    return repos
  } catch (err) {
    await handleError(err, '❗️ Failed to retrieve user repositories')
  }
}

/**
 * getGithubPRs
 *
 * @param {Octokit} api   GitHub Octokit object
 * @param {object} repos  The repos name, owner and Id
 * @param {string} scope  The type of PR selected to show by user
 *
 * @return {object} The object containing main data from repos
 */
const getGithubPRs = async (api, repos, scope) => {
  await ux.spinner.start('Retrieving pull requests')
  const user = await getUserData(api)
  let PRs = []
  try {
    for (const repoData of repos) {
      const { owner, name } = repoData
      const rawPRs = await api.paginate(
        `/repos/${owner}/${name}/pulls`,
        {},
        response =>
          response.data.map(pull => {
            const {
              assignees,
              user: { login },
              title,
              id,
              html_url,
              number,
            } = pull
            return {
              title,
              name,
              Id: id,
              number,
              url: html_url,
              owner: login,
              assignees,
            }
          })
      )
      for (const rawPR of rawPRs) {
        const isAssigned = await isUserAssigned(user, rawPR.assignees)
        if (
          (scope === ASSIGNED_STR && !isAssigned) ||
          (scope === CREATED_STR && user !== rawPR.owner)
        ) {
          continue
        }
        PRs = PRs.concat(rawPR)
      }
    }
    await ux.spinner.stop('Done!')
    return PRs
  } catch (err) {
    await handleError(err, '❗️  Failed to retrieve PRs')
  }
}

/**
 * isUserAssigned checks if current user is assigned to specific PR
 *
 * @param {string} user      The user name
 * @param {array} assignees  The names of users assigned to the specific PR
 *
 * @return {boolean}  The result of checking if a user is assigned to a specific PR
 */
const isUserAssigned = (user, assignees) => {
  for (const assignee of assignees) {
    return assignee.login === user
  }
  return false
}

/**
 * formatPRchoices creates an array of objects with structured PR data
 *
 * @param {string[]} rawPRs      The array of rawPR data
 *
 * @return {string[]}  A formatted string array of the title of PRs
 */
const formatPRchoices = rawPRs => {
  return rawPRs.map(rawPR => rawPR.title)
}

/**
 * getSelectedPRInfo  filters the retrieved PRs to the type selected by user
 *
 * @param {string[]} rawPRs       The object containing main data from repos
 * @param {string} selectedPR   The name of PR selected by user
 *
 * @return {object}  The object containing main data from selected repo
 */
const getSelectedPRInfo = (rawPRs, selectedPR) => {
  for (const rawPR of rawPRs) {
    if (selectedPR === rawPR.title) {
      return rawPR
    }
  }
  return
}

module.exports = {
  initializeAPIs,
  getUserData,
  getGithubPRs,
  formatPRchoices,
  getSelectedPRInfo,
  retrieveRepos,
}
