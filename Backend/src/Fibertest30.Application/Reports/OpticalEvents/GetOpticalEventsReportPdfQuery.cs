using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetOpticalEventsReportPdfQuery(bool IsCurrentEvents, DateTimeFilter DateTimeFilter,
    List<EventStatus> EventStatuses, List<FiberState> TraceStates, bool IsDetailed, bool IsShowPlace) : IRequest<byte[]>;

public class GetOpticalEventsReportPdfQueryHandler(Model writeModel, ICurrentUserService currentUserService,
    IUserSettingsRepository userSettingsRepository, IPdfBuilder pdfBuilder)
    : IRequestHandler<GetOpticalEventsReportPdfQuery, byte[]>
{
    public async Task<byte[]> Handle(GetOpticalEventsReportPdfQuery request, CancellationToken cancellationToken)
    {
        var userId = currentUserService.UserId!;
        var userSettings = await userSettingsRepository.GetUserSettings(userId);

        var serverInfo = ServerInfoProvider.Get();

        if (request.IsCurrentEvents)
        {
            var wrapped = writeModel
                .ActiveMeasurements.Select(m => writeModel.WrapMeasurement(m, false)).ToList();

            var bytes = pdfBuilder
                .GenerateCurrentOpticalEventsReport(wrapped, serverInfo, userSettings?.GetCulture() ?? "ru-RU");
            if (bytes == null)
                throw new InvalidDataException("Failed to Generate Current Optical Evetns Report");

            return bytes;

        }
        else
        {
            var filtered = writeModel.Measurements.Where(m => m.IsEventForReport(request))
                .OrderByDescending(x=>x.SorFileId).ToList();

            var totals = filtered.GetTotals(request);
            var wrapped = filtered.Select(m => writeModel.WrapMeasurement(m, true)).ToList();

            var bytes = pdfBuilder
                .GenerateOpticalEventsForPeriodReport(request, wrapped, totals, serverInfo, userSettings);

            if (bytes == null)
                throw new InvalidDataException("Failed to Generate Optical Events for Period Report");

            return bytes;
        }
    }

}

