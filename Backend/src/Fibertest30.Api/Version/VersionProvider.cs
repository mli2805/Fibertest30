using System.Diagnostics;
using System.Reflection;

namespace Fibertest30.Api;

public class VersionProvider : IVersionProvider
{
    private string? _productVersion = null;
    
    public string GetApiVersion()
    {
        if (_productVersion == null)
        {
            var assembly = Assembly.GetExecutingAssembly();
            var fileInfo = FileVersionInfo.GetVersionInfo(assembly.Location);
            _productVersion = fileInfo.ProductVersion ?? string.Empty;
        }

        return _productVersion;
    }
}