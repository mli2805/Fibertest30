using Newtonsoft.Json;

namespace Iit.Fibertest.Graph;
public static class ModelJsonSerializationExt
{
    /// <summary>
    /// Reads an object instance from an Json file.
    /// <para>Object type must have a parameterless constructor.</para>
    /// </summary>
    /// <param name="filePath">The file path to read the object instance from.</param>
    /// <returns>Returns a new instance of the object read from the Json file.</returns>
    public static Model? ReadFromJsonFile(string filePath)
    {
        TextReader? reader = null;
        try
        {
            reader = new StreamReader(filePath);
            var fileContents = reader.ReadToEnd();
            return JsonConvert.DeserializeObject<Model>(fileContents);
        }
        finally
        {
            if (reader != null)
                reader.Close();
        }
    }
}
