import {
  SubscriptionDisplayFilterEnum,
  SubscriptionStatus,
  TagTypeEnum,
} from '../constants'
import { convertFilter } from '../utils'
import { convertStatusInTagType } from '../components/SubscriptionStatus'

describe('Utils test Scenarios', () => {
  it('should convert active filter', () => {
    const active = SubscriptionStatus.Active

    const expectedResult = [active, SubscriptionStatus.Paused]
    const result = convertFilter(SubscriptionDisplayFilterEnum.Active)

    expect(result).toEqual(expect.arrayContaining(expectedResult))
    expect(result).toHaveLength(expectedResult.length)
  })

  it('should convert canceled filter', () => {
    const result = convertFilter(SubscriptionDisplayFilterEnum.Canceled)
    const expectedResult = [SubscriptionStatus.Canceled]

    expect(result).toEqual(expect.arrayContaining(expectedResult))
    expect(result).toHaveLength(expectedResult.length)

    expectedResult.push(SubscriptionStatus.Active)

    expect(result).not.toEqual(expect.arrayContaining(expectedResult))
  })

  it('should convert status canceled into correct tag type', () => {
    expect(convertStatusInTagType(SubscriptionStatus.Canceled)).toEqual(
      TagTypeEnum.Error
    )
  })

  it('should convert status paused into correct tag type', () => {
    expect(convertStatusInTagType(SubscriptionStatus.Paused)).toEqual(
      TagTypeEnum.Warning
    )
  })

  it('should convert status active into correct tag type', () => {
    expect(convertStatusInTagType(SubscriptionStatus.Active)).toBeNull()
  })
})
