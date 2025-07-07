pipeline {
  agent any

  environment {
    PATH = "/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
    DOCKER_USERNAME = credentials('docker-username')
    DOCKER_PASSWORD = credentials('docker-password')
    VPS_HOST        = credentials('vps-host')
    VPS_USER        = credentials('vps-user')
    VPS_PASSWORD    = credentials('vps-password')
  }

  triggers {
    githubPush()
  }

  options {
    skipDefaultCheckout()
  }

  stages {
    stage('Checkout Code') {
      steps {
        checkout scm
      }
    }

    stage('Detect Branch') {
      steps {
        script {
          def branch = sh(
            script: "git branch -r --contains HEAD | grep origin | sed 's/origin\\///' | head -n 1",
            returnStdout: true
          ).trim()

          env.ACTUAL_BRANCH = branch
          echo "✅ Detected Branch: ${env.ACTUAL_BRANCH}"
        }
      }
    }

    stage('Conditional Execution') {
      steps {
        script {
          if (env.ACTUAL_BRANCH == 'TS-6') {
            echo "✅ TS-6 branch detected. Running pipeline..."

            sh '''
              echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
              docker build -t usmanshabbir/task-api:latest .
              docker push usmanshabbir/task-api:latest

              sshpass -p "$VPS_PASSWORD" ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_HOST <<EOF
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
kubectl rollout restart deployment task-api
kubectl rollout status deployment task-api
EOF
            '''
          } else {
            echo "🚫 This pipeline only runs for the TS-6 branch. Skipping..."
          }
        }
      }
    }
  }
post {
  success {
    script {
      mail to: 'usmanshabbir202@gmail.com',
           subject: "✅ Jenkins Success: ${env.JOB_NAME} [#${env.BUILD_NUMBER}]",
           body: """🎉 Build succeeded!
Job: ${env.JOB_NAME}
Branch: ${env.ACTUAL_BRANCH ?: 'Unknown'}
Build: #${env.BUILD_NUMBER}
URL: ${env.BUILD_URL}"""
    }
  }
  failure {
    script {
      mail to: 'usmanshabbir202@gmail.com',
           subject: "❌ Jenkins Failure: ${env.JOB_NAME} [#${env.BUILD_NUMBER}]",
           body: """🚨 Build failed!
Job: ${env.JOB_NAME}
Branch: ${env.ACTUAL_BRANCH ?: 'Unknown'}
Build: #${env.BUILD_NUMBER}
URL: ${env.BUILD_URL}"""
    }
  }
}
}
