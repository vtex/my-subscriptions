# My Subscriptions — Agent Guidelines

## Project overview

VTEX IO monorepo containing the **My Subscriptions** app (`vtex.my-subscriptions@3.x`), which renders subscription management UI inside the shopper's MyAccount page. There is also a legacy portal connector app (`vtex.my-subscriptions-portal-connector`).

The main app lives under `apps/vtex-my-subscriptions-3/`.

## Tech stack

| Layer | Technology |
|---|---|
| Runtime | VTEX IO (builders: `react@3.x`, `messages@1.x`, `store@0.x`) |
| Language | TypeScript 3.9, React 16 |
| State / data | Apollo Client 2 (`react-apollo@3`) with `graphql()` HOCs |
| Composition | `recompose` (`compose`, `branch`, `renderComponent`) |
| i18n | `react-intl@3` (`FormattedMessage`, `injectIntl`, `defineMessages`) |
| UI library | `vtex.styleguide@9.x` (`Box`, `Tag`, `Button`, `ActionMenu`, `PageHeader`, `Alert`, etc.) |
| Forms | Formik + Yup (creation page only) |
| Routing | `vtex.my-account-commons/Router` (HashRouter-based) |
| Monitoring | `vtex.splunk-monitoring` via `tracking/index.tsx` (`withQueryWrapper`, `withMetric`, `logError`) |
| Styling | Tachyons utility classes + occasional CSS Modules |
| Tests | `@vtex/test-tools` (Jest-based), files in `react/__tests__/` |
| Linting | ESLint (`vtex` preset at root, `vtex-react/io` inside `react/`), Prettier (`@vtex/prettier-config`) |

## Folder structure (main app)

```
apps/vtex-my-subscriptions-3/
├── manifest.json            # VTEX IO app manifest (vendor, dependencies, builders)
├── messages/                # i18n JSON files (ar, ca, de, en, es, fr, id, it, pt, ro)
├── store/                   # VTEX Store Framework interfaces and routes
├── docs/                    # Feature documentation
│   └── free-trial.md        # Free trial behavior on details page
└── react/
    ├── package.json         # Dependencies + scripts (lint, test)
    ├── tsconfig.json        # Extends @vtex/tsconfig
    ├── ExtensionRouter.tsx  # Route definitions (/subscriptions, /subscriptions-new, /subscriptions/:id)
    ├── Router.tsx           # HashRouter wrapper
    ├── graphql/
    │   ├── queries/         # .gql files (detailsPage, subscriptions, simulation, etc.)
    │   └── mutations/       # .gql files (updateStatus, updatePlan, addItem, etc.)
    ├── typings/
    │   ├── global.d.ts
    │   └── graphql/         # TypeScript module declarations for .gql imports
    │       ├── queries/     # e.g. detailsPage.gql.d.ts
    │       └── mutations/
    ├── tracking/            # Splunk monitoring wrappers (withQueryWrapper, withMetric)
    ├── mocks/               # Test factories (subscriptionFactory, generateDetailMock)
    ├── __mocks__/           # Jest manual mocks for vtex.* packages
    ├── __tests__/           # Test files (*.test.tsx)
    └── components/
        ├── DetailsPage/     # Subscription detail (main focus of development)
        │   ├── index.tsx    # Container: Apollo queries/mutations, FreeTrialProvider
        │   ├── FreeTrialContext.tsx  # React Context for trial state
        │   ├── PageHeader/  # Header, Status dot, Menu (actions dropdown)
        │   ├── Products/    # Subscribed products list + add/edit/remove
        │   ├── Preferences/ # Frequency, payment, address (display + edit modes)
        │   ├── History/     # Order execution history modal
        │   ├── ActionBar.tsx
        │   └── utils.tsx    # SubscriptionAction type, modal config, scroll helper
        ├── List/            # Subscription list page
        ├── CreationPage/    # New subscription flow
        ├── SimulationContext.tsx  # Reference React Context implementation (pricing)
        ├── SubscriptionName.tsx  # Editable subscription name
        ├── Frequency/       # Frequency display + selector utilities
        ├── Selector/        # Shared selectors (Frequency, Payment, Address)
        ├── Summary.tsx      # Totals summary
        └── ...              # Other shared components
```

