// Replace with winston
export default {
  // eslint-disable-next-line
  child: (childParams: any): any => ({
    error: (str: string, obj: any): void => console.error(str, obj),
    warn: (str: string, obj: any): void => console.warn(str, obj),
    info: (str: string, obj: any): void => console.log(str, obj),
    http: (str: string, obj: any): void => console.log(str, obj),
    verbose: (str: string, obj: any): void => console.log(str, obj),
    debug: (str: string, obj: any): void => console.log(str, obj),
    silly: (str: string, obj: any): void => console.log(str, obj),
  }),
}
