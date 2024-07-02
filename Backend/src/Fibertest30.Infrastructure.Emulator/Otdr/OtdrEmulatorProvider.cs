using System.Text.Json;

namespace Fibertest30.Infrastructure.Emulator;

public class OtdrEmulatorProvider
{
    private readonly JsonSerializerOptions _serializerOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };
    
    public (OtdrProductInfo, OtdrMeasurementParameterSet) GetParameters()
    {
        var emulatedOtdrFilePath = @"assets/otdr/emulated-otdr.json";
        var json = File.ReadAllText(emulatedOtdrFilePath);
        var elements = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(json, _serializerOptions);
        
        if (elements == null)
        {
            throw new Exception($"Failed to deserialize ${emulatedOtdrFilePath}");
        }
        
        var otdrProductIndo = new OtdrProductInfo(
            elements["mainframeId"].ToString(),
            elements["opticalModuleSerialNumber"].ToString());
        
        var supportedMeasurementParameters = JsonSerializer.Deserialize<OtdrMeasurementParameterSet>(
            elements["supportedMeasurementParameters"].GetRawText(), _serializerOptions);
        if (supportedMeasurementParameters == null)
        {
            throw new Exception($"Failed to deserialize supportedMeasurementParameters");
        }

        return (otdrProductIndo, supportedMeasurementParameters);
    }

    public List<OtdrTraceMeasurementResult> GetMeasurementSteps()
    {
        var emulatedDefaultTrace = @"assets/otdr/emulated-otdr-traces/default";
        var sorFiles = Directory.GetFiles(emulatedDefaultTrace)
            .Where(x => x.EndsWith(".sor")).OrderBy(x => x)
            .Select(x =>
            {
                var sorBytes = File.ReadAllBytes(x);
                return new OtdrTraceMeasurementResult
                {
                    Progress = Convert.ToInt32(Path.GetFileNameWithoutExtension(x)) / 100.0f,
                    Sor = sorBytes,
                };
            })
            .ToList();

        return sorFiles;
    }
}