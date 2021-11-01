import React, { FunctionComponent } from 'react'
import { IconEdit } from 'vtex.styleguide'

const EditButton: FunctionComponent<Props> = ({
  onClick,
  withBackground = false,
}) => (
  <span>
    <button
      className={`c-action-primary hover-c-action-primary pointer br-pill bn bg-${
        withBackground ? 'action-secondary' : 'transparent'
      } flex items-center`}
      onClick={onClick}
      type="button"
      style={{ padding: '.40rem' }}
    >
      <IconEdit solid size={10} />
    </button>
  </span>
)

interface Props {
  withBackground?: boolean
  onClick: () => void
}

export default EditButton
