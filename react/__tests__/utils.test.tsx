import { SubscriptionDisplayFilter, SubscriptionStatus } from '../enums'
import { convertFilter } from '../utils'

describe('Utils test Scenarios', () => {
  it('should convert active filter', () => {
    const active = SubscriptionStatus.Active

    const expectedResult = [active, SubscriptionStatus.Paused]
    const result = convertFilter(SubscriptionDisplayFilter.Active)

    expect(result).toEqual(expect.arrayContaining(expectedResult))
    expect(result).toHaveLength(expectedResult.length)
  })

  it('should convert canceled filter', () => {
    const result = convertFilter(SubscriptionDisplayFilter.Canceled)
    const expectedResult = [SubscriptionStatus.Canceled]

    expect(result).toEqual(expect.arrayContaining(expectedResult))
    expect(result.length).toEqual(expectedResult.length)

    expectedResult.push(SubscriptionStatus.Active)

    expect(result).not.toEqual(expect.arrayContaining(expectedResult))
  })
})