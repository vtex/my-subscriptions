import React, { FunctionComponent } from 'react'
import { IconEdit } from 'vtex.styleguide'

const EditButton: FunctionComponent<Props> = ({
  onClick,
  withBackground = false,
}) => (
  <button
    className={`c-action-primary hover-c-action-primary pointer br-pill bn bg-${
      withBackground ? 'action-secondary' : 'transparent'
    }`}
    onClick={onClick}
    style={{ padding: '.40rem' }}
  >
    <div className="flex items-center">
      <IconEdit solid size={10} />
    </div>
  </button>
)

interface Props {
  withBackground?: boolean
  onClick: () => void
}

export default EditButton
