![](https://raw.githubusercontent.com/cto-ai/web-app-generator/master/assets/banner.png)

# CTO.ai - Official Op - Review

Review is an Op that allows you to manage Open PRs on Github and apply a specific action on it.

## Installation

💡 Prior to running the op it is recommended that you have stored your API token as a secret. 💡

If you are not sure how to create a token on Github, please go to this link:
[How to create a token on Github](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)

Once you have your token, you can store it as a secret on your op by running the following command:

```bash
ops secrets:set
```

## Usage

To run this op run the following command on the terminal or the team's slack channel corresponding to this op:

From your terminal:

```bash
ops run @cto.ai/review
```

From Slack:

```text
/ops run cto.ai/review
```

After initializing the op just follow the steps that are going to be prompt:

1. Use corresponding token (you can select it from a list by the name you store it)
2. Choose type of PRs to view
3. Select specific PR from list
4. Choose the specific action you want to apply on the PR

## Testing

Run `npm test`

## Debugging Issues

When submitting issues or requesting help, be sure to also include the version information. To get your ops version run:

```bash
ops -v
```

## Contributing

See the [contributing docs](CONTRIBUTING.md) for more information

## Contributors

<table>
  <tr>
    <td align="center"><a href="https://github.com/pabloaredu"><img src="https://avatars2.githubusercontent.com/u/34356811?s=400&v=4" width="100px;" alt=""/><br /><sub><b>Pablo Arellano</b></sub></a><br/></td>
    <td align="center"><a href="https://github.com/jmariomejiap"><img src="https://avatars1.githubusercontent.com/u/22829270?&v=4" width="100px;" alt=""/><br /><sub><b>Mario Mejia</b></sub></a><br/></td>
    <td align="center"><a href="https://github.com/tw5033"><img src="https://avatars2.githubusercontent.com/u/16050851?&v=4" width="100px;" alt=""/><br /><sub><b>Timothy Wan</b></sub></a><br/></td>
    <td align="center"><a href="https://github.com/ruxandrafed"><img src="https://avatars0.githubusercontent.com/u/11021586?s=460&v=4" width="100px;" alt=""/><br /><sub><b>Ruxandra Fediuc</b></sub></a><br/></td>
    <td align="center"><a href="https://github.com/CalHoll"><img src="https://avatars3.githubusercontent.com/u/21090765?&v=4" width="100px;" alt=""/><br /><sub><b>Calvin Holloway</b></sub></a><br/></td>
  </tr>
</table>

## License

[MIT](LICENSE)