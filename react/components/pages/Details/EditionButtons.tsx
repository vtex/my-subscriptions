import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'vtex.styleguide'

const EditionButtons: FunctionComponent<Props> = ({
  onCancel,
  onSave,
  isLoading,
  disabled,
}) => {
  return (
    <div className="pt4 flex">
      <div className="flex ml-auto">
        <div className="pr3">
          <Button size="small" onClick={onCancel} variation="secondary">
            <FormattedMessage id="store/subscription.edition.button.cancel" />
          </Button>
        </div>
        <Button
          size="small"
          onClick={onSave}
          variation="primary"
          isLoading={isLoading}
          disabled={disabled}
        >
          <FormattedMessage id="store/subscription.edition.button.save" />
        </Button>
      </div>
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
