using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetRtuCurrentStepQuery(Guid RtuId) : IRequest<CurrentState>;

public class GetRtuCurrentStepQueryHandler(IRtuCurrentStateDictionary rtuCurrentStateDictionary, Model writeModel)
    : IRequestHandler<GetRtuCurrentStepQuery, CurrentState>
{
        // чтобы была возможность перевода надо возвращать данные а не готовую строку
    public Task<CurrentState> Handle(GetRtuCurrentStepQuery request, CancellationToken cancellationToken)
    {
        var result = new CurrentState();
        CurrentMonitoringStepDto? step = rtuCurrentStateDictionary.Get(request.RtuId);
        if (step == null) { return Task.FromResult(result); }

        result.Step = step.Step;
        if (step.PortWithTraceDto != null)
        {
            var trace = writeModel.Traces.First(t => t.TraceId == step.PortWithTraceDto.TraceId);
            result.TraceTitle = trace.Title;
            result.Port = step.PortWithTraceDto.OtauPort.ToStringB();
        }

        return Task.FromResult(result);
    }
}

public class CurrentState
{
    public MonitoringCurrentStep Step { get; set; } = MonitoringCurrentStep.Unknown; 
    public string Port { get; set; } = ""; // порта может не быть
    public string TraceTitle { get; set; } = ""; // трассы может не быть
}