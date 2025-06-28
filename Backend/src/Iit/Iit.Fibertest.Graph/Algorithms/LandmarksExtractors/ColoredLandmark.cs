using GMap.NET;
using Iit.Fibertest.Dto;

namespace Iit.Fibertest.Graph;

public class ColoredLandmark
{
    public bool IsFromBase;

    public Guid NodeId;
    public Guid FiberId; // to the left
    public int Number;
    public int NumberIncludingAdjustmentPoints;

    public string NodeTitle;
    public string NodeTitleColor;

    public string NodeComment;
    public string NodeCommentColor;

    public Guid EquipmentId;
    public string EquipmentTitle;
    public string EquipmentTitleColor;
    public EquipmentType EquipmentType;
    public string EquipmentTypeColor;

    public int LeftCableReserve;
    public int RightCableReserve;
    public string CableReservesColor;

    public double GpsDistance; // by GPS, ignore cable reserve
    public double GpsSection;
    public bool IsUserInput;
    public string GpsSectionColor;
    public double OpticalDistance; // from sor
    public double OpticalSection;
    public int EventNumber; // -1 если не связан

    public PointLatLng GpsCoors;
    public string GpsCoorsColor;

    public ColoredLandmark FromLandmark(Landmark landmark, ColoredLandmark? oldLandmarkRow,
            GpsInputMode mode, GpsInputMode originalGpsInputMode)
    {
        Number = landmark.Number;
        NumberIncludingAdjustmentPoints = landmark.NumberIncludingAdjustmentPoints;
        NodeId = landmark.NodeId;
        FiberId = landmark.FiberId;
        NodeTitle = landmark.NodeTitle;
        NodeTitleColor = oldLandmarkRow == null || landmark.NodeTitle == oldLandmarkRow.NodeTitle
            ? "Transparent" : "Cornsilk";
        NodeComment = landmark.NodeComment;
        NodeCommentColor = oldLandmarkRow == null || landmark.NodeComment == oldLandmarkRow.NodeComment
            ? "Transparent" : "Cornsilk";
        EquipmentId = landmark.EquipmentId;
        EquipmentTitle = landmark.EquipmentTitle;
        EquipmentTitleColor = oldLandmarkRow == null || landmark.EquipmentTitle == oldLandmarkRow.EquipmentTitle
            ? "Transparent" : "Cornsilk";
        EquipmentType = landmark.EquipmentType;
        EquipmentTypeColor = oldLandmarkRow == null || EquipmentType == oldLandmarkRow.EquipmentType
            ? "Transparent" : "Cornsilk";
        LeftCableReserve = landmark.LeftCableReserve;
        RightCableReserve = landmark.RightCableReserve;
        CableReservesColor = oldLandmarkRow == null || 
            (LeftCableReserve == oldLandmarkRow.LeftCableReserve && RightCableReserve == oldLandmarkRow.RightCableReserve)
            ? "Transparent" : "Cornsilk";
        GpsDistance = landmark.GpsDistance;
        GpsSection = landmark.GpsSection;
        GpsSectionColor = CalculateGpsSectionBrush(landmark, oldLandmarkRow);
        IsUserInput = landmark.IsUserInput;
        OpticalDistance = landmark.OpticalDistance;
        OpticalSection = landmark.OpticalSection;
        EventNumber = landmark.EventNumber;
        GpsCoors = landmark.GpsCoors;
        GpsCoorsColor = oldLandmarkRow == null || landmark.GpsCoors.Equals(oldLandmarkRow.GpsCoors)
            ? "Transparent" : "Cornsilk";

        return this;
    }

    private string CalculateGpsSectionBrush(Landmark source, ColoredLandmark? oldLandmarkRow)
    {
        return oldLandmarkRow != null && Math.Abs(GpsSection - oldLandmarkRow.GpsSection) > 0.001
            ? "Cornsilk"
            : source.IsUserInput
                ? "LightGray" : "Transparent";
    }

}