// Demander la permission d'envoyer des notifications
if ("Notification" in window) {
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
}

// Fonction pour envoyer une notification de prière
function sendPrayerNotification(prayerName, prayerTime) {
    const notificationTime = new Date(prayerTime);  // Crée un objet Date avec l'heure de la prière
    const now = new Date();
    const timeDifference = notificationTime - now;  // Calcule la différence de temps

    // Si l'heure de la prière est dans les 5 minutes
    if (timeDifference > 0 && timeDifference <= 5 * 60 * 1000) {
        setTimeout(() => {
            new Notification(`C'est l'heure de la prière ${prayerName}`, {
                body: `L'heure de la prière ${prayerName} approche. Il est temps de prier !`,
                icon: '/static/prayer-icon.png',  // Ajouter une icône
            });
        }, timeDifference);  // Attendez jusqu'à l'heure de la prière
    }
}

// Fonction pour afficher le compte à rebours jusqu'à la prochaine prière
function updateCountdown(prayerTimes) {
    const currentTime = new Date();
    let nextPrayerTime = null;
    let nextPrayerName = "";

    for (const [name, time] of Object.entries(prayerTimes)) {
        const prayerDate = new Date(`${new Date().toDateString()} ${time}`);
        if (prayerDate > currentTime && (!nextPrayerTime || prayerDate < nextPrayerTime)) {
            nextPrayerTime = prayerDate;
            nextPrayerName = name;
        }
    }

    if (nextPrayerTime) {
        const remainingTime = nextPrayerTime - currentTime;
        const minutes = Math.floor(remainingTime / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        document.getElementById("countdown").textContent = `Prochaine prière (${nextPrayerName}): ${minutes}m ${seconds}s`;
    }
}

window.onload = () => {
    if (window.location.pathname.includes("/prayers")) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;

                // Récupérer les horaires de prière via l'API
                fetch(`/get_times?lat=${lat}&lon=${lon}`)
                    .then(res => res.json())
                    .then(times => {
                        const list = document.getElementById("prayer-list");
                        list.innerHTML = "";

                        // Mettre à jour le compte à rebours
                        updateCountdown(times);

                        // Afficher les horaires et envoyer des notifications
                        for (const [name, time] of Object.entries(times)) {
                            const item = document.createElement("li");
                            item.innerHTML = `<strong>${name}:</strong> ${time}`;
                            list.appendChild(item);
                            sendPrayerNotification(name, time);  // Appeler la fonction pour envoyer une notification
                        }

                        // Actualiser toutes les 30 secondes pour le compte à rebours
                        setInterval(() => updateCountdown(times), 30000);
                    });
            });
        } else {
            alert("La géolocalisation est désactivée ou non supportée.");
        }
    }
};
