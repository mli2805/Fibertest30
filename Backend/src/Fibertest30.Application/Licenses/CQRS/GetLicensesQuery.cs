using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application
{
    public record GetLicensesQuery(): IRequest<List<License>>;

    public class GetLicensesQueryHandler(Model writeModel) : IRequestHandler<GetLicensesQuery, List<License>>
    {
        public Task<List<License>> Handle(GetLicensesQuery request, CancellationToken cancellationToken)
        {
            return Task.FromResult(writeModel.Licenses.Where(l=>l.Version.StartsWith("3")).ToList());
        }
    }
}