echo "Stopping redis..."
killall redis-server
echo "done."
echo "Stopping rabbitmq..."
rabbitmqctl stop
echo "done."