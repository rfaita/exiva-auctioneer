
FROM node:alpine 
WORKDIR /root/code

COPY . .
RUN npm ci --only=production 
 

RUN chmod +x /root/code/dockerhelper/wait-for-it.sh && \
    chmod +x /root/code/dockerhelper/entrypoint.sh

ENTRYPOINT ["/root/code/dockerhelper/entrypoint.sh"]