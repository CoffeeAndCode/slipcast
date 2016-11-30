#!/bin/sh
set -e
set -x

for package in packages/* ; do
	cd "${package}"
	yarn install
	cd -
done
