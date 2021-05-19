FROM rabbitmq:management

RUN apt update && \
    apt -y install wget  && \
    wget https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/v3.8.0/rabbitmq_delayed_message_exchange-3.8.0.ez && \
    mv rabbitmq_delayed_message_exchange-3.8.0.ez /opt/rabbitmq/plugins && \
    rabbitmq-plugins enable --offline rabbitmq_delayed_message_exchange && \
    apt -y purge wget