import React, { Component, ReactNode } from 'react'
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

  public componentWillUnmount = () => {
    if (this.innerPromise) {
      this.innerPromise.cancel()
    }
  }

  public handleSubmit = () => {
    const {
      showToast,
      targetPromise,
      successMessage,
      onCloseModal,
    } = this.props

    this.innerPromise = makeCancelable(
      targetPromise()
        .then(() => {
          onCloseModal()
          showToast({
            message: successMessage,
          })
        })
        .catch(() => this.setState({ shouldDisplayError: true }))
        .finally(() => this.handleLoading(false))
    )

    this.handleLoading(true)
  }

  public handleLoading = (value: boolean) => {
    const { onLoading } = this.props

    if (onLoading) {
      onLoading(value)
    }
    this.setState({ isLoading: value })
  }

  public handleDismissError = () => {
    this.setState({ shouldDisplayError: false })
  }

  public render() {
    const {
      isModalOpen,
      errorMessage,
      confirmationLabel,
      cancelationLabel,
      modalContent,
      onCloseModal,
    } = this.props

    return (
      <Modal centered isOpen={isModalOpen} onClose={onCloseModal}>
        <Alert
          type={TagTypeEnum.Error}
          onClose={this.handleDismissError}
          visible={this.state.shouldDisplayError}>
          {errorMessage}
        </Alert>
        {modalContent}
        <div className="flex flex-row justify-end mt7">
          <span className="mr4">
            <Button size="small" variation="tertiary" onClick={onCloseModal}>
              {cancelationLabel}
            </Button>
          </span>
          <Button
            size="small"
            isLoading={this.state.isLoading}
            onClick={this.handleSubmit}>
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
  targetPromise: () => Promise<any>
  confirmationLabel: string
  cancelationLabel: string
  errorMessage: string
  successMessage: string
  modalContent: ReactNode
  onCloseModal: () => void
  onLoading?: (loading: boolean) => void
  isModalOpen: boolean
}

interface InnerProps {
  showToast: (args: object) => void
}
