import React, { Component } from 'react'
import { ModalDialog, withToast } from 'vtex.styleguide'

import { TagTypeEnum } from '../../constants'
import { makeCancelable } from '../../utils'
import Alert from './CustomAlert'

class ConfirmationModalContainer extends Component<Props> {
  public state = {
    isLoading: false,
    shouldDisplayError: false,
  }

  private innerPromise:
    | undefined
    | { promise: Promise<unknown>; cancel: () => void }

  public componentWillUnmount = () =>
    this.innerPromise && this.innerPromise.cancel()

  private handleSubmit = () => {
    const {
      showToast,
      successMessage,
      onSubmit,
      onCloseModal,
      onError,
    } = this.props

    this.innerPromise = makeCancelable(
      onSubmit()
        .then(() => {
          onCloseModal()
          successMessage &&
            showToast({
              message: successMessage,
            })
        })
        .catch(error => {
          this.setState({ shouldDisplayError: true })
          onError?.(error)
        })
        .finally(() => this.handleLoading(false))
    )

    this.handleLoading(true)
  }

  private handleLoading = (value: boolean) => {
    this.props.onLoading && this.props.onLoading(value)

    this.setState({ isLoading: value })
  }

  private handleDismissError = () => {
    this.setState({ shouldDisplayError: false })
  }

  public render() {
    const {
      isModalOpen,
      errorMessage,
      confirmationLabel,
      cancelationLabel,
      onCloseModal,
      children,
    } = this.props

    return (
      <ModalDialog
        centered
        loading={this.state.isLoading}
        isOpen={isModalOpen}
        onClose={onCloseModal}
        confirmation={{
          onClick: this.handleSubmit,
          label: confirmationLabel,
        }}
        cancelation={{
          onClick: onCloseModal,
          label: cancelationLabel,
        }}
      >
        <div className="mt7">
          <Alert
            type={TagTypeEnum.Error}
            onClose={this.handleDismissError}
            visible={this.state.shouldDisplayError}
          >
            {errorMessage}
          </Alert>
          {children}
        </div>
      </ModalDialog>
    )
  }
}

export default withToast(ConfirmationModalContainer)

interface Props {
  onSubmit: () => Promise<unknown>
  onCloseModal: () => void
  onLoading?: (loading: boolean) => void
  onError?: (error: any) => void
  confirmationLabel: string
  cancelationLabel: string
  errorMessage: string
  successMessage?: string
  isModalOpen: boolean
  showToast: (args: object) => void
}
