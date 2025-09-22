using Iit.Fibertest.Graph;
using Iit.Fibertest.StringResources;
using MigraDoc.DocumentObjectModel;
using MigraDoc.DocumentObjectModel.Tables;
using MigraDoc.Rendering;
using PdfSharp.Fonts;
using PdfSharp.Pdf;
using System.Globalization;

namespace Fibertest30.Infrastructure
{
    public class CurrentOpticalEventsReportGenerator
    {
        public PdfDocument GenerateReport(List<MeasurementWrap> currentEvents, ServerInfo serverInfo, string userCulture)
        {
            var culture = new CultureInfo(userCulture); 
            // Установка культуры для текущего потока
            // Thread.CurrentThread.CurrentCulture = culture; // не влияет
            Thread.CurrentThread.CurrentUICulture = culture;

            var reportTitle = Resources.SID_Current_optical_events_report;
            var document = new Document { Info = { Title = reportTitle } };

            Section section = document.AddSection();
            section.PageSetup.Orientation = Orientation.Landscape;
            section.PageSetup.LeftMargin = Unit.FromCentimeter(2);
            section.PageSetup.RightMargin = Unit.FromCentimeter(1);
            section.PageSetup.TopMargin = Unit.FromCentimeter(0.5);
            section.PageSetup.BottomMargin = Unit.FromCentimeter(1.5);
            section.PageSetup.FooterDistance = Unit.FromCentimeter(0.5);

            section.PageSetup.DifferentFirstPageHeaderFooter = false;

            LetsGetStarted(section, reportTitle, serverInfo);

            DrawOpticalEventTable(section, currentEvents);

            PdfExt.SetLandscapeFooter(section, reportTitle);

            // Рендеринг
            var renderer = new PdfDocumentRenderer() { Document = document };
            GlobalFontSettings.FontResolver = new EmbeddedFontResolver();
            renderer.RenderDocument();

            return renderer.PdfDocument;
        }

        private void LetsGetStarted(Section section, string reportTitle, ServerInfo serverInfo)
        {
            var image = section.AddImage(@"assets/headers/header-landscape.png");
            image.LockAspectRatio = true;

            var paragraph = section.AddParagraph();
            paragraph.AddFormattedText(reportTitle, TextFormat.Bold);
            paragraph.Format.Font.Size = 20;
            paragraph.Format.SpaceBefore = Unit.FromCentimeter(1.0);

            var paragraph2 = section.AddParagraph();
            var software = string.Format(Resources.SID_software____0_, serverInfo.Version);
            var server = string.Format(Resources.SID_Server_____0_____1_____2_, serverInfo.Title, serverInfo.Address, software);
            paragraph2.AddFormattedText(server, TextFormat.Bold);
            paragraph2.Format.Font.Size = 14;
            paragraph2.Format.SpaceBefore = Unit.FromCentimeter(0.4);
        }

        private void DrawOpticalEventTable(Section section, List<MeasurementWrap> measurements)
        {
            var gap = section.AddParagraph();
            gap.Format.SpaceBefore = Unit.FromCentimeter(0.4);

            var table = DrawOpticalEventTableHeader(section);

            foreach (var measurement in measurements)
            {
                DrawOpticalEventRow(table, measurement);
            }
        }

