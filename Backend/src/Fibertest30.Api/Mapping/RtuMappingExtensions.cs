namespace Fibertest30.Api;

public static class RtuMappingExtensions
{
    public static AppTimeZone ToProto(this Fibertest30.Application.AppTimeZone timeZone)
    {
        return new AppTimeZone
        {
            IanaId = timeZone.IanaId,
            DisplayName =  timeZone.DisplayName,
            DisplayBaseUtcOffset = timeZone.DisplayBaseUtcOffset
        };
    }

    public static Application.AppTimeZone FromProto(this AppTimeZone appTimeZone)
    {
        return new Application.AppTimeZone
        {
            IanaId = appTimeZone.IanaId, 
            DisplayName = appTimeZone.DisplayName, 
            DisplayBaseUtcOffset = appTimeZone.DisplayBaseUtcOffset
        };
    }
    
    public static OtdrMeasurementParameterSet ToProto(this Fibertest30.Application.OtdrMeasurementParameterSet parameters)
    {
        var result = new OtdrMeasurementParameterSet();

        foreach (var (laserUnitKey, laserUnitSet) in parameters.LaserUnits)
        {
            var laserUnitProto = new LaserUnit
            {
                Name = laserUnitKey,
                DwdmChannels = { laserUnitSet.DwdmChannels.ToList() }
            };
            
            foreach (var (distanceRangeSetKey, distanceRangeSet) in laserUnitSet.DistanceRanges)
            {
                var distanceRangeProto = new DistanceRange()
                {
                    Name = distanceRangeSetKey,
                    PulseDurations = { distanceRangeSet.PulseDurations.ToList() },
                    AveragingTimes = { distanceRangeSet.AveragingTimes.ToList() },
                    Resolutions = { distanceRangeSet.Resolutions.ToList() },
                    LiveAveragingTimes = { distanceRangeSet.LiveAveragingTimes.ToList() },

                };
                
                laserUnitProto.DistanceRanges.Add(distanceRangeProto);
            }
            
            result.LaserUnits.Add(laserUnitProto);
        }

        return result;
    }
    
    public static Fibertest30.Application.OtdrMeasurementParameterSet FromProto(this OtdrMeasurementParameterSet proto)
    {
        var result = new Fibertest30.Application.OtdrMeasurementParameterSet();

        foreach (var laserUnitProto in proto.LaserUnits)
        {
            var laserUnitSet = new Fibertest30.Application.OtdrMeasurementParameterSet.LaserUnitSet
            {
                DwdmChannels = new List<string>(laserUnitProto.DwdmChannels)
            };

            foreach (var distancePair in laserUnitProto.DistanceRanges)
            {
                var distanceRangeSet = new Fibertest30.Application.OtdrMeasurementParameterSet.LaserUnitSet.DistanceRangeSet
                {
                    PulseDurations = new List<string>(distancePair.PulseDurations),
                    AveragingTimes = new List<string>(distancePair.AveragingTimes),
                    Resolutions = new List<string>(distancePair.Resolutions),
                    LiveAveragingTimes = new List<string>(distancePair.LiveAveragingTimes)
                };

                laserUnitSet.DistanceRanges.Add(distancePair.Name, distanceRangeSet);
            }

            result.LaserUnits.Add(laserUnitProto.Name, laserUnitSet);
        }

        return result;
    }
    
    public static MeasurementSettings  ToProto(this Fibertest30.Domain.MeasurementSettings measSettings)
    {
        return new MeasurementSettings()
        {
            MeasurementType = measSettings.MeasurementType switch
            {
                Fibertest30.Domain.MeasurementType.Manual => MeasurementType.Manual,
                Fibertest30.Domain.MeasurementType.Auto => MeasurementType.Auto,
                _ => throw new ArgumentOutOfRangeException()
            },
            NetworkType = measSettings.NetworkType switch
            {
                Fibertest30.Domain.NetworkType.PointToPoint => NetworkType.PointToPoint,
                Fibertest30.Domain.NetworkType.ManualPon => NetworkType.ManualPon,
                Fibertest30.Domain.NetworkType.AutoPonToOnt => NetworkType.AutoPonToOnt,
                Fibertest30.Domain.NetworkType.XWdm => NetworkType.XWdm,
                Fibertest30.Domain.NetworkType.AutoPon => NetworkType.AutoPon,
                _ => throw new ArgumentOutOfRangeException()
            },
            BackscatterCoeff = measSettings.BackscatterCoeff,
            RefractiveIndex = measSettings.RefractiveIndex,
            Laser = measSettings.Laser,
            DistanceRange = measSettings.DistanceRange,
            AveragingTime = measSettings.AveragingTime,
            Pulse = measSettings.Pulse,
            SamplingResolution = measSettings.SamplingResolution,
            EventLossThreshold = measSettings.EventLossThreshold,
            EventReflectanceThreshold = measSettings.EventReflectanceThreshold,
            EndOfFiberThreshold = measSettings.EndOfFiberThreshold,
            FastMeasurement = measSettings.FastMeasurement,
            CheckConnectionQuality = measSettings.CheckConnectionQuality,
            Splitter1DB = measSettings.Splitter1Db,
            Splitter2DB = measSettings.Splitter2Db,
            Mux = measSettings.Mux
        };
    }

    public static Fibertest30.Domain.MeasurementSettings FromProto(this MeasurementSettings proto)
    {
        var measurementSettings = new Fibertest30.Domain.MeasurementSettings()
        {
            MeasurementType = proto.MeasurementType switch
            {
                MeasurementType.Manual => Fibertest30.Domain.MeasurementType.Manual,
                MeasurementType.Auto => Fibertest30.Domain.MeasurementType.Auto,
                _ => throw new ArgumentOutOfRangeException()
            },
            NetworkType = proto.NetworkType switch
            {
                NetworkType.PointToPoint => Fibertest30.Domain.NetworkType.PointToPoint,
                NetworkType.ManualPon => Fibertest30.Domain.NetworkType.ManualPon,
                NetworkType.AutoPonToOnt => Fibertest30.Domain.NetworkType.AutoPonToOnt,
                NetworkType.XWdm => Fibertest30.Domain.NetworkType.XWdm,
                NetworkType.AutoPon => Fibertest30.Domain.NetworkType.AutoPon,
                _ => throw new ArgumentOutOfRangeException()
            },
            BackscatterCoeff = proto.BackscatterCoeff,
            RefractiveIndex = proto.RefractiveIndex,
            Laser = proto.Laser,
            DistanceRange = proto.DistanceRange,
            AveragingTime = proto.AveragingTime,
            Pulse = proto.Pulse,
            SamplingResolution = proto.SamplingResolution,
            EventLossThreshold = proto.EventLossThreshold,
            EventReflectanceThreshold = proto.EventReflectanceThreshold,
            EndOfFiberThreshold = proto.EndOfFiberThreshold,
            FastMeasurement = proto.FastMeasurement,
            CheckConnectionQuality = proto.CheckConnectionQuality,
            Splitter1Db = proto.Splitter1DB,
            Splitter2Db = proto.Splitter2DB,
            Mux = proto.Mux
        };

        return measurementSettings;
    }

}