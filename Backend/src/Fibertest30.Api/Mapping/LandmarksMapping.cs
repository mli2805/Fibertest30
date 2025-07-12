namespace Fibertest30.Api;

public static class LandmarksMapping
{
    public static LandmarksModel ToProto(this Application.LandmarksModel model)
    {
        var r = new LandmarksModel()
        {
            LandmarksModelId = model._landmarksModelId.ToString(),
            Landmarks = { model.Rows.Select(ToProto) }
        };

        return r;
    }

    public static Iit.Fibertest.Graph.ColoredLandmark FromProto(this ColoredLandmark landmark)
    {
        return new Iit.Fibertest.Graph.ColoredLandmark
        {
            IsFromBase = landmark.IsFromBase,

            NodeId = Guid.Parse(landmark.NodeId),
            FiberId = Guid.Parse(landmark.FiberId),
            Number = landmark.Number,
            NumberIncludingAdjustmentPoints = landmark.NumberIncludingAdjustmentPoints,

            NodeTitle = landmark.NodeTitle,
            NodeTitleColor = landmark.NodeTitleColor,
            NodeComment = landmark.NodeComment,
            NodeCommentColor = landmark.NodeCommentColor,

            EquipmentId = Guid.Parse(landmark.EquipmentId),
            EquipmentTitle = landmark.EquipmentTitle,
            EquipmentTitleColor = landmark.EquipmentTitleColor,
            EquipmentType = landmark.EquipmentType.FromProto(),
            EquipmentTypeColor = landmark.EquipmentTypeColor,

            LeftCableReserve = landmark.LeftCableReserve,
            RightCableReserve = landmark.RightCableReserve,
            CableReservesColor = landmark.CableReservesColor,

            GpsDistance = landmark.GpsDistance,
            GpsSection = landmark.GpsSection,
            IsUserInput = landmark.IsUserInput,
            GpsSectionColor = landmark.GpsSectionColor,

            OpticalDistance = landmark.OpticalDistance,
            OpticalSection = landmark.OpticalSection,
            EventNumber = landmark.EventNumber,

            GpsCoors = landmark.GpsCoors.FromProto(),
            GpsCoorsColor = landmark.GpsCoorsColor
        };
    }

    private static ColoredLandmark ToProto(this Iit.Fibertest.Graph.ColoredLandmark landmark)
    {
        return new ColoredLandmark
        {
            NodeId = landmark.NodeId.ToString(),
            FiberId = landmark.FiberId.ToString(),
        
            Number = landmark.Number,
            NumberIncludingAdjustmentPoints = landmark.NumberIncludingAdjustmentPoints,
        
            NodeTitle = landmark.NodeTitle,
            NodeTitleColor = landmark.NodeTitleColor,
            NodeComment = landmark.NodeComment,
            NodeCommentColor = landmark.NodeCommentColor,
        
            EquipmentId = landmark.EquipmentId.ToString(),
            EquipmentTitle = landmark.EquipmentTitle,
            EquipmentTitleColor = landmark.EquipmentTitleColor,
            EquipmentType = landmark.EquipmentType.ToProto(),
            EquipmentTypeColor = landmark.EquipmentTypeColor,
        
            LeftCableReserve = landmark.LeftCableReserve,
            RightCableReserve = landmark.RightCableReserve,
            CableReservesColor = landmark.CableReservesColor,
        
            GpsDistance = landmark.GpsDistance,
            GpsSection = landmark.GpsSection,
            IsUserInput = landmark.IsUserInput,
            GpsSectionColor = landmark.GpsSectionColor,
        
            OpticalDistance = landmark.OpticalDistance,
            OpticalSection = landmark.OpticalSection,
            EventNumber = landmark.EventNumber,
        
            GpsCoors = landmark.GpsCoors.ToProto(),
            GpsCoorsColor = landmark.GpsCoorsColor,
        
            IsFromBase = landmark.IsFromBase,
            IsChanged = landmark.IsChanged,
        };
    }
}
