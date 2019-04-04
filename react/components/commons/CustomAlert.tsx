import React, { FunctionComponent } from 'react'
import { injectIntl, InjectedIntlProps } from 'react-intl'
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
        }>
        {children
          ? children
          : contentId && intl.formatMessage({ id: contentId })}
      </Alert>
    </div>
  )
}

interface Props extends InjectedIntlProps {
  visible: boolean
  type: TagTypeEnum
  action?: { labelId: string; onClick: () => void }
  autoClose?: number
  contentId?: string
  onClose?: () => void
}

export default injectIntl(CustomAlert)
