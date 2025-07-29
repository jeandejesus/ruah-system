self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};
  console.log("Push event received:", data);
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "src/assets/ruah.PNG",
      data: {
        url: data.url,
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  console.log("⚡ notificationclick DISPARADO!");

  event.notification.close();

  const urlToOpen = event.notification.data?.url;
  console.log("Notification click event:", urlToOpen);

  if (urlToOpen) {
    event.waitUntil(
      clients
        .matchAll({ type: "window", includeUncontrolled: true })
        .then(function (clientList) {
          for (const client of clientList) {
            if (client.url === urlToOpen && "focus" in client) {
              return client.focus();
            }
          }

          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
});
