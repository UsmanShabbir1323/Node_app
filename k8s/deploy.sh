#!/bin/bash

kubectl apply -f mongo-deployment.yml
kubectl apply -f redis-deployment.yml
kubectl apply -f task-deployment.yml
kubectl apply -f nginx-configmap.yml
kubectl apply -f nginx-deployment.yml
kubectl apply -f nginx-service.yml