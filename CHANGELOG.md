# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.8.0] - 2019-04-12

### Added

- Estimated delivery.
- Order now feature.

## [0.7.0] - 2019-04-08

### Added

- Edit subscription name on the subscription details page.

### Fixed

- Loaders on the details page.
- Standarize the card wrappers css on the subscription details page.

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

## [0.3.3] - 2019-01-11

### Fixed

- Loading and display of order's history.

## [0.3.2] - 2019-01-07

### Fixed

- Add extra check on Details page for when the subscription has no instances.

## [0.3.1] - 2019-01-04 [YANKED]

### Added

- Retry button to the subscriptions with error.

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
