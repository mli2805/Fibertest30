namespace Iit.Fibertest.Graph;

public static class LandmarkExt
{
    public static bool AreNodePropertiesChanged(this Landmark landmark, Landmark other)
    {
        return landmark.NodeTitle != other.NodeTitle
               || landmark.NodeComment != other.NodeComment
               || !landmark.AreCoordinatesTheSame(other);
    }

    public static bool AreEquipmentPropertiesChanged(this Landmark landmark, Landmark other)
    {
        return landmark.EquipmentTitle != other.EquipmentTitle
               || landmark.EquipmentType != other.EquipmentType
               || landmark.LeftCableReserve != other.LeftCableReserve
               || landmark.RightCableReserve != other.RightCableReserve;
    }

    public static bool AreAnyPropertyChanged(this Landmark landmark, Landmark other)
    {
        return landmark.AreNodePropertiesChanged(other) 
               || landmark.AreEquipmentPropertiesChanged(other)
               || !landmark.UserInputLength.Equals(other.UserInputLength);
    }
}