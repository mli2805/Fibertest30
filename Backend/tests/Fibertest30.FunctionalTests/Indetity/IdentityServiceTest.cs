using Grpc.Core;
using Microsoft.IdentityModel.JsonWebTokens;
using Fibertest30.Api;

namespace Fibertest30.FunctionalTests;

[TestClass]
public class IdentityServiceTest : TestClientBase
{
    [TestMethod]
    public async Task TestUsersCanLogin()
    {
        var defaultPermissionProvider =  new DefaultPermissionProvider();
        foreach (var testUser in TestUsersProvider.TestUsers)
        {
            var response = await _identityClient.LoginAsync(new LoginRequest() { 
                UserName = testUser.UserName.ToString(), 
                Password = TestUsersProvider.DefaultAdminPassword
            });  
            
            response.Allow.Should().BeTrue();
            response.Token.Should().NotBeNullOrEmpty();
            var token = new JsonWebToken(response.Token);
            token.GetClaim(ApplicationClaims.Role).Value.Should().Be(testUser.Role.ToString());
            response.User.Permissions.ToList().Should()
                .Equal(defaultPermissionProvider
                    .GetDefaultRolePermissions(testUser.Role)
                    .Select(x => x.ToString()).ToList());

        }
    }

    [TestMethod]
    public async Task UnknownUser_CantLogin()
    {
        var response = await _identityClient.LoginAsync(new LoginRequest() { 
            UserName = "unknown", 
            Password = "password"
        });   
        
        response.Allow.Should().BeFalse();   
        response.Token.Should().BeEmpty();
        response.User.Should().BeNull();
    }

    [TestMethod]
    public async Task AuthenticatedUser_CanRefreshToken()
    {
        var login = await LoginAsViewer();

        var response = await _identityClient.RefreshTokenAsync(new RefreshTokenRequest(), GetAuthMetadata(login.Token));
        response.Token.Should().NotBeNullOrEmpty();
    }
    [TestMethod]
    public async Task ExpiredToken_AreNotValidatedInTests()
    {
        // see TestDateTime class for explanation why we disable token validation lifetime in tests       

        _dateTime.UtcNow = DateTime.UtcNow.AddYears(-1);
        var login = await LoginAsViewer(); // here the token expiration is 1 year ago

        Func<Task> call = async () =>
        {
            await _identityClient.RefreshTokenAsync(new RefreshTokenRequest(), 
                GetAuthMetadata(login.Token));
        };
        
        await call.Should().NotThrowAsync(); // as lifetime validation is disabled in tests
    }
    
}