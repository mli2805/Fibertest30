using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MySqlConnector;
using NEventStore;
using NEventStore.Persistence.Sql.SqlDialects;
using System.Data.Common;
using System.Runtime.InteropServices;

namespace Fibertest30.Infrastructure;
public class EventStoreInitializer
{
    private readonly ILogger<EventStoreInitializer> _logger;
    private readonly IConfiguration _configuration;
    private readonly MySerializer _mySerializer;
    private string EventSourcingScheme => "ft20graph";
    public string EventSourcingConnectionString { get; init; }


    public Guid StreamIdOriginal { get; set; } = Guid.Empty;
    public IStoreEvents? StoreEvents { get; set; }


    public EventStoreInitializer(ILogger<EventStoreInitializer> logger, IConfiguration configuration, MySerializer mySerializer)
    {
        _logger = logger;
        _configuration = configuration;
        _mySerializer = mySerializer;

        // этот же шаблон из конфига ещё используется для конфигурации доступа ко 2й части бд,
        // см Fibertest30.Infrastructure.ConfigureServices
        var conStrTemplate = _configuration["MySqlConnectionString"]
                         ?? "server=localhost;port=3306;user id=root;password=root;database={0}";
        EventSourcingConnectionString = string.Format(conStrTemplate, EventSourcingScheme);
    }

    public void Init()
    {
        CreateDatabaseIfNotExists(); 
        try
        {
            DbProviderFactories.RegisterFactory("AnyNameYouWant", MySqlConnectorFactory.Instance);
            var providerFactory = DbProviderFactories.GetFactory("AnyNameYouWant");

            StoreEvents = Wireup.Init()
                .UsingSqlPersistence(providerFactory, $"{EventSourcingConnectionString}") 
                .WithDialect(new MySqlDialect())
                .InitializeStorageEngine()
                .UsingCustomSerialization(_mySerializer)
                .Build();
        }
        catch (Exception e)
        {
            _logger.LogError("MySqlEventStoreInitializer exception : " + e.Message);
            throw;
        }
    }

    private void CreateDatabaseIfNotExists()
    {
        try
        {
            MySqlConnection connection = new MySqlConnection(EventSourcingConnectionString);
            MySqlCommand command = new MySqlCommand($"create database if not exists {EventSourcingScheme};", connection);
            connection.Open();
            command.ExecuteNonQuery();
            connection.Close();
            Thread.Sleep(TimeSpan.FromMilliseconds(100));
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            throw;
        }
    }

    public Guid GetStreamIdIfExists()
    {
        if (StreamIdOriginal != Guid.Empty) return StreamIdOriginal;

        bool isWindows = RuntimeInformation.IsOSPlatform(OSPlatform.Windows);
        var commandText = isWindows
            ? $"SELECT StreamIdOriginal FROM {EventSourcingScheme}.commits LIMIT 1;"
            : $"SELECT StreamIdOriginal FROM {EventSourcingScheme}.Сommits LIMIT 1;";

        if (isWindows) return GetByMysqlCommand(commandText);

        // под линуксом дает ошибку нет такой таблицы (не важно с большой или маленькой буквы задаешь)
        // поэтому временно делаем так - задаем в appsettings.json StreamIdOriginal

        string? ll = _configuration["StreamIdOriginal"];
        if (ll == null)
            return Guid.Empty;
        return Guid.TryParse(ll, out Guid r) ? r : Guid.Empty;
    }

    private Guid GetByMysqlCommand(string commandText)
    {
        try
        {
            MySqlConnection connection = new MySqlConnection(EventSourcingConnectionString);
            _logger.LogInformation($"Events store: {EventSourcingConnectionString}");
            MySqlCommand command = new MySqlCommand(commandText, connection);
            connection.Open();

            // метод ExecuteReader 
            var result = "";
            using var reader = command.ExecuteReader();
            while (reader.Read()) // limit 1 - 1 строка
            {
                result = reader.GetString(0);
            }

            // var result = (string)(command.ExecuteScalar() ?? 0);
            connection.Close();
            Thread.Sleep(TimeSpan.FromMilliseconds(100));
            StreamIdOriginal = Guid.Parse(result);
            _logger.LogInformation($"StreamIdOriginal is {StreamIdOriginal}");
            return StreamIdOriginal;
        }
        catch (Exception e)
        {
            _logger.LogError("GetStreamIdIfExists: " + e.Message);
            return Guid.Empty;
        }
    }
}
