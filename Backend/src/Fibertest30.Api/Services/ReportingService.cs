using Google.Protobuf;
using Grpc.Core;
using MediatR;

namespace Fibertest30.Api;

public class ReportingService : Reporting.ReportingBase
{
    private readonly ISender _mediator;

    public ReportingService(ISender mediator)
    {
        _mediator = mediator;
    }

    public override async Task<GetSystemEventsResponse> GetSystemEvents(GetSystemEventsRequest request, ServerCallContext context)
    {
        var systemEvents = await _mediator.Send(
            new GetSystemEventsQuery(),
            context.CancellationToken);

        var response = new GetSystemEventsResponse()
        {
            SystemEvents = { systemEvents.Select(x => x.ToProto()) }
        };
        
        return response;
    }

  
    public override async Task<GetMonitoringsResponse> GetMonitorings(GetMonitoringsRequest request, ServerCallContext context)
    {
        var monitorings = await _mediator.Send(
            new GetMonitoringsQuery(
                request.MonitoringPortIds.ToList(), 
                request.DateTimeFilter.FromProto()
                ),
            context.CancellationToken);

        var response = new GetMonitoringsResponse()
        {
            Monitorings =  { monitorings.Select(x => x.ToProto()) }
        };
        
        return response;
    }

    public override async Task<GetMonitoringResponse> GetMonitoring(GetMonitoringRequest request, ServerCallContext context)
    {
        var monitoring = await _mediator.Send(
            new GetMonitoringQuery(request.MonitoringId, AddExtra: true),
            context.CancellationToken);

        var response = new GetMonitoringResponse()
        {
            Monitoring =  monitoring.ToProto()
        };
        
        return response;
    }

    public override async Task<GetMonitoringTraceResponse> GetMonitoringTrace(GetMonitoringTraceRequest request, ServerCallContext context)
    {
        var trace = await _mediator.Send(
            new GetMonitoringTraceQuery(request.MonitoringId),
            context.CancellationToken);
        
        return new GetMonitoringTraceResponse()
        {
            Sor = ProtoUtils.MeasurementTraceToSorByteString(trace, request.VxsorFormat),
        };
    }

    public override async Task<GetMonitoringLinkmapResponse> GetMonitoringLinkmap(GetMonitoringLinkmapRequest request, ServerCallContext context)
    {
        var lmapBytes = await _mediator.Send(
            new GetMonitoringLinkmapQuery(request.MonitoringId, request.MacrobendThreshold),
            context.CancellationToken);

        if (lmapBytes == null)
        {
            return new GetMonitoringLinkmapResponse();
        }
        return new GetMonitoringLinkmapResponse
        {
            Lmap = ByteString.CopyFrom(lmapBytes)
        };
    }

    public override async Task<GetBaselinesResponse> GetBaselines(GetBaselinesRequest request,
        ServerCallContext context)
    {
        var baselines = await _mediator.Send(
            new GetBaselinesQuery(request.MonitoringPortIds.ToList()), context.CancellationToken);

        return new GetBaselinesResponse() { Baselines = { baselines.Select(b => b.ToProto()) } };
    }

    public override async Task<GetBaselineResponse> GetBaseline(GetBaselineRequest request, ServerCallContext context)
    {
        var baseline = await _mediator.Send(
            new GetBaselineQuery(request.BaselineId),
            context.CancellationToken);

        var response = new GetBaselineResponse()
        {
            Baseline =  baseline.ToProto()
        };
        
        return response;
    }


    public override async Task<GetBaselineTraceResponse> GetBaselineTrace(GetBaselineTraceRequest request, ServerCallContext context)
    {
        var trace = await _mediator.Send(
            new GetBaselineTraceQuery(request.BaselineId),
            context.CancellationToken);

        return new GetBaselineTraceResponse()
        {
            Sor = ProtoUtils.MeasurementTraceToSorByteString(trace, request.VxsorFormat)
        };
    }

