# CI/CD Decisions and Teams

## Context and Problem Statement

For the CI/CD pipleine assignment and associated ADR documentation, we needed to decide how to effectively divide responsibilities among team members to ensure
- Equal contribution and participation
- Efficient task completion
- Clear ownership and accountability
- Reduced confusion and overlap in responsibilities.

The overall goal was to compelte the pipeline configuration and supporting documentation while balacing workload and minimizing bottlenecks

## Considered Options

* Tackle indivdual tasks
  * Pros:
    * Each person can take ownership of a specific task
    * Clear individual accountability
  * Cons:
    * Risk of uneven workload distribution
    * Limited collaboration or peer review
    * Could lead to inconsistent implementation approaches
* Split into small groups to work on specific task
  * Pros:
    * Encourages collaboration and knowledge sharing within subgroups
    * Allows team members to divide work efficiently and in parallel
    * Balances workload while maintaining focus and cohesion
    * Mimics Agile based development, with small units focusing on related tasks
  * Cons:
    * Requires coordination to ensure sub-teams stay aligned
    * Potential for duplicated effort or overlooked edge cases if teams don't sync
* Whole team works together
  * Pros:
    * high transparency and shared understanding across the group
    * Group wide decision making to ensure alignment on implementation
  * Cons:
    * Inefficent for time sensitive tasks, making it harder to make progress in parallel
    * Risk of too many people involved in small tasks


## Decision Outcome

Chosen option: Splitting into teams because it allows everyone to contribute to the team and helps finish the task faster compared to being inone large group. Divided the CI/CD pipeline assignment into three groups, one working on code quality/linting, one working on unit testing, and one on documentation. 

## Consequences

- Enables faster and more organized progress by working in parallel.
- Everyone gets to contribute to an area of interest or strength.
- Encourages responsibility and team ownership within focus tasks.
- Enhances peer learning through small group collaboration.
- Requires active communication between groups to stay aligned on pipeline design.
  