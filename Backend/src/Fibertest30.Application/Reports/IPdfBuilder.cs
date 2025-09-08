namespace Fibertest30.Application;

public interface IPdfBuilder
{
    byte[]? GenerateUserActionsReport(List<UserActionLine> lines, string culture);

    public byte[]? GenerateCurrentOpticalEventsReport(List<MeasurementWrap> wrapped, ServerInfo serverInfo,
        string culture);

    public byte[]? GenerateOpticalEventsForPeriodReport(GetOpticalEventsReportPdfQuery query,
        List<MeasurementWrap> wrapped, List<List<string>> totals,
        ServerInfo serverInfo, UserSettings? userSettings);

}