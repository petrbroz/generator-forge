'use strict';

const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    this.log(
      yosay(`Welcome to the kickass ${chalk.red('generator-forge')} generator!`)
    );

    const prompts = [
      {
        type: 'input',
        name: 'project_name',
        message: 'Project name',
        default: this.appname
      },
      {
        type: 'input',
        name: 'project_desc',
        message: 'Project description'
      },
      {
        type: 'input',
        name: 'author_name',
        message: 'Your name'
      },
      {
        type: 'input',
        name: 'author_email',
        message: 'Your e-mail'
      },
      {
        type: 'input',
        name: 'forge_client_id',
        message: 'Forge client ID'
      },
      {
        type: 'input',
        name: 'forge_client_secret',
        message: 'Forge client secret'
      },
      {
        type: 'input',
        name: 'forge_bucket',
        message: 'Forge bucket'
      },
      {
        type: 'confirm',
        name: 'vscode',
        message: 'Would you like to setup Visual Studio Code?',
        default: true
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  writing() {
    const copy = (path, context) => {
      const srcPath = this.templatePath(path);
      const dstPath = this.destinationPath(path);
      if (context) {
        this.fs.copyTpl(srcPath, dstPath, context);
      } else {
        this.fs.copy(srcPath, dstPath);
      }
    };

    copy('public');
    copy('routes');
    copy('config.js');
    copy('server.js');
    copy('package.json', this.props);
    copy('LICENSE', this.props);
    copy('README.md', this.props);
    if (this.props.vscode) {
      copy('.vscode/extensions.json', this.props);
      copy('.vscode/launch.json', this.props);
      copy('.vscode/settings.json', this.props);
    }

    const ignore = [
      'node_modules/',
      '.vscode/',
      '*.log',
      'Thumbs.db',
      '.DS_Store'
    ];
    this.fs.write(this.destinationPath('.gitignore'), ignore.join('\n'));
  }

  install() {
    this.installDependencies();
  }
};
