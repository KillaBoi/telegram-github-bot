const assert = require('assert');
const { sample, range } = require('lodash');

const { GITHUB_REPO, GITHUB_OWNER, ADD_ISSUE_REPLY_STICKER_IDS } = process.env;
const SPICE = '🌶️';

const addIssueReplyStickers = (ADD_ISSUE_REPLY_STICKER_IDS || '').split(/,/g);

assert(GITHUB_OWNER, 'GITHUB_OWNER');
assert(GITHUB_REPO, 'GITHUB_REPO');

module.exports = async ({ ctx, octokit }) => {
  const title = ctx.message.text
    .split(/ /g)
    .slice(1)
    .join(' ');

  const { data: issue } = await octokit.issues.create({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    title,
    body: range(0, 4)
      .map(_ => SPICE)
      .join(''),
  });

  const stickerId = sample(addIssueReplyStickers);

  if (stickerId) {
    await ctx.replyWithSticker(stickerId);
  }

  await ctx.reply(`Thanks! ${issue.html_url}`);
};
