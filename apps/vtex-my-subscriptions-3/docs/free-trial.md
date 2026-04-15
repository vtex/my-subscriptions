# Free Trial — Detail page behavior

## GraphQL fields

The `SubscriptionDetailsPage` query (`react/graphql/queries/detailsPage.gql`) includes two free-trial-related fields:

| Field | Type | Description |
|---|---|---|
| `isInTrialPeriod` | `Boolean` (nullable) | `true` while the subscription is in a free-trial period. Becomes `false` after the first order execution. |
| `createdAsFreeTrial` | `Boolean` (nullable) | Immutable flag. `true` if the subscription was created from a plan with free trial. Never changes. |

For subscriptions created before this feature, both fields return `null` or `undefined` and should be treated as `false`.

## Core rule

All UI restrictions apply **only** when `isInTrialPeriod === true` (strict comparison). When the trial ends and `isInTrialPeriod` becomes `false`, the page reverts to its default behavior, even if `createdAsFreeTrial` remains `true`.

While the trial is active, `nextPurchaseDate` represents the **trial end date**, not the next purchase date.

## FreeTrialContext

The trial state is distributed via React Context (`react/components/DetailsPage/FreeTrialContext.tsx`) to avoid prop drilling. `DetailsPage/index.tsx` computes the value and provides it through the Provider:

```typescript
const isActivelyInTrial = subscription.isInTrialPeriod === true
```

Child components consume the context with the `useFreeTrial()` hook:

```typescript
import { useFreeTrial } from '../FreeTrialContext'

const { isActivelyInTrial } = useFreeTrial()
```

## Affected components

### PageHeader (`PageHeader/index.tsx`)

- Displays `nextPurchaseDate` below the subscription name with a "Next charge:" label (`details-page.page-header.next-purchase` message key). This label is shown for **all** subscriptions, not just free trial ones.
- When `isActivelyInTrial`, renders a green badge (`<Tag type="success">`) with a **remaining days countdown** (e.g. "Free trial remaining: 3 days"). The remaining days are calculated as `nextPurchaseDate - today` using the `getRemainingDays()` utility function defined in the same file.
- The badge has `role="status"` for accessibility.

### Menu (`PageHeader/Menu.tsx`)

- When `isActivelyInTrial`, the dropdown shows **only** the "Cancel subscription" option.
- Skip, pause, and place single order are hidden.

### Products/Listing (`Products/Listing.tsx`)

- When `isActivelyInTrial`:
  - The "Add product" button (`AddItemModal`) is hidden.
  - The edit button (pencil icon) that activates quantity/removal editing mode is hidden.

### Preferences/Edit (`Preferences/Edit.tsx`)

- When `isActivelyInTrial`, the `FrequencySelector` section is hidden in edit mode.
- Payment and address remain editable as usual.

## Restrictions summary

| UI Element | Visible during trial? | Reason |
|---|---|---|
| "Free trial remaining: X days" badge | Yes | Inform the shopper |
| Cancel subscription | Yes | Shopper can opt out |
| Skip next order | No | Blocked by backend |
| Pause subscription | No | Blocked by backend |
| Place single order | No | Blocked by backend |
| Add product | No | Fixed configuration during trial |
| Remove product | No | Fixed configuration during trial |
| Edit quantity | No | Fixed configuration during trial |
| Edit frequency | No | Blocked by backend |
| Edit payment method | Yes | Allowed by backend |
| Edit address | Yes | Allowed by backend |

## Backend validation

Even if the frontend fails to hide a control, the backend blocks restricted actions during the trial. The UI restrictions are a UX improvement to prevent the shopper from attempting an action and receiving an error.

## i18n

Two message keys are used in the header:

- `details-page.page-header.next-purchase` — "Next charge: {date}" label shown for all subscriptions. The `{date}` placeholder receives a `<FormattedDate>` component.
- `details-page.free-trial.badge` — "Free trial remaining: {days} days" countdown badge shown only during trial. The `{days}` placeholder receives a numeric value (integer).

Both keys are available in all app locales (PT, EN, ES, FR, IT, DE, RO, ID, CA, AR).
