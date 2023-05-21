pipeline{
    
    agent any

    environment {
        APP_NAME = "my-health"
        RELEASE = "1.0.0"
        ACR_USER = "myhealthcontainerregistry.azurecr.io"
        IMAGE_NAME = "${ACR_USER}" + "/" + "${APP_NAME}"
        IMAGE_TAG = "${RELEASE}-${BUILD_NUMBER}"
        // JENKINS_API_TOKEN = credentials("JENKINS_API_TOKEN")
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

        stage('SonarQube Analysis') {
            steps {
                script{
                    def scannerHome = tool 'sonar';
                    withSonarQubeEnv(credentialsId: 'sonar-cred') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }

        stage("Buiild Docker Image"){
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
                }
            }
        }

        stage("Azure Login and push the docker image"){
            steps {
                withCredentials([usernamePassword(credentialsId: 'acr_credentials', passwordVariable: 'password', usernameVariable: 'username')]){
                    sh "docker login -u ${username} -p ${password} ${ACR_USER}.azurecr.io}"
                    sh "docker image push ${IMAGE_NAME}:${IMAGE_TAG}"
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