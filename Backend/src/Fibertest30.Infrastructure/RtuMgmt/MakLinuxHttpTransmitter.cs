using Iit.Fibertest.Dto;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Text;

namespace Fibertest30.Infrastructure;
public class MakLinuxHttpTransmitter : IRtuTransmitter
{
    private readonly ILogger<MakLinuxHttpTransmitter> _logger;

    private static readonly HttpClient _httpClient = new();
    private static readonly JsonSerializerSettings _jsonSerializerSettings =
        new() { TypeNameHandling = TypeNameHandling.All };

    public MakLinuxHttpTransmitter(ILogger<MakLinuxHttpTransmitter> logger)
    {
        _logger = logger;
    }


    public async Task<RtuConnectionCheckedDto> CheckRtuConnection(NetAddress netAddress, CancellationToken cancellationToken)
    {
        if (netAddress.Port == -1) netAddress.Port = (int)TcpPorts.RtuListenToHttp;
        var result = await SendCheck(netAddress, cancellationToken);

        return result;

        // когда-нибудь добавим RTU4000, виндовозные МАКи не получится, они ждут WCF запросы
        
    }

    private async Task<RtuConnectionCheckedDto> SendCheck(NetAddress netAddress, CancellationToken cancellationToken)
    {
        var result = new RtuConnectionCheckedDto
        {
            NetAddress = netAddress.Clone(),
        };

        var uri = $"http://{netAddress.ToStringA()}/rtu/current-state";
        var request = new HttpRequestMessage(new HttpMethod("GET"), uri);
        try
        {
            var _ = await _httpClient.SendAsync(request, cancellationToken);
            // just a fact of successful sending
            result.IsConnectionSuccessfull = true;
        }
        catch (Exception e)
        {
            result.IsConnectionSuccessfull = false;
            _logger.LogError(e, $"CheckRtuConnection: {e.Message}");
        }

        return result;
    }

    // не надо здесь кидать exception, идет поллинг кучи рту каждую секунду в логе будет мусор
    public async Task<RtuCurrentStateDto> GetRtuCurrentState(GetCurrentRtuStateDto dto)
    {
        var uri = $"http://{dto.RtuDoubleAddress.Main.ToStringA()}/rtu/current-state";
        var json = JsonConvert.SerializeObject(dto, _jsonSerializerSettings);
        var request = CreateRequestMessage(uri, "post", "application/merge-patch+json", json);
        try
        {
            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                return new RtuCurrentStateDto(ReturnCode.D2RHttpError);
            }

            var responseJson = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<RtuCurrentStateDto>(responseJson, _jsonSerializerSettings);
            if (result == null)
            {
                return new RtuCurrentStateDto(ReturnCode.DeserializationError);
            }
            return result;
        }
        catch (Exception e)
        {
            return new RtuCurrentStateDto(ReturnCode.D2RHttpError);
        }
    }

    public async Task<TResult> SendCommand<T, TResult>(T dto, DoubleAddress rtuDoubleAddress) where TResult : RequestAnswer, new()
    {
        var uri = $"http://{rtuDoubleAddress.Main.ToStringA()}/rtu/do-operation";
        var json = JsonConvert.SerializeObject(dto, _jsonSerializerSettings);
        var request = CreateRequestMessage(uri, "post", "application/merge-patch+json", json);
        try
        {
            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
                throw new FailedToConnectRtuException("StatusCode: {response.StatusCode}; \" + response.ReasonPhrase");

            var responseJson = await response.Content.ReadAsStringAsync();
            var result = JsonConvert.DeserializeObject<TResult>(responseJson);
            if (result == null)
                throw new DeserializationException(responseJson);
            return result;
        }
        catch (Exception e)
        {
            throw new FailedToConnectRtuException(e.Message);
        }
    }

    private HttpRequestMessage CreateRequestMessage(string url, string method,
        string contentRepresentationType, string? jsonData = null)
    {
        var request = new HttpRequestMessage(new HttpMethod(method.ToUpper()), url);
        if (jsonData != null)
            request.Content = new StringContent(jsonData, Encoding.UTF8, contentRepresentationType);
        return request;
    }
}
