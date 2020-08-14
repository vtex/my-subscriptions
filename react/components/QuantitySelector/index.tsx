// src: https://github.com/vtex-apps/product-list/blob/master/react/QuantitySelector.tsx

import React, { FunctionComponent, useState } from 'react'
import { Dropdown, Input } from 'vtex.styleguide'

import styles from './styles.css'

const MAX_ITEM_QUANTITY = 99999

function normalizeValue(value: number, maxValue: number) {
  return value > maxValue ? maxValue : value
}

function validateValue(value: string, maxValue: number) {
  const parsedValue = parseInt(value, 10)

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(parsedValue)) {
    return 1
  }

  return normalizeValue(parseInt(value, 10), maxValue)
}

function validateDisplayValue(value: string, maxValue: number) {
  const parsedValue = parseInt(value, 10)

  // eslint-disable-next-line no-restricted-globals
  if (isNaN(parsedValue) || parsedValue < 0) {
    return ''
  }

  return `${normalizeValue(parsedValue, maxValue)}`
}

function range(max: number) {
  return Array.from({ length: max }, (_, i) => i + 1)
}

function getDropdownOptions(maxValue: number) {
  const limit = Math.min(9, maxValue)
  const options = [
    ...range(limit).map((idx) => ({ value: idx, label: `${idx}` })),
  ]

  if (maxValue >= 10) {
    options.push({ value: 10, label: '10+' })
  }

  return options
}

const MAX_INPUT_LENGTH = 5

const QuantitySelector: FunctionComponent<Props> = ({
  id,
  value,
  maxValue = MAX_ITEM_QUANTITY,
  onChange,
  disabled,
}) => {
  const [curSelector, setSelector] = useState<SelectorType>(
    value < 10 ? 'dropdown' : 'input'
  )
  const [activeInput, setActiveInput] = useState(false)

  const normalizedValue = normalizeValue(value, maxValue)

  const [curDisplayValue, setDisplayValue] = useState(`${normalizedValue}`)

  const handleDropdownChange = (newValue: string) => {
    const validatedValue = validateValue(newValue, maxValue)
    const displayValue = validateDisplayValue(newValue, maxValue)

    if (validatedValue >= 10 && curSelector === 'dropdown') {
      setSelector('input')
    }

    setDisplayValue(displayValue)
    onChange(validatedValue)
  }

  const handleInputChange = (newValue: string) => {
    const displayValue = validateDisplayValue(newValue, maxValue)

    setDisplayValue(displayValue)
  }

  const handleInputBlur = () => {
    setActiveInput(false)
    if (curDisplayValue === '') {
      setDisplayValue('1')
    }

    const validatedValue = validateValue(curDisplayValue, maxValue)
    onChange(validatedValue)
  }

  const handleInputFocus = () => setActiveInput(true)

  if (
    !activeInput &&
    normalizedValue !== validateValue(curDisplayValue, maxValue)
  ) {
    if (normalizedValue >= 10) {
      setSelector('input')
    }
    setDisplayValue(validateDisplayValue(`${normalizedValue}`, maxValue))
  }

  if (curSelector === 'dropdown') {
    const dropdownOptions = getDropdownOptions(maxValue)

    return (
      <div className={`${styles.quantity} ${styles.quantitySelector}`}>
        <div className="dn-m">
          <Dropdown
            id={`quantity-dropdown-mobile-${id}`}
            testId={`quantity-dropdown-mobile-${id}`}
            options={dropdownOptions}
            size="small"
            value={normalizedValue}
            onChange={(event: any) => handleDropdownChange(event.target.value)}
            placeholder="1"
            disabled={disabled}
          />
        </div>
        <div className="dn db-m">
          <Dropdown
            id={`quantity-dropdown-${id}`}
            testId={`quantity-dropdown-${id}`}
            options={dropdownOptions}
            value={normalizedValue}
            onChange={(event: any) => handleDropdownChange(event.target.value)}
            placeholder="1"
            disabled={disabled}
          />
        </div>
      </div>
    )
  }
  return (
    <div className={`${styles.quantity} ${styles.quantitySelector}`}>
      <div className="dn-m">
        <Input
          id={`quantity-input-mobile-${id}`}
          size="small"
          value={curDisplayValue}
          maxLength={MAX_INPUT_LENGTH}
          onChange={(event: any) => handleInputChange(event.target.value)}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          placeholder=""
          disabled={disabled}
        />
      </div>
      <div className="dn db-m">
        <Input
          id={`quantity-input-${id}`}
          value={curDisplayValue}
          maxLength={MAX_INPUT_LENGTH}
          onChange={(event: any) => handleInputChange(event.target.value)}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          placeholder=""
          disabled={disabled}
        />
      </div>
    </div>
  )
}

type SelectorType = 'dropdown' | 'input'

type Props = {
  id: string
  value: number
  maxValue?: number
  onChange: (value: number) => void
  disabled: boolean
}

export default QuantitySelector
