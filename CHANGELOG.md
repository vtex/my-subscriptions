# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Skip help message.

## [1.16.1] - 2021-01-04

### Fixed

- Edit frequency when frequency options are empty.

## [1.16.0] - 2020-07-31

### Changed

- Using **subscriptions-commons** for frequency translations.

## [1.15.1] - 2020-07-02

### Fixed

- Subscription frequency change.

## [1.15.0] - 2020-06-29

### Added

- **it** translations.

## [1.14.2] - 2020-05-27

### Changed

- Using `SkeletonPiece` component from `vtex.my-account-commons`.
- Using `TranslateTotalizer` component from `vtex.totalizer-translator`.

### Fixed

- Message typo.

## [1.14.1] - 2020-05-25

### Fixed

- Messages by using the defineMessages.

## [1.14.0] - 2020-05-21

### Added

- Splunk tracking.

## [1.13.0] - 2020-05-13

### Added

- Magic link for automatically changing the payment method and address.

## [1.12.1] - 2020-05-08

### Fixed

- Payment change when the payment method is null.

## [1.12.0] - 2020-04-29

### Changed

- Displaying **currentPrice** on the product list instead of **priceAtSubscriptionDate**.

## [1.11.1] - 2020-02-10

### Fixed

- **updateSettings** mutation.

## [1.11.0] - 2019-12-18

### Added

- **de** translations.

## [1.10.0] - 2019-12-12

### Changed

- Migrate to `subscriptions-graphql`.

## [1.9.1] - 2019-11-13

### Fixed

- Refresh info after editing subscription frequency.

## [1.9.0] - 2019-10-14

### Changed

- Using payments flags from `vtex.payment-flags`
- Get PaymentMethods from `userPaymentMethods`

## [1.8.1] - 2019-09-26

### Changed

- Get changes made at version `v0.12.1`.

## [0.12.1] - 2019-09-23

### Fixed

- `OrderNow` feature.

## [1.8.0] - 2019-08-27

### Changed

- Get changes made at version `v0.12.0`.

## [0.12.0] - 2019-08-27

### Added

- Update products quantity.

### Changed

- Products list to the details page.

### Fixed

- Credit cards display on details.

## [1.7.0] - 2019-08-12

### Changed

- Get changes made at version `v0.11.0`.

## [0.11.0] - 2019-08-12

### Added

- subscription orders history panel.

## [1.6.1] - 2019-07-30

### Changed

- Get changes made at version `v0.10.1`.

## [0.10.1] - 2019-07-30

### Fixed

- `groupedSubscription` query and `updatePayment` mutation.

## [1.6.0] - 2019-07-25

### Changed

- Get changes made at version `v0.10.0`.

## [0.10.0] - 2019-07-25

### Added

- Validation for null `shippingAddress`.
- Validation for null `paymentMethod`.
- Redirect to credit card creation when the user has no credit card registered.

## [1.5.1] - 2019-06-25

### Changed

- Get changes made at version `v0.9.1`.

## [0.9.1] - 2019-06-25

### Changed

- Remove some month options(29, 30, 31), from the list of frequencies.

## [1.5.0] - 2019-06-24

### Changed

- Get changes made at version `v0.9.0`.

## [0.9.0] - 2019-06-24

### Changed

- Improve retry UX.

## [1.4.2] - 2019-06-18

### Changed

- Get changes made at version `v0.8.4`.

## [0.8.4] - 2019-06-18

### Fix

- Rename interpolated `interval` variable to `count`.

## [1.4.1] - 2019-05-14

### Changed

- Get changes made at version `v0.8.3`.

## [0.8.3] - 2019-05-14

### Fix

- Display frequency interval correctly on dropdown.

## [0.8.2] - 2019-05-04

### Fix

- Display frequency correctly on dropdown.
- Edit address mutation.

## [1.4.0] - 2019-04-16

## [1.3.2] - 2019-04-15

### Changed

- Get changes made at version `v0.8.1`.

## [0.8.1] - 2019-04-15

### Added

- OrderNow metric on splunk.

## [0.8.0] - 2019-04-12

### Added

- Estimated delivery.
- Order now feature.

## [1.3.1] - 2019-04-08

### Changed

- Get changes made at version `v0.7.0`.

## [0.7.0] - 2019-04-08

### Added

- Edit subscription name on the subscription details page.

### Fixed

- Loaders on the details page.
- Standarize the card wrappers css on the subscription details page.

## [1.3.0] - 2019-03-29

### Changed

- Get changes made at version `v0.6.0`.

## [0.6.0] - 2019-03-29

### Added

- Redirect to the card creation page on add new card.

### Changed

- Redirect to the address creation page and go back on add new address.
- Enable edition only for ACTIVE subscriptions.

## [0.5.0] - 2019-03-29

### Added

- List by filter.
- Display and edition of subscription group name on listing.
- Unpause button on listing.
- `Error` fallback component on listing.

## [1.2.2] - 2019-02-21

### Changed

- Get updates from versions `v0.4.0` and `v0.4.1`.

## [0.4.1] - 2019-02-06

### Fixed

- Update status query.

## [0.4.0] - 2019-02-04 [YANKED]

### Fixed

- Display of `purchaseDay` on `SubscriptionDetails`.
- Block edition on a canceled subscription.

### Changed

- Bump `vtex.my-subscriptions-graphql`.
- Queries and mutations to use `orderGroup` and subscriptionGroup instead of `subscription`.

## [1.2.1] - 2019-01-22

## [1.2.0] - 2019-01-22

## [1.1.0] - 2019-01-18

### Changed

- Update React builder to 3.x.
- Bump vtex.styleguide to 9.x.

## [0.3.3] - 2019-01-11

### Fixed

- Loading and display of order's history.

## [0.3.2] - 2019-01-07

### Fixed

- Add extra check on Details page for when the subscription has no instances.

## [0.3.1] - 2019-01-04 [YANKED]

### Added

- Retry button to the subscriptions with error.

## [1.0.0] - 2018-12-28

### Changed

- New builders are in town! Add messages and store builders.

## [0.3.0] - 2018-12-28

### Changed

- Using queries from `vtex.my-subscriptions-graphql` instead of `vtex.my-orders`.

## [0.2.3] - 2018-12-11

### Fixed

- `FrequencyInfo` label.
- `Discounts` translated label.

## [0.2.2] - 2018-12-07

### Fixed

- Link to `Products` page.

## [0.2.1] - 2018-12-06

### Fixed

- `OrderHistory` rendering.

## [0.2.0] - 2018-11-30

### Added

- Initializing repo.
