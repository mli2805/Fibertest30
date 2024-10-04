using System.Diagnostics;

namespace Fibertest30.Infrastructure;
public static class ShellCommand
{
    public static string GetCommandLineOutput(string shCommand)
    {
        var cmd = $"-c \"{shCommand}\"";
        ProcessStartInfo startInfo = new() 
        { 
            FileName = "/bin/sh", 
            Arguments = cmd, 
            RedirectStandardOutput = true,
        }; 

        Process proc = new() { StartInfo = startInfo, };
        proc.Start();
        string output = proc.StandardOutput.ReadToEnd();
        proc.WaitForExit();

        return output;
    }
}
