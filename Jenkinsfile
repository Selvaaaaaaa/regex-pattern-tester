
pipeline {
    agent any

    stages {

        // Stage 1: Confirm that the project source is ready
        stage('Checkout') {
            steps {
                echo 'Regex Pattern Tester source is ready'
            }
        }

        // Stage 2: Test the Python application
        stage('Test') {
            steps {
                sh '''
                    # Check Python syntax
                    python3 -m py_compile app/app.py
                '''
            }
        }

        // Stage 3: Build the Docker image and deploy using Ansible
        stage('Build and Deploy') {
            steps {
                sh '''
                    # Move into the Ansible directory
                    cd ansible

                    # Run the Ansible deployment playbook
                    ansible-playbook -i inventory.ini deploy.yml
                '''
            }
        }

        // Stage 4: Verify the regex-fresh Kubernetes cluster
        stage('Verify') {
            steps {
                echo 'Verifying regex-fresh Kubernetes cluster'

                sh '''
                    # Check the Kubernetes node
                    sudo -n -u selvaa /usr/local/sbin/jenkins-regex-kubectl get nodes

                    # Check the application deployment
                    sudo -n -u selvaa /usr/local/sbin/jenkins-regex-kubectl get deployment devops-flask

                    # Check the application pods
                    sudo -n -u selvaa /usr/local/sbin/jenkins-regex-kubectl get pods

                    # Check the application service
                    sudo -n -u selvaa /usr/local/sbin/jenkins-regex-kubectl get service devops-flask-service
                '''
            }
        }
    }

    // Display the final pipeline result
    post {
        success {
            echo 'Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check Console Output.'
        }

        always {
            echo 'Regex Pattern Tester pipeline finished.'
        }
    }
}
