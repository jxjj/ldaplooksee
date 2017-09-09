#!/usr/bin/env node -r reify

// const inquirer = require('inquirer');
// const SimpleLDAPSearch = require('simple-ldap-search').default;
// const getConfig = require('./lib/getConfig');

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

// function printResults(results) {
//   const total = results.length;
//   console.log(`${total} RESULTS\n`);

//   results.forEach((result, i) => {
//     console.log(`\n[${i}/${total}]`);
//     console.log(result);
//   });
// }

async function main() {
  log('LDAP Look-See');
  const config = await getConfig();
  const { filter } = await inquirer.prompt(filterQuestions);
  const ldap = new SimpleLDAPSearch(config);
  await ldap
    .search(filter)
    .then(prettifyLDAPResults)
    .catch((err) => {
      console.error(err.message);
    });
  ldap.destroy();
}

// log unhandled rejections
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

main();
