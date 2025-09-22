using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetMonitoringSystemReportPdfQuery() : IRequest<byte[]>;

public class GetMonitoringSystemReportPdfQueryHandler(
    Model writeModel, ICurrentUserService currentUserService, IUserSettingsRepository userSettingsRepository, IPdfBuilder pdfBuilder)
    : IRequestHandler<GetMonitoringSystemReportPdfQuery, byte[]>
{
    public async Task<byte[]> Handle(GetMonitoringSystemReportPdfQuery request, CancellationToken cancellationToken)
    {
        var userId = currentUserService.UserId!;
        var userSettings = await userSettingsRepository.GetUserSettings(userId);

        var serverInfo = ServerInfoProvider.Get();

        var bytes = pdfBuilder
            .GenerateMonitoringSystemReport(writeModel, serverInfo, userSettings?.GetCulture() ?? "ru-RU");

        if (bytes == null)
            throw new InvalidDataException("Failed to Generate Monitoring System Report");

        return bytes;
    }
}