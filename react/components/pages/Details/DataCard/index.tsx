import React, { Component } from 'react'

import DisplayData from './DisplayData'
import EditData from './EditData'

import { SubscriptionsGroup } from '..'

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
    const { group } = this.props
    const { isEditMode } = this.state

    return isEditMode ? (
      <EditData onCloseEdit={this.handleCloseEdit} group={group} />
    ) : (
      <DisplayData onOpenEdit={this.handleOpenEdit} group={group} />
    )
  }
}

interface Props {
  group: SubscriptionsGroup
}

export default DataCardContainer
