import { FunctionComponent, ReactElement } from 'react'
import { InjectedIntlProps, injectIntl, defineMessages } from 'react-intl'

const messages = defineMessages({
  link: {
    id: 'store/subscription.menu.link',
  },
})

const ExtensionLinks: FunctionComponent<Props> = ({ render, intl }) => {
  return render([
    {
      name: intl.formatMessage(messages.link),
      path: '/subscriptions',
    },
  ])
}

interface RenderArgs {
  name: string
  path: string
}

interface Props extends InjectedIntlProps {
  render: (args: RenderArgs[]) => ReactElement
}

export default injectIntl(ExtensionLinks)
