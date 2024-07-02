using MediatR;

namespace Fibertest30.Application;

public record GetTimeSettingsQuery() : IRequest<TimeSettings>;

public class GetTimeSettingsQueryHandler : IRequestHandler<GetTimeSettingsQuery, TimeSettings>
{
    private readonly IDeviceInfoProvider _deviceInfoProvider;
    private readonly INtpSettingsProvider _ntpSettingsProvider;

    public GetTimeSettingsQueryHandler(IDeviceInfoProvider deviceInfoProvider, INtpSettingsProvider ntpSettingsProvider)
    {
        _deviceInfoProvider = deviceInfoProvider;
        _ntpSettingsProvider = ntpSettingsProvider;
    }

    public async Task<TimeSettings> Handle(GetTimeSettingsQuery request, CancellationToken cancellationToken)
    {
        var timeSettings = new TimeSettings();
        timeSettings.TimeZone = _deviceInfoProvider.GetTimeZone().ToAppTimeZone();
        timeSettings.NtpSettings = await _ntpSettingsProvider.GetNtpSettings(cancellationToken);
        return timeSettings;
    }
}