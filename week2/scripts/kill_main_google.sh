echo ------------------------------
echo Killing pingpong application 
echo ------------------------------

kubectl delete -f main/manifests/configmap.yaml

kubectl delete -f main/manifests/sealedsecret.yaml

kubectl delete -f main/manifests/postgre-service.yaml

kubectl delete -f main/prod_manifests/statefulset.yaml

kubectl delete -f pingpong/prod_manifests/ingress.yaml

kubectl delete -f status200/manifests/service.yaml

kubectl delete -f pingpong/prod_manifests/service.yaml

kubectl delete -f pingpong/manifests/deployment.yaml

kubectl delete -f status200/manifests/deployment.yaml

echo ------------------------------
echo Killing main application
echo ------------------------------

#kubectl delete -f main/prod_manifests/persistentvolumeclaim.yaml

#kubectl delete -f main/prod_manifests/persistentvolume.yaml

kubectl delete -f main/prod_manifests/ingress.yaml

kubectl delete -f main/prod_manifests/service.yaml

kubectl delete -f main/manifests/deployment.yaml