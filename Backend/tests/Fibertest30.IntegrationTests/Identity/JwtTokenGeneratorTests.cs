
using Microsoft.Extensions.Options;
using System.IdentityModel.Tokens.Jwt;

namespace Fibertest30.IntegrationTests;

[TestClass]
public class JwtTokenGeneratorTests : SqliteTestBase
{
    private IOptions<JwtSettings> _jwtSettingsOptions;

    public JwtTokenGeneratorTests()
    {
        _jwtSettingsOptions = Options.Create(new JwtSettings
        {
            Audience = "TestAudience",
            Issuer = "TestIssuer",
            Secretkey = "TestSecretKey123456789TestSecretKey123456789TestSecretKey123456789",
            ExpireMinutes = 60
        });
    }

    [TestMethod]
    public async Task GenerateToken()
    {
        await SeedUsingRtuContextInitializer();

        var jwtTokenGenerator = new JwtTokenGenerator(
            _jwtSettingsOptions, 
            TestMock.IDateTime.Object,
            new UserRolePermissionProvider(_permissionProvider, _userManager, _roleManager));

        var user = _userManager.Users.First();
        user.Email = "test@gmail.com";

        var roles = await _userManager.GetRolesAsync(user);
        var singleRole = roles.Single();
        
        var token = await jwtTokenGenerator.GenerateToken(user);
        var jwtToken = new JwtSecurityToken(token);

        jwtToken.Audiences.First().Should().Be(_jwtSettingsOptions.Value.Audience);
        jwtToken.Issuer.Should().Be(_jwtSettingsOptions.Value.Issuer);
        jwtToken.ValidFrom.Should().Be(TestMock.DateTime);
        jwtToken.ValidTo.Should().Be(TestMock.DateTime.AddMinutes(_jwtSettingsOptions.Value.ExpireMinutes));

        jwtToken.Subject.Should().Be(user.Id);
        jwtToken.Claims.Should().Contain(x => x.Type == JwtRegisteredClaimNames.Name && x.Value == user.UserName);
        jwtToken.Claims.Should().Contain(x => x.Type == JwtRegisteredClaimNames.Email && x.Value == user.Email);
        jwtToken.Claims.Should().Contain(x => x.Type == ApplicationClaims.Role && x.Value == singleRole);
    }
}
