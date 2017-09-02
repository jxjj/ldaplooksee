#!/usr/bin/env node

const inquirer = require('inquirer');
const SimpleLDAPSearch = require('simple-ldap-search').default;
const getConfig = require('./lib/getConfig');

const filterQuestions = [
  {
    type: 'input',
    name: 'filter',
    message: 'ldap search (e.g. `uid=artvandelay`)?',
  },
];

function printResults(results) {
  const total = results.length;
  console.log(`${total} RESULTS\n`);

  results.forEach((result, i) => {
    console.log(`\n[${i}/${total}]`);
    console.log(result);
  });
}

async function main() {
  try {
    console.log('LDAP Look-See');
    const config = await getConfig();
    const { filter } = await inquirer.prompt(filterQuestions);
    const ldap = new SimpleLDAPSearch(config);

    const results = await ldap.search(filter);
    printResults(results);
    ldap.destroy();
  } catch (err) {
    console.error(err);
  }
}

main();
