using Iit.Fibertest.StringResources;
using MigraDoc.DocumentObjectModel;

public static class PdfExt
{
    public static void SetLandscapeFooter(Section section, string reportTitle)
    {
        var footerParagraph = section.Footers.Primary.AddParagraph();
        footerParagraph.Format.Font.Size = 9;
        footerParagraph.Format.Alignment = ParagraphAlignment.Justify;
        footerParagraph.Format.SpaceBefore = "0.5cm";

        var generationTimestamp = DateTime.Now;
        // Левая часть
        footerParagraph.AddText($"Fibertest 3.0 \u00A9 {reportTitle}");

        // Средняя часть
        footerParagraph.AddTab(); // первая табуляция (18см)
        footerParagraph.AddText($"{Resources.SID_created_} {generationTimestamp:dd.MM.yyyy HH:mm}");
            
        // Правая часть
        footerParagraph.AddTab(); // вторая табуляция (23см)
        footerParagraph.AddText(Resources.SID_Page_);
        footerParagraph.AddPageField();
        footerParagraph.AddText(" / ");
        footerParagraph.AddNumPagesField();

        // Настройка табуляции
        footerParagraph.Format.TabStops.ClearAll();
        footerParagraph.Format.TabStops.AddTabStop(Unit.FromCentimeter(18), TabAlignment.Left);
        footerParagraph.Format.TabStops.AddTabStop(Unit.FromCentimeter(23), TabAlignment.Left);
    }
}