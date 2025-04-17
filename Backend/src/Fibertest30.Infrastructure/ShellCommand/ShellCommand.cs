using System.Diagnostics;

namespace Fibertest30.Infrastructure;
public static class ShellCommand
{
    public static string GetCommandLineOutput(string shCommand)
    {
        var cmd = $"-c \"{shCommand}\"";
        return GetOutput(cmd);
    }

    public static string GetScriptOutput(string scriptFilename)
    {
        return GetOutput(scriptFilename);
    }

    private static string GetOutput(string startInfoArguments)
    {
        ProcessStartInfo startInfo = new()
        {
            FileName = "/bin/sh",
            Arguments = startInfoArguments,
            RedirectStandardOutput = true,
        };
        Process proc = new() { StartInfo = startInfo, };
        proc.Start();
        string output = proc.StandardOutput.ReadToEnd();
        proc.WaitForExit();

        return output;
    }
}
