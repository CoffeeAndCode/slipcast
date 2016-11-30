#!/bin/sh
set -e
set -x

for package in packages/* ; do
	"${package}/node_modules/.bin/mocha" --require "test/testHelper.js" "$@" "${package}/test/**/*.js"
done
