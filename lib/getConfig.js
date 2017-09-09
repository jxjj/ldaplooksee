import path from 'path';
import os from 'os';
import fs from 'fs';
import { promisify } from 'util';
import inquirer from 'inquirer';

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
