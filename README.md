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

Install jest and write some basic unit tests on logical functions
Unify Responses - make error as an error object, and message as err.toString()
Use logger where needed throughout app
Test adding a new permission
