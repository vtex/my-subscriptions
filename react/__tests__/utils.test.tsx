import {
  SubscriptionDisplayFilterEnum,
  SubscriptionStatusEnum,
  TagTypeEnum,
} from '../enums'
import { convertFilter, convertStatusInTagType } from '../utils'

describe('Utils test Scenarios', () => {
  it('should convert active filter', () => {
    const active = SubscriptionStatusEnum.ACTIVE

    const expectedResult = [active, SubscriptionStatusEnum.PAUSED]
    const result = convertFilter(SubscriptionDisplayFilterEnum.ACTIVE)

    expect(result).toEqual(expect.arrayContaining(expectedResult))
    expect(result).toHaveLength(expectedResult.length)
  })

  it('should convert canceled filter', () => {
    const result = convertFilter(SubscriptionDisplayFilterEnum.CANCELED)
    const expectedResult = [SubscriptionStatusEnum.CANCELED]

    expect(result).toEqual(expect.arrayContaining(expectedResult))
    expect(result.length).toEqual(expectedResult.length)

    expectedResult.push(SubscriptionStatusEnum.ACTIVE)

    expect(result).not.toEqual(expect.arrayContaining(expectedResult))
  })

  it('should convert status canceled into correct tag type', () => {
    expect(convertStatusInTagType(SubscriptionStatusEnum.CANCELED)).toEqual(
      TagTypeEnum.ERROR
    )
  })

  it('should convert status paused into correct tag type', () => {
    expect(convertStatusInTagType(SubscriptionStatusEnum.PAUSED)).toEqual(
      TagTypeEnum.WARNING
    )
  })

  it('should convert status active into correct tag type', () => {
    expect(convertStatusInTagType(SubscriptionStatusEnum.ACTIVE)).toEqual(null)
  })
})
