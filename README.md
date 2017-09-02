# LDAP Look-See

> Command Line LDAP Search

Search LDAP from command-line

## Installation
```sh
$ npm install -g ldaplooksee
```

## Usage

```sh
$ ldaplooksee

no saved config

[?] LDAP url (e.g. ldaps://ldap.hostname.com:1389)
> ldaps://ldap.example.org

[?] Base for searching users
> dc=users,dc=localhost

[?] Distinguished Name (DN)
> cn=root

[?] Password
> ******

[?] Save Config to `~/.ldaplooksee.json`
[Yn] YES/no
> Y

saving config ... done!

[?] ldap search filter (e.g. `uid=artvandelay`)
> uid=artvandelay

[1/1]
dn: 'uid=artvandelay, dc=users, dc=localhost'
idNumber: 1234567
uid: 'artvandelay'
givenName: 'Art'
sn: 'Vandelay'
telephoneNumber: '555-123-4567'
```

Quick lookup:

```sh
$ ldaplooksee uid=artvandelay

[1/1]
dn: 'uid=artvandelay, dc=users, dc=localhost'
idNumber: 1234567
uid: 'artvandelay'
givenName: 'Art'
sn: 'Vandelay'
telephoneNumber: '555-123-4567'
```

## License

MIT © James Johnson

