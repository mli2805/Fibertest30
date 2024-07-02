using System.Reflection;

namespace Fibertest30.Database.Cli;

public static class ResourceUtils
{
    public static byte[] GetResource(this Assembly assembly, string resourceName)
    {
        using Stream? stream = assembly.GetManifestResourceStream(resourceName);
        if (stream == null)
        {
            throw new ArgumentException($"Resource {resourceName} not found in assembly {assembly.FullName}");
        }
        
        using BinaryReader reader = new(stream);
        byte[] result = reader.ReadBytes((int)stream.Length);
        return result;
    }
}