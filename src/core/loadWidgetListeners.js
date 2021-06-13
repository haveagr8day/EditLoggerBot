const getWidgetHandlerMap = require("./getWidgetHandlerMap");

const runHandlers = (handlers, ...eventArguments) =>
    handlers.forEach((handler) => handler(...eventArguments));

module.exports = (client) => {
    process
    .on("unhandledRejection", console.error)
    .on("uncaughtException", (error) => {
        console.log('Unhandled exception, shutting down')
        console.error(error);
        client.destroy();
        process.exit(1);
    });

  const { ready, ...widgetHandlerMap } = getWidgetHandlerMap();
  client.once("ready", () => runHandlers(ready, client));

  Object.keys(widgetHandlerMap).forEach((handlerName) =>
    client.on(handlerName, (...eventArguments) =>
      runHandlers(widgetHandlerMap[handlerName], ...eventArguments)
    )
  );
};
