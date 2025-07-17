using Iit.Fibertest.Dto;
using Microsoft.Extensions.Logging;
using System.Threading.Channels;

namespace Fibertest30.Infrastructure;

public class RtuDataDispatcher : IRtuDataDispatcher
{
    private readonly ILogger<RtuDataDispatcher> _logger;
    private readonly RtuDataProcessor _rtuDataProcessor;
    private readonly Channel<IDataFromRtu> _channel = Channel.CreateUnbounded<IDataFromRtu>();

    public RtuDataDispatcher(ILogger<RtuDataDispatcher> logger,  RtuDataProcessor rtuDataProcessor)
    {
        _logger = logger;
        _rtuDataProcessor = rtuDataProcessor;
    }

    public async Task Send(IDataFromRtu dataFromRtu, CancellationToken ct)
    {
        await _channel.Writer.WriteAsync(dataFromRtu, ct);
    }

    public async Task ProcessRtuData(CancellationToken ct)
    {
        // в бесконечном цикле пока не остановят весь API
        while (!ct.IsCancellationRequested)
        {
            try
            {
                // достаем из Channel данные, которые туда поместил RtuPollster
                var rtuData = await _channel.Reader.ReadAsync(ct);

                // и обрабатываем их в зависимости от типа данных
                if (rtuData is MonitoringResultDto monitoringResultDto)
                {
                    await _rtuDataProcessor.ProcessMonitoringResult(monitoringResultDto, ct);
                }
                else if (rtuData is BopStateChangedDto bopStateChangedDto)
                {
                    await _rtuDataProcessor.ProcessBopStateChanges(bopStateChangedDto);
                }
              
                else if (rtuData is ClientMeasurementResultDto )
                {
                    // полстер не помещает в Channel результат клиентских измерений
                    // а сразу вызывает обработчик
                    // там еще нужно знать с какого модуля, для этого менять dto,
                    // да и вся обработка это ждать когда клиент заберет результат,
                    // т.е. сюда переедет словать для хранения результата, м.б. позже
                }
                else if (rtuData is InitializationResult )
                {
                    // пока нет
                }
                else if (rtuData is CurrentMonitoringStepDto currentMonitoringStepDto)
                {
                    _rtuDataProcessor.ProcessCurrentRtuState(currentMonitoringStepDto);
                }
                else if (rtuData is RtuNetworkEvent dto)
                {
                    await _rtuDataProcessor.ProcessRtuNetworkEvent(dto);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e, "Failed while ProcessRtuData");
            }
        }
    }
}
