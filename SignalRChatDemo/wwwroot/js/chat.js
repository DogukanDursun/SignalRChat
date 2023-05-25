"use strict";

// HubConnection olu�turulmas�
var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

// G�nder d��mesinin ba�lant� kurulana kadar devre d��� b�rak�lmas�
disableSendButton();

// ReceiveMessage olay�n�n dinlenmesi
var isMessageReceived = false; // Mesaj�n daha �nce al�n�p al�nmad���n� kontrol etmek i�in bir bayrak
connection.on("ReceiveMessage", function (user, message, room) {
    if (room === getSelectedRoom()) {
        var li = document.createElement("li");
        if (user === getUserInputValue()) {
            li.innerHTML = `<span class="avatar">Avatar</span><span class="message">${user} (${room}): ${message}</span>`;
            isMessageReceived = true; // Mesaj�n al�nd���n� i�aretleyin
        } else {
            if (message.trim() !== "") { // Bo� mesajlar� g�z ard� etmek i�in kontrol ekleyin
                if (!isMessageReceived) {
                    li.innerHTML = `<span class="avatar">Avatar</span><span class="message">${user} (${room}): ${message}</span>`;
                    isMessageReceived = true; // Mesaj�n al�nd���n� i�aretleyin
                } else {
                    li.innerHTML = `<span class="avatar">Avatar</span><span class="message">${user} says: ${message}</span>`;
                }
            }
        }
        document.getElementById("messagesList").appendChild(li);
    }
});

// Ba�lant�n�n ba�lat�lmas� ve d��menin etkinle�tirilmesi
connection.start().then(function () {
    enableSendButton();
}).catch(function (err) {
    console.error(err.toString());
    connection.invoke('Login', kullaniciAdi, sifre)
        .catch(function (hata) {
            console.error(hata);
        });

    // G�nder d��mesinin t�klanma olay�n�n i�lenmesi
    document.getElementById("sendButton").addEventListener("click", function (event) {
        event.preventDefault();
        var user = document.getElementById("userInput").value;
        var message = document.getElementById("messageInput").value;
        var room = getSelectedRoom();

        if (message.trim() !== "") { // Bo� mesaj�n g�nderilmesini engelleyin
            connection.invoke("SendMessage", user, message, room).catch(function (error) {
                console.log(error);
            });

            isMessageReceived = true; // Mesaj�n al�nd���n� i�aretleyin
        }

        clearMessageInput();
    });



    // Se�ilen oda de�erini d�nd�r�r
    function getSelectedRoom() {
        return document.getElementById("roomSelect").value;
    }

    // Mesaj giri� alan�n� temizler ve mesaj�n al�nd���n� s�f�rlar
    function clearMessageInput() {
        var messageInput = document.getElementById("messageInput");
        messageInput.value = "";
        messageInput.focus(); // Mesaj giri� alan�na odaklanmay� sa�lar
        isMessageReceived = false; // Mesaj�n al�nd���n� s�f�rlar
    }
});