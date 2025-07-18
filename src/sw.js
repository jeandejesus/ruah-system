self.addEventListener("push", function (event) {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/assets/icons/icon-192x192.png", // ajuste o caminho do ícone se necessário
    })
  );
});
