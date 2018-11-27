import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { utils } from 'vtex.my-account-commons'

const { fixImageUrl } = utils

class OrderItems extends Component {
  render() {
    const { items } = this.props
    return (
      <div>
        {items.map(item => {
          return (
            <div key={item.uniqueId} className="pt4 flex flex-row">
              <img
                alt={item.name}
                className="ba b--muted-5"
                src={fixImageUrl(item.imageUrl, 60, 70)}
              />
              <span className="pl5 pt5 fw3 f5">{item.name} </span>
            </div>
          )
        })}
      </div>
    )
  }
}

OrderItems.propTypes = {
  items: PropTypes.array.isRequired,
}

export default OrderItems
