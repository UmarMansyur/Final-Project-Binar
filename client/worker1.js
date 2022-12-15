let notificationUrl = ''
console.log('notif:', notificationUrl)
self.addEventListener('push', e => {
    // e.waitUntil();
    const data = e.data.json();
    notificationUrl = data.url

    self.registration.showNotification(
        data.title,
        {
            body: data.body
        }
    )
})

    self.addEventListener('notificationclick', function (event) {
        event.notification.close();
    
        event.waitUntil(
            clients.matchAll({
                type: "window"
            })
            .then(function (clientList) {
                if (clients.openWindow) {
                    return clients.openWindow(notificationUrl);
                }
            })
        );
    });
