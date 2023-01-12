#!/usr/bin/env node

const REGEX_MAIN = /^main$/g;
const REGEX_FEATURE = /^feature\/[A-Z0-9]{1,10}-[0-9]{1,4}$/g;
const REGEX_HOTFIX = /^hotfix\/[A-Z0-9]{1,10}-[0-9]{1,4}$/g;
const REGEX_RELEASE = /^release\/\d\.\d\.\d$/g;

const BRANCHING_MODEL_MAP = new Map();
BRANCHING_MODEL_MAP.set(REGEX_RELEASE, [REGEX_FEATURE]);
BRANCHING_MODEL_MAP.set(REGEX_MAIN, [REGEX_RELEASE, REGEX_HOTFIX]);

// branch we are opening the PR from...
const HEAD_REF = process.env.GITHUB_HEAD_REF;

// branch we are merging into...
const BASE_REF = process.env.GITHUB_BASE_REF;

for (const patternBaseRef of BRANCHING_MODEL_MAP.keys()) {
  const matches = BASE_REF.match(patternBaseRef);

  if (matches) {
    console.log(
      `Base branch is matching a definition in our branching-model => `,
      patternBaseRef
    );
    const allowedHeadRefs = BRANCHING_MODEL_MAP.get(patternBaseRef);
    console.log(
      `Allowed head branches for this base branch are =>`,
      allowedHeadRefs
    );

    for (const allowedHeadRef of allowedHeadRefs) {
      const matches = HEAD_REF.match(allowedHeadRef);

      if (matches) {
        console.log(
          `Head branch is matching this regular expression =>`,
          allowedHeadRef
        );
        process.exit(0);
      }

      console.log(
        `Head branch is not matching this regular expression =>`,
        allowedHeadRef
      );
    }
  }
}

console.error(
  `Branches of the pull request aren't matching our branching model!`
);
process.exit(1);
