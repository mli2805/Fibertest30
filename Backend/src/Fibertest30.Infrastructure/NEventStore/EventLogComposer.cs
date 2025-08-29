using Iit.Fibertest.Graph;
using Microsoft.Extensions.DependencyInjection;

namespace Fibertest30.Infrastructure
{
    public class EventLogComposer(Model model, EventToLogLineParser eventToLogLineParser,
        IServiceScopeFactory serviceScopeFactory)
    {
        private int _ordinal = 1;

        public void Initialize()
        {
            eventToLogLineParser.InitializeBySnapshot(model);
            _ordinal = model.UserActionsLog.Count + 1;
        }

        public async Task AddEventToLog(string username, string clientIp, DateTime timestamp, LogLine line)
        {
            try
            {
                var scope = serviceScopeFactory.CreateScope();
                var usersRepository = scope.ServiceProvider.GetRequiredService<IUsersRepository>();
                var user = await usersRepository.GetUserByLogin(username);

                // event should be parsed even before check in order to update internal dictionaries
                // события от имени System не надо логировать кроме очистки базы
                if (user == null || user.Role.Name == "System" && line.OperationCode != LogOperationCode.EventsAndSorsRemoved)
                    return;

                line.Ordinal = _ordinal;
                line.Username = user.User.UserName!; // логин
                line.ClientIp = clientIp;
                line.Timestamp = timestamp;
                model.UserActionsLog.Insert(0, line);
                _ordinal++;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
        }
    }
}
