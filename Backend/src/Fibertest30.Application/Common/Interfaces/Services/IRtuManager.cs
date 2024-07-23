using Iit.Fibertest.Dto;

namespace Fibertest30.Application;
public interface IRtuManager
{
    Task<RtuConnectionCheckedDto> CheckRtuConnection(NetAddress netAddress, CancellationToken cancellationToken);

    Task<RtuCurrentStateDto> GetRtuCurrentState(GetCurrentRtuStateDto dto);

    Task<TResult> SendCommand<T, TResult>(T dto, DoubleAddress rtuDoubleAddress)
        where TResult : RequestAnswer, new();
}
