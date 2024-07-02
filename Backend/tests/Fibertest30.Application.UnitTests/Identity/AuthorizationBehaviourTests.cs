
using MediatR;
using Moq;

namespace Fibertest30.Application.UnitTests;

[TestClass]
public class AuthorizationBehaviourTests
{
    private record NoAuthorizationAttributeRequest : IRequest<Unit>;

    [AllowAnonymous]
    private record AllowAnonymousAttributedRequest : IRequest<Unit>;
    
    [AllowCurrentUserChangingHimself]
    [HasPermission(ApplicationPermission.ConfigureOtau)]
    private record UserChangingHimself_Ivalid_Request : IRequest<Unit>;
    
   
    [AllowCurrentUserChangingHimself]
    [HasPermission(ApplicationPermission.ConfigureOtau)]
    private record UserChangingHimselfRequest(string UserId) : IRequest<Unit>;
    

    [HasPermission(ApplicationPermission.ConfigureOtau)]
    private record HasPermissionAttributedRequest : IRequest<Unit>;

    Mock<IUserRolePermissionProvider> _mockNoFoundPermissionProvider = new();
    Mock<IUserRolePermissionProvider> _mockOkPermissionProvider = new();


    RequestHandlerDelegate<Unit> next = () => { return Task.FromResult(Unit.Value); };

    public AuthorizationBehaviourTests()
    {
        _mockNoFoundPermissionProvider.Setup(x => x.HasPermission(It.IsAny<string>(), It.IsAny<ApplicationPermission>()))
            .Returns<string, ApplicationPermission>((role, p) => Task.FromResult(false));

        _mockOkPermissionProvider.Setup(x => x.HasPermission(It.IsAny<string>(), It.IsAny<ApplicationPermission>()))
              .Returns<string, ApplicationPermission>((role, p) => Task.FromResult(true));
    }

