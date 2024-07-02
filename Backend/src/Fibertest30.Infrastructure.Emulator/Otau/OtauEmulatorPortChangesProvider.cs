using System.Text.Json;
using System.Text.Json.Serialization;

namespace Fibertest30.Infrastructure.Emulator;

public class OtauEmulatorPortChangesProvider
{
    private static readonly string OtauPortChangesConfigPath = @"assets/otau/emulated-otau-port-changes.json";
    private static readonly ReaderWriterLockSlim rwLock = new ReaderWriterLockSlim();
    
    private readonly OtauEmulatorProvider _otauEmulatorProvider = new();
    
    public class OtauEmulatorPortChanges
    {
        public bool Enabled { get; set; } = true;
        public List<MonitoringChange> Changes { get; set; } = new();
    }
    
    private readonly JsonSerializerOptions _serializerOptions = new()
    {
        WriteIndented = true,
        PropertyNameCaseInsensitive = true,
        Converters = { new JsonStringEnumConverter() }
    };


    private Dictionary<string, Dictionary<int, OtauEmulatorPortChanges>> GetOrValidateThrow(string config)
    {
        var otausMap = JsonSerializer.Deserialize<Dictionary<string, Dictionary<int, OtauEmulatorPortChanges>>>
        (config, _serializerOptions);
        
        if (otausMap == null)
        {
            throw new Exception($"Failed to deserialize otau emulator config");
        }

        return otausMap;
    }

    private Dictionary<string, Dictionary<int, OtauEmulatorPortChanges>> 
        MergeWithCurrentOtaus(Dictionary<string, Dictionary<int, OtauEmulatorPortChanges>> otausPortChangesMap)
    {
        var result = new Dictionary<string, Dictionary<int, OtauEmulatorPortChanges>>();
        var otaus = _otauEmulatorProvider.GetAllOtauSettingsSortedBy();
        
        foreach (var otau in otaus)
        {
            var otauPortChanges = new Dictionary<int, OtauEmulatorPortChanges>();
            
            result.Add(otau.EmulatedOtauId, otauPortChanges);

            for (int i = 0; i < otau.PortCount; i++)
            {
                var portIndex = i + 1;
                if (otausPortChangesMap.ContainsKey(otau.EmulatedOtauId)
                    && otausPortChangesMap[otau.EmulatedOtauId].ContainsKey(portIndex))
                {
                    otauPortChanges.Add(portIndex, otausPortChangesMap[otau.EmulatedOtauId][portIndex]);
                }
                else
                {
                    otauPortChanges.Add(portIndex, new OtauEmulatorPortChanges());
                }
            }
        }

        return result;

    }

    public Dictionary<string, Dictionary<int, OtauEmulatorPortChanges>> GetPortChangesMap()
    {
        var config = DoReadConfig();
        return GetPortChangesMap(config);
    }
    
    private Dictionary<string, Dictionary<int, OtauEmulatorPortChanges>> GetPortChangesMap(string config)
    {
        var otausPortChangesMap = GetOrValidateThrow(config);
        return MergeWithCurrentOtaus(otausPortChangesMap);
    }

    public string ReadConfig()
    {
        var portChangesMap = GetPortChangesMap();
        var newConfig = JsonSerializer.Serialize(portChangesMap, _serializerOptions);
        return newConfig;
    }
    
    private string DoReadConfig()
    {
        rwLock.EnterReadLock();
        try
        {
            return File.ReadAllText(OtauPortChangesConfigPath);
        }
        finally
        {
            rwLock.ExitReadLock();
        }
    }
    
    public void WriteConfig(string config)
    {
        var otausPortChangesMap = GetPortChangesMap(config);
        var newConfig = JsonSerializer.Serialize(otausPortChangesMap, _serializerOptions);
        
        rwLock.EnterWriteLock();
        try
        {
            File.WriteAllText(OtauPortChangesConfigPath, newConfig);
        }
        finally
        {
            rwLock.ExitWriteLock();
        }
    }
}