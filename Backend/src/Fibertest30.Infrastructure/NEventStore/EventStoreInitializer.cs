using Microsoft.Extensions.Logging;
using MySqlConnector;
using NEventStore;
using NEventStore.Persistence.Sql.SqlDialects;
using System.Data.Common;

namespace Fibertest30.Infrastructure;
public class EventStoreInitializer
{
    private readonly ILogger<EventStoreInitializer> _logger;
    private readonly MySerializer _mySerializer;
    private string EventSourcingScheme => "ft20graph";
    public string EventSourcingConnectionString => 
        $"server=localhost;port=3306;user id=root;password=root;database={EventSourcingScheme}";
    
    // такая же строка ещё используется для конфигурации доступа ко 2й части бд, см ConfigureServices
    private string FtConnectionString => 
        "server=localhost;port=3306;user id=root;password=root;database=ft20efcore";

    public Guid StreamIdOriginal { get; set; } = Guid.Empty;
    public IStoreEvents? StoreEvents { get; set; }


    public EventStoreInitializer(ILogger<EventStoreInitializer> logger, MySerializer mySerializer)
    {
        _logger = logger;
        _mySerializer = mySerializer;
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

            _logger.LogInformation("Events store: MYSQL=localhost:3306   Database=ft20graph");
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
            MySqlConnection connection = new MySqlConnection(FtConnectionString);
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

        try
        {
            MySqlConnection connection = new MySqlConnection(EventSourcingConnectionString);
            MySqlCommand command = new MySqlCommand(
                $"SELECT StreamIdOriginal FROM {EventSourcingScheme}.Сommits", connection);
            connection.Open();
            var result = (string)(command.ExecuteScalar() ?? 0);
            connection.Close();
            Thread.Sleep(TimeSpan.FromMilliseconds(100));
            StreamIdOriginal = Guid.Parse(result);
            return StreamIdOriginal;
        }
        catch (Exception e)
        {
            _logger.LogError("GetStreamIdIfExists: " + e.Message);
            return Guid.Empty;
        }

    }
}
