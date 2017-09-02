#!/usr/bin/env node

const path = require('path');
const os = require('os');
const fs = require('fs');
const { promisify } = require('util');
const inquirer = require('inquirer');
const SimpleLDAPSearch = require('simple-ldap-search').default;

const configQuestions = [
  {
    type: 'input',
    name: 'url',
    message: 'LDAP url, e.g. `ldaps://ldap.example.org`?',
  },
  {
    type: 'input',
    name: 'base',
    message: 'base, e.g. `dc=accounts,dc=ldap,dc=example,dc=org`?',
  },
  {
    type: 'input',
    name: 'dn',
    message: 'dn, e.g. `uid=artvandelay,dc=users,dc=accounts,dc=ldap,dc=example,dc=org`',
  },
  {
    type: 'password',
    name: 'password',
    mask: '*',
    message: 'Password?',
  },
];

const filterQuestions = [
  {
    type: 'input',
    name: 'filter',
    message: 'ldap search (e.g. `uid=artvandelay`)?',
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
    // console.log(err);
    console.log('No saved config.');
    const answers = await inquirer.prompt(configQuestions);
    console.log('Saving config ... ');
    await writeFileAsync(filename, JSON.stringify(answers), { mode: 0o600 });
    return answers;
  }
}

function printResults(results) {
  const total = results.length;
  console.log(`${total} RESULTS\n`);

  results.forEach((result, i) => {
    console.log(`\n[${i}/${total}]`);
    console.log(result);
  });
}

async function main() {
  console.log('LDAP Look-See');
  const config = await getConfig();
  const { filter } = await inquirer.prompt(filterQuestions);
  const ldap = new SimpleLDAPSearch(config);

  try {
    const results = await ldap.search(filter);
    printResults(results);
  } catch (err) {
    // console.error(err);
  }
  ldap.destroy();
}

main();
