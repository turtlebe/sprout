module.exports = {
  options: {},
  prompts: [
    {
      type: 'input',
      name: 'appName',
      message: 'Your Sprout app name - kebab case (ex: lab-testing)',
      validate: function(input) {
        if (!/^([a-z][a-z0-9]*)(-[a-z0-9]+)*$/.test(input)) {
          return 'Invalid app name, must be kebab format.';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'appDesc',
      message: 'Your Sprout app description.',
      default: 'My new Sprout app',
    },
  ],
  dirsToCreate: ['src'],
  filesToCopy: [
    {
      input: '_tsconfig.json',
      output: 'tsconfig.json',
    },
  ],
  filesToRender: [
    {
      input: '_package.json',
      output: 'package.json',
    },
    {
      input: 'index.template',
      output: 'src/index.tsx',
    },
  ],
};
