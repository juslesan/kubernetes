echo Running Google Cloud Cluster start scripts!

gcloud container clusters create dwk-cluster --zone=europe-north1-b

gcloud container clusters get-credentials dwk-cluster --zone=europe-north1-b
kubectl cluster-info

kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.12.1/controller.yaml

kubectl create namespace main

kubectl create namespace project

kubectl create namespace prometheus

helm install prometheus-community/kube-prometheus-stack --generate-name --namespace prometheus