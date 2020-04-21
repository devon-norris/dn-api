Express API built with Node, Express, Typescript

# Heroku CLI

Install:

https://devcenter.heroku.com/articles/heroku-cli

Run:

```
heroku -v
heroku login
```

# Dynos

Staging Dyno

```
vast-fortress-23068
```

Production Dyno

```
pacific-atoll-87761
```

# Environments

development (only locally)

staging

production

# Heroku Commands

Deploying Dyno

```
git push [environment] master
```

Restarting Dyno

```
heroku restart --remote [environment]
```

Tail logs

```
heroku logs --tail --remote [environment]
```

TODO:

RE-WRITE smoke tests

- org model test
- permission model test?
- access control tests
- Create cross org tests

Finish permissions service
Write permissions tests

FILTER ORGS BY ONLY NAME AND ID IF NOT SUPER ADMIN REQUEST ON GET
