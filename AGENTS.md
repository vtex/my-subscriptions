# AGENTS.md — My Subscriptions

## Project Overview

Monorepo VTEX IO containing the **My Subscriptions** front-end application displayed inside the shopper's My Account page. The project manages subscription listing, detail viewing, editing, and creation flows.

**App ID:** `vtex.my-subscriptions` @ `3.x`
**Vendor:** `vtex`
**Platform:** VTEX IO (no Node backend in this repo — server logic resides in `vtex.subscriptions-graphql` and `vtex.store-graphql`)

---

## Repository Structure

```
my-subscriptions/
├── apps/
│   ├── vtex-my-subscriptions-3/        # Main app (react 3.x, store 0.x, messages 1.x)
│   │   ├── manifest.json               # VTEX IO app manifest
│   │   ├── package.json                # App-level lint-staged + husky pre-commit
│   │   ├── react/                      # React source code
│   │   │   ├── ExtensionRouter.tsx     # My Account routes (/subscriptions, /subscriptions-new, /:id)
│   │   │   ├── ExtensionLinks.tsx      # Sidebar nav link for My Account
│   │   │   ├── Router.tsx              # HashRouter for Portal embedded mode
│   │   │   ├── components/             # Feature modules (List, DetailsPage, CreationPage, etc.)
│   │   │   ├── graphql/               # .gql files (queries/ and mutations/)
│   │   │   ├── tracking/              # Splunk monitoring (withMetric, withQueryWrapper)
│   │   │   ├── typings/               # Local .d.ts shims for VTEX modules
│   │   │   ├── mocks/                 # Test mocks for subscription data
│   │   │   ├── __mocks__/             # Module mocks (styleguide, render-runtime, etc.)
│   │   │   ├── __tests__/             # Jest test files
│   │   │   ├── package.json           # React runtime deps
│   │   │   └── tsconfig.json          # Extends @vtex/tsconfig
│   │   ├── store/
│   │   │   ├── interfaces.json        # Store extension points → React components
│   │   │   └── routes.json            # Public route for embedded router
│   │   └── messages/                   # i18n (en, pt, es, fr, de, it, ar, ro, ca, id)
│   │
│   └── vtex-my-subscriptions-portal-connector/  # Auxiliary app for Portal stores
│       ├── manifest.json               # react 2.x, pages 0.x, messages
│       ├── react/
│       │   ├── ExtensionRouter.tsx     # Routes rendering Iframe component
│       │   ├── ExtensionLinks.tsx      # Portal menu link
│       │   ├── components/Iframe.tsx   # iframe pointing to IO router path
│       │   └── pages/pages.json       # Pages builder extensions
│       └── messages/
│
├── .github/                            # Issue/PR templates, CODEOWNERS (no CI workflows)
├── .gitsecret/                         # git-secret encrypted files
├── .eslintrc                           # Root ESLint config (extends vtex)
├── .editorconfig                       # 2-space indent, LF, UTF-8
├── crowdin.yml                         # Crowdin i18n sync
├── package.json                        # Root scripts (lint, test, verify, locales)
└── README.md
```

---

## Technology Stack

| Layer            | Technology                                                        |
|------------------|-------------------------------------------------------------------|
| Language         | TypeScript 3.9, TSX                                               |
| UI Framework     | React 16.13.x                                                     |
| Platform         | VTEX IO (builders: react 3.x, store 0.x, messages 1.x)           |
| Data Fetching    | react-apollo 3 (graphql HOC, `<Query>`)                           |
| Forms            | Formik 2 + Yup                                                    |
| Routing          | vtex.my-account-commons (HashRouter, Route, Switch, withRouter)   |
| i18n             | react-intl 3 (injectIntl, defineMessages)                         |
| UI Components    | vtex.styleguide 9.x                                               |
| CSS Strategy     | Tachyons utilities + vtex.css-handles + plain CSS modules          |
| Composition      | recompose (compose for HOC stacking)                              |
| Monitoring       | vtex.splunk-monitoring (withMetric, withQueryWrapper)             |
| Testing          | @vtex/test-tools (Jest-based), @apollo/react-testing              |
| Linting          | ESLint (eslint-config-vtex, eslint-config-vtex-react/io)          |
| Formatting       | Prettier (@vtex/prettier-config)                                  |
| i18n Validation  | @vtex/intl-equalizer                                              |

---

## Key Entry Points

| Extension Point                         | Component             | Purpose                                       |
|-----------------------------------------|-----------------------|-----------------------------------------------|
| `my-account-page.my-subscriptions`      | `ExtensionRouter`     | Registers routes within My Account            |
| `my-account-link.my-subscriptions-link` | `ExtensionLinks`      | Adds sidebar navigation link                  |
| `subscriptions-portal.embedded-router`  | `Router`              | Public hash-based router for Portal iframe    |

---

## GraphQL Operations

### Queries
- `subscriptions` — List all subscriptions
- `listBy` — Filtered subscription listing
- `detailsPage` — Single subscription detail
- `subscriptionExecutions` — Execution history
- `availablePreferences` — Frequency/plan options
- `availablePaymentAddresses` — Payment methods and addresses
- `frequencyOptions` — Available frequencies
- `orderForm` — Cart/checkout data (via vtex.store-graphql)
- `simulation` — Price simulation

