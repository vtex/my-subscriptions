import PropTypes from 'prop-types'

const skuShape = PropTypes.shape({
  detailUrl: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  priceAtSubscriptionDate: PropTypes.string,
  productName: PropTypes.string.isRequired,
})

const subscriptionItemShape = PropTypes.shape({
  SubscriptionId: PropTypes.shape.isRequired,
  id: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  sku: PropTypes.shape(skuShape),
})

const orderInfoShape = PropTypes.shape({
  orderGroup: PropTypes.string.isRequired,
  orderId: PropTypes.string.isRequired,
  paymentUrl: PropTypes.string,
})

const customerProfileShape = PropTypes.shape({
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
})

const instanceShape = PropTypes.shape({
  date: PropTypes.string.isRequired,
  message: PropTypes.string,
  workflowId: PropTypes.string.isRequired,
  orderInfo: orderInfoShape,
})

const frequencyShape = PropTypes.shape({
  interval: PropTypes.number.isRequired,
  periodicity: PropTypes.string.isRequired,
})

const validityShape = PropTypes.shape({
  begin: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired,
})

const planShape = PropTypes.shape({
  type: PropTypes.string.isRequired,
  frequency: frequencyShape.isRequired,
  validity: validityShape.isRequired,
})

const paymentAccountShape = PropTypes.shape({
  accountId: PropTypes.string.isRequired,
  cardNumber: PropTypes.string.isRequired,
})

const paymentMethodShape = PropTypes.shape({
  paymentSystem: PropTypes.string.isRequired,
  paymentSystemGroup: PropTypes.string.isRequired,
  paymentSystemName: PropTypes.string.isRequired,
  paymentAccount: paymentAccountShape.isRequired,
})

const purchaseSettingsShape = PropTypes.shape({
  currencySymbol: PropTypes.string.isRequired,
  purchaseDay: PropTypes.string.isRequired,
  salesChannel: PropTypes.string.isRequired,
  seller: PropTypes.string.isRequired,
  paymentMethod: paymentMethodShape.isRequired,
})

const shippingAddressShape = PropTypes.shape({
  addressId: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  neighborhood: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired,
  receiverName: PropTypes.string.isRequired,
  reference: PropTypes.stirng,
  state: PropTypes.string.isRequired,
  street: PropTypes.string.isRequired,
})

const totalsShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
})

export const subscriptionsGroupShape = PropTypes.shape({
  customerId: PropTypes.string.isRequired,
  customerProfile: customerProfileShape.isRequired,
  instances: PropTypes.arrayOf(instanceShape).isRequired,
  isSkipped: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(subscriptionItemShape),
  nextPurchaseDate: PropTypes.string.isRequired,
  orderGroup: PropTypes.string.isRequired,
  plan: planShape.isRequired,
  purchaseSettings: purchaseSettingsShape.isRequired,
  shippingAddress: shippingAddressShape.isRequired,
  totalValue: PropTypes.number.isRequired,
  totals: PropTypes.arrayOf(totalsShape).isRequired,
})

export const genericQueryShape = PropTypes.shape({
  error: PropTypes.object,
  loading: PropTypes.bool.isRequired,
})
