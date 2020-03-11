const { sdk, ux } = require('@cto.ai/sdk');
const {
  jobPrompt,
  showPRTypes,
  selectPR,
  shouldRefreshToken,
  newToken
} = require('./prompts');
const {
  showPreRunMessage,
  handleSuccess,
  handleError,
  initializeAPIs,
  getUserData,
  getGithubPRs,
  formatPRchoices,
  getSelectedPRInfo,
  retrieveRepos,
  runSelectedJob
} = require('./utils');

const main = async () => {
  await showPreRunMessage();

  try {
    const { GITHUB_TOKEN } = await sdk.getSecret('GITHUB_TOKEN');
    let github = initializeAPIs(GITHUB_TOKEN);

    const username = await getUserData(github);
    await ux.print(`The current authenticated GitHub user is ${username}`);
    const { shouldRefresh } = await ux.prompt(shouldRefreshToken);
    if (shouldRefresh) {
      const { token } = await ux.prompt(newToken);
      github = initializeAPIs(token);
    }

    const repos = await retrieveRepos(github);
    const { prTypes } = await ux.prompt(showPRTypes);
    const rawPRs = await getGithubPRs(github, repos, prTypes);
    if (!rawPRs.length) {
      await ux.print(
        "Sorry, we didn't find any PRs based on your search criteria"
      );
      return;
    }

    const prChoices = await formatPRchoices(rawPRs);
    const { selectedPR } = await ux.prompt(selectPR(prChoices));
    const selectedPRInfo = await getSelectedPRInfo(rawPRs, selectedPR);
    const { job } = await ux.prompt(jobPrompt);
    await runSelectedJob(github, job, selectedPRInfo);
    await handleSuccess(
      `🎉  Successfully completed chosen job for ${selectedPR}`
    );
  } catch (err) {
    await handleError(err, '❗️  Failed to run review!');
  }
};

main();
