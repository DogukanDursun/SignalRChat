using Microsoft.AspNetCore.SignalR;

namespace SignalRChatDemo.Hubs
{
    public class ChatHubs:Hub
    {
        public async Task SendMessage(string user, string message)
        {
            // Gelen mesajı tüm istemcilere iletilmesi için istemci metodunu çağırın
            await Clients.All.SendAsync("ReceiveMessage",user, message);
        }
    }
}
