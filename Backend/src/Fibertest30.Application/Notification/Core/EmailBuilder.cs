using Iit.Fibertest.Graph;
using Iit.Fibertest.StringResources;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System.Globalization;

namespace Fibertest30.Application;

public class EmailBuilder(IServiceScopeFactory serviceScopeFactory, ILogger<EmailBuilder> logger) : IEmailBuilder
{
    public string BuildOpticalEventSubject(AddMeasurement measurement, Model model)
    {
        var trace = model.Traces.FirstOrDefault(t => t.TraceId == measurement.TraceId);
        if (trace == null) return null;

        return string.Format(Resources.SID_Trace___0___state_is_changed_to___1___at__2_, trace.Title,
            measurement.TraceState.ToLocalizedString(), measurement.EventRegistrationTimestamp.ForReport());
    }

    public string BuildOpticalEventHtmlBody(AddMeasurement measurement, Model model)
    {
            var reportModel = PrepareReportModel(measurement, model);
            return "";
    }


    private TraceReportModel? PrepareReportModel(AddMeasurement addMeasurement, Model model)
    {
        try
        {
            var ci = new CultureInfo("ru-RU");
            string format = ci.DateTimeFormat.FullDateTimePattern;

            var trace = model.Traces.First(t => t.TraceId == addMeasurement.TraceId);
            var rtu = model.Rtus.First(r => r.Id == addMeasurement.RtuId);
            var reportModel = new TraceReportModel()
            {
                TraceTitle = trace.Title,
                TraceState = trace.State.ToLocalizedString(),
                RtuTitle = rtu.Title,
                RtuSoftwareVersion = rtu.Version,
                PortTitle = trace.OtauPort!.IsPortOnMainCharon
                    ? trace.OtauPort.OpticalPort.ToString()
                    : $@"{trace.OtauPort.Serial}-{trace.OtauPort.OpticalPort}",
                MeasurementTimestamp = $@"{addMeasurement.MeasurementTimestamp.ToString(format)}",
                RegistrationTimestamp = $@"{addMeasurement.EventRegistrationTimestamp.ToString(format)}",

                Accidents = ConvertAccidents(addMeasurement.Accidents).ToList(),
            };
            return reportModel;
        }
        catch (Exception e)
        {
            logger.LogError(@"PrepareReportModel: ", e.Message);
            return null;
        }
    }

    private IEnumerable<AccidentLineModel> ConvertAccidents(List<AccidentOnTraceV2> list)
    {
        var accidentLineModelFactory = new AccidentLineModelFactory();
        var number = 0;
        foreach (var accidentOnTraceV2 in list)
        {
            yield return accidentLineModelFactory
                .Create(accidentOnTraceV2, ++number, true, GpsInputMode.DegreesMinutesAndSeconds);
        }
    }


    private string? PreparePdfAttachment(TraceReportModel reportModel)
    {
        try
        {
            // var _traceStateReportProvider = new TraceStateReportProvider()
            // var folder = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"..\Reports");
            // if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);
            // var filename = Path.Combine(folder, $@"TraceStateReport{DateTime.Now:yyyy-MM-dd-hh-mm-ss}.pdf");
            // var pdfDocument = _traceStateReportProvider.Create(reportModel, _currentDatacenterParameters);
            // pdfDocument.Save(filename);
            // return filename;

            return "";
        }
        catch (Exception e)
        {
            logger.LogError(@"PreparePdfAttachment: create report file: ", e.Message);
            return null;
        }
    }



    public string GetTestHtmlBody()
    {
        return @"
<!DOCTYPE html>
<html>
<head>
    <title>Fibertest30 test email</title>
</head>
<body>
    <div style=""padding: 20px;"">
        <div style=""margin-top: 20px;"">
            <p>This is a test email to ensure email settings are correctly configured.</p>
        </div>
    </div>
</body>
</html>";
    }

   
  
    public List<Tuple<string, byte[]>> BuildOpticalAttachments(AddMeasurement measurement, byte[] measBytes, byte[] baseline)
    {
        throw new NotImplementedException();
    }
}
