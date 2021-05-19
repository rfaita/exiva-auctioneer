#!/bin/sh
i=383200
while true; do
    MESSAGE="{\"auctionId\": $i}"
    echo $MESSAGE
    rabbitmqadmin -u rfaita -p M@inpassword publish routing_key='auction' properties='{"content_type":"application/json"}' payload="$MESSAGE" payload_encoding='string'
    i=$(($i-1))
    sleep .5
done