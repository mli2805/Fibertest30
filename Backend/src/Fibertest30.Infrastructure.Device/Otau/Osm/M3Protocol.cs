using System.Text.RegularExpressions;

namespace Fibertest30.Infrastructure.Device;

// TODO: Add description to this and maybe other classes
internal static class M3Protocol
{
    public const char BeginMarker = '<';
    public const char EndMarker = '>';

    private static string AddMarkers(string command)
    {
        return BeginMarker + command + EndMarker;
    }

    private static string StripMarkers(string response)
    {
        // TODO: consider if we need to allow random chars before and after the markers
        if (!response.StartsWith(BeginMarker) || !response.EndsWith(EndMarker))
        {
            throwInvalidResponse(response);
        }
        return response.Substring(1, response.Length - 2);
    }

    private static void throwInvalidResponse(string response)
    {
        throw new InvalidDataException($"Invalid OSM OTAU response: {response}");
    }

    public static class GetInfo
    {
        public static string Command() { return AddMarkers("INFO_?"); }

        public static (string ModelOrPartNumber, string Version, string SerialNumber, string ProductNumber)
            ParseResponse(string responseWithMarkers)
        {
            string response = StripMarkers(responseWithMarkers);

            var match = Regex.Match(response, @"^([^_]+)_VER([^_]+)_SN([^_]+)_([^_]+)$");
            if (!match.Success) 
            {
                throwInvalidResponse(responseWithMarkers);
            }
            // NOTE: In the HC M3 optical switch documentation, the first field is model, but
            //       in production HC writes part number in this field.
            return (match.Groups[1].Value, match.Groups[2].Value, match.Groups[3].Value, match.Groups[4].Value);
        }
    }

    public static class SetPort
    {
        public static string Command(int portIndex)
        {
            // NOTE: Protocol expected 1-based indices, with port 0 meaning 'no port' aka 'dark port'.
            return AddMarkers($"OSW_01_SW_{portIndex:D3}");
        }

        public static void CheckResponse(string responseWithMarkers, int portIndex)
        {
            string response = StripMarkers(responseWithMarkers);

            var match = Regex.Match(response, @"^OSW_01_SW_(\d+)_OK$");
            int parsedPortIndex;
            if (!match.Success || 
                !Int32.TryParse(match.Groups[1].Value, out parsedPortIndex) || 
                parsedPortIndex != portIndex)
            {
                throwInvalidResponse(responseWithMarkers);
            }
        }
    }
}
