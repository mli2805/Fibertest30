using PdfSharp.Pdf;
using MigraDoc.DocumentObjectModel;
using MigraDoc.DocumentObjectModel.Tables;
using MigraDoc.Rendering;
using Iit.Fibertest.StringResources;
using PdfSharp.Fonts;
using System.Globalization;

namespace Fibertest30.Infrastructure
{

    public class UserActionsReportGenerator
    {
        public PdfDocument GenerateReport(List<UserActionLine> logLines, string userCulture)
        {
            var culture = new CultureInfo(userCulture); 
            // Установка культуры для текущего потока
            // Thread.CurrentThread.CurrentCulture = culture; // не влияет
            Thread.CurrentThread.CurrentUICulture = culture;

            var reportTitle = Resources.SID_User_operations_log;
            var document = new Document { Info = { Title = reportTitle } };

            var section = document.AddSection();
            section.PageSetup.Orientation = Orientation.Landscape;
            section.PageSetup.PageFormat = PageFormat.A4;
            section.PageSetup.LeftMargin = Unit.FromCentimeter(2);
            section.PageSetup.TopMargin = Unit.FromCentimeter(0.5);
            section.PageSetup.RightMargin = Unit.FromCentimeter(1);
            section.PageSetup.BottomMargin = Unit.FromCentimeter(1.5);
            section.PageSetup.FooterDistance = Unit.FromCentimeter(0.5);

            // Заголовок
            var title = section.AddParagraph(reportTitle);
            title.Format.Font.Size = 16;
            title.Format.Font.Bold = true;
            title.Format.SpaceAfter = "1cm";
            title.Format.Alignment = ParagraphAlignment.Center;

            // Таблица
            var table = section.AddTable();
            table.Borders.Width = 0.5;
            table.Rows.LeftIndent = 0;

            // Определение колонок
            string[] headers = [
                Resources.SID_Number, 
                Resources.SID_User, 
                Resources.SID_Client_Ip, 
                Resources.SID_Date, 
                Resources.SID_Operation, 
                "RTU", 
                Resources.SID_Trace, 
                Resources.SID_Additional_info];
            table.AddColumn(@"1cm").Format.Alignment = ParagraphAlignment.Center;
            table.AddColumn(@"3cm").Format.Alignment = ParagraphAlignment.Center;
            table.AddColumn(@"3cm").Format.Alignment = ParagraphAlignment.Center;
            table.AddColumn(@"2.5cm").Format.Alignment = ParagraphAlignment.Center;
            table.AddColumn(@"4.5cm").Format.Alignment = ParagraphAlignment.Center;
            table.AddColumn(@"3.0cm").Format.Alignment = ParagraphAlignment.Center;
            table.AddColumn(@"4cm").Format.Alignment = ParagraphAlignment.Center;
            table.AddColumn(@"6cm").Format.Alignment = ParagraphAlignment.Center;

            // Заголовок таблицы
            var headerRow = table.AddRow();
            headerRow.Format.Font.Bold = true;
            headerRow.Height = Unit.FromCentimeter(1);
            headerRow.HeightRule = RowHeightRule.AtLeast;
            headerRow.VerticalAlignment = VerticalAlignment.Center;

            for (int i = 0; i < headers.Length; i++)
                headerRow.Cells[i].AddParagraph(headers[i]);

            // Данные
            foreach (var log in logLines)
            {
                var row = table.AddRow();
                row.VerticalAlignment = VerticalAlignment.Center;
                row.Cells[0].AddParagraph(log.Ordinal.ToString());
                row.Cells[1].AddParagraph(log.Username);
                row.Cells[2].AddParagraph(log.ClientIp ?? "");
                //row.Cells[3].AddParagraph(log.Timestamp.ToString("dd.MM.yyyy HH:mm:ss"));
                row.Cells[3].AddParagraph(log.Timestamp.ToString(CultureInfo.CurrentUICulture));
                row.Cells[4].AddParagraph(log.OperationName);
                row.Cells[5].AddParagraph(log.RtuTitle ?? "");
                row.Cells[6].AddParagraph(log.TraceTitle ?? "");
                row.Cells[7].AddParagraph(log.GetLocalizedAdditionalInfo());
            }

            // Нижний колонтитул
            var footerParagraph = section.Footers.Primary.AddParagraph();
            footerParagraph.Format.Font.Size = 9;
            footerParagraph.Format.Alignment = ParagraphAlignment.Justify;
            footerParagraph.Format.SpaceBefore = "0.5cm";

            var generationTimestamp = DateTime.Now;
            // Левая часть
            footerParagraph.AddText($"Fibertest 3.0 \u00A9 {reportTitle} {generationTimestamp:dd.MM.yyyy HH:mm}");

            // Пробелы для выравнивания
            footerParagraph.AddTab(); // добавим табуляцию
            footerParagraph.AddTab(); // можно добавить несколько, если нужно

            // Правая часть
            footerParagraph.AddText("Страница ");
            footerParagraph.AddPageField();
            footerParagraph.AddText(" / ");
            footerParagraph.AddNumPagesField();

            // Настройка табуляции
            footerParagraph.Format.TabStops.ClearAll();
            footerParagraph.Format.TabStops.AddTabStop(Unit.FromCentimeter(23), TabAlignment.Right);

            // Рендеринг
            var renderer = new PdfDocumentRenderer() { Document = document };
            GlobalFontSettings.FontResolver = new EmbeddedFontResolver();
            renderer.RenderDocument();

            return renderer.PdfDocument;
        }
    }
}
