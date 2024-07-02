using Microsoft.AspNetCore.Identity;
using Moq;

namespace Fibertest30.Application.UnitTests;

public static class TestMock
{
    private static readonly Mock<IUsersRepository> _mockUserNotExist = new();
    private static readonly Mock<IUsersRepository> _mockUserExist = new();
    private static readonly Mock<ICurrentUserService> _mockUserAnonymous = new();
    private static readonly Mock<ICurrentUserService> _mockUserViewer = new();
    private static readonly Mock<UserManager<ApplicationUser>> _mockUserManagerViewer = CreateUserManagerMock();
    private static readonly Mock<UserManager<ApplicationUser>> _mockUserManagerNoUser = CreateUserManagerMock();
    private static readonly Mock<IJwtTokenGenerator> _mockJwtTokenGenerator = new();

    public static IUsersRepository UserExist => _mockUserExist.Object;
    public static IUsersRepository UserNotExist => _mockUserNotExist.Object;
    public static ICurrentUserService UserAnonymous => _mockUserAnonymous.Object;
    public static ICurrentUserService UserViewer => _mockUserViewer.Object;
    
    public static UserManager<ApplicationUser> UserManagerViewer => _mockUserManagerViewer.Object;
    public static UserManager<ApplicationUser> UserManagerNoUser => _mockUserManagerNoUser.Object;
    
    public static IJwtTokenGenerator JwtTokenGenerator => _mockJwtTokenGenerator.Object;



    static TestMock()
    {
        _mockUserExist.Setup(x => x.IsUserExist(It.IsAny<string>()))
            .Returns(() => Task.FromResult(true));
        
        _mockUserNotExist.Setup(x => x.IsUserExist(It.IsAny<string>()))
            .Returns(() => Task.FromResult(false));
        
        _mockUserViewer.SetupGet(x => x.UserId).Returns("userid_viewer");
        _mockUserViewer.SetupGet(x => x.Role).Returns(ApplicationDefaultRole.Viewer.ToString());
        
        // no need to setup _mockUserAnonymous, returns null by default
        
        _mockUserManagerViewer.Setup(x => x.FindByIdAsync(It.IsAny<string>()))
            .Returns<string>(id => Task.FromResult(new ApplicationUser() { Id = id })!);
        
        _mockJwtTokenGenerator.Setup(x => x.GenerateToken(It.IsAny<ApplicationUser>()))
            .Returns<ApplicationUser>(user => Task.FromResult("valid_token")!);
        
        // no need to setup _mockUserManagerNoUser, returns null by default
        
    }
    
    public static Mock<UserManager<ApplicationUser>> CreateUserManagerMock() 
    {
        var userStoreMock = new Mock<IUserStore<ApplicationUser>>();
        var userManagerMock = new Mock<UserManager<ApplicationUser>>(
            userStoreMock.Object, null, null, null, null, null, null, null, null);

        return userManagerMock;
    }
}