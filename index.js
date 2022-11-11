#!/usr/bin/env node

const BRANCHING_MODEL_MAP = {
  develop: [
    /^main$/g,
    /^feature\/[A-Z]{1,10}-[0-9]{1,4}$/g,
    /^hotfix\/[A-Z]{1,10}-[0-9]{1,4}$/g,
    /^release\/[A-Z]{1,10}-[0-9]{1,4}$/g,
  ],
  main: [
    /^hotfix\/[A-Z]{1,10}-[0-9]{1,4}$/g,
    /^release\/[A-Z]{1,10}-[0-9]{1,4}$/g,
  ],
};

// branch we are opening the PR from...
const HEAD_REF = process.env.GITHUB_HEAD_REF;

// branch we are merging into...
const BASE_REF = process.env.GITHUB_BASE_REF;

// get list of allowed head-branches for this base-branch...
const ALLOWED_HEAD_REFS = BRANCHING_MODEL_MAP[BASE_REF];

//
if (!ALLOWED_HEAD_REFS) {
  console.log("No merges allowed into this base branch!");
  process.exit(1);
}

for (let i = 0; i < ALLOWED_HEAD_REFS.length; i++) {
  const allowedHeadRef = ALLOWED_HEAD_REFS[i];
  const matches = HEAD_REF.match(allowedHeadRef);
  if (matches) {
    process.exit(0);
  }
}

process.exit(1);