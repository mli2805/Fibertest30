namespace Fibertest30.Application.UnitTests;

[TestClass]
public class RefreshTokenQueryTests
{
    [TestMethod]
    public async Task AuthenticatedLocally_CanRefreshToken()
    {
        var handler = new RefreshTokenQueryHandler(TestMock.UserViewer
            , TestMock.UserManagerViewer
            , TestMock.JwtTokenGenerator);

        var newToken = await handler.Handle(new RefreshTokenQuery(), CancellationToken.None);
        newToken.Should().Be("valid_token");
    }
    
    [TestMethod]
    public async Task AuthenticatedExternally_ForbidToRefreshToken()
    {
        var handler = new RefreshTokenQueryHandler(TestMock.UserViewer
            , TestMock.UserManagerNoUser
            , TestMock.JwtTokenGenerator);

       
        Func<Task> call = async () => { await handler.Handle(new RefreshTokenQuery(), CancellationToken.None); };
        await call.Should().ThrowAsync<Exception>();
    }
}