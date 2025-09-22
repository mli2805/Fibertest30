using Iit.Fibertest.Dto;
using Iit.Fibertest.Graph;
using Iit.Fibertest.StringResources;
using MigraDoc.DocumentObjectModel;
using MigraDoc.Rendering;
using PdfSharp.Fonts;
using PdfSharp.Pdf;
using System.Globalization;

namespace Fibertest30.Infrastructure;

public class MonitoringSystemReportGenerator(Model writeModel, string userCulture)
{
    public PdfDocument GenerateReport(ServerInfo serverInfo)
    {
        var culture = new CultureInfo(userCulture);
        // Установка культуры для текущего потока
        // Thread.CurrentThread.CurrentCulture = culture; // не влияет
        Thread.CurrentThread.CurrentUICulture = culture;

        var reportTitle = string
            .Format(Resources.SID_Monitoring_system_components);

        var document = new Document { Info = { Title = reportTitle } };

        Section section = document.AddSection();
        section.PageSetup.LeftMargin = Unit.FromCentimeter(2);
        section.PageSetup.RightMargin = Unit.FromCentimeter(1);
        section.PageSetup.TopMargin = Unit.FromCentimeter(0.5);
        section.PageSetup.BottomMargin = Unit.FromCentimeter(1.5);
        section.PageSetup.FooterDistance = Unit.FromCentimeter(0.5);
        section.PageSetup.DifferentFirstPageHeaderFooter = false;

        LetsGetStarted(section, reportTitle, serverInfo);
        DrawStatistics(section);
        DrawBody(section);

        PdfExt.SetFooter(section, reportTitle);

        // Рендеринг
        var renderer = new PdfDocumentRenderer() { Document = document };
        GlobalFontSettings.FontResolver = new EmbeddedFontResolver();
        renderer.RenderDocument();

        return renderer.PdfDocument;
    }

