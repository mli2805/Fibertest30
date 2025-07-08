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

    public bool IsChanged { get => _isChanged(); }

    public ColoredLandmark FromLandmark(Landmark landmark, ColoredLandmark? oldLandmarkRow)
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
        IsUserInput = landmark.IsUserInput;
        GpsSectionColor = CalculateGpsSectionBrush(landmark, oldLandmarkRow);

        OpticalDistance = landmark.OpticalDistance;
        OpticalSection = landmark.OpticalSection;
        EventNumber = landmark.EventNumber;
        GpsCoors = landmark.GpsCoors;
        GpsCoorsColor = oldLandmarkRow == null || landmark.GpsCoors.Equals(oldLandmarkRow.GpsCoors)
            ? "Transparent" : "Cornsilk";

        return this;
    }

    public void ToLandmark(Landmark ll)
    {
        ll.Number = this.Number;
        ll.NumberIncludingAdjustmentPoints = this.NumberIncludingAdjustmentPoints;
        ll.NodeId = this.NodeId;
        ll.FiberId = this.FiberId;
        ll.NodeTitle = this.NodeTitle;
        ll.NodeComment = this.NodeComment;
        ll.EquipmentId = this.EquipmentId;
        ll.EquipmentTitle = this.EquipmentTitle;
        ll.EquipmentType = this.EquipmentType;
        ll.LeftCableReserve = this.LeftCableReserve;
        ll.RightCableReserve = this.RightCableReserve;
        ll.GpsDistance = this.GpsDistance;
        ll.GpsSection = this.GpsSection;
        ll.IsUserInput = this.IsUserInput;
        ll.OpticalDistance = this.OpticalDistance;
        ll.OpticalSection = this.OpticalSection;
        ll.EventNumber = this.EventNumber;
        ll.GpsCoors = this.GpsCoors;
    }

    private bool _isChanged()
    {
        return NodeCommentColor == "Cornsilk" || NodeTitleColor == "Cornsilk" 
               || EquipmentTitleColor == "Cornsilk" || EquipmentTypeColor == "Cornsilk"
               || CableReservesColor == "Cornsilk" || GpsSectionColor == "Cornsilk"|| GpsCoorsColor == "Cornsilk";
    }


    private string CalculateGpsSectionBrush(Landmark source, ColoredLandmark? oldLandmarkRow)
    {
        if (oldLandmarkRow != null)
        {
            if (oldLandmarkRow.IsUserInput ^ source.IsUserInput) 
                return "Cornsilk";
            if (Math.Abs(GpsSection - oldLandmarkRow.GpsSection) > 0.001)
                return "Cornsilk";
        }

        return  source.IsUserInput ? "LightGray" : "Transparent";
    }

}