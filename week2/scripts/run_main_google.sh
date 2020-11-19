# Check deployment rollout status every 5 seconds (max 2.5 minutes) until complete.
ATTEMPTS=0
ROLLOUT_STATUS_CMD="kubectl rollout status deployment/sealed-secrets-controller -n kube-system"
until $ROLLOUT_STATUS_CMD || [ $ATTEMPTS -eq 30 ]; do
  $ROLLOUT_STATUS_CMD
  ATTEMPTS=$((attempts + 1))
  sleep 5
done

echo ------------------------------
echo Starting pingpong application 
echo ------------------------------

kubectl apply -f main/manifests/configmap.yaml

kubeseal -o yaml < main/manifests/postgre_secrets.yaml > main/manifests/sealedsecret.yaml

kubectl apply -f main/manifests/sealedsecret.yaml

kubectl apply -f main/manifests/postgre-service.yaml

kubectl apply -f main/prod_manifests/statefulset.yaml

kubectl apply -f pingpong/prod_manifests/ingress.yaml

kubectl apply -f status200/manifests/service.yaml

kubectl apply -f pingpong/prod_manifests/service.yaml

kubectl apply -f pingpong/manifests/deployment.yaml

kubectl apply -f status200/manifests/deployment.yaml


echo ------------------------------
echo Starting main application
echo ------------------------------

kubectl apply -f main/prod_manifests/persistentvolumeclaim.yaml

kubectl apply -f main/prod_manifests/ingress.yaml

kubectl apply -f main/prod_manifests/service.yaml

kubectl apply -f main/manifests/deployment.yaml