ifndef VERBOSE
.SILENT:
endif

AWS_COMMAND =

# https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/install-cliv2-docker.html#cliv2-docker-share-files
.PHONY: aws
aws:
	docker run --rm -it -v `pwd`/.aws:/root/.aws -v `pwd`/templates:/templates amazon/aws-cli ${AWS_COMMAND}

.PHONY: create-network
create-network:
	make aws AWS_COMMAND="cloudformation create-stack --stack-name slack-clone-network --template-body file:///templates/network.yml"

.PHONY: delete-network
delete-network:
	make aws AWS_COMMAND="cloudformation delete-stack --stack-name slack-clone-network"
