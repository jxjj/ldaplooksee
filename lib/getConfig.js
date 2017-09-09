const path = require('path');
const os = require('os');
const fs = require('fs');
const { promisify } = require('util');
const inquirer = require('inquirer');

const log = console.log;

const configQuestions = [
  {
    type: 'input',
    name: 'url',
    message: 'LDAP url?',
    default: 'ldaps://ldap.mcad.edu',
  },
  {
    type: 'input',
    name: 'base',
    message: 'base?',
    default: 'dc=accounts,dc=ldap,dc=mcad,dc=edu',
  },
  // {
  //   type: 'input',
  //   name: 'dn',
  //   message: 'dn, e.g. `uid=artvandelay,dc=users,dc=accounts,dc=ldap,dc=example,dc=org`',
  // },
  {
    type: 'input',
    name: 'username',
    message: 'username?',
  },
  {
    type: 'password',
    name: 'password',
    mask: '*',
    message: 'password?',
  },
];

async function getConfig() {
  const readFileAsync = promisify(fs.readFile);
  const writeFileAsync = promisify(fs.writeFile);
  const filename = path.resolve(os.homedir(), '.ldaplooksee.json');

  try {
    const contents = await readFileAsync(filename, 'utf8');
    return JSON.parse(contents);
  } catch (err) {
    log('No saved config.');
    const answers = await inquirer.prompt(configQuestions);
    const dn = `uid=${answers.username},dc=users,${answers.base}`;
    const config = Object.assign({}, answers, { dn });

    log('Saving config ... ');
    await writeFileAsync(filename, JSON.stringify(config), { mode: 0o600 });
    return config;
  }
}

module.exports = getConfig;
