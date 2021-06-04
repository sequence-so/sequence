rm -rf build
mkdir build
cp -r ../common ./build
docker build \
  --tag sequence-ui:latest \
  --file ./Dockerfile \
  .
