# My Subscriptions

> Notice: React: 3.x | Subscriptions v3.

## Intro

App responsible for display and management of subscriptions inside the Shopper my account page.

## Features

### Translations

- DE (🇩🇪), EN (🇺🇸), ES (🇪🇸), FR (🇫🇷), IT (🇮🇹), PT (🇧🇷), RO (🇷🇴)

### List shopper's subscriptions:

> url: https://{{account}}.myvtex.com/account#/subscriptions

- List the subscriptions related to a specific shopper.
- Filter by subscription status.
- Pause/Activate a specific subscription.

- Agents: Shopper and Call center operator.

### Detail shopper's subscription:

> url: https://{{account}}.myvtex.com/account#/subscriptions/:subscriptionId

- Display the detailed info about a single subscription.
- Display subscription cycles.
- Retry last subscripton cycle.
- Manage it's preferences:
  -- Add/remove SKU's
  -- Change subscription status.
  -- Change: frequency, purchase day, payment method or address.

- Agents: Shopper and Call center operator.

### Create subscription:

> url: https://{{account}}.myvtex.com/account#/subscriptions-new

- Select available frequencies.
- Select begin/end dates.
- Select SKUs.
- Select Payment Method.
- Select Address.

- Agents: Shopper and Call center operator.
