pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps { echo 'Project source is ready' }
        }
        stage('Test') {
            steps { sh 'python3 -m py_compile app/app.py' }
        }
        stage('Build and Deploy') {
            steps {
                sh '''
                    cd ansible
                    ansible-playbook -i inventory.ini deploy.yml
                '''
            }
        }
        stage('Verify') {
            steps {
                sh '''
                    kubectl get nodes
                    kubectl get pods
                    kubectl get services
                '''
            }
        }
    }
    post {
        success { echo 'Regex Pattern Tester deployed successfully!' }
        failure { echo 'Pipeline failed. Check Console Output.' }
    }
}
