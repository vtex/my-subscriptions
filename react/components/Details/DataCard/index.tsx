import React, { Component } from 'react'

import DisplayData from './DisplayData'
import EditData from './EditData'
import { Subscription } from '..'

class DataCardContainer extends Component<Props> {
  public state = {
    isEditMode: false,
  }

  public handleOpenEdit = () => {
    this.setState({ isEditMode: true })
  }

  public handleCloseEdit = () => {
    this.setState({ isEditMode: false })
  }

  public render() {
    const { subscription } = this.props
    const { isEditMode } = this.state

    return isEditMode ? (
      <EditData
        onCloseEdit={this.handleCloseEdit}
        subscription={subscription}
      />
    ) : (
      <DisplayData
        onOpenEdit={this.handleOpenEdit}
        subscription={subscription}
      />
    )
  }
}

interface Props {
  subscription: Subscription
}

export default DataCardContainer
