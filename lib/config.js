const inquirer = require('inquirer');
const Conf = require('conf');

// beware: just obscures contents
const conf = new Conf({
  projectName: 'ldaplooksee',
  encryptionKey: '2lkjf9-RLKj3n-DNon@#-n4vv0-234ll',
});

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
  if (conf.size) return conf.store;

  const answers = await inquirer.prompt(configQuestions);
  const dn = `uid=${answers.username},dc=users,${answers.base}`;
  const config = Object.assign({}, answers, { dn });
  conf.set(config);
  return config;
}

function resetConfig() {
  conf.clear();
}

module.exports = {
  get: getConfig,
  reset: resetConfig,
};
