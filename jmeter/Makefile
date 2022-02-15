LATEST_VERSION=1.0
MAESTROJMETER_IMAGE=maestrojmeter

docker-build:
	docker build -t ${MAESTROJMETER_IMAGE}:${LATEST_VERSION} .

docker-run:
	docker run --rm -it --net=host ${MAESTROJMETER_IMAGE}:${LATEST_VERSION}

docker-run-bash:
	docker run --rm -it --entrypoint=bash ${MAESTROJMETER_IMAGE}:${LATEST_VERSION}
