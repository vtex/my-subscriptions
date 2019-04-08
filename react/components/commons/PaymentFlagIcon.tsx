import React, { FunctionComponent } from 'react'

import { PaymentGroupEnum } from '../../constants'
import PaymentFlagsSprite from '../../images/payment-flags.png'

const PaymentFlagIcon: FunctionComponent<Props> = ({ type, size, group }) => {
  if (!type) {
    return null
  }

  let slug
  switch (group) {
    case PaymentGroupEnum.BankInvoice:
      slug = 'bankinvoice'
      break
    case PaymentGroupEnum.PayPal:
      slug = 'paypal'
      break
    case PaymentGroupEnum.GiftCard:
      slug = 'giftcard'
      break
    case PaymentGroupEnum.DebitCard:
      slug = 'cash'
      break
    default:
      slug = type.toLowerCase().split(' ')[0]
      break
  }

  const originalSize = 560 /* In pixel */
  const ratio = size ? size / originalSize : originalSize

  const positions = {
    american: -120 * ratio,
    aura: -280 * ratio,
    bankinvoice: -400 * ratio,
    banricompras: -240 * ratio,
    cash: -520 * ratio,
    diners: -80 * ratio,
    discover: -200 * ratio,
    elo: -320 * ratio,
    giftcard: -480 * ratio,
    hipercard: -160 * ratio,
    jcb: -360 * ratio,
    mastercard: -40 * ratio,
    paypal: -440 * ratio,
    visa: 0,
  } as Position

  const position =
    positions[slug] || positions[slug] === 0 ? positions[slug] : -1

  if (position === -1) {
    return null
  }

  return (
    <span className="fl dib overflow-hidden mr3 w-29px h-22px nt-1px">
      <img
        alt={type}
        src={PaymentFlagsSprite}
        style={{ maxWidth: `${size}px`, marginLeft: position }}
      />
    </span>
  )
}

interface Props {
  type: string
  size: number
  group: string
}

interface Position {
  american: number
  aura: number
  bankinvoice: number
  banricompras: number
  cash: number
  diners: number
  discover: number
  elo: number
  giftcard: number
  hipercard: number
  jcb: number
  mastercard: number
  paypal: number
  visa: number
  [key: string]: number | undefined
}

export default PaymentFlagIcon
