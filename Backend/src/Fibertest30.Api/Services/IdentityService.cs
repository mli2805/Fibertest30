using Grpc.Core;
using MediatR;

namespace Fibertest30.Api;

public class IdentityService : Identity.IdentityBase
{
    private readonly ISender _mediator;

    public IdentityService(ISender mediator)
    {
        _mediator = mediator;
    }

    public override async Task<LoginResponse> Login(LoginRequest request, ServerCallContext context)
    {
        var authentication = await _mediator.Send(
                new LoginQuery(request.UserName, request.Password),
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
        var newToken = await _mediator.Send(
            new RefreshTokenQuery(),
            context.CancellationToken);

        return new RefreshTokenResponse
        {
            Token = newToken
        };
    }

    public override async Task<IsAuthenticatedResponse> IsAuthenticated(IsAuthenticatedRequest request, ServerCallContext context)
    {
        var isAuthenticated = await _mediator.Send(
            new IsAuthenticatedQuery(),
            context.CancellationToken);

        return new IsAuthenticatedResponse
        {
            IsAuthenticated = isAuthenticated
        };
    }

    public override async Task<GetCurrentUserResponse> GetCurrentUser(GetCurrentUserRequest request, ServerCallContext context)
    {
        var currentUser = await _mediator.Send(
            new GetCurrentUserQuery(), context.CancellationToken);

        return new GetCurrentUserResponse
        {
            User = currentUser.AuthenticatedUser.ToProto(),
            Settings = currentUser.UserSettings?.ToProto()
        };
    }

    public override async Task<SaveUserSettingsResponse> SaveUserSettings(SaveUserSettingsRequest request, ServerCallContext context)
    {
        await _mediator.Send(
            new SaveUserSettingsCommand(request.Settings.FromProto()),
            context.CancellationToken);

        return new SaveUserSettingsResponse();
    }


    public override async Task<GetAllUsersResponse> GetAllUsers(GetAllUsersRequest request, ServerCallContext context)
    {
        var appUsers = await _mediator.Send(
            new GetAllUsersQuery(), context.CancellationToken);
        var users = appUsers.Select(u => u.ToProto());

        return new GetAllUsersResponse() { Users = { users } };
    }

    public override async Task<GetUserResponse> GetUser(GetUserRequest request, ServerCallContext context)
    {
        var user = await _mediator.Send(
            new GetUserQuery(request.UserId), context.CancellationToken);

        return new GetUserResponse { User = user.ToProto() };
    }

    public override async Task<UpdateUserResponse> UpdateUser(UpdateUserRequest request, ServerCallContext context)
    {
        await _mediator.Send(new UpdateUserCommand(request.UserId, request.Patch.FromProto()));
        return new UpdateUserResponse();
    }

    public override async Task<CreateUserResponse> CreateUser(CreateUserRequest request, ServerCallContext context)
    {
        await _mediator.Send(new CreateUserCommand(request.Patch.FromProto()));
        return new CreateUserResponse();
    }

    public override async Task<DeleteUserResponse> DeleteUser(DeleteUserRequest request, ServerCallContext context)
    {
        await _mediator.Send(new DeleteUserCommand(request.UserId));
        return new DeleteUserResponse();
    }

    public override async Task<GetAllRolesResponse> GetAllRoles(GetAllRolesRequest request, ServerCallContext context)
    {
        var appRoles = await _mediator.Send(new GetAllRolesQuery());
        var roles = appRoles.Select(x => x.ToProto());
        return new GetAllRolesResponse() { Roles = { roles } };
    }
}