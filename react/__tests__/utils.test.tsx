import { SubscriptionStatus } from 'vtex.subscriptions-graphql'

import { SubscriptionDisplayFilterEnum, TagTypeEnum } from '../constants'
import { convertFilter } from '../utils'
import { convertStatusInTagType } from '../components/commons/SubscriptionStatus'

describe('Utils test Scenarios', () => {
  it('should convert active filter', () => {
    const active: SubscriptionStatus = 'ACTIVE'

    const expectedResult: SubscriptionStatus[] = [active, 'PAUSED']
    const result = convertFilter(SubscriptionDisplayFilterEnum.Active)

    expect(result).toEqual(expect.arrayContaining(expectedResult))
    expect(result).toHaveLength(expectedResult.length)
  })

  it('should convert canceled filter', () => {
    const result = convertFilter(SubscriptionDisplayFilterEnum.Canceled)
    const expectedResult: SubscriptionStatus[] = ['CANCELED']

    expect(result).toEqual(expect.arrayContaining(expectedResult))
    expect(result).toHaveLength(expectedResult.length)

    expectedResult.push('ACTIVE')

    expect(result).not.toEqual(expect.arrayContaining(expectedResult))
  })

  it('should convert status canceled into correct tag type', () => {
    expect(convertStatusInTagType('CANCELED')).toEqual(TagTypeEnum.Error)
  })

  it('should convert status paused into correct tag type', () => {
    expect(convertStatusInTagType('PAUSED')).toEqual(TagTypeEnum.Warning)
  })

  it('should convert status active into correct tag type', () => {
    expect(convertStatusInTagType('ACTIVE')).toBeNull()
  })
})
