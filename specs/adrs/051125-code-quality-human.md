# The use of human reviews for code quality checks

## Context and Problem Statement

- How to ensure code is up to standard? 
- How to ensure that Agile practices are followed in terms of making other developers aware of the current code base? 
- How can reviews support knowledge sharing rather and reducing solo understanding

## Considered Options

* Require at least 2 reviewers for pull request
* Enforce feature branches (no commit to main without a PR)
* Self Approval for low risk changes

## Decision Outcome

Chosen option: "Require atleast 2 Reviewers for pull Request" and "Enforce Feature branches" because this way it would allow reviewers to be familar with the code as well as protect the main branch from any unwanted bugs. This process is done to catch any bugs before hand and allow developers to be familar with the code base. We opted out of "self approval for low risk changes" as while it may be small to someone, it leads to inconsistent standards as well as the possibility to introduce bugs into the mian code base.