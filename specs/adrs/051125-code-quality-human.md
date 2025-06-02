# The use of human reviews for code quality checks

## Context and Problem Statement

As part of maintaining a high quality codebase, and following Agile practices, we want to estable a review process that
- Ensures code adheres to team standards and is maintainable
- Facilitates team-wide awareness of changes to the codebase
- Encourages collaboration, reducing the risk of individual silos and support knowledge sharing
- Prevents bugs and regressions from being merged into the main branch


## Considered Options

* Require at least 2 reviewers for pull request
  * Pros:
    * Encourages collaboration and multiple perspectives on a change
    * Reduce the likelihood of a single point of failure or blind spots in review
    * Promotes shared code ownership and collective responsibility
    * Knowledge distribution as reviewers would gain context on different parts of the codebase
  * Cons:
    * May slow down the review process if reviewers are unavailable
* Enforce feature branches (no commit to main without a PR)
  * Pros:
    * Protects the integrity of the main branch
    * Ensures change goes through a formal review process
    * Encourages isolated, well scoped changes that are eaiser to test and review
    * Supports version control and rollback strategies
  * Cons:
    * Require discipline to follow branching conventions
    * Might add slight friction to very small changes
* Self Approval for low risk changes
  * Pros:
    * Speeds up small tasks like typo fixes, documention tweaks or config updates
    * Reduces bottlenecks
  * Cons:
    * "Low risk" is subjective and prone to misjudgement
    * Leads to inconsistent standards if changes bypass usual checks
    * Increases risks of bugs or regressions slipping into the main codebase.
    * Undermines team awareness

## Decision Outcome

Chosen option: "Require atleast 2 Reviewers for pull Request" and "Enforce Feature branches" because this way it would allow reviewers to be familar with the code as well as protect the main branch from any unwanted bugs. This process is done to catch any bugs before hand and allow developers to be familar with the code base. We opted out of "self approval for low risk changes" as while it may be small to someone, it leads to inconsistent standards as well as the possibility to introduce bugs into the mian code base.

## Consequences

- Promotes code quality, team accountability and knowledge sharing.
- Reduces the likelihood of introducing bugs into the main branch.
- Review Cycles may slow down in times of low availability.