    public override async Task<GetBaselineLinkmapResponse> GetBaselineLinkmap(GetBaselineLinkmapRequest request, ServerCallContext context)
    {
        var lmapBytes = await _mediator.Send(
            new GetBaselineLinkmapQuery(request.BaselineId, request.MacrobendThreshold),
            context.CancellationToken);

        if (lmapBytes == null)
        {
            return new GetBaselineLinkmapResponse();
        }
        return new GetBaselineLinkmapResponse
        {
            Lmap = ByteString.CopyFrom(lmapBytes)
        };
    }

    public override async Task<GetMonitoringTraceAndBaseResponse> GetMonitoringTraceAndBase(
        GetMonitoringTraceAndBaseRequest request, ServerCallContext context)
    {
        var data = await _mediator.Send(
            new GetMonitoringTraceAndBaseQuery(request.MonitoringId),
            context.CancellationToken);

        return new GetMonitoringTraceAndBaseResponse()
        {
            Archive =  ByteString.CopyFrom(data)
        };
    }

    public override async Task<GetAlarmResponse> GetAlarm(GetAlarmRequest request, ServerCallContext context)
    {
        var alarm = await _mediator.Send(
            new GetAlarmQuery(request.Id),
            context.CancellationToken);

        var response = new GetAlarmResponse()
        {
            Alarm =  alarm.ToProto() 
        };
        
        return response;
    }

    public override async Task<GetActiveAlarmsResponse> GetActiveAlarms(GetActiveAlarmsRequest request, ServerCallContext context)
    {
        var activeAlarms = await _mediator.Send(
            new GetActiveAlarmsQuery(),
            context.CancellationToken);

        var response = new GetActiveAlarmsResponse()
        {
            ActiveAlarms =  { activeAlarms.Select(x => x.ToProto()) }
        };
        
        return response;
    }

    public override async Task<GetAllAlarmsResponse> GetAllAlarms(GetAllAlarmsRequest request,
        ServerCallContext context)
    {
        var allAlarms = await _mediator.Send(
            new GetAllAlarmsQuery(request.MonitoringPortIds.ToList()),
            context.CancellationToken);

        var response = new GetAllAlarmsResponse()
        {
            AllAlarms =  { allAlarms.Select(x => x.ToProto()) }
        };
        
        return response;
    }

    public override async Task<GetAlarmEventsResponse> GetAlarmEvents(GetAlarmEventsRequest request,
        ServerCallContext context)
    {
        var alarmEvents = await _mediator.Send(
            new GetAlarmEventsQuery(request.MonitoringPortIds.ToList()),
            context.CancellationToken);

        var response = new GetAlarmEventsResponse()
        {
            AlarmEvents = { alarmEvents.Select(x => x.ToProto()) }
        };

        return response;
    }

    public override async Task<GetLastMonitoringResponse> GetLastMonitoring(GetLastMonitoringRequest request, ServerCallContext context)
    {
        var monitoring = await _mediator.Send(
            new GetLastMonitoringQuery(request.MonitoringPortId, request.BaselineId),
            context.CancellationToken);

        var response = new GetLastMonitoringResponse()
        {
            Monitoring =  monitoring?.ToProto()
        };
        
        return response;
    }

    public override async Task<GetLastMonitoringTraceResponse> GetLastMonitoringTrace(GetLastMonitoringTraceRequest request, ServerCallContext context)
    {
        var trace = await _mediator.Send(
            new GetLastMonitoringTraceQuery(request.MonitoringPortId, request.BaselineId),
            context.CancellationToken);

        if (trace == null)
        {
            return new GetLastMonitoringTraceResponse();
        }
        else
        {
            return new GetLastMonitoringTraceResponse()
            {
                Sor =ProtoUtils.MeasurementTraceToSorByteString(trace, request.VxsorFormat)
            };
        }
    }

    public override async Task<GetLastMonitoringLinkmapResponse> GetLastMonitoringLinkmap(GetLastMonitoringLinkmapRequest request, ServerCallContext context)
    {
        var lmapBytes = await _mediator.Send(
            new GetLastMonitoringLinkmapQuery(request.MonitoringPortId, request.BaselineId, request.MacrobendThreshold),
            context.CancellationToken);

        if (lmapBytes == null)
        {
            return new GetLastMonitoringLinkmapResponse();
        }
        return new GetLastMonitoringLinkmapResponse
        {
            Lmap = ByteString.CopyFrom(lmapBytes)
        };
    }
}
