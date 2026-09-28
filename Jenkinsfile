// Define the Jenkins CI/CD pipeline
pipeline {
    // Run the pipeline on any available Jenkins agent
    agent any

    // Define the pipeline stages
    stages {

        // Check out the source code
        stage('Checkout') {
            steps {
                // Confirm that the source is available
                echo 'Regex Pattern Tester source is ready'
            }
        }

        // Check Python syntax
        stage('Test') {
            steps {
                // Compile the Python file to detect syntax errors
                sh 'python3 -m py_compile app/app.py'
            }
        }

        // Build the Docker image and deploy the application
        stage('Build and Deploy') {
            steps {
                // Run the Ansible deployment playbook
                sh '''
                    # Navigate to the Ansible directory
                    cd ansible

                    # Build the image, load it into Minikube,
                    # and apply the Kubernetes manifests
                    ansible-playbook -i inventory.ini deploy.yml
                '''
            }
        }

        // Verify the new Minikube cluster
        stage('Verify') {
            steps {
                sh '''
                    # Display nodes in the fresh cluster
                    kubectl --context=regex-fresh get nodes

                    # Display application pods
                    kubectl --context=regex-fresh get pods

                    # Display Kubernetes Services
                    kubectl --context=regex-fresh get services

                    # Confirm the application rollout completed
                    kubectl --context=regex-fresh rollout status deployment/devops-flask --timeout=180s
                '''
            }
        }
    }

    // Display the final pipeline result
    post {
        success {
            echo 'Regex Pattern Tester deployed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check Console Output.'
        }
    }
}
