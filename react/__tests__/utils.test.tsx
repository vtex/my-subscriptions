import { convertStatusInTagType } from '../components/List/SubscriptionStatus'
import { convertFilter } from '../components/List/utils'

describe('Utils test Scenarios', () => {
  it('should convert active filter', () => {
    const expectedResult = ['ACTIVE', 'PAUSED']
    const result = convertFilter('ACTIVE_FILTER')

    expect(result).toEqual(expect.arrayContaining(expectedResult))
    expect(result).toHaveLength(expectedResult.length)
  })

  it('should convert canceled filter', () => {
    const result = convertFilter('CANCELED_FILTER')
    const expectedResult = ['CANCELED']

    expect(result).toEqual(expect.arrayContaining(expectedResult))
    expect(result).toHaveLength(expectedResult.length)

    expectedResult.push('ACTIVE')

    expect(result).not.toEqual(expect.arrayContaining(expectedResult))
  })

  it('should convert status canceled into correct tag type', () => {
    expect(convertStatusInTagType('CANCELED')).toEqual('error')
  })

  it('should convert status paused into correct tag type', () => {
    expect(convertStatusInTagType('PAUSED')).toEqual('warning')
  })

  it('should convert status active into correct tag type', () => {
    expect(convertStatusInTagType('ACTIVE')).toBeNull()
  })
})
