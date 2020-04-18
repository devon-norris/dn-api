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

deleteTestUsers
deleteTestOrgs

- create separate files for everything
- at the end, throw error if errors array is not empty

Create cross org tests
Finish permissions service