    private void LetsGetStarted(Section section, string reportTitle, ServerInfo serverInfo)
    {
        var image = section.AddImage(@"assets/headers/header.png");
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

    private void DrawBody(Section section)
    {
        foreach (Rtu rtu in writeModel.Rtus.Where(r => r.IsInitialized))
        {
            DrawRtu(section, rtu);
        }
    }

    private void DrawStatistics(Section section)
    {
        var rtus = writeModel.Rtus; // здесь фильтровать по зоне
        var rtuCount = rtus.Count;

        var portCount = rtus.Sum(r => r.OwnPortCount);

        var traces = writeModel.Traces; // здесь фильтровать по зоне
        var traceCount = traces.Count;

        var bopIds = traces
            .Where(t => t.OtauPort != null && !t.OtauPort.IsPortOnMainCharon)
            .Select(t => t.OtauPort!.OtauId).ToList();
        var bops = writeModel.Otaus.Where(o => bopIds.Contains(o.Id.ToString())).ToList();
        portCount += bops.Sum(b => b.PortCount);

        var statistics = string.Format(Resources.SID_Tree_statistics,
            rtuCount, bops.Count(), portCount, traceCount, (double)traceCount / portCount * 100);

        var paragraph4 = section.AddParagraph();
        paragraph4.AddFormattedText(statistics, TextFormat.Bold);
        paragraph4.Format.Font.Size = 12;
        paragraph4.Format.SpaceBefore = Unit.FromCentimeter(0.4);
        paragraph4.Format.SpaceAfter = Unit.FromCentimeter(1.4);
    }

    private void DrawRtu(Section section, Rtu rtu)
    {
        var paragraph = section.AddParagraph();
        var mode = rtu.MonitoringState == MonitoringState.On ? Resources.SID_Automatic : Resources.SID_Manual;
        var availability = rtu.IsAvailable ? Resources.SID_Available : Resources.SID_Not_available;
        var serial = string.Format(Resources.SID_s_n__0_, rtu.Serial);
        var portCount = string.Format(Resources.SID_ports____0_, rtu.PortCount);
        var software = string.Format(Resources.SID_software____0_, rtu.Version);
        paragraph.AddFormattedText($@"{rtu.Title} ; {rtu.Mfid} ; {serial} ; {portCount} ; {software} ; {mode} ; {availability}");
        var mainChannel = string.Format(Resources.SID_Main_channel____0_____1_,
            rtu.MainChannel.ToStringA(), rtu.MainChannelState.ToLocalizedString());
        var reserveChannel = rtu.IsReserveChannelSet
            ? string.Format(Resources.SID_____Reserve_channel____0_____1_,
                rtu.ReserveChannel.ToStringA(), rtu.ReserveChannelState.ToLocalizedString()) : "";
        paragraph.AddFormattedText($@"{mainChannel}{reserveChannel}");

        paragraph.Format.Font.Size = 12;
        paragraph.Format.Font.Bold = true;
        paragraph.Format.SpaceBefore = Unit.FromCentimeter(0.5);

        for (int i = 0; i < rtu.OwnPortCount; i++)
        {
            if (rtu.Children.TryGetValue(i + 1, out OtauDto? bop))
            {
                DrawBop(section, bop);
            }

            var trace = writeModel.Traces.FirstOrDefault(t => t.RtuId == rtu.Id &&
                t.OtauPort != null && t.OtauPort.IsPortOnMainCharon && t.OtauPort.OpticalPort == i + 1);
            if (trace != null)
            {
                DrawTrace(section, trace);
            }
        }
    }

    private void DrawBop(Section section, OtauDto otauDto)
    {
        var bop = writeModel.Otaus.First(o => o.Serial == otauDto.Serial);
        var paragraph = section.AddParagraph();
        paragraph.Format.Font.Size = 12;
        paragraph.Format.Font.Bold = true;
        var port = Resources.SID_Port;
        var serial = string.Format(Resources.SID_s_n__0_, bop.Serial);
        var state = bop.IsOk ? Resources.SID_Ok : Resources.SID_Broken;
        paragraph.AddFormattedText($@"{port} {bop.MasterPort} ; {bop.NetAddress.ToStringA()} ; {serial} ; {state}");
        paragraph.Format.SpaceBefore = Unit.FromCentimeter(0.2);
        paragraph.Format.FirstLineIndent = Unit.FromCentimeter(1);

        for (int i = 0; i < bop.PortCount; i++)
        {
            var trace = writeModel.Traces.FirstOrDefault((t) => 
                t.RtuId == bop.RtuId && t.OtauPort != null && 
                t.OtauPort.MainCharonPort == bop.MasterPort && t.OtauPort.OpticalPort == i + 1);
            if (trace != null)
            {
                DrawTrace(section, trace, bop.MasterPort);
            }
        }
    }

    private void DrawTrace(Section section, Trace trace, int otauPort = 0)
    {
        //if (!trace.ZoneIds.Contains(_reportModel.SelectedZone.ZoneId))
        //    return;

        var paragraph = section.AddParagraph();
        if (trace.IsIncludedInMonitoringCycle)
        {
            var imageFilename = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, @"assets/pdf/check-mark.png");
            paragraph.AddImage(imageFilename);
        }

        var monitoringIndent = trace.IsIncludedInMonitoringCycle ? 0 : 0.6;

        paragraph.Format.Font.Size = 12;
        var otauPortNumber = otauPort != 0 ? $@"{otauPort}-" : "";
        var portNumber = trace.Port != -1 ? string.Format(Resources.SID_port__0__1____, otauPortNumber, trace.Port) : "";

        paragraph.AddFormattedText($@" {portNumber}{trace.Title} ; {trace.State.ToLocalizedString()}");
        paragraph.Format.SpaceBefore = Unit.FromCentimeter(0.2);
        var indentation = otauPort == 0 ? 1 : 1.5;
        paragraph.Format.FirstLineIndent = Unit.FromCentimeter(indentation + monitoringIndent);
    }


}