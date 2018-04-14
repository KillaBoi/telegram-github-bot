const {
  name,
  author,
  description,
  version,
  homepage,
  bugs: { url: issuesUrl },
} = require('../package.json');

module.exports = async ({ ctx }) => {
  await ctx.reply(
    [
      `I'm ${name} (v${version}) written by ${author}`,
      `My purpose is: ${description}`,
      `I'm open source: ${homepage}`,
      `Report bugs: ${issuesUrl}`,
    ].join('\n')
  );
};
