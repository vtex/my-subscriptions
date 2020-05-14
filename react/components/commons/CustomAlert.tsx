import React, { FunctionComponent } from 'react'
import { injectIntl, WrappedComponentProps } from 'react-intl'
import { Alert } from 'vtex.styleguide'

import { TagTypeEnum } from '../../constants'

const CustomAlert: FunctionComponent<Props> = ({
  visible,
  action,
  contentId,
  children,
  intl,
  ...restProps
}) => {
  if (!visible || (!children && !contentId)) return null

  return (
    <div className="mb5">
      <Alert
        {...restProps}
        action={
          action && {
            label: intl.formatMessage({ id: action.labelId }),
            onClick: action.onClick,
          }
        }
      >
        {children || (contentId && intl.formatMessage({ id: contentId }))}
      </Alert>
    </div>
  )
}

interface Props extends WrappedComponentProps {
  visible: boolean
  type: TagTypeEnum
  action?: { labelId: string; onClick: () => void }
  contentId?: string
  onClose?: () => void
  children?: any
}

export default injectIntl(CustomAlert)
