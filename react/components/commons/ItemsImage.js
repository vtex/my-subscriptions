import React from 'react'
import PropTypes from 'prop-types'
import MediaQuery from 'react-responsive'
import { intlShape, injectIntl } from 'react-intl'
import { utils } from 'vtex.my-account-commons'

const { fixImageUrl } = utils

const Image = ({ items }) => {
  const itemsLength = items.length
  if (itemsLength === 1) {
    return (
      <img
        alt={items[0].sku.name}
        className="db-s center di-ns pt8-ns pl8-ns"
        src={fixImageUrl(items[0].sku.imageUrl, 130, 140)}
      />
    )
  }
  if (itemsLength === 2) {
    return (
      <div className="flex flex-column-ns flex-row-s pb4-s pb0-ns">
        <MediaQuery maxWidth={639}>
          <img
            alt={items[0].sku.name}
            className="db-s di-ns pa3 ba bw1-s b--muted-5"
            src={fixImageUrl(items[0].sku.imageUrl, 110, 120)}
          />
          <img
            alt={items[1].sku.name}
            className="db-s di-ns pa3 ml2 bt-ns ba bw1-s b--muted-5"
            src={fixImageUrl(items[1].sku.imageUrl, 110, 120)}
          />
        </MediaQuery>
        <MediaQuery minWidth={640}>
          <img
            alt={items[0].sku.name}
            className="db-s di-ns pa4"
            src={fixImageUrl(items[0].sku.imageUrl, 230, 90)}
          />
          <img
            alt={items[1].sku.name}
            className="db-s di-ns pa4 bt-ns bw1-ns b--muted-5"
            src={fixImageUrl(items[1].sku.imageUrl, 230, 90)}
          />
        </MediaQuery>
      </div>
    )
  }

  if (itemsLength === 3) {
    return (
      <div className="flex flex-column h-100 pb4-s pb0-ns">
        <MediaQuery maxWidth={639}>
          <div className="flex flex-row">
            <img
              alt={items[0].sku.name}
              className="db-s di-ns pa4 ba mr4 bw1-s b--muted-5"
              src={fixImageUrl(items[0].sku.imageUrl, 150, 110)}
            />
            <div className="flex flex-column">
              <img
                alt={items[1].sku.name}
                className="db-s di-ns pa4 ba bw1-s b--muted-5"
                src={fixImageUrl(items[1].sku.imageUrl, 72, 75)}
              />
              <img
                alt={items[2].sku.name}
                className="db-s di-ns pa4 ba mt2 bw1-s b--muted-5"
                src={fixImageUrl(items[2].sku.imageUrl, 72, 75)}
              />
            </div>
          </div>
        </MediaQuery>
        <MediaQuery minWidth={640}>
          <img
            alt={items[0].sku.name}
            className="db-s di-ns pa4"
            src={fixImageUrl(items[0].sku.imageUrl, 160, 70)}
          />
          <div className="flex flex-row w-100">
            <div className="w-50">
              <img
                alt={items[1].sku.name}
                className="db-s di-ns pa4 bt-ns b--muted-5"
                src={fixImageUrl(items[1].sku.imageUrl, 72, 73)}
              />
            </div>
            <div className="w-50">
              <img
                alt={items[2].sku.name}
                className="db-s di-ns pa4 bl-ns bt-ns b--muted-5"
                src={fixImageUrl(items[2].sku.imageUrl, 72, 73)}
              />
            </div>
          </div>
        </MediaQuery>
      </div>
    )
  }

  if (itemsLength === 4) {
    return (
      <div className="flex flex-column pb4-s pb0-ns">
        <MediaQuery maxWidth={639}>
          <div className="flex flex-row">
            <img
              alt={items[0].sku.name}
              className="db-s di-ns pa4 ba bw1-s mr4 b--muted-5"
              src={fixImageUrl(items[0].sku.imageUrl, 150, 140)}
            />
            <div className="flex flex-column">
              <img
                alt={items[0].sku.name}
                className="db-s di-ns pa4 bw1-s ba b--muted-5"
                src={fixImageUrl(items[0].sku.imageUrl, 72, 75)}
              />
              <div className="relative items-center ba bw1-s b--muted-5 mt2">
                <div className="absolute f3 b pb1 ph2 right-2 bottom-2">{`+${itemsLength -
                  3}`}</div>
                <img
                  alt={items[0].sku.name}
                  className="db-s di-ns o-30 pv4 pl4 pr3"
                  src={fixImageUrl(items[0].sku.imageUrl, 72, 75)}
                />
              </div>
            </div>
          </div>
        </MediaQuery>
        <MediaQuery minWidth={640}>
          <div className="flex flex-row pb4-s pb0-ns">
            <img
              alt={items[0].sku.name}
              className="db-s di-ns pa4 bw1-ns b--muted-5"
              src={fixImageUrl(items[0].sku.imageUrl, 80, 84)}
            />
            <img
              alt={items[1].sku.name}
              className="db-s di-ns pa4 bl-ns bw1-ns b--muted-5"
              src={fixImageUrl(items[1].sku.imageUrl, 80, 84)}
            />
          </div>
          <div className="flex flex-row">
            <img
              alt={items[2].sku.name}
              className="db-s di-ns pa4 bt-ns bw1-ns b--muted-5"
              src={fixImageUrl(items[2].sku.imageUrl, 80, 84)}
            />
            <img
              alt={items[3].sku.name}
              className="db-s di-ns pa4 bl-ns bt-ns bw1-ns b--muted-5"
              src={fixImageUrl(items[3].sku.imageUrl, 86, 84)}
            />
          </div>
        </MediaQuery>
      </div>
    )
  }

  if (itemsLength > 4) {
    return (
      <div className="flex flex-column h-100 pb4-s pb0-ns">
        <MediaQuery maxWidth={639}>
          <div className="flex flex-row">
            <img
              alt={items[0].sku.name}
              className="db-s di-ns pa4 ba mr4 bw1-s b--muted-5"
              src={fixImageUrl(items[0].sku.imageUrl, 150, 140)}
            />
            <div className="flex flex-column">
              <img
                alt={items[1].sku.name}
                className="db-s di-ns pa4 ba bw1-s b--muted-5"
                src={fixImageUrl(items[1].sku.imageUrl, 72, 75)}
              />
              <div className="relative items-center ba bw1-s b--muted-5 mt2">
                <div className="absolute f3 b pb1 ph2 right-2 bottom-2">{`+${itemsLength -
                  3}`}</div>
                <img
                  alt={items[3].sku.name}
                  className="db-s di-ns o-30 pa4"
                  src={fixImageUrl(items[3].sku.imageUrl, 72, 75)}
                />
              </div>
            </div>
          </div>
        </MediaQuery>
        <MediaQuery minWidth={640}>
          <div className="flex flex-row w-100">
            <div className="w-50">
              <img
                alt={items[0].sku.name}
                className="db-s di-ns pa4 bw1-ns b--muted-5"
                src={fixImageUrl(items[0].sku.imageUrl, 80, 84)}
              />
            </div>
            <div className="w-50">
              <img
                alt={items[1].sku.name}
                className="db-s di-ns pa4 bl-ns bw1-ns b--muted-5"
                src={fixImageUrl(items[1].sku.imageUrl, 80, 84)}
              />
            </div>
          </div>
          <div className="flex flex-row w-100">
            <div className="w-50">
              <img
                alt={items[2].sku.name}
                className="db-s di-ns pa4 bt-ns bw1-ns b--muted-5"
                src={fixImageUrl(items[2].sku.imageUrl, 84, 84)}
              />
            </div>
            <div className="w-50 relative items-center bl-ns bt-ns bw1-ns b--muted-5">
              <div className="absolute f4 b pb2 ph2 right-2 bottom-2">{`+${itemsLength -
                4}`}</div>
              <img
                alt={items[3].sku.name}
                className="db-s di-ns o-30 pa4"
                src={fixImageUrl(items[3].sku.imageUrl, 86, 84)}
              />
            </div>
          </div>
        </MediaQuery>
      </div>
    )
  }
}

Image.propTypes = {
  intl: intlShape.isRequired,
  items: PropTypes.array.isRequired,
}

export default injectIntl(Image)
