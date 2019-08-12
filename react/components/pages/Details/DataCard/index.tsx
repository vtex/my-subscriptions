import React, { Component } from 'react'

import DisplayData from './DisplayData'
import EditData from './EditData'

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
    const { subscriptionsGroup } = this.props
    const { isEditMode } = this.state

    return isEditMode ? (
      <EditData
        onCloseEdit={this.handleCloseEdit}
        subscriptionsGroup={subscriptionsGroup}
      />
    ) : (
      <DisplayData
        onOpenEdit={this.handleOpenEdit}
        subscriptionsGroup={subscriptionsGroup}
      />
    )
  }
}

interface Props {
  subscriptionsGroup: SubscriptionsGroupItemType
}

export default DataCardContainer
