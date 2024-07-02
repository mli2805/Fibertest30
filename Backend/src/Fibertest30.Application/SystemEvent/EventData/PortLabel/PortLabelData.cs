namespace Fibertest30.Application;

public class PortLabelData
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string HexColor { get; set; } = string.Empty;
    
    public PortLabelData(int id, string name, string hexColor)
    {
        Id = id;
        Name = name;
        HexColor = hexColor;
    }
}

public static class PortLabelDataExtensions
{
    public static PortLabelData ToPortLabelData(this PortLabel portLabel)
    {
        return new PortLabelData(portLabel.Id, portLabel.Name, portLabel.HexColor);
    }
}