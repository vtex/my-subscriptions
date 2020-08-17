import React, { Component } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'

import Box from './CustomBox'

const messages = defineMessages({
  orderNowTitle: {
    id: 'store/subscribe-page.order-now-title',
    defaultMessage: 'Comprar e assinar',
  },
  orderNowDescription: {
    id: 'store/subscribe-page.order-now-description',
    defaultMessage:
      'Você recebe seu produto agora, e cadastra uma assinatura para recebê-lo automaticamente na frequência que desejar.',
  },
  createTitle: {
    id: 'store/subscribe-page.create-title',
    defaultMessage: 'Criar assinatura',
  },
  createDescription: {
    id: 'store/subscribe-page.create-description',
    defaultMessage:
      'Cadastre uma assinatura e receba automaticamente na frequência que desejar.',
  },
  addToExistingTitle: {
    id: 'store/subscribe-page.add-to-existing-title',
    defaultMessage: 'Adicionar em uma assinatura já existente',
  },
  addToExistingDescription: {
    id: 'store/subscribe-page.add-to-existing-description',
    defaultMessage:
      'Selecione a assinatura que deseja acrescentar esse produto:',
  },
})

class SubscribePageContainer extends Component {
  private handleOrderNow = () => null
  private handleCreate = () => null

  public render() {
    return (
      <section className="flex flex-column items-center pv8 bg-muted-5 min-vh-100">
        <div className="w-100 mw7">
          <div className="mb4">
            <Box
              title={messages.orderNowTitle}
              description={messages.orderNowDescription}
              onClick={this.handleOrderNow}
            />
          </div>
          <Box
            title={messages.createTitle}
            description={messages.createDescription}
            onClick={this.handleCreate}
          />
          <h4 className="t-heading-4 ma0 mb4 mt8">
            <FormattedMessage {...messages.addToExistingTitle} />
          </h4>
          <p className="t-body c-muted-1 ma0 mb5">
            <FormattedMessage {...messages.addToExistingDescription} />
          </p>
        </div>
      </section>
    )
  }
}

export default SubscribePageContainer
