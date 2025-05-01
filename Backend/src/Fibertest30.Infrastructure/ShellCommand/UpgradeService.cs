using Microsoft.Extensions.Logging;
using System.Diagnostics;
using Microsoft.Extensions.Hosting;

namespace Fibertest30.Infrastructure
{
    public interface IUpgradeService
    {
        void Start();
    }

    public class UpgradeService(ILogger<UpgradeService> logger, IHostApplicationLifetime hostApplicationLifetime) : IUpgradeService
    {
        private CancellationTokenSource _cts = null!;
        private Task _logReaderTask = null!;

        public void Start()
        {
            var script = "/var/fibertest/api/verify.sh";
            var scriptLog = "/var/fibertest/api/vlog/verify.log";
            if (File.Exists(scriptLog))
            {
                // to avoid logging the old file
                File.Delete(scriptLog);
            }

            _cts = new CancellationTokenSource();

            // Start the script
            StartDetachedAndRedirectOutput(script, scriptLog);
            // Start checking script's output file
            _logReaderTask = TailLogFile(scriptLog, _cts.Token);

            hostApplicationLifetime.ApplicationStopping.Register(OnShutdown);
        }

        private void OnShutdown()
        {
            logger.LogInformation("Service shutdown initiated.");
            Stop().Wait();  // Gracefully stop log reader
        }

        private async Task Stop()
        {
            await _cts.CancelAsync();  // Signal cancellation to log reader
            await _logReaderTask;      // Wait for log reader to finish
            logger.LogInformation("Service stopped gracefully.");
        }

        private async Task TailLogFile(string logFilePath, CancellationToken stoppingToken)
        {
            logger.LogInformation("TailLogFile started");
            try
            {
                while (!File.Exists(logFilePath))
                {
                    logger.LogInformation($"{logFilePath} does not exist yet");
                    await Task.Delay(1000, stoppingToken);
                }


                await using var stream = new FileStream(logFilePath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);

                using var reader = new StreamReader(stream);
                reader.BaseStream.Seek(0, SeekOrigin.Begin);

                while (!stoppingToken.IsCancellationRequested)
                {
                    string? line = await reader.ReadLineAsync(stoppingToken);
                    if (line != null)
                    {
                        logger.LogInformation($@"Script Output: {line}");
                    }
                    else
                    {
                        logger.LogInformation("nothing to log");
                        await Task.Delay(1000, stoppingToken);
                    }
                }
            }
            catch (OperationCanceledException)
            {
                logger.LogInformation("TailLogFile cancellation");
            }
            catch (Exception e)
            {
                logger.LogError($"[TailLogFile]: {e.Message}");
            }
        }



        /// <summary>
        /// systemd-run
        /// A Linux command that creates a transient systemd service to run the specified command.
        /// This ensures the script is managed by systemd independently of its parent process.
        /// 
        /// --unit=my-script.service:
        /// Explicitly names the transient unit my-script.service.
        /// This makes it easier to monitor/control later (e.g., with systemctl status my-script.service
        ///  or clean after failed: systemctl reset-failed my-script.service)
        ///
        /// In order to redirect script output:
        ///     systemd-run runs bash
        ///     bash can redirect output
        /// </summary>
        /// <param name="script">Absolute path!</param>
        /// <param name="scriptLog">Absolute path!</param>
        private void StartDetachedAndRedirectOutput(string script, string scriptLog)
        {
            ProcessStartInfo startInfo = new()
            {
                FileName = "/bin/sh",
                Arguments = $"-c \"systemd-run --unit=my-script.service --setenv=TMPDIR=/home/data " +
                            $"/bin/bash -c '{script} >{scriptLog} 2>&1'\"",
            };
            Process proc = new() { StartInfo = startInfo, };
            proc.Start();
        }
    }
}
