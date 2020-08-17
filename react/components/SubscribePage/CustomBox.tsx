import React, { FunctionComponent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Box, IconCaretRight } from 'vtex.styleguide'

const CustomBox: FunctionComponent<Props> = ({
  title,
  description,
  onClick,
}) => (
  <Box>
    <article className="flex items-center">
      <div className="w-80">
        <h4 className="t-heading-4 ma0 mb4">
          <FormattedMessage {...title} />
        </h4>
        <p className="t-body c-muted-1 ma0">
          <FormattedMessage {...description} />
        </p>
      </div>
      <div className="w-20 flex justify-end">
        <button
          className="flex items-center pa0 bn c-action-primary bg-transparent b--transparent pointer"
          onClick={onClick}
        >
          <IconCaretRight />
        </button>
      </div>
    </article>
  </Box>
)

type Props = {
  title: FormattedMessage.MessageDescriptor
  description: FormattedMessage.MessageDescriptor
  onClick: () => void
}

export default CustomBox
