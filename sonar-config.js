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
      'sonar.projectKey': 'vtex_my-orders',
      'sonar.organization': 'vtex',
      'sonar.branch.name': branchName,
      'sonar.test.inclusions': './react/**/*.test.tsx,./react/**/*.test.ts',
      'sonar.typescript.lcov.reportPaths': './react/coverage/lcov.info',
      'sonar.testExecutionReportPaths': './react/reports/test-report.xml',
    },
  },
  () => {}
)