using MediatR;

namespace Fibertest30.Application;

public record GetUserActionsPdfQuery(Guid UserId, DateTimeFilter DateTimeFilter, List<int> OperationCodes) :
    IRequest<byte[]>;

public class GetUserActionsPdfQueryHandler(IPdfBuilder pdfBuilder) :
    IRequestHandler<GetUserActionsPdfQuery, byte[]>
{
    public Task<byte[]> Handle(GetUserActionsPdfQuery request, CancellationToken cancellationToken)
    {
        var bytes = pdfBuilder.GenerateUserActionsReport(request.UserId, request.DateTimeFilter, request.OperationCodes);
        if (bytes == null)
            throw new InvalidDataException("FailedToGenerateReport");

        return Task.FromResult(bytes);
    }
}