const { ux, sdk } = require('@cto.ai/sdk');
const { getLogo } = require('../constants');

const underlinePrerequisites = `${ux.colors.bold.underline(
  '\nℹ️  Prerequisites:'
)}`;
const linkGithubToken = `${ux.colors.cyanBright(
  'https://github.com/settings/tokens/new'
)}`;

const preRequisites = `\n${underlinePrerequisites}
🔑  Access token for GitHub interactions.
Follow the link to create an access token -> ${linkGithubToken}.\n`;

const showPreRunMessage = async () => {
  const logo = getLogo();
  await ux.print(logo);
  await ux.print(`\n🚀  ${ux.colors.bgRed('CTO.ai - Review')} 🚀\n`);
  await ux.print(
    'This Op will help you manage open Pull-Requests on GitHub by allowing you to:\n* Merge PRs\n* Approve PRs\n* Add reviewers\n* Make comments\n* Quickly show PR in the browser'
  );
  await ux.print(preRequisites);
};

const track = async trackingData => {
  const metadata = {
    event: `${trackingData.event}`,
    ...trackingData
  };
  await sdk.track(['track', 'review'], metadata);
};

const handleSuccess = async msg => {
  await ux.print(msg);
  await track({
    event: `Review Completed`,
    msg
  });
  process.exit();
};

const handleError = async (err, errMsg) => {
  await ux.print(errMsg);
  if (err && err.status && err.status === 404) {
    await ux.print(
      '🤔  Unable find GitHub resource, please make sure you have the right permissions'
    );
  }
  await track({
    event: `Error occurred: check logs for details`,
    errMsg,
    error: `${err.name} ${err.message}`
  });
  process.exit(1);
};

module.exports = {
  showPreRunMessage,
  handleSuccess,
  handleError
};
