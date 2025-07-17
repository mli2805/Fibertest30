using Iit.Fibertest.Graph;
using MediatR;

namespace Fibertest30.Application;

public record GetAllGeoDataQuery : IRequest<AllGisData>;

public class GetAllGeoDataQueryHandler(Model writeModel, ICurrentUserService currentUserService,
        IUserRolePermissionProvider permissionProvider) 
    : IRequestHandler<GetAllGeoDataQuery, AllGisData>
{
    public async Task<AllGisData> Handle(GetAllGeoDataQuery request, CancellationToken cancellationToken)
    {
        var hasEditGraphPermission =
            await permissionProvider.HasPermission(currentUserService.Role!, ApplicationPermission.EditGraph);
        return hasEditGraphPermission ? writeModel.GetAllGisData() : writeModel.GetAllReadOnly();
    }
}