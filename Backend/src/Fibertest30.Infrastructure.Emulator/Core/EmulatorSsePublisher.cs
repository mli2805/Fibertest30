using Lib.AspNetCore.ServerSentEvents;

namespace Fibertest30.Infrastructure;

public class EmulatorSsePublisher 
{
    private readonly IServerSentEventsService _emulatorSseService;

    public EmulatorSsePublisher(IServerSentEventsService emulatorSseService)
    {
        _emulatorSseService = emulatorSseService;
    }

    public async Task SendSeeUpdate(string text)
    {
        await _emulatorSseService.SendEventAsync(text);
    }
}