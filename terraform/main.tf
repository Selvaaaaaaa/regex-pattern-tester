# Terraform configuration for the fresh Regex Pattern Tester cluster
terraform {
  required_version = ">= 1.5.0"
}

# Use a Terraform resource to run the local Minikube setup commands
resource "null_resource" "regex_fresh_cluster" {

  # Re-run setup when either Kubernetes manifest changes
  triggers = {
    deployment_file = filemd5("${path.module}/../k8s/deployment.yaml")
    service_file    = filemd5("${path.module}/../k8s/service.yaml")
  }

  # Start the new, separately named Minikube cluster
  provisioner "local-exec" {
    command = "minikube -p regex-fresh start --driver=docker"
  }

  # Wait until the new cluster's node is ready
  provisioner "local-exec" {
    command = "kubectl --context=regex-fresh wait --for=condition=Ready node/regex-fresh --timeout=180s"
  }

  # Apply the Kubernetes Deployment to the new cluster
  provisioner "local-exec" {
    command = "kubectl --context=regex-fresh apply -f ${path.module}/../k8s/deployment.yaml"
  }

  # Apply the Kubernetes Service to the new cluster
  provisioner "local-exec" {
    command = "kubectl --context=regex-fresh apply -f ${path.module}/../k8s/service.yaml"
  }

  # Wait for the application Deployment to finish rolling out
  provisioner "local-exec" {
    command = "kubectl --context=regex-fresh rollout status deployment/devops-flask --timeout=180s"
  }
}
