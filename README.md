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

[staging](https://vast-fortress-23068.herokuapp.com/health)

[production](https://pacific-atoll-87761.herokuapp.com/health)

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
