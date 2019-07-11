const assert = require('@vtex/danger')
// const config = require('@vtex/danger/config')

// Level of checks
const FAIL = 'fail'
const WARN = 'warn'
const INFO = 'message'

const config = {
  matchers: {
    test_files: path => path.match(/test|spec/i),
    code_files: path => path.match(/\.[tj]sx?$/i),
  },
  rules: {
    file_changes: [INFO, { created: true, deleted: true, modified: true }],
    changelog: FAIL,
    description: [FAIL, { minLength: 20 }],
    wip: FAIL,
    assignee_reviewers: WARN,
    pr_size: [WARN, { additionLimit: 800, deletionLimit: -1 }],
    lock_file: WARN,
    need_rebase: WARN,
    tests_only: FAIL,
    console_log: WARN,
  },
}

assert(config)
