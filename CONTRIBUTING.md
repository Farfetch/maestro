# Contributing

Hi there! We're thrilled that you'd like to contribute to this project. Your help is essential for keeping it great.

Please note that this project is released with a [Code of Conduct](CODE_OF_CONDUCT.md). By participating in this project you agree to abide by its terms.

- [Contributing](#contributing)
  - [Issues](#issues)
  - [Pull Requests](#pull-requests)
    - [Does it state intent](#does-it-state-intent)
    - [Is it of good quality](#is-it-of-good-quality)
  - [Workflow](#workflow)
    - [Code review and approval process](#code-review-and-approval-process)
    - [Release process](#release-process)
  - [Your First Contribution](#your-first-contribution)
  - [Additional resources](#additional-resources)
  - [Disclaimer](#disclaimer)

## Issues

Either you faced an issue or have an new idea that would be nice to have, Issues is the right place to start with.

## Pull Requests

PRs are always welcome and can be a quick way to get your fix or improvement slated for the next release.

In general, we follow the ["fork-and-pull" Git workflow](https://github.com/susam/gitpr)

1. Fork the repository to your own GitHub account
2. Clone the project to your machine
3. Create a branch locally with a succinct but descriptive name
4. Commit changes to the branch
5. Follow any guidelines specific to this repository
6. Push changes to your fork
7. Open a PR in our repository and follow the PR template so that we can efficiently review the changes.

When opening a pull request, consider the following:

### Does it state intent

You should be clear about which problem you're trying to solve with your contribution. For example:

> Add a link to code of conduct in README.md

This doesn't tell anything about why it's being done, unlike

> Add a link to code of conduct in README.md because users don't always look in the CONTRIBUTING.md

This tells the problem that you have found, and the pull request shows the action you have taken to solve it.

The same principle applies to the commit body.

### Is it of good quality

- It follows the provided template
- There are no spelling mistakes
- It follows the [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) specification

## Workflow

As a main branch we use `master` branch. All changes directly go to the main branch from where we have `beta` build per each commit.

### Code review and approval process

Our maintainers look at pull requests on a regular basis, and the process follows some simple steps:

1. Assign `Farfetch/maestro` team for review
2. Wait for comments/suggestion from auto assigned reviewers. (It generally done within few workdays)
3. Get 2 approvals to get PR merged

> Note: We close Pull requests without any activities within 2 weeks.

### Release process

Releases are made in bi-weekly basics from the `master` branch by our maintainers, regardless of the number of features or fixes.

For release preparation we have [milestones](https://github.com/Farfetch/maestro/milestones) created to have visibility on what is in progress right now.

If you are interested in testing out any features that are still not part of release, we do publish of `Beta` per each commit to main branch. Publish is generally made to Docker registry by using tag `beta-<shot-commit-sha>`

## Your First Contribution

If you want to deep dive and help out with development, then first get the project installed locally.
After that is done we suggest you have a look at issues that are labelled "[good first issue](https://github.com/Farfetch/maestro/labels/good%20first%20issue)".
These are meant to be a great way to get a smooth start and won’t put you in front of the most complex parts of the system.

## Additional resources

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Using Pull Requests](https://help.github.com/articles/about-pull-requests/)

## Disclaimer

By sending us your contributions, you are agreeing that your contribution is made subject to the terms of our [Contributor Ownership Statement](https://github.com/Farfetch/.github/blob/master/COS.md)
