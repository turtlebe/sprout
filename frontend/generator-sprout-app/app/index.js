/* eslint-disable @typescript-eslint/explicit-member-accessibility */
/* eslint-disable @typescript-eslint/no-var-requires */
const mkdirp = require('mkdirp');
const Generator = require('yeoman-generator');

const config = require('./config');

// generate app title from kebab case appName
function getTitle(appName) {
  var parts = appName.split('-');
  return parts.map(part => part[0].toUpperCase() + part.substring(1)).join('');
}

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    for (const optionName in config.options) {
      this.option(optionName, config.options[optionName]);
    }
  }

  initializing() {}

  prompting() {
    return this.prompt(config.prompts).then(answers => {
      this.appName = answers.appName;
      this.appDesc = answers.appDesc;
      this.appTitle = getTitle(this.appName);
    });
  }

  writing() {
    this.destinationRoot('app-' + this.appName);

    const templateData = {
      appName: this.appName,
      appTitle: this.appTitle,
      appDesc: this.appDesc,
    };

    const copy = (input, output) => {
      this.fs.copy(this.templatePath(input), this.destinationPath(output));
    };

    const copyTpl = (input, output, data) => {
      this.fs.copyTpl(this.templatePath(input), this.destinationPath(output), data);
    };

    // Render Files
    config.filesToRender.forEach(file => {
      copyTpl(file.input, file.output, templateData);
    });

    // Copy Files
    config.filesToCopy.forEach(file => {
      copy(file.input, file.output);
    });

    // Create extra directories
    config.dirsToCreate.forEach(item => {
      mkdirp(item);
    });
  }

  install() {
    // nothing to do yet.
  }
};