        private static Table DrawOpticalEventTableHeader(Section section)
        {
            var table = section.AddTable();
            table.Borders.Width = 0.25;

            table.AddColumn(@"1.8cm").Format.Alignment = ParagraphAlignment.Left;
            table.AddColumn(@"3.5cm").Format.Alignment = ParagraphAlignment.Center;
            table.AddColumn(@"3.5cm").Format.Alignment = ParagraphAlignment.Center;
            table.AddColumn(@"4.5cm").Format.Alignment = ParagraphAlignment.Left;
            table.AddColumn(@"3.2cm").Format.Alignment = ParagraphAlignment.Left;
            table.AddColumn(@"3cm").Format.Alignment = ParagraphAlignment.Left;
            table.AddColumn(@"3.5cm").Format.Alignment = ParagraphAlignment.Center;
            table.AddColumn(@"4cm").Format.Alignment = ParagraphAlignment.Left;

            var headerRow1 = table.AddRow();
            headerRow1.HeadingFormat = true;
            headerRow1.Format.Alignment = ParagraphAlignment.Center;
            headerRow1.Format.Font.Bold = true;

            headerRow1.Cells[0].AddParagraph(Resources.SID_Event_Id);
            headerRow1.Cells[0].MergeDown = 1;
            headerRow1.Cells[0].VerticalAlignment = VerticalAlignment.Center;
            headerRow1.Cells[1].AddParagraph(Resources.SID_Time);
            headerRow1.Cells[1].MergeRight = 1;
            headerRow1.Cells[3].AddParagraph(Resources.SID_Trace);
            headerRow1.Cells[3].MergeDown = 1;
            headerRow1.Cells[3].VerticalAlignment = VerticalAlignment.Center;
            headerRow1.Cells[4].AddParagraph(Resources.SID_Trace_state);
            headerRow1.Cells[4].MergeDown = 1;
            headerRow1.Cells[4].VerticalAlignment = VerticalAlignment.Center;
            headerRow1.Cells[5].AddParagraph(Resources.SID_Event_status);
            headerRow1.Cells[5].MergeDown = 1;
            headerRow1.Cells[5].VerticalAlignment = VerticalAlignment.Center;
            headerRow1.Cells[6].AddParagraph(Resources.SID_Status_set);
            headerRow1.Cells[6].MergeRight = 1;

            var headerRow2 = table.AddRow();
            headerRow2.HeadingFormat = true;
            headerRow2.Format.Alignment = ParagraphAlignment.Center;
            headerRow2.Format.Font.Bold = true;

            headerRow2.Cells[1].AddParagraph(Resources.SID_measurement_finished);
            headerRow2.Cells[2].AddParagraph(Resources.SID_event_registered);
            headerRow2.Cells[6].AddParagraph(Resources.SID_Time);
            headerRow2.Cells[6].VerticalAlignment = VerticalAlignment.Center;
            headerRow2.Cells[7].AddParagraph(Resources.SID_User);
            headerRow2.Cells[7].VerticalAlignment = VerticalAlignment.Center;
            return table;
        }

        private void DrawOpticalEventRow(Table table, MeasurementWrap wrap)
        {
            var row = table.AddRow();
            row.HeightRule = RowHeightRule.Auto;
            row.Height = Unit.FromCentimeter(0.8);
            row.VerticalAlignment = VerticalAlignment.Center;
            row.Cells[0].AddParagraph(wrap.Measurement.SorFileId.ToString());
            var measurementTime = $@"{wrap.Measurement.MeasurementTimestamp:G}";
            row.Cells[1].AddParagraph(measurementTime);
            var registrationTime = $@"{wrap.Measurement.EventRegistrationTimestamp:G}";
            row.Cells[2].AddParagraph(registrationTime);
            row.Cells[3].AddParagraph($@"{wrap.TraceTitle}");
            row.Cells[4].AddParagraph($@"{wrap.Measurement.TraceState.ToLocalizedString()}");
            row.Cells[5].AddParagraph($@"{wrap.Measurement.EventStatus.GetLocalizedString()}");
            row.Cells[6].AddParagraph($@"{wrap.Measurement.StatusChangedTimestamp}");
            row.Cells[7].AddParagraph($@"{wrap.Measurement.StatusChangedByUser}");

            if (!string.IsNullOrEmpty(wrap.Measurement.Comment))
            {
                var commentRow = table.AddRow();
                commentRow.Cells[0].MergeRight = 7;
                commentRow.Cells[0].AddParagraph(wrap.Measurement.Comment);
            }
        }
    }
}