## Key patterns

### GraphQL queries and types

- Queries/mutations are `.gql` files under `react/graphql/`.
- Each `.gql` file has a corresponding `.d.ts` under `react/typings/graphql/` that declares the TypeScript module.
- Types are built as `Pick<>` from `vtex.subscriptions-graphql` types — do not create types manually.
- When adding fields to a query, update both the `.gql` file and its `.d.ts` counterpart.

### Component composition (HOC pattern)

Container components use `recompose`'s `compose` to chain HOCs:

```typescript
const enhance = compose<Props, OuterProps>(
  injectIntl,
  withRouter,
  graphql(MUTATION, { name: 'mutationName' }),
  withQueryWrapper<InputProps, Result, Args, ChildProps>({
    workflowInstance: 'InstanceName',
    document: QUERY,
    getRuntimeInfo,
    operationOptions: { ... },
  }),
  branch<Props>(({ loading }) => loading, renderComponent(Skeleton))
)
export default enhance(ContainerComponent)
```

- `withQueryWrapper` is the project's Apollo query HOC (wraps `vtex.splunk-monitoring` for observability).
- `branch` + `renderComponent(Skeleton)` shows loading state while query is in flight.
- Mutations are attached via `graphql(MUTATION, { name })` and accessed as named props.

### React Context

When state needs to be shared across deeply nested components without prop drilling, use React Context:

- Create with `createContext` and export the Provider + a `useX()` consumer hook.
- See `FreeTrialContext.tsx` for a simple boolean context.
- See `SimulationContext.tsx` for a context backed by a GraphQL query.

### i18n

- Message files are flat JSON in `messages/*.json` (10 locales).
- Use `defineMessages` for message definitions, `FormattedMessage` for JSX, `intl.formatMessage` for strings.
- When adding a new message key, add it to **all** locale files.
- Date formatting uses `FormattedDate` with locale-aware options (`day`, `month`, `year`).

### Styling

- Primarily Tachyons utility classes (e.g. `flex`, `items-center`, `mt3`, `pa5`, `c-muted-1`, `t-heading-4`).
- CSS Modules used sparingly (e.g. `PageHeader/styles.css` for status dot).
- UI primitives from `vtex.styleguide` (`Box`, `Tag`, `Button`, `ActionMenu`, `Alert`, `PageHeader`, `Input`).

## Testing

- Test runner: `vtex-test-tools test` (Jest).
- Tests live in `react/__tests__/` with `*.test.tsx` naming.
- Manual mocks for VTEX packages in `react/__mocks__/` (e.g. `vtex.splunk-monitoring.tsx` strips real monitoring).
- Test factories in `react/mocks/` (`subscriptionFactory`, `generateDetailMock`).
- Render with `@vtex/test-tools/react` (`render`, `fireEvent`), pass Apollo mocks via `graphql: { mocks: [...] }`.

## Feature: Free Trial

Subscriptions created from free-trial plans have restricted UI during the trial period. The `isInTrialPeriod` field from the GraphQL API controls all restrictions. The header shows a "Next charge: [date]" label for all subscriptions, and a "Free trial remaining: X days" countdown badge during the trial (days = `nextPurchaseDate - today`). See [docs/free-trial.md](apps/vtex-my-subscriptions-3/docs/free-trial.md) for full documentation.

## Commands

```bash
# From apps/vtex-my-subscriptions-3/react/
npm run lint    # tsc --noEmit && eslint
npm run test    # vtex-test-tools test

# Deploy (from apps/vtex-my-subscriptions-3/)
vtex link       # Development
vtex deploy     # Production (after releasy tag + manifest bump)
```
