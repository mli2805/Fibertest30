﻿using Microsoft.Extensions.Configuration;
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
    private readonly MySerializer _mySerializer;
    private string EventSourcingScheme => "ft20graph";
    public string EventSourcingConnectionString { get; init; }

    // for creation new database - without Database=xxxx
    public string ConnectionStringForCreation { get; init; }

    private string LinuxMysqlPath { get; init; }

    public Guid StreamIdOriginal { get; set; } = Guid.Empty;
    public IStoreEvents? StoreEvents { get; set; }

    public IEventStream EventStream { get; set; } = null!;


    public EventStoreInitializer(ILogger<EventStoreInitializer> logger, IConfiguration configuration, 
        MySerializer mySerializer)
    {
        _logger = logger;
        _mySerializer = mySerializer;

        // этот же шаблон из конфига ещё используется для конфигурации доступа ко 2й части бд,
        // см Fibertest30.Infrastructure.ConfigureServices
        var mySqlAddress = configuration["MySqlServerAddress"] ?? "localhost";
        var mySqlPort = configuration["MySqlServerPort"] ?? "3306";
        var fullDbTemplate = "server={0};port={1};user id=root;password=root";
        ConnectionStringForCreation = string.Format(fullDbTemplate, mySqlAddress, mySqlPort);
        var schemeDbTemplate = "server={0};port={1};user id=root;password=root;database={2}";
        EventSourcingConnectionString = string.Format(schemeDbTemplate, mySqlAddress, mySqlPort, EventSourcingScheme);

        LinuxMysqlPath = configuration["LinuxMysqlPath"] ?? "";
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

            EventStream = StoreEvents.OpenStream(StreamIdOriginal);
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
            MySqlConnection connection = new MySqlConnection(ConnectionStringForCreation);
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

    public async Task<Guid> GetStreamId()
    {
        if (StreamIdOriginal != Guid.Empty) return StreamIdOriginal;

        bool isWindows = RuntimeInformation.IsOSPlatform(OSPlatform.Windows);

        return isWindows ? GetByMysqlCommand() : await GetStreamIdOnLinuxByScript();
    }

    /// <summary>
    /// запускать под линуксом, когда уже известно что бд ft20graph существует
    /// 
    /// "mysql -uroot -proot ft20graph -e \"select StreamIdOriginal from Commits limit 1\"";
    /// исполнить как команду /bash/sh -c command - не удалось (хотя из ком строки нормально выполняется),
    /// а вот выполнить скрипт можно /bash/sh ab.sh
    /// </summary>
    /// <returns></returns>
    private async Task<Guid> GetStreamIdOnLinuxByScript()
    {
        var res = ShellCommand.GetCommandLineOutput("whoami");
        _logger.LogInformation($"user is {res}");

        var res1 = ShellCommand.GetCommandLineOutput("echo $PATH");
        _logger.LogInformation($" {res1}");


        // эксперимент с "апгрейдом сервиса"
        // т.е. вывод скрипта идет в отдельный файл, 
        //  прога читает по мере появления нового в файле
        // в какой-то момент скрип погасит прогу
        // try
        // {
        //     var upgradeService = _serviceProvider.GetRequiredService<IUpgradeService>();
        //     upgradeService.Start();
        // }
        // catch (Exception e)
        // {
        //     _logger.LogError(e.Message);
        // }



        string scriptFilename = "getStreamId.sh";

        //  на виртуалке deb12office работает и без пути, потому что mysql установил стандартно
        // и mysqld лег в стандартный каталог /usr/sbin  данные бд - /var/lib/mysql
        // после установки/копирования на виртуалке deb12office удалить в appsettings.json эту переменную
        // var command = $"{LinuxMysqlPath}mysql -uroot -proot ft20graph -e \"select StreamIdOriginal from Commits limit 1\"";
        var command = "mysql -uroot -proot ft20graph -e \"select StreamIdOriginal from Commits limit 1\"";
        await File.WriteAllTextAsync(scriptFilename, command);
        await Task.Delay(300);

        var chmod = $"chmod 775 {scriptFilename}";
        ShellCommand.GetCommandLineOutput(chmod);
        await Task.Delay(300);

        var output = ShellCommand.GetScriptOutput(scriptFilename);
        _logger.LogInformation(output);
        var lines = output.Split('\n');
        _logger.LogInformation($"got {lines.Length} lines ");
        var streamIdOriginal = Guid.Parse(lines[1]);
        _logger.LogInformation($"StreamIdOriginal is {streamIdOriginal}");

        // var remove = $"rm {scriptFilename}";
        // ShellCommand.GetCommandLineOutput(remove);
        return streamIdOriginal;
    }

    // запускать под виндой (под линуксом не срабатывает)
    private Guid GetByMysqlCommand()
    {
        // string commandText = $"SELECT StreamIdOriginal FROM {EventSourcingScheme}.Commits LIMIT 1;";
        string commandText = $"SELECT StreamIdOriginal FROM Commits LIMIT 1;";
        try
        {
            MySqlConnection connection = new MySqlConnection(EventSourcingConnectionString);
            connection.Open();
            _logger.LogInformation($"Get StreamIdOriginal by command {commandText}");
            MySqlCommand command = new MySqlCommand(commandText, connection);

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
            _logger.LogError("GetByMysqlCommand: " + e.Message);
            return Guid.Empty;
        }
    }

    public bool IsFt20GraphExists()
    {
        try
        {
            MySqlConnection connection = new MySqlConnection(EventSourcingConnectionString);
            connection.Open();
            connection.Close();
            Thread.Sleep(TimeSpan.FromMilliseconds(100));
            _logger.LogInformation($"Connection open successfully: {EventSourcingConnectionString}");
            return true;
        }
        catch (Exception e)
        {
            if (e.Message == "Unknown database 'ft20graph'")
            {
                _logger.LogWarning("IsFt20GraphExists: " + e.Message);
            }
            else
            {
                _logger.LogError("IsFt20GraphExists: " + e.Message);

            }
            return false;
        }
    }
}
