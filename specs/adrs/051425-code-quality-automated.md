# The use of human reviews for code quality checks

## Context and Problem Statement

Ensuring code quality is criticial to a maintaibable codebase. As a team, we want to ensure:
- Code adheres to agreed-upon standards
- Formatting remains consistent, regardless of individual developer preferences
- Developers aware of ongoining changes to the code base, promoting collaboration and knowledge sharing
- Feedback cycles are fast, actionable and automated when possible.

We evaluated tools to support automated code quality and collaboration during PRs, while supporting manual review efforts. 

## Considered Options

- CodeClimate
  - Pros: 
    - Offer a robust maintainability and complexity metrics.
    - Supports Integration with Github, and other Git providers.
    - Provides test coverage insights when integrated with CI tools
  - Cons:
    - Limited Language support
    - Less focus on formatting/style checks compared to others
- Qlty
  - Pros:
    - Lightweight and simple to use
    - Minimal setup
    - Can be customized with rulesets
  - Cons:
    - Support for limited languages
    - Small community/user base
    - Lack of built in PR review making feedback less visible
- Codacy
  - Pros:
    - Supports a variety of languages
    - Provides automated code reviews in PRs.
    - Can be easily configurable 
    - Offers suggestions and integrates well with the workflow
  - Cons:
    - May require fine tuning to reduce noise and false positives (i.e markdown files, and package-lock.json comments )

## Decision Outcome

Chosen option: "Codacy" since it stikes the balance between ease of use, wide range of language support, and actionable automated code review feedback. With Codacy, it would integrate directly into the pull request process, helping each developers see and fix issues. It also enforces consistent formatting and quality standards across the team.

Compared to CodeClimate and Qtly, Codacy offers broader language support and a more user friendly setup. For our team, it makes Codacy the most scalable and effective tool for ensuring code quality while encouraging Agile collaboration.

## Consequences

- Potential for false positives or over enforcement, leading to alert fatigue
- Codacy tuning is needed initially.
- It will provide a faster code review as well as ensure code consistency.
- Catches bad practices and complexity early.