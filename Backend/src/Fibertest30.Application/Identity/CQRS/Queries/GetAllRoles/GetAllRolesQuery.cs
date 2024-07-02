using MediatR;

namespace Fibertest30.Application;

public record GetAllRolesQuery() : IRequest<List<ApplicationRole>>;

public class GetAllRolesQueryHandler : IRequestHandler<GetAllRolesQuery, List<ApplicationRole>>
{
    private readonly IUserRolePermissionProvider _userRolePermissionProvider;

    public GetAllRolesQueryHandler(IUserRolePermissionProvider userRolePermissionProvider)
    {
        _userRolePermissionProvider = userRolePermissionProvider;
    }

    public async Task<List<ApplicationRole>> Handle(GetAllRolesQuery request, CancellationToken cancellationToken)
    {
        var roles = await _userRolePermissionProvider.GetAllRoles();
        return roles;
    }
}