pipeline{
    agent any
    environment {
        APP_NAME = "my-health"
        RELEASE = "1.0.0"
        DOCKER_USER = "alejandro945"
        DOCKER_PASS = 'Alejo1234'
        IMAGE_NAME = "${DOCKER_USER}" + "/" + "${APP_NAME}"
        IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
        // JENKINS_API_TOKEN = credentials("JENKINS_API_TOKEN")
    }
    tools{
        NodeJS '17.0.0'
    }
    stages{
        stage("Cleanup Workspace"){
            steps {
                cleanWs()
            }

        }
    
        stage("Checkout from SCM"){
            steps {
                git branch: 'main', credentialsId: 'github', url: 'https://github.com/alejandro945/my-health-dev'
            }
        }

        stage("Build Application"){
            steps {
                sh "npm version"
                sh "cd frontend && npm install && npm run build"
                sh "cd .."
                sh "cd backend && npm install"
                sh "cd .."
            }

        }

        stage("Test Application"){
            steps {
                sh "cd fronted && npm run test && npm run lint"
                sh "cd .."
                sh "cd backend && npm run test"
                sh "cd .."
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                script{
                    def scannerHome = tool 'SonarScanner';
                    withSonarQubeEnv('SonarOwn') {
                    sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage("Quality Gate") {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'jenkins-sonarqube-token'
                }
            }
        }

        stage("Build & Push Docker Image") {
            steps {
                script {
                    docker.withRegistry('',DOCKER_PASS) {
                        docker_image = docker.build "${IMAGE_NAME}"
                    }

                    docker.withRegistry('',DOCKER_PASS) {
                        docker_image.push("${IMAGE_TAG}")
                        docker_image.push('latest')
                    }
                }
            }

        }

        // stage("Trivy Scan") {
        //     steps {
        //         script {
		//             sh (`'docker run -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image alejandro945/my-health-dev:1.0.0-'${BUILD_NUMBER} '--no-progress --scanners vuln  --exit-code 0 --severity HIGH,CRITICAL --format table'`)
        //         }
        //     }
        // }

        // stage ('Cleanup Artifacts') {
        //     steps {
        //         script {
        //             sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG}"
        //             sh "docker rmi ${IMAGE_NAME}:latest"
        //         }
        //     }
        // }


        // stage("Trigger CD Pipeline") {
        //     steps {
        //         script {
        //             sh "curl -v -k --user admin:${JENKINS_API_TOKEN} -X POST -H 'cache-control: no-cache' -H 'content-type: application/x-www-form-urlencoded' --data 'IMAGE_TAG=${IMAGE_TAG}' 'buildWithParameters?token=gitops-token'"
        //         }
        //     }
        // }
    }
}