# My Subscriptions

## Installing this app using VTEX IO

Currently, we install this app manually in the accounts that request to have the VTEX subscription system. So, run this command to switch to the target account: `vtex switch <account-name>`.

Firstly, one must know in which Subscriptions API version the target account is. As of the writing of this, we have v2 and v3. To get this information, speak to the Subscription API team.

Secondly, the following rules must be followed in order to make this app work properly in the VTEX admin:

1. If the account is provisioned by the Subscriptions API v2:
    1.1 If this account uses the Portal (old VTEX CMS), you must run the following command: `vtex install vtex.my-subscriptions@0.x`
    1.2 If it uses the Store v2, you must run the following command: `vtex install vtex.my-subscriptions@1.x`
2. If the account is provisioned by the Subscriptions API v3:
    2.1 If this account uses the Portal (old VTEX CMS), you must run the following command: `vtex install vtex.my-subscriptions@2.x`
    2.2 If it uses the Store v2, you must run the following command: `vtex install vtex.my-subscriptions@3.x`

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://salesfelipe.github.io"><img src="https://avatars1.githubusercontent.com/u/3926634?v=4" width="100px;" alt=""/><br /><sub><b>Felipe Sales</b></sub></a><br /><a href="https://github.com/vtex/my-subscriptions/commits?author=salesfelipe" title="Code">💻</a> <a href="https://github.com/vtex/my-subscriptions/commits?author=salesfelipe" title="Documentation">📖</a></td>
    <td align="center"><a href="https://kaisermann.me"><img src="https://avatars3.githubusercontent.com/u/12702016?v=4" width="100px;" alt=""/><br /><sub><b>Christian Kaisermann</b></sub></a><br /><a href="https://github.com/vtex/my-subscriptions/commits?author=kaisermann" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
