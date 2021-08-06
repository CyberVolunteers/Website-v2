#!/bin/sh

set -e

if [[ "$2" = "-p" ]]; then
	cd ./next && npm run lint
	cd ../
fi

echo $(pwd)

git add .

echo "Commit with the message \"$1\"? (y/n)"

while read line; do    
	case $line in
	([Yy]) keepGoing="true" && break;;
	([Nn]) break;;
	esac
    # if [[ "$line" == "n" ]]; then
	# 	break
	# fi
done

if [[ "$keepGoing" != "true" ]]; then exit 1; fi



git commit -m "$1"

if [[ "$2" = "-p" ]]; then
	git push
fi