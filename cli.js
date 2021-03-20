#!/usr/bin/env node

import inquirer from 'inquirer';
import meow from 'meow';
import SimpleLDAPSearch from 'simple-ldap-search';
import promiseTimeout from 'p-timeout';
import { resetConfig, getConfig } from './lib/config.js';
import prettifyLDAPResults from './lib/prettifyLDAPResults.js';

const { log } = console;

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
    resetConfig();
  }
  const ldapConfig = await getConfig();

  // if string was passed in on cli, assume it's the uid
  // and skip the questions
  const uid = cli.input ? cli.input[0] : null;

  const { filter } = uid ? { filter: `uid=${uid}` } : await inquirer.prompt(filterQuestions);
  const ldap = new SimpleLDAPSearch(ldapConfig);
  const timeout = 2000;
  await promiseTimeout(ldap.search(filter), timeout)
    .then(prettifyLDAPResults)
    .catch((err) => {
      if (err.name !== 'TimeoutError') return log(err.message);

      log(`Search timed out after ${timeout}ms.`);
      return process.exit();
    });

  ldap.destroy();
}

// log unhandled rejections
process.on('unhandledRejection', (reason, p) => {
  log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

main();
