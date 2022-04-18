slackResponse=null
pipeline {
    agent { label params.AGENT_LABEL }
    parameters {
        string name: 'ORGANIZATION'
        string name: 'REPOSITORY_NAME'
        string name: 'SOURCE_VERSION'
        string name: 'PROJECT'
        string name: 'SOURCE_ID'
        string name: 'PR_NUMBER'
        string name: 'SLACK_CHANNEL'
        string name: 'FOLDER_BASE', defaultValue: './'
        string name: 'AGENT_LABEL', defaultValue: 'node-agent'
    }
    stages {
        stage('Download source') {
            steps {
                reportStatus('pending', 'Downloading source')
                git url: 'git@github.com:$ORGANIZATION/$REPOSITORY_NAME.git', credentialsId: 'pachamama-rsa-private'
                sh 'git checkout $SOURCE_VERSION'
            }
        }
        stage('Build and Test') {
            steps {
                container('builder') {
                    reportStatus('pending', 'Running build')
                    echo 'Installing Packages...'
                    sh '''
                        yarn install
                        cd react
                        yarn install
                        cd ..
                        yarn test $SOURCE_VERSION
                    '''
                    echo 'Packages installed!'
                }
            }
        }
    }
    post {
      success {
        reportStatus('success', 'All check was succeded')
      }
      unsuccessful {
        reportStatus('failure', 'Build failed')
      }
    }
    options {
        skipStagesAfterUnstable()
    }
}
import groovy.json.JsonOutput
def reportStatus(status, message) {
    def color = "#439FE0"
    def icon = "loading"
    switch (status) {
        case 'success':
            color = "good"
            icon = "github-check-done"
            break;
        case 'failure':
            color = "danger"
            icon = "error"
            break;
        default:
            break;
    }
    slackNotify(status, message, color, icon)
    updateGitStatus(status, message)
}

def updateGitStatus(status, message) {
    switch (status) {
        case 'success':
            status = "SUCCESS"
            break;
        case 'failure':
        case 'error':
            status = "FAILURE"
            break;
        default:
            status = "PENDING"
            break;
    }
    githubNotify account: params.ORGANIZATION, repo: params.REPOSITORY_NAME, sha: params.SOURCE_ID, status: status, context: "Jenkins:${env.JOB_BASE_NAME}", description: "${message} #${env.BUILD_NUMBER}", targetUrl: env.RUN_DISPLAY_URL, credentialsId: 'pachamama-user-token',  gitApiUrl: ''
}

def slackNotify(status, message, color, icon) {
    def fullMessage = "*$PROJECT* - *$JOB_BASE_NAME* - branch: *$SOURCE_VERSION*\n:${icon}: *#$BUILD_NUMBER ${status.toUpperCase()}*\n${message}\n<$RUN_DISPLAY_URL|View Details>"
    if(!slackResponse) {
        slackResponse = slackSend(channel: params.SLACK_CHANNEL, color: color, message: fullMessage, tokenCredentialId: 'slack-token')
    }
    else {
        slackSend(channel: slackResponse.channelId, timestamp: slackResponse.ts, color: color, message: fullMessage, tokenCredentialId: 'slack-token')
        slackSend(channel: slackResponse.threadId, color: color, message: message, tokenCredentialId: 'slack-token')
    }
}