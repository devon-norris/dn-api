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

## Staging Dyno

```
heroku git:remote -a vast-fortress-23068
git remote rename heroku staging
```

Production Dyno

```
heroku git:remote -a pacific-atoll-87761
git remote rename heroku production
```

# Environments

[development](http://localhost:5000/health)

[staging](http://localhost:5000/health)

[production](http://localhost:5000/health)

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
