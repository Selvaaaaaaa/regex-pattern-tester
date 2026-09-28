terraform {
  required_version = ">= 1.5.0"
}
resource "null_resource" "minikube" {
  provisioner "local-exec" {
    command = "minikube start --driver=docker"
  }
  provisioner "local-exec" {
    command = "kubectl wait --for=condition=Ready node/minikube --timeout=180s"
  }
}
