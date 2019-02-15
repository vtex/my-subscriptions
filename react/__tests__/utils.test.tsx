import {
  SubscriptionDisplayFilterEnum,
  SubscriptionStatusEnum,
  TagTypeEnum,
} from '../enums'
import { convertFilter, convertStatusInTagType } from '../utils'

describe('Utils test Scenarios', () => {
  it('should convert active filter', () => {
    const active = SubscriptionStatusEnum.Active

    const expectedResult = [active, SubscriptionStatusEnum.Paused]
    const result = convertFilter(SubscriptionDisplayFilterEnum.Active)

    expect(result).toEqual(expect.arrayContaining(expectedResult))
    expect(result).toHaveLength(expectedResult.length)
  })

  it('should convert canceled filter', () => {
    const result = convertFilter(SubscriptionDisplayFilterEnum.Canceled)
    const expectedResult = [SubscriptionStatusEnum.Canceled]

    expect(result).toEqual(expect.arrayContaining(expectedResult))
    expect(result.length).toEqual(expectedResult.length)

    expectedResult.push(SubscriptionStatusEnum.Active)

    expect(result).not.toEqual(expect.arrayContaining(expectedResult))
  })

  it('should convert status canceled into correct tag type', () => {
    expect(convertStatusInTagType(SubscriptionStatusEnum.Canceled)).toEqual(
      TagTypeEnum.Error
    )
  })

  it('should convert status paused into correct tag type', () => {
    expect(convertStatusInTagType(SubscriptionStatusEnum.Paused)).toEqual(
      TagTypeEnum.Warning
    )
  })

  it('should convert status active into correct tag type', () => {
    expect(convertStatusInTagType(SubscriptionStatusEnum.Active)).toEqual(null)
  })
})
