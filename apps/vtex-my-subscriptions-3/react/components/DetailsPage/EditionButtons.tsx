import type { FunctionComponent } from 'react'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'

const EditionButtons: FunctionComponent<Props> = ({
  onCancel,
  onSave,
  isLoading,
  disabled,
}) => {
  return (
    <div className="flex">
      <div className="pr3">
        <Button size="small" onClick={onCancel} variation="secondary">
          <FormattedMessage id="subscription.edition.button.cancel" />
        </Button>
      </div>
      <Button
        size="small"
        onClick={onSave}
        variation="primary"
        isLoading={isLoading}
        disabled={disabled}
      >
        <FormattedMessage id="subscription.edition.button.save" />
      </Button>
    </div>
  )
}

EditionButtons.defaultProps = {
  disabled: false,
}

interface Props {
  isLoading: boolean
  disabled?: boolean
  onSave: () => void
  onCancel: () => void
}

export default EditionButtons
