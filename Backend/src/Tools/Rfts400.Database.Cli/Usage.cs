namespace Fibertest30.Database.Cli;

public static class Usage
{
    public static readonly string Text = @"
Description:
    'rftsdb' is a tool designed to create Rfts400 database filled with emulated historical data,
     primarily for performance testing purpose.
    
    User can specify which port to add historical data for and for how long.

    Data for all specified ports is filled from a starting past datetime to the present moment. 

    For instance, using the parameters '--monitoring 1:1d --monitoring 2:1mo', 
    the tool calculates the start measurements date as one month prior to the present moment. 
    It will then populate data for ports 1 and 2 beginning from this date. 
    Port 1 will have data for the first day, and Port 2 will continue to receive data for the remaining 29 days.

    This setup ensures that ports with shorter durations are close towards the past,
    facilitating performance testing for queries targeting older data.

Usage:
       rftsdb [options]

Options:
       --output <file>                  Specifies the output file (default: rfts400.db).

       --monitoring <port>:<duration>    Add emulated monitoring historical data for a port with specified duration. 

       --measurement-time <duration>     Emulate measurement duration (default: 5s). 

       --sor                            Add real SOR data to the database (instead of an empty byte array).

       --seed-demo-users                Seed demo users to the database.

       --rm                             Remove existing database file.

       --analyze                        Run ANALYZE command on the database.

       --batch-size                     Specifies the batch size for adding the monitoring history data (default: 1000).

       Port for --monitoring should be in the range [1, 8].

       Duration for --monitoring and --measurement-time should be in one of the following time units:
            's'  - second
            'm'  - minute
            'h'  - hour
            'd'  - day
            'w'  - week
            'mo' - month
            'y'  - year

Example:
       # Create the 'rfts400.db' database file in the 'data' directory with 1 day of 10-seconds monitoring results for port 1.
       rftsdb --output data/rfts400.db --monitoring-history 1:1d --sor --measurement-time 10s
";
}