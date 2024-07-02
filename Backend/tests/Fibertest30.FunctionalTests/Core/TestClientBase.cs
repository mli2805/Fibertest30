using Grpc.Core;
using Grpc.Net.Client;
using Fibertest30.Api;
using Measurement = Fibertest30.Api.Measurement;

namespace Fibertest30.FunctionalTests;

public class TestClientBase
{
    protected Identity.IdentityClient _identityClient;
    protected Measurement.MeasurementClient _measurementClient;
    protected TestDateTime _dateTime = new TestDateTime();
    internal CustomWebApplicationFactory _factory;

    public static string ViewerUserName 
        => TestUsersProvider.GetFirstUserByRole(ApplicationDefaultRole.Viewer).UserName;
    
   
    public static Metadata GetAuthMetadata(string token)
    {
        var metadata = new Metadata();
        metadata.Add("Authorization", $"Bearer {token}");
        return metadata;
    }
    
    public TestClientBase()
    {
        _factory = new CustomWebApplicationFactory(_dateTime);

        var options = new GrpcChannelOptions { HttpHandler = _factory.Server.CreateHandler() };
        var channel = GrpcChannel.ForAddress(_factory.Server.BaseAddress, options);

        _identityClient = new Identity.IdentityClient(channel);
        _measurementClient = new Measurement.MeasurementClient(channel);

    }

    public async Task<LoginResponse> LoginAsAdmin()
    {
        return await DoLogin("Administrator", TestUsersProvider.DefaultAdminPassword);
    }
    
    public async Task<LoginResponse> LoginAsUser()
    {
        return await DoLogin("User", TestUsersProvider.DefaultAdminPassword);
    }
    
    public async Task<LoginResponse> LoginAsViewer()
    {
        return await DoLogin(ViewerUserName, TestUsersProvider.DefaultAdminPassword);
    }
    
    public async Task<LoginResponse> DoLogin(string userName, string password)
    {
        var response = await _identityClient.LoginAsync(new LoginRequest() { 
            UserName = userName, 
            Password = password
        });

        response.Allow.Should().BeTrue();
        
        return response;
    }
}