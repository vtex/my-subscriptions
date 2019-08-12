import React, { FunctionComponent } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { Button } from 'vtex.styleguide'

const EditButtons: FunctionComponent<Props & InjectedIntlProps> = ({
  onCancel,
  onSave,
  isLoading,
  intl,
  disabled,
}) => {
  return (
    <div className="ml-auto">
      <div className="flex flex-row">
        <div className="pr3">
          <Button size="small" onClick={onCancel} variation="secondary">
            {intl.formatMessage({
              id: 'commons.cancel',
            })}
          </Button>
        </div>
        <Button
          size="small"
          onClick={onSave}
          variation="primary"
          isLoading={isLoading}
          disabled={disabled}
        >
          {intl.formatMessage({
            id: 'subscription.actions.save',
          })}
        </Button>
      </div>
    </div>
  )
}

EditButtons.defaultProps = {
  disabled: false,
}

interface Props {
  isLoading: boolean
  disabled?: boolean
  onSave: () => void
  onCancel: () => void
}

export default injectIntl(EditButtons)
