using System.Text.Json;

namespace Fibertest30.Infrastructure.Emulator;

public class OtauEmulatorProvider
{
    private static readonly string OtauConfigPath = @"assets/otau/emulated-otau.json";
    private static ReaderWriterLockSlim rwLock = new ReaderWriterLockSlim();
    
    public class OtauEmulatorSettings
    {
        public string EmulatedOtauId { get; set; } = string.Empty;
        public int PortCount { get; set; }
        public bool Offline { get; set; }
        public OtauEmulatorExceptions? Exceptions { get; set; } 
        public bool SupportBlink { get; set; }
    }
    
    public class OtauEmulatorExceptions
    {
        public bool UnknownOsmModel { get; set; }
        public bool Discover { get; set; }
        public bool Ping { get; set; }
        public bool Connect { get; set; }
        public bool Disconnect { get; set; }
        public bool SetPort { get; set; }
        public bool Blink { get; set; }
    }
    
    public class OtauEmulatorOcmSettings : OtauEmulatorSettings
    {
    }
    
    public class OtauEmulatorOsmSettings : OtauEmulatorSettings
    {
        public int ChainAddress { get; set; }
    }
    
    public class OtauEmulatorOxcSettings : OtauEmulatorSettings
    {
        public string Ip { get; set; } = null!;
        public int Port { get; set; }
    }
    
    private readonly JsonSerializerOptions _serializerOptions = new()
    {
        WriteIndented = true,
        PropertyNameCaseInsensitive = true,
    };

    public List<OtauEmulatorSettings> GetAllOtauSettingsSortedBy()
    {
        var elements = GetConfigJsonElements();
        OtauEmulatorOcmSettings ocm = GetOcmSettings(elements);
        List<OtauEmulatorOsmSettings> osm = GetOsmSettings(elements);
        List<OtauEmulatorOxcSettings> oxc = GetOxcSettings(elements);
        
        var all = new List<OtauEmulatorSettings> { ocm };
        all.AddRange(osm);
        all.AddRange(oxc);
        return all;
    }
    
   
    public OtauEmulatorOcmSettings GetOcmSettings()
    {
        var elements = GetConfigJsonElements();
        return GetOcmSettings(elements);
    }

    private OtauEmulatorOcmSettings GetOcmSettings(Dictionary<string, JsonElement> elements)
    {
        var ocmSettings = JsonSerializer.Deserialize<OtauEmulatorOcmSettings>(elements["Ocm"].GetRawText(), _serializerOptions);
        if (ocmSettings == null)
        {
            throw new Exception($"Failed to deserialize EmulatorOcmSettings");
        }

        return ocmSettings;
    }

    public OtauEmulatorOsmSettings? GetOsmSettings(int chainAddress)
    {
        var elements = GetConfigJsonElements();
        return GetOsmSettings(elements, chainAddress);
    }
    
    private OtauEmulatorOsmSettings? GetOsmSettings(Dictionary<string, JsonElement> elements, int chainAddress)
    {
        var osmOtaus = GetOsmSettings(elements);
        if (osmOtaus.Count == 0) { return null;}

        var osmOtau = osmOtaus.SingleOrDefault(x => x.ChainAddress == chainAddress);
        return osmOtau;
    }

    private List<OtauEmulatorOsmSettings> GetOsmSettings(Dictionary<string, JsonElement> elements)
    {
        var osmOtaus = JsonSerializer.Deserialize<OtauEmulatorOsmSettings[]>(elements["Osm"].GetRawText(), _serializerOptions);
        if (osmOtaus == null) { return new List<OtauEmulatorOsmSettings>();}

        return osmOtaus.ToList();
    }

    public OtauEmulatorOxcSettings? GetOxcSettings(string ip, int port)
    {
        var elements = GetConfigJsonElements();
        return GetOxcSettings(elements, ip, port);
    }
    
    private OtauEmulatorOxcSettings? GetOxcSettings(Dictionary<string, JsonElement> elements, string ip, int port)
    {
        var oxcOtaus = GetOxcSettings(elements);
        if (oxcOtaus.Count == 0) { return null;}

        var oxcOtau = oxcOtaus.SingleOrDefault(x => x.Ip == ip && x.Port == port);
        return oxcOtau;
    }

    private List<OtauEmulatorOxcSettings> GetOxcSettings(Dictionary<string, JsonElement> elements)
    {
        var oxcOtaus = JsonSerializer.Deserialize<OtauEmulatorOxcSettings[]>(elements["Oxc"].GetRawText(), _serializerOptions);
        if (oxcOtaus == null) { return new List<OtauEmulatorOxcSettings>();}

        return oxcOtaus.ToList();
    }

    private Dictionary<string, JsonElement> GetConfigJsonElements()
    {
        var json = ReadConfig();
        var elements = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(json, _serializerOptions);
        
        if (elements == null)
        {
            throw new Exception($"Failed to deserialize otau emulator config");
        }

        return elements;
    }
    
    public string ReadConfig()
    {
        rwLock.EnterReadLock();
        try
        {
            return File.ReadAllText(OtauConfigPath);
        }
        finally
        {
            rwLock.ExitReadLock();
        }
    }
    
    public void WriteConfig(string data)
    {
        rwLock.EnterWriteLock();
        try
        {
            File.WriteAllText(OtauConfigPath, data);
        }
        finally
        {
            rwLock.ExitWriteLock();
        }
    }
}