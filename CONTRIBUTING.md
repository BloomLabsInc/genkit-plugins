# Contribution Guidelines

Hey, welcome! We love receiving contributions from our community, so thanks for stopping by! There are many ways to contribute, including submitting bug reports and feature requests, reviewing new submissions, or contributing code that can be incorporated into the project.

This document describes our development process. Following these guidelines shows that you respect the time and effort of the developers managing this project. In return, you will be shown respect in addressing your issue, reviewing your changes, and incorporating your contributions.

Before reading further, please note that:

> [!NOTE]  
> This repository depends on Google's Firebase Genkit. For issues and questions related to Genkit, please refer to instructions available in [Genkit's repository](https://github.com/firebase/genkit).

## Table of Contents

- [Contribution Guidelines](#contribution-guidelines)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [License](#license)
  - [Questions](#questions)
  - [Feature Requests](#feature-requests)
  - [Reporting Bugs](#reporting-bugs)
  - [Contributing with code](#contributing-with-code)
    - [Getting Started](#getting-started)
      - [Option 1: Dev Container](#option-1-dev-container)
      - [Option 2: Local install](#option-2-local-install)
    - [Finding an Issue](#finding-an-issue)
    - [Development Process](#development-process)
    - [Building the Project](#building-the-project)
    - [Testing](#testing)
    - [Automatic release draft with version bump labels](#automatic-release-draft-with-version-bump-labels)
  - [About this document](#about-this-document)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). We expect all contributors to follow the [Code of Conduct](CODE_OF_CONDUCT.md) and to treat fellow humans with respect. Be kind with others!

## License

By participating in this project and submitting contributions, you agree to license your contributions under the [project license](LICENSE).

## Questions

If you have any support questions, please open a [GitHub discussion](https://github.com/BloomLabsInc/genkit-plugins/discussions). The GitHub issue tracker is not for support-related requests.

## Feature Requests

Major Changes that you wish to contribute to the project should be discussed first in an GitHub issue that clearly outlines the changes and benefits of the feature.

Small Changes can directly be crafted and submitted to the GitHub Repository as a Pull Request.

## Reporting Bugs

**If you discover a security vulnerability, do NOT open an issue. Email info@firecompany.co instead.**

Before you submit your issue, please [search the issue archive](https://github.com/BloomLabsInc/genkit-plugins/issues) - your issue might have already been identified or addressed.

If you find a bug in the source code, you can help us by submitting an issue or, even better, you can submit a Pull Request with a fix.

## Contributing with code

Working on your first open source project or pull request? Here are some helpful tutorials:

- [How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)
- [Make a Pull Request](https://makeapullrequest.com/)
- [First Timers Only](http://www.firsttimersonly.com)

### Getting Started

#### Option 1: Dev Container

We provide the configuration files for a VSCode Dev Container. When opening the repository within the container, VSCode will automatically install all the dependencies for you.

You can read more about Dev Containers [here](https://code.visualstudio.com/docs/devcontainers/containers).

#### Option 2: Local install

If you want to develop locally, please make sure to have Node >=20 installed on you machine.

You can set up the local development environment as follows:

1. Run `npm run install` from the root directory of the project.
2. You are good to go!

### Finding an Issue

The list of open feature requests and bugs can be found on our on our [GitHub issue tracker](https://github.com/BloomLabsInc/genkit-plugins/issues). Pick an unassigned issue that you think you can accomplish and add a comment that you are attempting to do it.

### Development Process

If you are a first time contributor, we highly suggest to read the GitHub fork and pull-request process [here](https://gist.github.com/Chaser324/ce0505fbed06b947d962).

We work directly in the `main` branch. In order to contribute to the project you can create a new branch starting from there.

When you are done, make sure to create a Pull Request with `main` as the base branch.

### Building the Project

You can build the package with npm from the root directory:

```
npm run build
```

Or with the `npm: build` VSCode task. More about VSCode tasks [here](https://code.visualstudio.com/Docs/editor/tasks).

### Testing

If you add code you need to add tests! If your pull request reduces our test coverage because it lacks tests then it will be rejected.

Tests can be added in the `tests` subfolder of each of the plugins. As an example, please take a look at the tests which are already there.

You can then run tests with npm from the root directory:

```
npm run test
```

Or with the `npm: test` VSCode task. More about VSCode tasks [here](https://code.visualstudio.com/Docs/editor/tasks).

### Automatic release draft with version bump labels

For repository maintainers, make sure to add one of `bump:patch`, `bump:minor` or `bump:major` labels according to whether you think the PR contains a patch, minor or major change.
When the PR is merged, CI will automatically create a new tag and draft a release with changes included in the PR.

If no bump labels are added to the PR, no draft release and tag will be generated.

## About this document

These contribution guidelines are adapted by the [Embedded Artistry Templates](https://github.com/embeddedartistry/templates). Licensing information about the original information of this document can be found [here](https://github.com/embeddedartistry/templates/blob/master/LICENSE).
