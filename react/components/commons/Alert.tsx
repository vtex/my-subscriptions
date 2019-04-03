import React, { FunctionComponent, ReactNode } from 'react'
import { Alert } from 'vtex.styleguide'

import { TagTypeEnum } from '../../constants'

const CustomAlert: FunctionComponent<Props> = ({ visible, ...restProps }) => {
  if (!visible) return null

  return (
    <div className="mb5">
      <Alert {...restProps} />
    </div>
  )
}

interface Props {
  visible: boolean
  type: TagTypeEnum
  action: { label: string; onClick: () => void }
  onClose: () => void
  children: ReactNode
}

export default CustomAlert
