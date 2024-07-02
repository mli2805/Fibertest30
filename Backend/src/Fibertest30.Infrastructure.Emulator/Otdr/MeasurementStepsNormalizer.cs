using System.Globalization;

namespace Fibertest30.Infrastructure.Emulator;

public class MeasurementStepsNormalizer
{
    public List<OtdrTraceMeasurementResult> Normalize(List<OtdrTraceMeasurementResult> measurementSteps, 
        int delayBetweenStepsMs,
        bool fastMeasurement,
        OtdrTraceManualMeasurementParameters measurementSettings)
    {
        if (fastMeasurement || measurementSettings.AveragingTime == null)
        {
            // if fast measurement, just give the trace immediately
            // for auto mode (no averaging time), just give the trace immediately
            return measurementSteps.TakeLast(1).ToList();
        }
 
        var averageTime = TimeSpan.ParseExact(measurementSettings.AveragingTime, "mm\\:ss", 
            CultureInfo.InvariantCulture);
        return Normalize(measurementSteps, delayBetweenStepsMs, (int)averageTime.TotalMilliseconds);
    }

    public List<OtdrTraceMeasurementResult> Normalize(List<OtdrTraceMeasurementResult> measurementSteps,
        int delayBetweenStepsMs,
        int totalTimeMs)
    {
        var stepsCount = totalTimeMs / delayBetweenStepsMs;

        var progressMeasurement = measurementSteps.SkipLast(1).ToList();
        var completedMeasurement = measurementSteps.Last();

        var normalizedSteps = GetCircularMeasurementSteps(progressMeasurement, stepsCount - 1);
        normalizedSteps.Add(completedMeasurement);

        return normalizedSteps;
    }

    private List<OtdrTraceMeasurementResult> GetCircularMeasurementSteps
        (List<OtdrTraceMeasurementResult> input, int outputCount)
    {
        List<OtdrTraceMeasurementResult> output = new();
        for (int i = 0; i < outputCount; i++)
        {
            var progress = (i + 1.0) / (outputCount + 1);
            var item = input[i % input.Count];
            output.Add(new OtdrTraceMeasurementResult
            {
                Progress = progress,
                Sor = item.Sor
            });
        }
        return output;
    }
}