let guid = 1

export function getGUID() {
  return (guid++ * new Date().getTime() * -1).toString()
}

export const parseErrorMessageId = error => {
  if (
    error &&
    error.graphQLErrors.length > 0 &&
    error.graphQLErrors[0].extensions &&
    error.graphQLErrors[0].extensions
  ) {
    return `subscription.fetch.${(error.graphQLErrors[0].extensions.error &&
      error.graphQLErrors[0].extensions.error.statusCode &&
      error.graphQLErrors[0].extensions.error.statusCode.toLowerCase()) ||
      'timeout'}`
  }
}

export const getLastInstance = instances => {
  if (instances && instances.length !== 0) {
    return instances.reduce((accumulator, currentValue) =>
      accumulator.date > currentValue.date ? accumulator : currentValue
    )
  }
}
