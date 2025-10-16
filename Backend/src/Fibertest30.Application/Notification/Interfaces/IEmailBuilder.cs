using Iit.Fibertest.Graph;

namespace Fibertest30.Application;

public interface IEmailBuilder
{
    string GetTestHtmlBody();

    string BuildOpticalEventSubject(AddMeasurement measurement, Model model);
    public string BuildOpticalEventHtmlBody(AddMeasurement measurement, Model model);
    List<Tuple<string, byte[]>> BuildOpticalAttachments(
        AddMeasurement measurement, byte[] measBytes, byte[] baseline);
}