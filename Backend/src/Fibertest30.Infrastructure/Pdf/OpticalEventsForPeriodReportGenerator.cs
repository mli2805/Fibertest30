using Iit.Fibertest.Dto;
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
    public class OpticalEventsForPeriodReportGenerator(GetOpticalEventsReportPdfQuery query, UserSettings? userSettings)
    {
        public PdfDocument GenerateReport(List<MeasurementWrap> wrapped, 
            Dictionary<EventStatus, Dictionary<FiberState, int>> totals, ServerInfo serverInfo)
        {
            var culture = new CultureInfo(userSettings?.GetCulture() ?? "ru-RU");
            // Установка культуры для текущего потока
            Thread.CurrentThread.CurrentCulture = culture; // не влияет ?
            Thread.CurrentThread.CurrentUICulture = culture;

            var dateTimeRange = query.DateTimeFilter.SearchWindow!;
            var upTo = dateTimeRange.End > DateTime.Now
                ? DateTime.Now
                : dateTimeRange.End; 

            var reportTitle = string
                .Format(Resources.SID_Optical_events_report_for__0_d_____1_d_, dateTimeRange.Start, upTo);

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

            DrawBody(section, totals, wrapped);

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

        private void DrawBody(Section section, Dictionary<EventStatus, Dictionary<FiberState, int>> totals, 
            List<MeasurementWrap> wrapped)
        {
            var gap = section.AddParagraph();
            gap.Format.SpaceBefore = Unit.FromCentimeter(0.4);

            DrawConsolidatedTable(section, totals);
            if (query.IsDetailed)
                DrawOpticalEvents(section, wrapped);
        }

        private void DrawConsolidatedTable(Section section, Dictionary<EventStatus, Dictionary<FiberState, int>> statuses)
        {
            var selectedStates = query.TraceStates;
            var table = section.AddTable();
            table.Borders.Width = 0.25;

            table.AddColumn(@"3.5cm").Format.Alignment = ParagraphAlignment.Center;
            foreach (var _ in selectedStates)
                table.AddColumn(@"3.5cm").Format.Alignment = ParagraphAlignment.Center;

            var rowHeader = table.AddRow();
            rowHeader.VerticalAlignment = VerticalAlignment.Center;
            rowHeader.TopPadding = Unit.FromCentimeter(0.1);
            rowHeader.BottomPadding = Unit.FromCentimeter(0.1);
            rowHeader.Format.Font.Bold = true;
            for (int i = 0; i < selectedStates.Count; i++)
                rowHeader.Cells[i + 1].AddParagraph(selectedStates[i].ToLocalizedString());

            foreach (var eventStatus in EventStatusExt.EventStatusesInRightOrder)
            {
                if (statuses.TryGetValue(eventStatus, out var states))
                {
                    var row = table.AddRow();
                    row.HeightRule = RowHeightRule.Exactly;
                    row.Height = Unit.FromCentimeter(0.6);
                    row.VerticalAlignment = VerticalAlignment.Center;

                    row.Cells[0].AddParagraph(eventStatus.GetLocalizedString());

                    var column = 1;
                    foreach (var traceState in query.TraceStates)
                    {
                        row.Cells[column].AddParagraph(states.TryGetValue(traceState, out var quantity)
                            ? quantity.ToString()
                            : "0");

                        column++;
                    }
                }
            }
        }

        private void DrawOpticalEvents(Section section, List<MeasurementWrap> wrapped)
        {
            var checkedStatuses = query.EventStatuses;

            foreach (var eventStatus in EventStatusExt
                         .EventStatusesInRightOrder.Where(eventStatus => checkedStatuses.Contains(eventStatus)))
            {
                foreach (var traceState in query.TraceStates)
                {
                    var withStatusAndState = wrapped
                        .Where(w => w.Measurement.EventStatus == eventStatus 
                                    && w.Measurement.TraceState == traceState).ToList();
                    if (withStatusAndState.Any())
                    {
                        DrawOpticalEventsWithStatusAndState(section, withStatusAndState);
                    }
                }
            }
        }

        private void DrawOpticalEventsWithStatusAndState(Section section, List<MeasurementWrap> wrapped)
        {
            var gap = section.AddParagraph();
            gap.Format.SpaceBefore = Unit.FromCentimeter(0.4);

            var ev = wrapped.First();
            var caption = section.AddParagraph($@"{ev.Measurement.EventStatus.GetLocalizedString()} / {ev.Measurement.TraceState.ToLocalizedString()} ({wrapped.Count})");
            caption.Format.Font.Bold = true;

            if (!query.IsShowPlace)
                DrawOpticalEventsTable(section, wrapped);
            else
                DrawOpticalEventsTableWithAccidentPlaces(section, wrapped);
        }

        private void DrawOpticalEventsTable(Section section, List<MeasurementWrap> wrapped)
        {
            var table = DrawOpticalEventTableHeader(section);
            foreach (var wrap in wrapped)
            {
                DrawOpticalEventRow(table, wrap);
            }
        }

        private void DrawOpticalEventsTableWithAccidentPlaces(Section section,
            List<MeasurementWrap> wrapped)
        {
            var accidentLineModelFactory = new AccidentLineModelFactory();
            var gpsFormat = userSettings?.LatLngFormat switch
            {
                "ddd.dddddd\u00b0" => GpsInputMode.Degrees,
                "ddd\u00b0 mm.mmmmm′" => GpsInputMode.DegreesAndMinutes,
                "ddd\u00b0 mm′ ss.ss″" => GpsInputMode.DegreesMinutesAndSeconds,
                _ => throw new ArgumentOutOfRangeException()
            };

            foreach (var wrap in wrapped)
            {
                var table = DrawOpticalEventTableHeader(section);
                DrawOpticalEventRow(table, wrap);

                var alms = wrap.Measurement.Accidents
                    .OrderByDescending(a=>a.AccidentSeriousness)
                    .Select((t, i) => accidentLineModelFactory
                        .Create(t, i + 1, true, gpsFormat)).ToList();
                AccidentPlaceReportProvider.DrawAccidents(alms, section);
            }
        }

        private Table DrawOpticalEventTableHeader(Section section)
        {
            var gap = section.AddParagraph();
            gap.Format.SpaceBefore = Unit.FromCentimeter(0.2);
            var table = section.AddTable();
            table.Borders.Width = 0.25;

            table.AddColumn(@"1.8cm").Format.Alignment = ParagraphAlignment.Left;
            table.AddColumn(@"3.5cm").Format.Alignment = ParagraphAlignment.Center;
            table.AddColumn(@"3.5cm").Format.Alignment = ParagraphAlignment.Center;
            table.AddColumn(@"3.5cm").Format.Alignment = ParagraphAlignment.Center;
            table.AddColumn(@"4.5cm").Format.Alignment = ParagraphAlignment.Left;

            table.AddColumn(@"3.5cm").Format.Alignment = ParagraphAlignment.Center;
            table.AddColumn(@"4cm").Format.Alignment = ParagraphAlignment.Center;

            var headerRow1 = table.AddRow();
            headerRow1.HeadingFormat = true;
            headerRow1.Format.Alignment = ParagraphAlignment.Center;
            headerRow1.Format.Font.Bold = true;

            headerRow1.Cells[0].AddParagraph(Resources.SID_Event_Id);
            headerRow1.Cells[0].MergeDown = 1;
            headerRow1.Cells[0].VerticalAlignment = VerticalAlignment.Center;
            headerRow1.Cells[1].AddParagraph(Resources.SID_Time);
            headerRow1.Cells[1].MergeRight = 2;
            headerRow1.Cells[4].AddParagraph(Resources.SID_Trace);
            headerRow1.Cells[4].MergeDown = 1;
            headerRow1.Cells[4].VerticalAlignment = VerticalAlignment.Center;

            headerRow1.Cells[5].AddParagraph(Resources.SID_Status_set);
            headerRow1.Cells[5].MergeRight = 1;

            var headerRow2 = table.AddRow();
            headerRow2.HeadingFormat = true;
            headerRow2.Format.Alignment = ParagraphAlignment.Center;
            headerRow2.Format.Font.Bold = true;
            headerRow2.VerticalAlignment = VerticalAlignment.Center;

            headerRow2.Cells[1].AddParagraph(Resources.SID_measurement_finished);
            headerRow2.Cells[2].AddParagraph(Resources.SID_event_registered);
            headerRow2.Cells[3].AddParagraph(Resources.SID_Turned_to_OK);
            headerRow2.Cells[5].AddParagraph(Resources.SID_Time);
            headerRow2.Cells[5].VerticalAlignment = VerticalAlignment.Center;
            headerRow2.Cells[6].AddParagraph(Resources.SID_User);
            headerRow2.Cells[6].VerticalAlignment = VerticalAlignment.Center;
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

            if (wrap.OkAt != null)
            {
                var closingTime = $@"{wrap.OkAt:G}";
                row.Cells[3].AddParagraph(closingTime);
            }

            row.Cells[4].AddParagraph($@"{wrap.TraceTitle}");

            if (wrap.Measurement.StatusChangedByUser == "system")
            {
                row.Cells[5].AddParagraph(@"-");
                row.Cells[6].AddParagraph(@"-");
            }
            else
            {
                row.Cells[5].AddParagraph($@"{wrap.Measurement.StatusChangedTimestamp}");
                row.Cells[6].AddParagraph($@"{wrap.Measurement.StatusChangedByUser}");
            }
           

            if (!string.IsNullOrEmpty(wrap.Measurement.Comment))
            {
                var commentRow = table.AddRow();
                commentRow.Cells[0].MergeRight = 6;
                commentRow.Cells[0].AddParagraph(wrap.Measurement.Comment);
            }
        }
    }
}