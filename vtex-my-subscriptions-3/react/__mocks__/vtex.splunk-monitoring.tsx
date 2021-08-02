import { graphql } from 'react-apollo'

export const main = {
  SplunkMonitoring: () => ({
    logGraphQLError: () => null,
  }),
}

export const withQueryWrapper = (_: any, args: any) => {
  return graphql(args.document, args.operationOptions)
}
