using Iit.Fibertest.Graph;
using MigraDoc.DocumentObjectModel;
using MigraDoc.DocumentObjectModel.Tables;

namespace Fibertest30.Infrastructure
{
    public static class AccidentPlaceReportProvider
    {
        public static void DrawAccidents(List<AccidentLineModel> accidents, Section section)
        {
            foreach (var accidentLineModel in accidents)
            {
                var gap = section.AddParagraph();
                gap.Format.SpaceBefore = Unit.FromCentimeter(0.2);

                DrawAccidentPlace(section, accidentLineModel).Clone();
            }
        }

        private static Table DrawAccidentPlace(Section section, AccidentLineModel accidentLineModel)
        {
            var table = section.AddTable();
            table.KeepTogether = true;

            table.AddColumn(@"2.5cm").Format.Alignment = ParagraphAlignment.Left;
            table.AddColumn(@"2.5cm").Format.Alignment = ParagraphAlignment.Left;
            table.AddColumn(@"5cm").Format.Alignment = ParagraphAlignment.Center;
            table.AddColumn(@"2.5cm").Format.Alignment = ParagraphAlignment.Right;
            table.AddColumn(@"2.5cm").Format.Alignment = ParagraphAlignment.Right;

            var row = table.AddRow();
            row.HeightRule = RowHeightRule.Exactly;
            row.Height = Unit.FromCentimeter(0.6);
            row.Borders.Visible = false;
            row.KeepWith = 3;
            row.Cells[0].MergeRight = 4;
            row.Cells[0].AddParagraph(accidentLineModel.Caption);
            row.Cells[0].Format.Alignment = ParagraphAlignment.Left;

            var rowTop = table.AddRow();
            rowTop.Borders.Visible = false;
            rowTop.HeightRule = RowHeightRule.Exactly;
            rowTop.Height = Unit.FromCentimeter(0.6);
            rowTop.Cells[0].MergeRight = 1;
            rowTop.Cells[0].AddParagraph(accidentLineModel.TopLeft ?? "");
            rowTop.Cells[0].Format.Alignment = ParagraphAlignment.Left;

            rowTop.Cells[2].AddParagraph(accidentLineModel.TopCenter ?? "");
            rowTop.Cells[2].Format.Alignment = ParagraphAlignment.Center;

            rowTop.Cells[3].MergeRight = 1;
            rowTop.Cells[3].AddParagraph(accidentLineModel.TopRight ?? "");
            rowTop.Cells[3].Format.Alignment = ParagraphAlignment.Right;

            var rowImage = table.AddRow();
            rowImage.Borders.Visible = false;
            rowImage.HeightRule = RowHeightRule.Exactly;
            rowImage.Height = Unit.FromCentimeter(0.9);
            var image = rowImage.Cells[0].AddImage(accidentLineModel.PngPath);
            image.Width = Unit.FromCentimeter(14.7);
            image.LockAspectRatio = true;

            var rowBottom = table.AddRow();
            rowBottom.Borders.Visible = false;
            rowBottom.HeightRule = RowHeightRule.Exactly;
            rowBottom.Height = Unit.FromCentimeter(0.6);

            rowBottom.Cells[0].MergeRight = 1;
            rowBottom.Cells[0].AddParagraph(accidentLineModel.Bottom1 ?? "");
            rowBottom.Cells[0].Format.Alignment = ParagraphAlignment.Left;

            rowBottom.Cells[2].AddParagraph(accidentLineModel.Bottom2 ?? "");
            rowBottom.Cells[2].Format.Alignment = ParagraphAlignment.Center;

            rowBottom.Cells[3].MergeRight = 1;
            rowBottom.Cells[3].AddParagraph(accidentLineModel.Bottom3 ?? "");
            rowBottom.Cells[3].Format.Alignment = ParagraphAlignment.Right;

            return table;
        }
    }
}