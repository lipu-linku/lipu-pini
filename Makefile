DEVNAME=lipu-linku
ROOT=.

.PHONY: dev stopdev

dev: stopdev
	docker rm $(DEVNAME) | true
	docker run \
		-d \
		-p 80:80 \
		-p 443:443 \
		--expose 80 \
		--expose 443 \
		-v $(PWD)/$(ROOT):/usr/local/apache2/htdocs \
		--name $(DEVNAME) \
		httpd:2

stopdev:
	docker kill $(DEVNAME) | true
