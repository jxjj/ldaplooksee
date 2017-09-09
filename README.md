# LDAP Look-See

> Command Line LDAP Search

Search LDAP from command-line

## Installation
```sh
$ npm install -g ldaplooksee
```

## Usage

### Interactive Lookups

ldaplooksee will prompt you for your ldap configuration.

```sh
$ ldaplooksee

[?] LDAP url?
> ldaps://ldap.example.org

[?] Base?
> dc=users,dc=localhost

[?] Username?
> cn=root

[?] Password?
> ******

[?] ldap search (e.g. `uid=artvandelay`)
> uid=artvandelay

[1/1]
dn: 'uid=artvandelay, dc=users, dc=localhost'
idNumber: 1234567
uid: 'artvandelay'
givenName: 'Art'
sn: 'Vandelay'
telephoneNumber: '555-123-4567'
```

### Quick search
Quick lookup, pass in uid as a command line argument

```sh
$ ldaplooksee artvandelay

[1/1]
dn: 'uid=artvandelay, dc=users, dc=localhost'
idNumber: 1234567
uid: 'artvandelay'
givenName: 'Art'
sn: 'Vandelay'
telephoneNumber: '555-123-4567'
```

### Reset Config
```sh
$ ldaplooksee --reset
```

## License

MIT © James Johnson

