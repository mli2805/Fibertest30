using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

[HasPermission(ApplicationPermission.DoMeasurementClient)]
public record DoMeasurementClientCommand(DoClientMeasurementDto dto) : IRequest<Unit>;

public class DoClientMeasurementCommandHandler : IRequestHandler<DoMeasurementClientCommand, Unit>
{
    private readonly ICurrentUserService _currentUserService;
    private readonly IRtuManager _rtuManager;
    private readonly ISystemEventSender _systemEventSender;
    private readonly Model _writeModel;

    public DoClientMeasurementCommandHandler(ICurrentUserService currentUserService, IRtuManager rtuManager,
        ISystemEventSender systemEventSender, Model writeModel)
    {
        _currentUserService = currentUserService;
        _rtuManager = rtuManager;
        _systemEventSender = systemEventSender;
        _writeModel = writeModel;
    }

    public async Task<Unit> Handle(DoMeasurementClientCommand command, CancellationToken cancellationToken)
    {
        var dto = command.dto;
        dto.ConnectionId = _currentUserService.UserId!;

        /* любые проблемы во время выполнения (на стороне сервера) должны бросать кастомный exception
         * этот exception в ExceptionInterceptor заворачивается в RpcException
         * и в вэбе будет Action.Failure и получена нужная ошибка
         */

        var result = await _rtuManager.StartClientMeasurement(dto);

        /*
         * если рту найден и свободен, то на нем уже СТАРТОВАЛО измерение
         *
         * возможно проблемы случились на стороне RTU 
         */
        if (result.ReturnCode != ReturnCode.MeasurementClientStartedSuccessfully)
            throw new RtuIsBusyException("");

        /*
         * result содержит пустой ClientMeasurementId если измерение успешно стартовало, увы! возможно надо переделать...
         *
         * на сервере крутится RtuLinuxPollster, который опрашивает все рту, и вытягивает результаты измерений
         * ClientMeasurementId будет заполнен в ClientMeasurementResultDto и получен полстером
         * полстер пришлет SystemEvent c ClientMeasurementId тому пользователю чей UserId лежит в ConnectionId
         */


        // успешный возврат означает Action.Success (в данном случае RtuMgmtActions.startMeasurementClientSuccess)
        return Unit.Value;
    }
}

