import React, { FunctionComponent } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { IconEdit } from 'vtex.styleguide'

const CSS_HANDLES = ['pencilEditIcon']

const EditButton: FunctionComponent<Props> = ({
  onClick,
  withBackground = false,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <span>
      <button
        className={`c-action-primary hover-c-action-primary pointer br-pill bn bg-${
          withBackground ? 'action-secondary' : 'transparent'
        } flex items-center ${handles.pencilEditIcon}`}
        onClick={onClick}
        type="button"
        style={{ padding: '.40rem' }}
      >
        <IconEdit solid size={10} />
      </button>
    </span>
  )
}

interface Props {
  withBackground?: boolean
  onClick: () => void
}

export default EditButton
