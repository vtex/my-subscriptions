import React, { Component } from 'react'
import { compose } from 'recompose'
import { Button, Modal, withToast } from 'vtex.styleguide'

import Alert from '../commons/CustomAlert'
import { TagTypeEnum } from '../../constants'
import { makeCancelable } from '../../utils'

class ConfirmationModalContainer extends Component<Props & InnerProps> {
  public state = {
    isLoading: false,
    shouldDisplayError: false,
  }

  private innerPromise: any

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
          onError && onError(error)
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
      <Modal centered isOpen={isModalOpen} onClose={onCloseModal}>
        <Alert
          type={TagTypeEnum.Error}
          onClose={this.handleDismissError}
          visible={this.state.shouldDisplayError}
        >
          {errorMessage}
        </Alert>
        {children}
        <div className="flex flex-row justify-end mt7">
          <span className="mr4">
            <Button size="small" variation="tertiary" onClick={onCloseModal}>
              {cancelationLabel}
            </Button>
          </span>
          <Button
            size="small"
            isLoading={this.state.isLoading}
            onClick={this.handleSubmit}
          >
            {confirmationLabel}
          </Button>
        </div>
      </Modal>
    )
  }
}

const enhance = compose<any, Props>(withToast)

export default enhance(ConfirmationModalContainer)

interface Props {
  onSubmit: () => Promise<any>
  onCloseModal: () => void
  onLoading?: (loading: boolean) => void
  onError?: (error: any) => void
  confirmationLabel: string
  cancelationLabel: string
  errorMessage: string
  successMessage?: string
  isModalOpen: boolean
}

interface InnerProps {
  showToast: (args: object) => void
}
