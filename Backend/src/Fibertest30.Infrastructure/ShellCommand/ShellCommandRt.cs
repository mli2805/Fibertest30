using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace Fibertest30.Infrastructure;

public interface IShellCommandRt
{
    Task LogScriptOutputInRealTime(string scriptFilename);
}

public class ShellCommandRt(ILogger<ShellCommandRt> logger) : IShellCommandRt
{
    public Task LogScriptOutputInRealTime(string scriptFilename)
    {
        ProcessStartInfo psi = new ProcessStartInfo
        {
            FileName = "/bin/bash",

            // The -c flag in Bash expects the script path to be absolute or explicitly relative
            // (e.g., ./verify.sh if the script is in the current working directory).
            Arguments = $"-c \"{scriptFilename}\"",
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true 
        };

        using (Process process = new Process { StartInfo = psi })
        {
            // Attach event handlers for asynchronous output and error capture
            process.OutputDataReceived += (sender, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                {
                    logger.LogInformation($"[Output] {e.Data}");
                }
            };
            process.ErrorDataReceived += (sender, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                {
                    logger.LogError($"[Output] {e.Data}");

                }
            };

            process.Start();
            
            // Begin asynchronous reading of output and error streams
            process.BeginOutputReadLine();
            process.BeginErrorReadLine();

            // Keep the application running while the script executes
            while (!process.HasExited)
            {
                // Perform other tasks or wait
                Thread.Sleep(100);
            }

            logger.LogInformation("Script execution completed.");
        }

        return Task.CompletedTask;
    }
}