# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [3.14.2] - 2023-05-11

### Fixed

- Fix when selecting subscription details scroll behavior

## [3.14.1] - 2023-04-10

### Fixed

- Fix create subscription with daily purchaseDay

## [3.14.0] - 2023-02-28

### Added

- CSS Handles

### Fixed

- For new subscriptions, auto-select appropriate `purchaseDate` (i.e. repeat day) when changing subscription frequency or date of first purchase

### Added

- CSS Handle for `purchaseDate` dropdown container

## [3.13.1] - 2023-01-10

## [3.13.1-beta] - 2023-01-10

### Added

- Catalan translation.

## [3.13.0] - 2022-12-22

### Added

- Indonesian translation.

## [3.12.0] - 2022-10-18

## [3.11.1] - 2022-03-22

### Fixed

- Arabic translation.

## [3.11.0] - 2022-03-08

### Added

- Arabic translation.

## [3.10.2] - 2021-10-11

### Fixed

- Fix subscription title in spanish

## [3.10.1] - 2021-08-26

### Fixed

- Display sku price instead of product price for every sku on search.

## [3.10.0] - 2021-08-02

### Changed

- Using **vtex.splunk-monitoring** to log errors.

## [3.9.4] - 2021-05-05

### Fixed

- Sku name on product search.

## [3.9.3] - 2021-04-14

### Fixed

- OrderNow functionality.
- Totalizer translations on Summary component.

## [3.9.2] - 2021-03-04

### Fixed

- Frequency selector.
- Payment change.

## [3.9.1] - 2021-02-05

### Fixed

- Frequency selector style.

## [3.9.0] - 2021-02-04

### Added

- Pagination in available products list for subscription.

## [3.8.2] - 2021-01-18

### Fixed

- Skip help message.

## [3.8.1] - 2021-01-04

### Fixed

- Remove purchaseDay dropdown when frequency options are empty in editing mode.

## [3.8.0] - 2020-12-08

### Added

- Compatibility with stores running on portal.

## [3.7.1] - 2020-10-07

### Fixed

- Cache upon listing.
- Send name while creating a new subscription.
- Display add credit card button when the user has no card.

## [3.7.0] - 2020-10-05

### Added

- New create subscription page.

## [3.6.1] - 2020-09-18

### Fixed

- Layout paddings.

## [3.6.0] - 2020-09-04

### Changed

- New details page.

## [3.5.0] - 2020-08-21

### Added

- Undo action upon the success add toast.

### Fixed

- Added message on **AddItemModal**
- **pt** messages.

## [3.4.0] - 2020-08-20

### Added

- Add product feature on the subscription details page.

## [3.3.0] - 2020-08-04

### Changed

- Using **subscriptions-commons** for frequency translations.

## [3.2.0] - 2020-07-20

### Added

- Batch change for payment and adress info.

## [3.1.1] - 2020-07-08

### Removed

- `totalValue` field from `removeItem` mutation.

## [3.1.0] - 2020-06-29

### Added

- **it** translations.

## [3.0.0] - 2020-06-10

### Changed

- Migration to GraphQL V3.

[unreleased]: https://github.com/vtex/my-subscriptions/compare/vtex.my-subscriptions@3.13.1...HEAD
[3.12.0]: https://github.com/vtex/my-subscriptions/compare/vtex.my-subscriptions@3.11.1...vtex.my-subscriptions@3.12.0
[3.14.2]: https://github.com/vtex/my-subscriptions/compare/vtex.my-subscriptions@3.14.1...vtex.my-subscriptions@3.14.2
[3.14.1]: https://github.com/vtex/my-subscriptions/compare/vtex.my-subscriptions@3.14.0...vtex.my-subscriptions@3.14.1
[3.14.0]: https://github.com/vtex/my-subscriptions/compare/vtex.my-subscriptions@3.13.1...vtex.my-subscriptions@3.14.0
[3.13.1]: https://github.com/vtex/my-subscriptions/compare/vtex.my-subscriptions@3.13.1-beta...vtex.my-subscriptions@3.13.1
[3.13.1-beta]: https://github.com/vtex/my-subscriptions/compare/vtex.my-subscriptions@3.13.0...vtex.my-subscriptions@3.13.1-beta
[unreleased]: https://github.com/vtex/my-subscriptions/compare/vtex.my-subscriptions@3.14.1...HEAD


[Unreleased]: https://github.com/vtex/my-subscriptions/compare/vtex.my-subscriptions@3.14.2...HEAD