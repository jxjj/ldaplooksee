#!/usr/bin/env node -r reify

import inquirer from 'inquirer';
import meow from 'meow';
import SimpleLDAPSearch from 'simple-ldap-search';
import config from './lib/config';
import prettifyLDAPResults from './lib/prettifyLDAPResults';

const log = console.log;

const cli = meow(`
Usage
  $ ldaplooksee

Options
  --reset   resets configuration

Examples
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
  const { filter } = await inquirer.prompt(filterQuestions);
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
