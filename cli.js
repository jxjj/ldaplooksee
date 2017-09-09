#!/usr/bin/env node -r reify

import inquirer from 'inquirer';
import SimpleLDAPSearch from 'simple-ldap-search';
import getConfig from './lib/getConfig';
import prettifyLDAPResults from './lib/prettifyLDAPResults';

const log = console.log;

const filterQuestions = [
  {
    type: 'input',
    name: 'filter',
    message: 'ldap search (e.g. `uid=artvandelay`)?',
  },
];

async function main() {
  log('LDAP Look-See');
  const config = await getConfig();
  const { filter } = await inquirer.prompt(filterQuestions);
  const ldap = new SimpleLDAPSearch(config);
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
