const assert = require('assert');
const { sample, range } = require('lodash');

const { GITHUB_REPO, GITHUB_OWNER, ADD_ISSUE_REPLY_STICKER_IDS } = process.env;

const addIssueReplyStickers = (ADD_ISSUE_REPLY_STICKER_IDS || '').split(/,/g);

const OKAY_EMOJI = '👌';

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
    body: OKAY_EMOJI,
  });

  const stickerId = sample(addIssueReplyStickers);

  if (stickerId) {
    await ctx.replyWithSticker(stickerId);
  }

  await ctx.reply(`Added. ${issue.html_url}`);
};
