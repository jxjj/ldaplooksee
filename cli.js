#!/usr/bin/env node

const inquirer = require('inquirer');
const meow = require('meow');
const SimpleLDAPSearch = require('simple-ldap-search').default;
const config = require('./lib/config');
const prettifyLDAPResults = require('./lib/prettifyLDAPResults');

const log = console.log;

const cli = meow(`
Usage
  $ ldaplooksee <username>

Options
  --reset   resets configuration

Examples
  $ ldaplooksee mlisa

  $ ldaplooksee
  [?] ldap url?
  [?] ldap base?
  [?] ldapsearch (e.g. uid=mlisa)?

  $ ldaplooksee --reset

`);

const filterQuestions = [
  {
    type: 'input',
    name: 'filter',
    message: 'ldap search (e.g. `uid=artvandelay`)?',
  },
];

async function main() {
  if (cli.flags.reset) {
    log('Resetting config');
    config.reset();
  }
  const ldapConfig = await config.get();

  // if string was passed in on cli, assume it's the uid
  // and skip the questions
  const uid = cli.input ? cli.input[0] : null;

  const { filter } = uid ? { filter: `uid=${uid}` } : await inquirer.prompt(filterQuestions);
  const ldap = new SimpleLDAPSearch(ldapConfig);
  await ldap
    .search(filter)
    .then(prettifyLDAPResults)
    .catch(err => log(err.message));
  ldap.destroy();
}

// log unhandled rejections
process.on('unhandledRejection', (reason, p) => {
  log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

main();
