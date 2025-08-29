using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using Iit.Fibertest.StringResources;
using System.Diagnostics;

namespace Fibertest30.Application
{
    public class UserActionLine
    {
        public int Ordinal { get; set; }
        public string Username { get; set; } = null!; // login
        public string? ClientIp { get; set; }
        public DateTime Timestamp { get; set; }
        public LogOperationCode OperationCode { get; set; }
        public string OperationName => OperationCode.GetLocalizedString();
        public string? RtuTitle { get; set; }
        public string? TraceTitle { get; set; }
        public string? OperationParams { get; set; }

        public string UserFullName { get; set; } = null!; // полное имя для показа в табл, для пользователей из 2.0 кладем Username

        // эту функцию вызывает генератор pdf отчета предварительно установив нужную культуру
        public string GetLocalizedAdditionalInfo()
        {
            if (string.IsNullOrEmpty(OperationParams)) return "";

            try
            {
                switch (OperationCode)
                {
                    case LogOperationCode.MeasurementUpdated:
                        var eventStatus = Enum.Parse<EventStatus>(OperationParams);
                        return eventStatus.GetLocalizedString();
                    case LogOperationCode.TraceAttached:
                        return Resources.SID_Port + " " + OperationParams;
                    case LogOperationCode.MonitoringSettingsChanged:
                        var isMonitoringOn = bool.Parse(OperationParams);
                        return isMonitoringOn ? Resources.SID_Automatic_mode : Resources.SID_Manual_mode;
                    case LogOperationCode.BaseRefAssigned:
                        return string.Join(';', OperationParams.Split(";")
                            .Select(s => Enum.Parse<BaseRefType>(s).GetLocalizedFemaleString()));
                    case LogOperationCode.ClientStarted:
                        var registrationResult = Enum.Parse<ReturnCode>(OperationParams);
                        return registrationResult.GetLocalizedString();
                    case LogOperationCode.EventsAndSorsRemoved:
                    case LogOperationCode.SnapshotMade:
                        var str = Resources.SID_Up_to;
                        return $"{str} {OperationParams}";
                }

            }
            catch (Exception e)
            {
                Debug.WriteLine(e);
            }

            return OperationParams;
        }
    }
}
