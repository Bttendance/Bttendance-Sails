
REPORTER ?= spec
TIMEOUT ?= 5000
SLOW ?= 100

test-alpha:
	@mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--slow $(SLOW) \
		test/alpha/*.js

test-beta:
	@mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--slow $(SLOW) \
		test/beta/*.js

test-gamma:
	@mocha \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--slow $(SLOW) \
		test/gamma/*.js