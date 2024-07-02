namespace Fibertest30.Database.Cli;

public class CommandLine
{
    private readonly List<string> _cmdArgs;
    public CommandLine(string[] args)
    {
        _cmdArgs = args.ToList();
    }

    public bool HasAnyArgument()
    {
        return _cmdArgs.Count != 0;
    }
    
    public string GetFirstArgument()
    {
        if (_cmdArgs.Count > 0)
        {
            var arg = _cmdArgs[0];
            _cmdArgs.RemoveAt(0);
            return arg.ToLower();
        }

        return string.Empty;
    }

    public List<string> GetUnparsed()
    {
        return _cmdArgs;
    }
    
    public bool GetFlag(string name)
    {
        var flagIndex = _cmdArgs.IndexOf(name);
        if (flagIndex >= 0)
        {
            _cmdArgs.RemoveAt(flagIndex); 
            return true;
        }

        return false;
    }
    
    public string GetValue(string argumentName, string defaultValue)
    {
        var value = GetValue(argumentName);
        return value ?? defaultValue;
    }

    public int GetValue(string argumentName, int defaultValue)
    {
        var value = GetValue(argumentName);
        if (value == null) { return defaultValue; }
        
        return Convert.ToInt32(value);
    }

    public List<string> GetValueList(string argumentName)
    {
        List<string> values = new();
        while(GetValue(argumentName) is { } value)
        {
            values.Add(value);
        }
        return values;
    }
    
    public string? GetValue(string argumentName)
    {
        var argIndex = _cmdArgs.IndexOf(argumentName);
        if (argIndex >= 0 && argIndex + 1 < _cmdArgs.Count)
        {
            var value = _cmdArgs[argIndex + 1];
            _cmdArgs.RemoveRange(argIndex, 2); // remove the argument and its value
            return value;
        }

        return null;
    }
}