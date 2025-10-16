using Iit.Fibertest.Graph;

namespace Fibertest30.Application;

public interface IEmailBodyBuilder
{
    string BuildEmailBody(AddMeasurement measurement);
}