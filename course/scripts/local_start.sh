#!/bin/bash

echo Running Local Cluster start scripts!

k3d cluster create --port '8082:30080@agent[0]' -p 8081:80@loadbalancer --agents 2

kubectl create namespace main

kubectl create namespace project

docker exec k3d-k3s-default-agent-0 mkdir -p /tmp/kube

kubectl apply -f https://github.com/bitnami-labs/sealed-secrets/releases/download/v0.12.1/controller.yaml

kubectl apply -f https://raw.githubusercontent.com/kubernetes/kubernetes/master/hack/testdata/recursive/pod/pod/busybox.yaml

helm install my-nats nats/nats

echo ------------------------------
echo Starting main application
echo ------------------------------

kubectl apply -f main/manifests/persistentvolume.yaml

kubectl apply -f main/manifests/persistentvolumeclaim.yaml

kubectl apply -f main/manifests/ingress.yaml

kubectl apply -f main/manifests/service.yaml

kubectl apply -f main/manifests/configmap.yaml

kubectl apply -f main/manifests/deployment.yaml

# Check deployment rollout status every 5 seconds (max 2.5 minutes) until complete.
ATTEMPTS=0
ROLLOUT_STATUS_CMD="kubectl rollout status deployment/sealed-secrets-controller -n kube-system"
until $ROLLOUT_STATUS_CMD || [ $ATTEMPTS -eq 30 ]; do
  $ROLLOUT_STATUS_CMD
  ATTEMPTS=$((attempts + 1))
  sleep 5
done

kubeseal -o yaml < main/manifests/postgre_secrets.yaml > main/manifests/sealedsecret.yaml

kubectl apply -f main/manifests/sealedsecret.yaml

kubectl apply -f main/manifests/postgre-service.yaml

kubectl apply -f main/manifests/statefulset.yaml


echo ------------------------------
echo Starting pingpong application 
echo ------------------------------

kubectl apply -f pingpong/manifests/ingress.yaml

kubectl apply -f pingpong/manifests/service.yaml

kubectl apply -f pingpong/manifests/deployment.yaml

echo ------------------------------
echo Starting project 
echo ------------------------------

kubectl create namespace argo-rollouts

kubectl apply -n argo-rollouts -f https://raw.githubusercontent.com/argoproj/argo-rollouts/stable/manifests/install.yaml

kubectl apply -f project/manifests/analysistemplate.yml

kubectl apply -f project/image-service/manifests/persistentvolume.yaml

kubectl apply -f project/image-service/manifests/persistentvolumeclaim.yaml

kubectl apply -f project/image-service/manifests/ingress.yaml

kubectl apply -f project/image-service/manifests/service.yaml

kubectl apply -f project/image-service/manifests/deployment.yaml

echo ------------------------------

kubeseal -o yaml < project/broadcaster/manifests/secret.yml > project/broadcaster/manifests/sealedsecret.yaml

kubectl apply -f project/broadcaster/manifests/sealedsecret.yaml

kubectl apply -f project/broadcaster/manifests/deployment.yml

echo ------------------------------

kubectl apply -f project/todo-back/manifests/configmap.yaml

kubeseal -o yaml < project/todo-back/manifests/postgres-secrets.yaml > project/todo-back/manifests/sealedsecret.yaml

kubectl apply -f project/todo-back/manifests/sealedsecret.yaml

kubectl apply -f project/todo-back/manifests/postgre-service.yaml

kubectl apply -f project/todo-back/manifests/statefulset.yaml

kubectl apply -f project/todo-back/manifests/ingress.yaml

kubectl apply -f project/todo-back/manifests/service.yaml

kubectl apply -f project/todo-back/manifests/deployment.yaml

kubectl apply -f project/cronjob/manifests/cronjob.yaml

echo ------------------------------

kubectl apply -f project/todo/manifests/ingress.yaml

kubectl apply -f project/todo/manifests/service.yaml

kubectl apply -f project/todo/manifests/deployment.yaml