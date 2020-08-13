import memoize from 'memoize-one'

const buildSet = memoize((values: string[]) => {
  const set = new Set<string>()

  values.forEach((id) => set.add(id))

  return set
})

function contains({ list, value }: { list: string[]; value: string }) {
  const plansSet = buildSet(list)

  return plansSet.has(value)
}

export function subscribable({
  targetPlan,
  availablePlans,
}: {
  targetPlan: string
  availablePlans: string[]
}) {
  return contains({ list: availablePlans, value: targetPlan })
}

export function subscribed({
  skuId,
  subscribedSkus,
}: {
  skuId: string
  subscribedSkus: string[]
}) {
  return contains({ list: subscribedSkus, value: skuId })
}
