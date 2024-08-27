using Iit.Fibertest.Dto;

namespace Iit.Fibertest.Graph
{
    public class EventLogComposer
    {
        private readonly Model _model;
        private readonly EventToLogLineParser _eventToLogLineParser;

        private int _ordinal = 1;

        public EventLogComposer(Model model, EventToLogLineParser eventToLogLineParser)
        {
            _model = model;
            _eventToLogLineParser = eventToLogLineParser;
        }

        public void Initialize()
        {
            _eventToLogLineParser.InitializeBySnapshot(_model);
            _ordinal = _model.UserActionsLog.Count + 1;
        }

        public void AddEventToLog(string username, string clientIp, DateTime timestamp, LogLine line)
        {
            try
            {
                var user = _model.Users.FirstOrDefault(u => u.Title == username);

                // event should be parsed even before check in order to update internal dictionaries
                if (user == null
                                 || user.Role < Role.Developer && line.OperationCode != LogOperationCode.EventsAndSorsRemoved)
                    return;

                line.Ordinal = _ordinal;
                line.Username = username;
                line.ClientIp = clientIp;
                line.Timestamp = timestamp;
                _model.UserActionsLog.Insert(0, line);
                _ordinal++;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
        }
    }
}
