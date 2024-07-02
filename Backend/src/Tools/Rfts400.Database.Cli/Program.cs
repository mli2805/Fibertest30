
try
{
    var cmd = new CommandLine(args);
    var help = cmd.GetFlag("--help") || cmd.GetFlag("-h");
    var removeExisting = cmd.GetFlag("--rm");

    var createOptions = OptionParser.ParseCreate(cmd);
   
    if (help || cmd.HasAnyArgument())
    {
        if (cmd.HasAnyArgument())
        {
            Console.WriteLine($"Unknown command line argument: {cmd.GetUnparsed().First()}");
        }
        
        Console.WriteLine(Usage.Text);
        return;
    }

    var databasePath = createOptions.DatabaseOutputPath;

    if (File.Exists(databasePath))
    {
        Console.WriteLine($"Database {databasePath} already exist.");
        if (removeExisting)
        {
            Console.WriteLine($"Database {databasePath} removed.");
            File.Delete(databasePath);
        }
        else
        {
            return;
        }
    }

    var directoryPath = Path.GetDirectoryName(databasePath);
    if (!string.IsNullOrEmpty(directoryPath))
    {
        Directory.CreateDirectory(directoryPath);
    }
    
    var connectionString = $"Data Source={databasePath};Cache=Shared";
    var serviceProvider = Fibertest30.Database.Cli.ConfigureServices.CreateServiceProvider(connectionString);

    var databaseCreator = new DatabaseCreator(serviceProvider,createOptions);
    await databaseCreator.Run();
}
catch (Exception ex)
{
    Console.WriteLine("Error: " + ex.Message);
}

