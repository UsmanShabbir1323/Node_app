#!/bin/sh

# Navigate to the directory containing this script
cd "$(dirname "$0")" || exit 1

# Go to the k8s directory (one level up from scripts/)
cd ../k8s || exit 1

echo "📦 Starting Kubernetes deployments..."

# YAML files to apply in order
FILES="
ingress.yml
mongo-deployment.yml
redis-deployment.yml
nginx-configmap.yml
nginx-deployment.yml
task-deployment.yml
"

for file in $FILES; do
  if [ -f "$file" ]; then
    echo "🔧 Applying $file..."
    kubectl apply -f "$file"
  else
    echo "⚠️  File $file not found!"
  fi
done

echo "✅ All manifests applied successfully."
