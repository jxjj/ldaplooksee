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
    message: 'Base?',
    default: 'dc=accounts,dc=ldap,dc=mcad,dc=edu',
  },
  {
    type: 'input',
    name: 'usernameOrDN',
    message: 'Username or Distinguished Name (DN)?',
  },
  {
    type: 'password',
    name: 'password',
    mask: '*',
    message: 'Password?',
  },
];

async function getConfig() {
  if (conf.size) return conf.store;

  const { url, base, usernameOrDN, password } = await inquirer.prompt(configQuestions);

  // if usernameOrDN contains an = sign, then assume it's a dn
  // if not assume it's a username and construct a DN with it
  const dn = usernameOrDN.match(/.*=+.*/) ? usernameOrDN : `uid=${usernameOrDN},dc=users,${base}`;

  const config = { url, base, dn, password };
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
