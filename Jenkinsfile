pipeline{

    agent any

    environment {
        APP_NAME = "my-health"
        RELEASE = "1.0.0"
        ACR_USER = "myHealthContainerRegistry"
        IMAGE_NAME_CLIENT = "${ACR_USER}" + "/" + "${APP_NAME}" + "-client"
        IMAGE_NAME_SERVER = "${ACR_USER}" + "/" + "${APP_NAME}" + "-server"
        IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
        JENKINS_API_TOKEN = credentials("JENKINS_API_TOKEN")
        ACR_CREDENTIALS = credentials('acr_credentials')
    }

    tools{
        nodejs 'node'
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
                    withSonarQubeEnv(credentialsId: 'sonar-credentials') {
                        sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=my-health-dev -Dsonar.sources=frontend,backend"
                    }
                }
            }
        } */

        stage("Build & Push Docker Images") {
            steps {
                script {
                    docker_image_client = docker.build("${IMAGE_NAME_CLIENT}", "./frontend")
                    docker_image_server = docker.build("${IMAGE_NAME_SERVER}", "./backend")
                    
                    docker.withRegistry('http://myhealthcontainerregistry.azurecr.io',ACR_CREDENTIALS) {
                        docker_image_client.push("${IMAGE_TAG}")
                        docker_image_client.push('latest')
                    }
                    docker.withRegistry('http://myhealthcontainerregistry.azurecr.io',ACR_CREDENTIALS) {
                        docker_image_server.push("${IMAGE_TAG}")
                        docker_image_server.push('latest')
                    }
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