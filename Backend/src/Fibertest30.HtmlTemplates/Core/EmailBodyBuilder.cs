using Fibertest30.Application;
using Scriban;

namespace Fibertest30.HtmlTemplates;
public class EmailBodyBuilder :  IEmailBodyBuilder
{
    private readonly ViewModelFactory _vmFactory = new();

  
    
    public string BuildEmailBody(string portPath, MonitoringAlarm alarm)
    {
        var model = new
        {
            Alarm = _vmFactory.CreateAlarmViewModel(alarm),
            Port = portPath
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
    
   
}
