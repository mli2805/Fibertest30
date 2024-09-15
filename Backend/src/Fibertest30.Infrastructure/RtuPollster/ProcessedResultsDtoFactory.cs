using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using Iit.Fibertest.UtilsLib;
using Microsoft.Extensions.Logging;
using Optixsoft.SorExaminer.OtdrDataFormat;

namespace Fibertest30.Infrastructure;
public class ProcessedResultsDtoFactory
{
    private readonly ILogger<ProcessedResultsDtoFactory> _logger;
    private readonly Model _writeModel;
    private readonly AccidentsFromSorExtractor _accidentsFromSorExtractor;

    public ProcessedResultsDtoFactory(ILogger<ProcessedResultsDtoFactory> logger, Model writeModel, 
        AccidentsFromSorExtractor accidentsFromSorExtractor)
    {
        _logger = logger;
        _writeModel = writeModel;
        _accidentsFromSorExtractor = accidentsFromSorExtractor;
    }

    public AddMeasurement CreateCommand(MonitoringResultDto monitoringResultDto, int sorId)
    {
        var result = new AddMeasurement
        {
            ReturnCode = monitoringResultDto.ReturnCode,
            SorFileId = sorId,

            MeasurementTimestamp = monitoringResultDto.TimeStamp,
            EventRegistrationTimestamp = DateTime.Now,
            RtuId = monitoringResultDto.RtuId,
            TraceId = monitoringResultDto.PortWithTrace.TraceId,
            BaseRefType = monitoringResultDto.BaseRefType,
            TraceState = monitoringResultDto.TraceState,

            StatusChangedTimestamp = DateTime.Now,
            StatusChangedByUser = "system",
            Comment = "",

            Accidents = ExtractAccidents(monitoringResultDto.SorBytes, monitoringResultDto.PortWithTrace.TraceId)
        };
        EvaluateStatus(result);
        return result;
    }

    public AddRtuAccident CreateRtuAccidentCommand(MonitoringResultDto monitoringResultDto)
    {
        return new AddRtuAccident()
        {
            IsMeasurementProblem = true,
            ReturnCode = monitoringResultDto.ReturnCode,

            EventRegistrationTimestamp = DateTime.Now,
            RtuId = monitoringResultDto.RtuId,
            TraceId = monitoringResultDto.PortWithTrace.TraceId,
            BaseRefType = monitoringResultDto.BaseRefType,

            Comment = "",
        };
    }

    private void EvaluateStatus(AddMeasurement cmd)
    {
        if (!IsEvent(cmd))
            cmd.EventStatus = EventStatus.JustMeasurementNotAnEvent;
        else if (cmd.TraceState == FiberState.Ok || cmd.BaseRefType == BaseRefType.Fast)
            cmd.EventStatus = EventStatus.EventButNotAnAccident;
        else cmd.EventStatus = EventStatus.Unprocessed;
    }

    private bool IsEvent(AddMeasurement cmd)
    {
        var previousMeasurementOnTrace = _writeModel.Measurements
            .Where(ev => ev.TraceId == cmd.TraceId).ToList()
            .LastOrDefault();
        if (previousMeasurementOnTrace == null)
        {
            _logger.LogInformation($"First measurement on trace {cmd.TraceId.First6()} - event.");
            return true;
        }

        if (IsStateChanged(cmd, previousMeasurementOnTrace))
        {
            _logger.LogInformation($"State of trace {cmd.TraceId.First6()} changed - event.");
            return true;
        }

        if (previousMeasurementOnTrace.BaseRefType == BaseRefType.Fast
            && previousMeasurementOnTrace.EventStatus >
            EventStatus.JustMeasurementNotAnEvent // fast measurement could be made 
            // when monitoring mode is turned to Automatic 
            // or it could be made by schedule
            // but we are interested only in Events
            && cmd.BaseRefType != BaseRefType.Fast // Precise or Additional
            && cmd.TraceState != FiberState.Ok)
        {
            _logger.LogInformation(
                $"Confirmation of accident on trace {cmd.TraceId.First6()} - event.");
            return true;
        }

        return false;
    }

    private bool IsStateChanged(AddMeasurement current, Measurement previous)
    {
        if (current.TraceState != previous.TraceState)
            return true;
        if (current.TraceState == FiberState.Ok || current.TraceState == FiberState.NoFiber)
            return false;
        if (current.Accidents.Count != previous.Accidents.Count)
            return true;
        for (int i = 0; i < current.Accidents.Count; i++)
        {
            if (!current.Accidents[i].IsTheSame(previous.Accidents[i])) return true;
        }

        return false;
    }
        
    private List<AccidentOnTraceV2> ExtractAccidents(byte[] sorBytes, Guid traceId)
    {
        OtdrDataKnownBlocks sorData = SorData.FromBytes(sorBytes);
        var accidents = _accidentsFromSorExtractor.GetAccidents(sorData, traceId);
        return accidents;
    }
}
