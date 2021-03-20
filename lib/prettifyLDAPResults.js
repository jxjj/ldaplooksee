import chalk from 'chalk';

const { log } = console;

/**
 * prettier LDAP Results Array
 * @param {Object} results
 */
export default function prettifyLDAPResults(results) {
  const total = results.length;

  if (!total) return log(chalk.red('\nNo results.'));

  return results.forEach((obj, i) => {
    // log item number
    log(chalk.cyan(`\n[${i + 1}/${total}]`));

    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const label = `${key.padStart(30)}:`;

      log(`${chalk.gray(label)} ${chalk.hex('#ccc')(value)}`);
    });
  });
}
