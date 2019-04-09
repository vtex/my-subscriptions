import { FunctionComponent, ReactElement } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'

const ExtensionLinks: FunctionComponent<Props> = ({ render, intl }) => {
  return render([
    {
      name: intl.formatMessage({ id: 'subscription.title.list' }),
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
