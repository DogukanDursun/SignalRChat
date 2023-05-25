"use strict";

// HubConnection oluþturulmasý
var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

// Gönder düðmesinin baðlantý kurulana kadar devre dýþý býrakýlmasý
disableSendButton();

// ReceiveMessage olayýnýn dinlenmesi
var isMessageReceived = false; // Mesajýn daha önce alýnýp alýnmadýðýný kontrol etmek için bir bayrak
connection.on("ReceiveMessage", function (user, message, room) {
    if (room === getSelectedRoom()) {
        var li = document.createElement("li");
        if (user === getUserInputValue()) {
            li.innerHTML = `<span class="avatar">Avatar</span><span class="message">${user} (${room}): ${message}</span>`;
            isMessageReceived = true; // Mesajýn alýndýðýný iþaretleyin
        } else {
            if (message.trim() !== "") { // Boþ mesajlarý göz ardý etmek için kontrol ekleyin
                if (!isMessageReceived) {
                    li.innerHTML = `<span class="avatar">Avatar</span><span class="message">${user} (${room}): ${message}</span>`;
                    isMessageReceived = true; // Mesajýn alýndýðýný iþaretleyin
                } else {
                    li.innerHTML = `<span class="avatar">Avatar</span><span class="message">${user} says: ${message}</span>`;
                }
            }
        }
        document.getElementById("messagesList").appendChild(li);
    }
});

// Baðlantýnýn baþlatýlmasý ve düðmenin etkinleþtirilmesi
connection.start().then(function () {
    enableSendButton();
}).catch(function (err) {
    console.error(err.toString());
    connection.invoke('Login', kullaniciAdi, sifre)
        .catch(function (hata) {
            console.error(hata);
        });

    // Gönder düðmesinin týklanma olayýnýn iþlenmesi
    document.getElementById("sendButton").addEventListener("click", function (event) {
        event.preventDefault();
        var user = document.getElementById("userInput").value;
        var message = document.getElementById("messageInput").value;
        var room = getSelectedRoom();

        if (message.trim() !== "") { // Boþ mesajýn gönderilmesini engelleyin
            connection.invoke("SendMessage", user, message, room).catch(function (error) {
                console.log(error);
            });

            isMessageReceived = true; // Mesajýn alýndýðýný iþaretleyin
        }

        clearMessageInput();
    });



    // Seçilen oda deðerini döndürür
    function getSelectedRoom() {
        return document.getElementById("roomSelect").value;
    }

    // Mesaj giriþ alanýný temizler ve mesajýn alýndýðýný sýfýrlar
    function clearMessageInput() {
        var messageInput = document.getElementById("messageInput");
        messageInput.value = "";
        messageInput.focus(); // Mesaj giriþ alanýna odaklanmayý saðlar
        isMessageReceived = false; // Mesajýn alýndýðýný sýfýrlar
    }
});