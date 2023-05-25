using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace SignalRChatDemo.Hubs
{
    public class ChatHubs : Hub
    {
        public async Task SendMessage(string user, string message, string room)
        {
            // Gelen mesajı tüm istemcilere iletmek için istemci metodunu çağırın
            await Clients.All.SendAsync("ReceiveMessage", user, message, room);
        }
        [HubMethodName("Login")]
        public async Task Login(string username, string password)
        {
            // Login logic here

            // Redirect the user to the Messages page
            await Clients.Caller.SendAsync("RedirectToMessages");
        }
        public async Task JoinRoom(string roomName)
        {
            // İstemciyi belirtilen odaya katılması için grup ile eşleştir
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);

            // İstemciye odaya katıldığını bildir
            await Clients.Caller.SendAsync("ReceiveMessage", "Sistem", $"Odaya {roomName} katıldınız.");
        }

        public async Task LeaveRoom(string roomName)
        {
            // İstemciyi belirtilen odadan çıkarmak için grup eşleştirmesini kaldır
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);

            // İstemciye odadan çıkarıldığını bildir
            await Clients.Caller.SendAsync("ReceiveMessage", "Sistem", $"Odanızdan {roomName} çıkarıldınız.");
        }

        public async Task SendMessageToRoom(string roomName, string user, string message)
        {
            // İstemci tarafından gönderilen mesajı sadece belirtilen odadaki istemcilere iletmek için grup metodunu çağırın
            await Clients.Group(roomName).SendAsync("ReceiveMessage", user, message);
        }
    }
}
