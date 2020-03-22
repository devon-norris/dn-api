export default {
  urlQueryParams: 'retryWrites=true',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  environments: {
    development: 'development',
    staging: 'staging',
    production: 'production',
  },
}