    [TestMethod]
    public async Task NoAuthorizationAttributeRequest_Anonymous_NotAllow()
    {
        var auth = new AuthorizationBehaviour<NoAuthorizationAttributeRequest, Unit>
            (TestMock.UserNotExist, TestMock.UserAnonymous, _mockOkPermissionProvider.Object);
        Func<Task> call = async () => { await auth.Handle(new NoAuthorizationAttributeRequest(), next, CancellationToken.None); };
        await call.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [TestMethod]
    public async Task NoAuthorizationAttributeRequest_ValidUserNoPermission_Allow()
    {
        var auth = new AuthorizationBehaviour<NoAuthorizationAttributeRequest, Unit>
            (TestMock.UserExist, TestMock.UserViewer, _mockNoFoundPermissionProvider.Object);
        Func<Task> call = async () => { await auth.Handle(new NoAuthorizationAttributeRequest(), next, CancellationToken.None); };
        await call.Should().NotThrowAsync();
    }
    
    [TestMethod]
    public async Task NoAuthorizationAttributeRequest_ValidUserNoPermission_ButRemovedFromDatabase_NotAllow()
    {
        var auth = new AuthorizationBehaviour<NoAuthorizationAttributeRequest, Unit>
            (TestMock.UserNotExist, TestMock.UserViewer, _mockNoFoundPermissionProvider.Object);
        Func<Task> call = async () => { await auth.Handle(new NoAuthorizationAttributeRequest(), next, CancellationToken.None); };
        await call.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [TestMethod]
    public async Task NoAuthorizationAttributeRequest_ValidUserWithPermission_Allow()
    {
        var auth = new AuthorizationBehaviour<NoAuthorizationAttributeRequest, Unit>
            (TestMock.UserExist, TestMock.UserViewer, _mockOkPermissionProvider.Object);
        Func<Task> call = async () => { await auth.Handle(new NoAuthorizationAttributeRequest(), next, CancellationToken.None); };
        await call.Should().NotThrowAsync();
    }

    [TestMethod]
    public async Task AllowAnonymousAttributeRequest_Anonymous_Allow()
    {
        var auth = new AuthorizationBehaviour<AllowAnonymousAttributedRequest, Unit>
            (TestMock.UserNotExist, TestMock.UserAnonymous, _mockNoFoundPermissionProvider.Object);
        Func<Task> call = async () => { await auth.Handle(new AllowAnonymousAttributedRequest(), next, CancellationToken.None); };
        await call.Should().NotThrowAsync();
    }

    [TestMethod]
    public async Task PermissionAttributeRequest_Anonymous_NotAllow()
    {
        var auth = new AuthorizationBehaviour<HasPermissionAttributedRequest, Unit>
            (TestMock.UserNotExist, TestMock.UserAnonymous, _mockOkPermissionProvider.Object);
        Func<Task> call = async () => { await auth.Handle(new HasPermissionAttributedRequest(), next, CancellationToken.None); };
        await call.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [TestMethod]
    public async Task PermissionAttributeRequest_ValidUserNoPermission_NotAllow()
    {
        var auth = new AuthorizationBehaviour<HasPermissionAttributedRequest, Unit>
            (TestMock.UserExist, TestMock.UserViewer, _mockNoFoundPermissionProvider.Object);
        Func<Task> call = async () => { await auth.Handle(new HasPermissionAttributedRequest(), next, CancellationToken.None); };
        await call.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [TestMethod]
    public async Task PermissionAttributeRequest_ValidUserWithPermission_Allow()
    {
        var auth = new AuthorizationBehaviour<HasPermissionAttributedRequest, Unit>
            (TestMock.UserExist, TestMock.UserViewer, _mockOkPermissionProvider.Object);
        Func<Task> call = async () => { await auth.Handle(new HasPermissionAttributedRequest(), next, CancellationToken.None); };
        await call.Should().NotThrowAsync();
    }
    
   
    [TestMethod]
    public async Task CurrentUserChangingHimself_DoesNotHaveUserId_Throw()
    {
        var auth = new AuthorizationBehaviour<UserChangingHimself_Ivalid_Request, Unit>
            (TestMock.UserExist, TestMock.UserViewer, _mockOkPermissionProvider.Object);
        Func<Task> call = async () =>
        {
            await auth.Handle(new UserChangingHimself_Ivalid_Request(), next, CancellationToken.None);
        };
        await call.Should().ThrowAsync<InvalidOperationException>();
    }
    
    [TestMethod]
    public async Task CurrentUserChangingHimself_EmptyUserId_Throw()
    {
        var auth = new AuthorizationBehaviour<UserChangingHimselfRequest, Unit>
            (TestMock.UserExist, TestMock.UserViewer, _mockOkPermissionProvider.Object);
        Func<Task> call = async () =>
        {
            await auth.Handle(new UserChangingHimselfRequest(""), next, CancellationToken.None);
        };
        await call.Should().ThrowAsync<InvalidOperationException>();
    }
    
    [TestMethod]
    public async Task CurrentUserChangingHimself_WrongUserId_Throw()
    {
        var auth = new AuthorizationBehaviour<UserChangingHimselfRequest, Unit>
            (TestMock.UserExist, TestMock.UserViewer, _mockNoFoundPermissionProvider.Object);
        Func<Task> call = async () =>
        {
            await auth.Handle(new UserChangingHimselfRequest("some other user id"), next, CancellationToken.None);
        };
        await call.Should().ThrowAsync<UnauthorizedAccessException>();
    }
    
    [TestMethod]
    public async Task CurrentUserChangingHimself_CurrentUser_Allow()
    {
        var auth = new AuthorizationBehaviour<UserChangingHimselfRequest, Unit>
            (TestMock.UserExist, TestMock.UserViewer, _mockNoFoundPermissionProvider.Object);
        Func<Task> call = async () =>
        {
            await auth.Handle(new UserChangingHimselfRequest(TestMock.UserViewer.UserId!), next, CancellationToken.None);
        };
        await call.Should().NotThrowAsync();
    }
    
    [TestMethod]
    public async Task UserChangingHimself_OnlyPermission_Allow()
    {
        var auth = new AuthorizationBehaviour<UserChangingHimselfRequest, Unit>
            (TestMock.UserExist, TestMock.UserViewer, _mockOkPermissionProvider.Object);
        Func<Task> call = async () =>
        {
            await auth.Handle(
                new UserChangingHimselfRequest("some other user"),
                next, CancellationToken.None);
        };
        await call.Should().NotThrowAsync();
    }
    
    [TestMethod]
    public async Task UserChangingHimself_OnlyUser_Allow()
    {
        var auth = new AuthorizationBehaviour<UserChangingHimselfRequest, Unit>
            (TestMock.UserExist, TestMock.UserViewer, _mockNoFoundPermissionProvider.Object);
        Func<Task> call = async () =>
        {
            await auth.Handle(
                new UserChangingHimselfRequest(TestMock.UserViewer.UserId!),
                next, CancellationToken.None);
        };
        await call.Should().NotThrowAsync();
    }
    
    [TestMethod]
    public async Task UserChangingHimself_Both_Allow()
    {
        var auth = new AuthorizationBehaviour<UserChangingHimselfRequest, Unit>
            (TestMock.UserExist, TestMock.UserViewer, _mockOkPermissionProvider.Object);
        Func<Task> call = async () =>
        {
            await auth.Handle(
                new UserChangingHimselfRequest(TestMock.UserViewer.UserId!),
                next, CancellationToken.None);
        };
        await call.Should().NotThrowAsync();
    }
    

}
