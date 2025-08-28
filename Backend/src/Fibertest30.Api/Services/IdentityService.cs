using Grpc.Core;
using MediatR;

namespace Fibertest30.Api;

public class IdentityService(ISender mediator, ILogger<IdentityService> logger) : Identity.IdentityBase
{
    public override async Task<LoginResponse> Login(LoginRequest request, ServerCallContext context)
    {
        var peer = context.Peer; 
        logger.LogInformation($@"Peer IP: {peer}");

        var httpContext = context.GetHttpContext();
        var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "null";
        logger.LogInformation($@"Client IP from http context : {ip}");

        var authentication = await mediator.Send(
                new LoginQuery(request.UserName, request.Password, ip),
                context.CancellationToken);

        return new LoginResponse
        {
            Allow = authentication.Allow,
            Token = authentication.Token,
            User = authentication.User?.ToProto(),
            Settings = authentication.UserSettings?.ToProto()
        };
    }

    public override async Task<RefreshTokenResponse> RefreshToken(RefreshTokenRequest request, ServerCallContext context)
    {
        var newToken = await mediator.Send(
            new RefreshTokenQuery(),
            context.CancellationToken);

        return new RefreshTokenResponse
        {
            Token = newToken
        };
    }

    public override async Task<IsAuthenticatedResponse> IsAuthenticated(IsAuthenticatedRequest request, ServerCallContext context)
    {
        var isAuthenticated = await mediator.Send(
            new IsAuthenticatedQuery(),
            context.CancellationToken);

        return new IsAuthenticatedResponse
        {
            IsAuthenticated = isAuthenticated
        };
    }

    public override async Task<GetCurrentUserResponse> GetCurrentUser(GetCurrentUserRequest request, ServerCallContext context)
    {
        var currentUser = await mediator.Send(
            new GetCurrentUserQuery(), context.CancellationToken);

        return new GetCurrentUserResponse
        {
            User = currentUser.AuthenticatedUser.ToProto(),
            Settings = currentUser.UserSettings?.ToProto()
        };
    }

    public override async Task<SaveUserSettingsResponse> SaveUserSettings(SaveUserSettingsRequest request, ServerCallContext context)
    {
        await mediator.Send(
            new SaveUserSettingsCommand(request.Settings.FromProto()),
            context.CancellationToken);

        return new SaveUserSettingsResponse();
    }


    public override async Task<GetAllUsersResponse> GetAllUsers(GetAllUsersRequest request, ServerCallContext context)
    {
        var appUsers = await mediator.Send(
            new GetAllUsersQuery(), context.CancellationToken);
        var users = appUsers.Select(u => u.ToProto());

        return new GetAllUsersResponse() { Users = { users } };
    }

    public override async Task<GetUserResponse> GetUser(GetUserRequest request, ServerCallContext context)
    {
        var user = await mediator.Send(
            new GetUserQuery(request.UserId), context.CancellationToken);

        return new GetUserResponse { User = user.ToProto() };
    }

    public override async Task<UpdateUserResponse> UpdateUser(UpdateUserRequest request, ServerCallContext context)
    {
        await mediator.Send(new UpdateUserCommand(request.UserId, request.Patch.FromProto()));
        return new UpdateUserResponse();
    }

    public override async Task<CreateUserResponse> CreateUser(CreateUserRequest request, ServerCallContext context)
    {
        await mediator.Send(new CreateUserCommand(request.Patch.FromProto()));
        return new CreateUserResponse();
    }

    public override async Task<DeleteUserResponse> DeleteUser(DeleteUserRequest request, ServerCallContext context)
    {
        await mediator.Send(new DeleteUserCommand(request.UserId));
        return new DeleteUserResponse();
    }

    public override async Task<GetAllRolesResponse> GetAllRoles(GetAllRolesRequest request, ServerCallContext context)
    {
        var appRoles = await mediator.Send(new GetAllRolesQuery());
        var roles = appRoles.Select(x => x.ToProto());
        return new GetAllRolesResponse() { Roles = { roles } };
    }
}