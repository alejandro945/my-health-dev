pipeline{
    agent {
        label "docker-agent"
    }

    environment {
        APP_NAME = "my-health"
        RELEASE = "1.0.0"
        ACR_REPO = "ajm"
        IMAGE_NAME_CLIENT = "${ACR_REPO}" + "/" + "${APP_NAME}" + "-client"
        IMAGE_NAME_SERVER = "${ACR_REPO}" + "/" + "${APP_NAME}" + "-server"
        IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
        JENKINS_API_TOKEN = credentials("jenkins_api_token")
        ACR_CREDENTIALS = credentials('acr_credentials')
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
                sh "cd frontend && npm install"
                sh "cd .."
                sh "cd backend && npm install"
                sh "cd .."
            }

        }

        stage("Test Application"){
            steps {
                sh "cd frontend && npm run test:unit && npm run lint"
                sh "cd .."
                sh "cd backend && npm run test:unit && npm run test:integration"
                sh "cd .."
            }
        }

       /*  stage('SonarQube Analysis') {
            steps {
                script{
                    def scannerHome = tool 'sonar';
                    withSonarQubeEnv(credentialsId: 'sonar_credentials') {
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=my-health-dev -Dsonar.sources=frontend,backend"
                    }
                }
            }
        } */

        stage("Build & Push Docker Images") {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME_CLIENT}:${IMAGE_TAG} ./frontend"
                    sh "docker build -t ${IMAGE_NAME_SERVER}:${IMAGE_TAG} ./backend"

                    sh "docker tag ${IMAGE_NAME_CLIENT}:${IMAGE_TAG} ${IMAGE_NAME_CLIENT}:latest"
                    sh "docker tag ${IMAGE_NAME_SERVER}:${IMAGE_TAG} ${IMAGE_NAME_SERVER}:latest"

                    sh "docker login -u ${ACR_USER} -p ${ACR_CREDENTIALS}"

                    sh "docker push ${IMAGE_NAME_CLIENT}:${IMAGE_TAG}"
                    sh "docker push ${IMAGE_NAME_CLIENT}:latest"
                    sh "docker push ${IMAGE_NAME_SERVER}:${IMAGE_TAG}"
                    sh "docker push ${IMAGE_NAME_SERVER}:latest"
            
                }
            }
        }

        stage("Trivy Scan") {
             steps {
                 script {
		             sh "docker run -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image' ${IMAGE_NAME_CLIENT}:${IMAGE_TAG} --no-progress --scanners vuln  --exit-code 0 --severity HIGH,CRITICAL --format table"
                     sh "docker run -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image' ${IMAGE_NAME_SERVER}:${IMAGE_TAG} --no-progress --scanners vuln  --exit-code 0 --severity HIGH,CRITICAL --format table"
                 }
             }
        }

        stage ('Cleanup Artifacts') {
            steps {
                script {
                    sh "docker rmi ${IMAGE_NAME_CLIENT}:${IMAGE_TAG}"
                    sh "docker rmi ${IMAGE_NAME_CLIENT}:latest"
                    sh "docker rmi ${IMAGE_NAME_SERVER}:${IMAGE_TAG}"
                    sh "docker rmi ${IMAGE_NAME_SERVER}:latest"
                }
            }
        }

        stage("Trigger CD Pipeline") {
            steps {
                script {
                    sh "curl -v -k --user admin:${JENKINS_API_TOKEN} -X POST -H 'cache-control: no-cache' -H 'content-type: application/x-www-form-urlencoded' --data 'IMAGE_TAG=${IMAGE_TAG}' 'buildWithParameters?token=gitops-token'"
                }
            }
        }

    }
}