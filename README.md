# My Subscriptions

- This is the monorepo that contains all the code related to rendering Subscriptions related information on the shopper my account page.

For more info about the MyAccount page itself, please check the [app repository](https://github.com/vtex-apps/my-account).

## List of Apps

| APP                                | URL                                                                                              | Description                                                   |
| ---------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| MySubscriptions@3.x                | [v3](https://github.com/vtex-apps/my-subscriptions/apps/vtex-my-subscriptions-3/)                | App responsible for the subscriptions pages inside MyAccount. |
| MySubscriptionsPortalConnector@0.x | [v0](https://github.com/vtex-apps/my-subscriptions/apps/vtex-my-subscriptions-portal-connector/) | Auxiliary app used to display the app on Portal stores.       |

## Git Secret

This repository uses [git secret](#https://git-secret.io/).
To get access to the encrypted code:

1. Generate a gpg key: `gpg --gen-key`
2. Get your public key : `gpg --armor --export you@example.com > mykey.asc`
3. Send your key to an admin

## Development

### Developing

Some of the files used inside the `apps/vtex-my-subscriptions-3` are encrypted, before linking it to test your changes you have to:

1. run `git secret reveal` \*\* You will need the git secrets tooll installed and ask for one of the repo`s admin to add your public key to the ring.

2. run `vtex link`

### Adding a new user to the secrets ring

1. Ask for the requester to generate a public key as mentionend on the ## Git Secrets section.
2. Import the public key using `gpg --import NAME_OF_THE_FILE` \*\* `gpg` is required for this to work.
3. Add the requester to the key ring using `git secret tell REQUESTER_EMAIL` \*\* the email needs to be the same used to generate the key.
4. Encrypt the file again with the new entries using `git secret hide`.
5. Save the changes to the repo.

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
