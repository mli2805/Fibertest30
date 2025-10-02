using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;

namespace Fibertest30.Application;

public interface IPdfBuilder
{
    byte[]? GenerateUserActionsReport(List<UserActionLine> lines, string culture);

    public byte[]? GenerateCurrentOpticalEventsReport(List<MeasurementWrap> wrapped, ServerInfo serverInfo,
        string culture);

    public byte[]? GenerateOpticalEventsForPeriodReport(GetOpticalEventsReportPdfQuery query,
        List<MeasurementWrap> wrapped, Dictionary<EventStatus, Dictionary<FiberState, int>> totals,
        ServerInfo serverInfo, UserSettings? userSettings);

    public byte[]? GenerateMonitoringSystemReport(Model model, ServerInfo serverInfo, string culture);

}