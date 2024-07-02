namespace Rfts.ConsoleSchedulerModeler;

public class CommandLine
{
    private List<string> _cmdArgs;
    public CommandLine(string[] args)
    {
        _cmdArgs = args.ToList();
    }

    public bool HasAnyArgument()
    {
        return _cmdArgs.Count != 0;
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
        var argIndex = _cmdArgs.IndexOf(argumentName);
        if (argIndex >= 0 && argIndex + 1 < _cmdArgs.Count)
        {
            var value = _cmdArgs[argIndex + 1];
            _cmdArgs.RemoveRange(argIndex, 2); // remove the argument and its value
            return value;
        }

        return defaultValue;
    }
}