
using MediatR;
using System.Reflection;

namespace Fibertest30.Application;

public class AuthorizationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : IRequest<TResponse>
{
    private readonly IUsersRepository _usersRepository;
    private readonly ICurrentUserService _currentUserService;
    private readonly IUserRolePermissionProvider _userRolePermissionProvider;

    public AuthorizationBehaviour(
        IUsersRepository usersRepository,
        ICurrentUserService currentUserService,
        IUserRolePermissionProvider userRolePermissionProvider)
    {
        _usersRepository = usersRepository;
        _currentUserService = currentUserService;
        _userRolePermissionProvider = userRolePermissionProvider;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var allowAnonymous = request.GetType().GetCustomAttributes<AllowAnonymousAttribute>().SingleOrDefault();
        var allowCurrentUserChangingHimself = request.GetType().GetCustomAttributes<AllowCurrentUserChangingHimselfAttribute>().SingleOrDefault();
        var permissionAttribute = request.GetType().GetCustomAttributes<HasPermissionAttribute>().SingleOrDefault();

        if (allowAnonymous != null && permissionAttribute != null)
        {
            throw new InvalidOperationException("AllowAnonymous and HasPermission cannot be used on the same endpoint.");
        }
        
        if (allowCurrentUserChangingHimself != null && permissionAttribute == null)
        {
            throw new InvalidOperationException(
                "AllowCurrentUserChangingHimself can be used only with HasPermission.");
        }

        if (allowAnonymous != null)
        {
            // authorization not required
            return await next();
        }

        // user is not authenticated or was removed from the database
        if (_currentUserService.UserId == null 
            || _currentUserService.Role == null
            || !(await _usersRepository.IsUserExist(_currentUserService.UserId))
            )
        {
            throw new UnauthorizedAccessException();
        }
        
        // let's get  GetRequestUserId before checking HasPermission attribute
        // So, we can fail fast if UserId is not set for AllowCurrentUserChangingHimself
        var requestUserId = allowCurrentUserChangingHimself != null ? GetRequestUserId(request) : null;

        if (permissionAttribute != null)
        {
           if (!await _userRolePermissionProvider.HasPermission(_currentUserService.Role, permissionAttribute.Permission))
           {
               // permission not found, but let's check if allowCurrentUserChangingHimself
               // is enabled and UserId is set
               if (allowCurrentUserChangingHimself == null
                   || requestUserId != _currentUserService.UserId)
               {
                   throw new UnauthorizedAccessException();
               }
           }
        }

        // User is authorized
        return await next();
    }

    private string GetRequestUserId(TRequest request)
    {
        var userIdProperty = request.GetType().GetProperty("UserId", typeof(string));
        if (userIdProperty == null)
        {
            throw new InvalidOperationException("AllowCurrentUserChangingHimself is used but UserId property is not found.");
        }

        var userId = userIdProperty.GetValue(request) as string;
        if (string.IsNullOrEmpty(userId))
        {
            throw new InvalidOperationException("AllowCurrentUserChangingHimself is used but UserId property is not set.");
        }

        return userId;
    }
}
