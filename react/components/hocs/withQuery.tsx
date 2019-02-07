import { ApolloError } from 'apollo-client' 
import React, { Component, ComponentType } from 'react'
import { Query, QueryOpts } from 'react-apollo'

interface ErrorCallback {
  error?: ApolloError, 
  refetch?: () => void,
  info: any
}

interface WithQueryArgs {
  component: ComponentType,
  loadingState: ComponentType,
  errorState: ComponentType,
  emptyState: ComponentType,
  queryProps: QueryCustom,
  errorCallback: (args: ErrorCallback) => void,
  validateEmpty: (data: any) => boolean,
}

interface CurrenState {
  component: ComponentType,
  props: any
}

interface WithQueryComponentState {
  hasError: boolean,
  componentError: any
}

interface QueryCustom extends QueryOpts {
  query: any,
  children: any,
  onCompleted: any,
  onError: any,
}

interface CurrentStateArgs {
  data: any, 
  loading: boolean, 
  queryError?: ApolloError, 
  refetch: () => void 
}

export function withQuery({
   component: WrappedComponent, 
   loadingState: LoadingState, 
   errorState: ErrorState, 
   emptyState: EmptyState,
   queryProps,
   errorCallback,
   validateEmpty, 
  }: WithQueryArgs) {

  return class WithQueryComponent extends Component {
    public static displayName = `WithQueryComponent(${WrappedComponent && WrappedComponent.displayName ||
      WrappedComponent && WrappedComponent.name || ''})`

    public state : WithQueryComponentState  = {
      componentError: null,
      hasError: false,
    }

    public componentDidCatch = (error: any, info: any) => {
      this.setState({ hasError: true, componentError: error })
      errorCallback({ error, info })
    }

    public currentState = ({ data, loading, queryError, refetch } : CurrentStateArgs): CurrenState => {
      const { hasError, componentError } = this.state

      if (loading) {
        return { component: LoadingState, props: {} }
      }

      if (queryError || hasError) {
        return { component: ErrorState, props: { error: queryError || componentError, refetch } } 
      }

      if(validateEmpty && validateEmpty(data)) {
        return { component: EmptyState, props: {} }
      }

      return { component: WrappedComponent, props: { data }}
    }

    public render = () => {
      return (
        <Query {...queryProps}>
          {({ data, loading, error, refetch }) => {

            const CurrentState = this.currentState({data, loading, queryError: error, refetch})

            return <CurrentState.component {...CurrentState.props} />
          }}
        </Query>
      )
    }
  }
}