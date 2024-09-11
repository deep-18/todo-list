pipeline {
    agent any

    tools {
        jdk 'jdk17'
        nodejs 'node16'
    }
    environment {
        SCANNER_HOME=tool 'sonar-scanner'
    }

    stages {
        stage('clean workspace'){
            steps{
                cleanWs()
            }
        }
        stage('git') {
            steps {
                // Get some code from a GitHub repository
                git branch: 'main', url: 'https://github.com/deep-18/todo-list.git'

            }
        }
        stage('sonarqube') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh ''' $SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=jenkins \
                    -Dsonar.projectKey=jenkins '''
                }
            }
        }
        stage('quality gate') {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'sonar'
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                sh "npm install"
            }
        }
        stage('Docker Build and push') {
            steps {
                script{
                    withDockerRegistry(credentialsId: 'docker', toolName: 'docker') {
                        sh '''docker build -t todo .
                            docker tag todo deepraval/todo:latest
                            docker push deepraval/todo:latest'''
                    }
                }
            }
        }
        stage('trivy') {
            steps {
                sh 'trivy fs . > trivyfs.txt'
            }
        }
    }
}