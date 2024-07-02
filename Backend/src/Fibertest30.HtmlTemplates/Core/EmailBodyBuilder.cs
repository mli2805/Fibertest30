using Fibertest30.Application;
using Scriban;

namespace Fibertest30.HtmlTemplates;
public class EmailBodyBuilder :  IEmailBodyBuilder
{
    private readonly ViewModelFactory _vmFactory = new();
    private readonly IDeviceInfoProvider _deviceInfoProvider;

    public EmailBodyBuilder(
        IDeviceInfoProvider deviceInfoProvider)
    {
        _deviceInfoProvider = deviceInfoProvider;
    }

    
    public string BuildEmailBody(OtauPortPath portPath, MonitoringAlarm alarm)
    {
        var timezone = _deviceInfoProvider.GetTimeZone();
        
        var model = new
        {
            Alarm = _vmFactory.CreateAlarmViewModel(timezone, alarm),
            Device = GetDeviceViewModel(),
            Port = GetPortViewModel(portPath)
        };
        var body = Render(GetMaizzleGenerateTemplatePath("monitoring-alarm.scriban"), model);
        return body;
    }
    
    private string GetMaizzleGenerateTemplatePath(string templateName)
    {
        var baseDir = AppDomain.CurrentDomain.BaseDirectory;
        var fileName = $"assets/html-templates/maizzle-generated/{templateName}.html";
        var path = Path.Combine(baseDir, fileName);
        return path;
    }

    private string Render(string filename, object model)
    {
        var template = Template.Parse(File.ReadAllText(filename));
        var result = template.Render(model, member => member.Name);
        return result ?? string.Empty;
    }
    
    private object GetDeviceViewModel()
    {
        return new
        {
            SerialNumber = _deviceInfoProvider.GetSerialNumber(),
            IpAddress = _deviceInfoProvider.GetIpV4Address()
        };
    }

    private object GetPortViewModel(OtauPortPath portPath)
    {
        return new
        {
            OcmOtauPortIndex = portPath.OcmOtauPort.PortIndex,
            CascadeOtauPortIndex = portPath.CascadeOtauPort?.PortIndex
        };
    }
}
