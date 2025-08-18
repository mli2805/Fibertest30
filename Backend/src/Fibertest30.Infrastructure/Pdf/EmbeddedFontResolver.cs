using PdfSharp.Fonts;
using System.Reflection;

namespace Fibertest30.Infrastructure;

public class EmbeddedFontResolver : IFontResolver
{
    public string DefaultFontName => "Arial";

    public byte[] GetFont(string faceName)
    {
        string resourceName;
        
        // Определяем какой файл шрифта нужно загрузить
        if (faceName.EndsWith("-BoldItalic"))
            resourceName = "Fibertest30.Infrastructure.assets.Fonts.ArialBoldItalic.ttf";
        else if (faceName.EndsWith("-Bold"))
            resourceName = "Fibertest30.Infrastructure.assets.Fonts.ArialBold.ttf"; 
        else if (faceName.EndsWith("-Italic"))
            resourceName = "Fibertest30.Infrastructure.assets.Fonts.ArialItalic.ttf"; 
        else
            resourceName = "Fibertest30.Infrastructure.assets.Fonts.ArialRegular.ttf";

        using var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName);
        if (stream == null)
            throw new InvalidOperationException($"Failed to find embedded font: {resourceName}");

        using var ms = new MemoryStream();
        stream.CopyTo(ms);
        return ms.ToArray();
    }


    public FontResolverInfo ResolveTypeface(string familyName, bool isBold, bool isItalic)
    {
        string fontName;
        
        if (isBold && isItalic)
            fontName = "Arial-BoldItalic";
        else if (isBold)
            fontName = "Arial-Bold";
        else if (isItalic)
            fontName = "Arial-Italic";
        else
            fontName = "Arial";

        return new FontResolverInfo(fontName);
    }
}

