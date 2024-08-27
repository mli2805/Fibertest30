using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Fibertest30.Infrastructure;

public class JwtTokenGenerator : IJwtTokenGenerator
{
    private readonly JwtSettings _jwtSettings;
    private readonly IDateTime _dateTime;
    private readonly IUserRolePermissionProvider _userRolePermissionProvider;

    public JwtTokenGenerator(
        IOptions<JwtSettings> jwtSettingsOptions,
        IDateTime dateTime,
        IUserRolePermissionProvider userRolePermissionProvider)
    {
        _jwtSettings = jwtSettingsOptions.Value;
        _dateTime = dateTime;
        _userRolePermissionProvider = userRolePermissionProvider;
    }

    public async Task<string> GenerateToken(ApplicationUser user)
    {
        if (user == null) { throw new ArgumentNullException(nameof(user)); }
        
        var userSingleRole = await _userRolePermissionProvider.GetUserSingleRole(user);

        var tokenClaims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        if (!string.IsNullOrEmpty(user.UserName))
        {
            tokenClaims.Add(new Claim(JwtRegisteredClaimNames.Name, user.UserName));
        }


        if (!string.IsNullOrEmpty(user.Email))
        {
            tokenClaims.Add(new Claim(JwtRegisteredClaimNames.Email, user.Email));
        }

        // add role claim
        tokenClaims.Add(new Claim(ApplicationClaims.Role, userSingleRole.Name));

        // let's not add permission claims to the token to not bloat it 

        var now = _dateTime.UtcNow;
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secretkey));
        var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var jwt = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: tokenClaims,
            notBefore: now,
            expires: now.AddMinutes(_jwtSettings.ExpireMinutes),
            signingCredentials: signingCredentials
            ) ;

        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }
}
