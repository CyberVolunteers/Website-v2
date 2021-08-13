set -e

# nextjs
sudo docker build -f ./next/Dockerfile ../../next/ -t next-prod

docker-compose up