### Mutations
- `createSubscription` — New subscription
- `updateStatus` — Activate/pause/cancel
- `updatePlan` — Change frequency/plan
- `updateItems` — Modify item quantities
- `updateAddress` — Change delivery address
- `updatePaymentMethod` — Change payment
- `updateName` — Rename subscription
- `updateIsSkipped` — Skip next cycle
- `addItem` / `removeItem` — Manage items
- `orderNow` — Trigger immediate order

---

## Component Architecture

```
ExtensionRouter
├── /subscriptions          → List (subscription cards with status, images, summary)
├── /subscriptions-new      → CreationPage (multi-step Formik wizard)
└── /subscriptions/:id      → DetailsPage
                              ├── PageHeader (name, menu actions)
                              ├── ActionBar (status, batch modal)
                              ├── Preferences (frequency, address, payment - edit mode)
                              ├── Products (item listing, add/remove)
                              └── History (execution timeline)
```

---

## Development Workflow

### Prerequisites
1. Install VTEX CLI (`vtex`)
2. Install `git-secret` and request access to the key ring
3. Run `git secret reveal` to decrypt encrypted files

### Local Development
```bash
cd apps/vtex-my-subscriptions-3
vtex link
```

### Scripts (from repo root)
| Command              | Action                                          |
|----------------------|-------------------------------------------------|
| `yarn lint`          | TypeScript type-check + ESLint                  |
| `yarn test`          | Run Jest tests via vtex-test-tools              |
| `yarn locales:lint`  | Validate i18n parity across locales             |
| `yarn locales:fix`   | Auto-fix missing locale keys                    |
| `yarn verify`        | Full pipeline: lint + locales + test            |

### Deploy Process (manual, no CI/CD bot)
1. `cd apps/vtex-my-subscriptions-3`
2. `releasy patch|minor|major`
3. `vtex publish --public`
4. `vtex install vtex.my-subscriptions@VERSION` (on test account)
5. `vtex deploy`

---

## Coding Conventions

- **HOC composition** via `recompose/compose` — stack `injectIntl`, `withRouter`, `graphql(...)` on class components
- **Functional components** with hooks for newer code (`useField`, `useCssHandles`)
- **GraphQL co-located** in `react/graphql/` directory, not inline
- **Type declarations** for `.gql` files live in `react/typings/graphql/`
- **Message IDs** follow pattern: `subscription-*` or `store/subscription.*`
- **intl-equalizer** enforces all locales have the same keys as `en.json`
- **Pre-push hook** runs full verify pipeline — code must pass lint + tests + locale check
- **Pre-commit hook** (app-level) runs lint-staged on changed files

---

## Dependencies (VTEX IO Peer Apps)

| App                                    | Purpose                                 |
|----------------------------------------|-----------------------------------------|
| `vtex.subscriptions-graphql` 3.x       | Backend GraphQL API for subscriptions   |
| `vtex.store-graphql` 2.x               | Store data (orderForm, checkout)        |
| `vtex.my-account` 1.x                  | My Account page framework               |
| `vtex.my-account-commons` 1.x          | Routing primitives for My Account       |
| `vtex.styleguide` 9.x                  | VTEX design system components           |
| `vtex.address-form` 4.x                | Address input/validation                |
| `vtex.payment-flags` 2.x               | Payment method icons/labels             |
| `vtex.totalizer-translator` 2.x        | Price/total formatting                  |
| `vtex.subscriptions-commons` 1.x       | Shared subscription utilities           |
| `vtex.splunk-monitoring` 1.x           | Performance/error monitoring            |
| `vtex.css-handles` 0.x                 | Theme-safe CSS class hooks              |

---

## Testing

- **Framework:** `@vtex/test-tools` (Jest wrapper for VTEX IO apps)
- **Test location:** `apps/vtex-my-subscriptions-3/react/__tests__/`
- **Mocks:** `__mocks__/` for VTEX modules, `mocks/` for subscription data fixtures
- **Run:** `yarn test` from root or `vtex-test-tools test` from `react/`

---

## i18n

- **Reference locale:** `en`
- **Supported locales:** en, pt, es, fr, de, it, ar, ro, ca, id
- **Sync tool:** Crowdin (configured in `crowdin.yml`)
- **Validation:** `@vtex/intl-equalizer` ensures locale parity

---

## Security

- **git-secret** is used to encrypt sensitive files (Splunk tokens, etc.)
- Developers must be added to the GPG key ring to access encrypted content
- Never commit decrypted secrets — run `git secret hide` before pushing

---

## Portal Connector

The `vtex-my-subscriptions-portal-connector` app enables legacy Portal stores to display the IO-based subscription UI:
- Renders an `<iframe>` pointing to `/_v/public/my-subscriptions-router`
- Uses `iframe-resizer` for dynamic height adjustment
- Hash-based navigation syncs between parent page and iframe content
