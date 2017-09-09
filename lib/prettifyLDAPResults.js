import chalk from 'chalk';

const log = console.log;

/**
 * prettier LDAP Results Array
 * @param {Object} results
 */
export default function (results) {
  results.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const label = `${key.padStart(30)}:`;

      log(`${chalk.gray(label)} ${chalk.hex('#ccc')(value)}`);
    });
  });
}
