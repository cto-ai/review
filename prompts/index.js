const { ASSIGNED_STR, CREATED_STR } = require('../constants');

const showPRTypes = {
  type: 'list',
  name: 'prTypes',
  message: `\nPlease select the type of PRs to display`,
  choices: [ASSIGNED_STR, CREATED_STR, 'All']
};

const selectPR = choices => [
  {
    type: 'list',
    name: 'selectedPR',
    message: `\nPlease select a pull request`,
    choices
  }
];

const jobPrompt = {
  type: 'list',
  name: 'job',
  message: `\nWhat would you like to do?`,
  choices: ['Merge', 'Approve', 'Add reviewer', 'Comment', 'View in browser']
};

const secret = {
  name: 'token',
  type: 'secret',
  message: 'Please select secret containing your API token'
};

const addComment = {
  type: 'input',
  name: 'comment',
  message: 'Please add your comment'
};

const inputReviewerName = {
  type: 'input',
  name: 'reviewer',
  message: 'Please add reviewer name (make sure they belong to the team)'
};

const shouldRefreshToken = {
  type: 'confirm',
  name: 'shouldRefresh',
  message: 'Would you like to authenticate as a different user?'
};

const newToken = {
  type: 'secret',
  name: 'token',
  message: 'Please enter the new GitHub personal access token'
};

module.exports = {
  jobPrompt,
  selectPR,
  showPRTypes,
  secret,
  addComment,
  inputReviewerName,
  shouldRefreshToken,
  newToken
};
