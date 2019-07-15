import { ApolloError } from 'apollo-client'
import { DocumentNode } from 'graphql'
import hoistNonReactStatics from 'hoist-non-react-statics'
import React, { Component, ComponentClass, ComponentType } from 'react'
import { graphql, OperationOption } from 'react-apollo'
import { branch, compose, renderComponent } from 'recompose'

interface ErrorCallback {
  error?: ApolloError
  refetch?: () => void
  info: any
}

interface WithQueryArgs {
  document: DocumentNode
  operationOptions?: OperationOption<any, any> | undefined
  loadingState: ComponentType
  errorState: ComponentType
  emptyState?: ComponentType
  errorCallback: (args: ErrorCallback) => void
  validateEmpty?: (data: any) => boolean
}

interface WithQueryComponentState {
  hasError: boolean
  componentError: any
}

export default function withQuery({
  document,
  operationOptions,
  loadingState: LoadingState,
  errorState: ErrorState,
  emptyState: EmptyState,
  errorCallback,
  validateEmpty,
}: WithQueryArgs) {
  return (WrappedComponent: ComponentType<any>): ComponentClass<any> => {
    class WithQueryComponent extends Component {
      public static displayName = `WithQueryComponent(${(WrappedComponent &&
        WrappedComponent.displayName) ||
        (WrappedComponent && WrappedComponent.name) ||
        ''})`

      public state: WithQueryComponentState = {
        componentError: null,
        hasError: false,
      }

      public componentDidCatch = (error: any, info: any) => {
        this.setState({ hasError: true, componentError: error })
        debugger
        errorCallback({ error, info })
      }

      public render = () => {
        const { hasError } = this.state
        const operationName =
          (operationOptions && operationOptions.name) || 'data'

        const enhance = compose(
          graphql(document, operationOptions),
          branch(
            (result: any) => result[operationName].loading,
            renderComponent(LoadingState)
          ),
          branch(
            (result: any) =>
              (validateEmpty &&
                EmptyState &&
                validateEmpty(result[operationName])) ||
              false,
            renderComponent(EmptyState || '')
          ),
          branch(
            (result: any) => result[operationName].error || hasError,
            renderComponent(ErrorState)
          )
        )

        const ResultComp = enhance(WrappedComponent)

        return <ResultComp {...this.props} />
      }
    }

    return hoistNonReactStatics(WithQueryComponent, WrappedComponent)
  }
}
