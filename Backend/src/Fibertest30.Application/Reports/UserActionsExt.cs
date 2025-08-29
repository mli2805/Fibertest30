using Iit.Fibertest.Graph;

namespace Fibertest30.Application
{
    public static class UserActionsExt
    {
        public static List<UserActionLine> GetFilteredUserActions(this Model writeModel, List<AuthenticatedUser> allUsers,
            Guid userId, DateTimeFilter dateTimeFilter, List<int> operationCodes)
        {
            // date: по  SearchWindow
            var period = dateTimeFilter.SearchWindow!;
            var logOfPeriod = writeModel.UserActionsLog
                .Where(l => l.Timestamp >= period.Start && l.Timestamp <= period.End);

            var lines = logOfPeriod.Where(l => operationCodes.Contains((int)l.OperationCode));

            if (userId != Guid.Empty)
            {
                var user = allUsers.FirstOrDefault(u => u.User.Id == userId.ToString());
                if (user != null)
                {
                    lines = lines.Where(l => l.Username == user.User.UserName);
                }
            }

            return lines.Select(l=>Map(l, allUsers)).ToList();
        }

        private static UserActionLine Map(LogLine logLine, List<AuthenticatedUser> allUsers)
        {
            var ual = new UserActionLine()
            {
                Ordinal = logLine.Ordinal,
                Username = logLine.Username,
                ClientIp = logLine.ClientIp,
                Timestamp = logLine.Timestamp,
                OperationCode = logLine.OperationCode,
                RtuTitle = logLine.RtuTitle,
                TraceTitle = logLine.TraceTitle,
                OperationParams = logLine.OperationParams
            };

            var user = allUsers.FirstOrDefault(u => u.User.UserName == logLine.Username);
            ual.UserFullName = user?.User.GetFullName() ?? logLine.Username;

            return ual;
        }
    }
}
