const sonarqubeScanner = require('sonarqube-scanner')
const currentGitBranchName = require('current-git-branch')

let branchName = process.argv[2]

if (branchName === undefined) {
  branchName = currentGitBranchName()
}

sonarqubeScanner(
  {
    serverUrl: 'https://sonarcloud.io',
    token: 'd30d3c427d2ea2dcedae2aa19afcafe3e689cd12',
    options: {
      'sonar.projectKey': 'vtex_my-subscriptions',
      'sonar.organization': 'vtex',
      'sonar.branch.name': branchName,
      'sonar.test.inclusions':
        'apps/vtex-my-subscriptions-3/react/**/*.test.tsx, apps/vtex-my-subscriptions-3/react/**/*.test.ts',
      'sonar.typescript.lcov.reportPaths':
        'apps/vtex-my-subscriptions-3/react/coverage/lcov.info',
      'sonar.testExecutionReportPaths':
        'apps/vtex-my-subscriptions-3/react/reports/test-report.xml',
    },
  },
  () => {}
)
