self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};
  console.log("Push event received:", data);
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "src/assets/ruah.PNG",
    })
  );
});
