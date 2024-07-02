using MediatR;

namespace Fibertest30.Application;

public record GetNtpSettingsQuery() : IRequest<NtpSettings>;

public class GetNtpSettingsQueryHandler : IRequestHandler<GetNtpSettingsQuery, NtpSettings>
{
    private readonly INtpSettingsProvider _ntpSettingsProvider;

    public GetNtpSettingsQueryHandler(INtpSettingsProvider ntpSettingsProvider)
    {
        _ntpSettingsProvider = ntpSettingsProvider;
    }

    public async Task<NtpSettings> Handle(GetNtpSettingsQuery request, CancellationToken cancellationToken)
    {
        return await _ntpSettingsProvider.GetNtpSettings(cancellationToken);
    }
}