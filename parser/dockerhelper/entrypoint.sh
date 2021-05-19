#!/bin/sh
set -e
echo "---------------------------------OPTS------------------------------------"
echo "WAIT_FOR_IT="$WAIT_FOR_IT
echo "-------------------------------------------------------------------------"

for i in $WAIT_FOR_IT;
    do /root/code/dockerhelper/wait-for-it.sh $i -t 3600;
done

npm run start