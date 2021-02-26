let gguid = 1

function getGGUID() {
  return (gguid++ * new Date().getTime() * -1).toString()
}

export function newAddress(address: any) {
  const {
    addressType,
    city,
    complement,
    country,
    geoCoordinates,
    neighborhood,
    number,
    postalCode,
    receiverName,
    reference,
    state,
    street,
    addressQuery,
    addressId,
  } = address

  return {
    addressId: addressId || getGGUID(),
    addressType: addressType || 'search',
    city: city || null,
    complement: complement || null,
    country: country || null,
    geoCoordinates: geoCoordinates || [],
    neighborhood: neighborhood || null,
    number: number || null,
    postalCode: postalCode || null,
    receiverName: receiverName || null,
    reference: reference || null,
    state: state || null,
    street: street || null,
    addressQuery: addressQuery || '',
  }
}
