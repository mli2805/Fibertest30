using Fibertest30.Domain;
using System.Reflection;

namespace Fibertest30.Database.Cli;

public static class FakeDataFactory
{
    private static MeasurementSettings? _measurementSettings = null;
    private static byte[]? _sor = null;
    private static List<MonitoringChange>? _monitoringChanges = null;
    
    public static MeasurementSettings FakeMeasurementSettings
    {
        get
        {
            if (_measurementSettings == null)
            {
                _measurementSettings = new MeasurementSettings
                {
                    MeasurementType = MeasurementType.Manual,
                    NetworkType = NetworkType.PointToPoint,
                    BackscatterCoeff = -81,
                    RefractiveIndex = 1.4682,
                    Laser = "SM1650",
                    DistanceRange = "80",
                    AveragingTime = "00:05",
                    Pulse = "300",
                    SamplingResolution = "8.2",
                    EventLossThreshold = 0.3,
                    EventReflectanceThreshold = -60,
                    EndOfFiberThreshold = 3,
                    FastMeasurement = false,
                    CheckConnectionQuality = false,
                    Splitter1Db = 16.8,
                    Splitter2Db = 0,
                    Mux = 1
                };
            }

            return _measurementSettings;
        }
    }

    public static byte[] FakeSor
    {
        get
        {
            if (_sor == null)
            {
                _sor = Assembly.GetExecutingAssembly().GetResource("Fibertest30.Database.Cli.assets.test.sor");
            }

            return _sor;
        }
    }
    
    public static List<MonitoringChange> FakeMonitoringChanges
    {
        get
        {
            if (_monitoringChanges == null)
            {
               
                _monitoringChanges = new List<MonitoringChange>
                {
                    new MonitoringChange
                    {
                        Type = MonitoringAlarmType.EventLoss,
                        Level = MonitoringAlarmLevel.Minor,
                        DistanceMeters = 5000,
                        DistanceThresholdMeters = 70,
                        Threshold = 5,
                        ThresholdExcessDelta = 0.55,
                        ReflectanceExcessDeltaExactness = null,
                        Current = new MonitoringChangeKeyEvent
                        {
                            KeyEventIndex = 1,
                            DistanceMeters = 5000,
                            EventLoss = 0.005,
                            EventReflectance = new QualifiedValue(-74.141, ValueExactness.AtMost),
                            SectionAttenuation = 0.203,
                            IsClipped = false,
                            IsReflective = false,
                            Comment = ""
                        },
                        Baseline = new MonitoringChangeKeyEvent
                        {
                            KeyEventIndex = 1,
                            DistanceMeters = 5000,
                            EventLoss = 0.005,
                            EventReflectance = new QualifiedValue(-74.141, ValueExactness.AtMost),
                            SectionAttenuation = 0.203,
                            IsClipped = false,
                            IsReflective = false,
                            Comment = ""
                        },
                        BaselineLeft = new MonitoringChangeKeyEvent
                        {
                            KeyEventIndex = 0,
                            DistanceMeters = 0,
                            EventLoss = null,
                            EventReflectance = new QualifiedValue(-48.349, ValueExactness.Exact),
                            SectionAttenuation = 0.2,
                            IsClipped = false,
                            IsReflective = true,
                            Comment = ""
                        },
                        BaselineRight = new MonitoringChangeKeyEvent
                        {
                            KeyEventIndex = 2,
                            DistanceMeters = 10000,
                            EventLoss = 0.004,
                            EventReflectance = new QualifiedValue(-74.668, ValueExactness.Exact),
                            SectionAttenuation = 0.199,
                            IsClipped = false,
                            IsReflective = true,
                            Comment = ""
                        }
                    },
                    
               new MonitoringChange
                {
                    Type = MonitoringAlarmType.EventReflectance,
                    Level = MonitoringAlarmLevel.Major,
                    DistanceMeters = 10000,
                    DistanceThresholdMeters = 70,
                    Threshold = 10,
                    ThresholdExcessDelta = 1.11,
                    ReflectanceExcessDeltaExactness = ValueExactness.AtLeast,
                    Current = new MonitoringChangeKeyEvent
                    {
                        KeyEventIndex = 2,
                        DistanceMeters = 10000,
                        EventLoss = 0.004,
                        EventReflectance = new QualifiedValue(-74.668, ValueExactness.Exact),
                        SectionAttenuation = 0.2,
                        IsClipped = false,
                        IsReflective = true,
                        Comment = ""
                    },
                    Baseline = new MonitoringChangeKeyEvent
                    {
                        KeyEventIndex = 2,
                        DistanceMeters = 10000,
                        EventLoss = 0.004,
                        EventReflectance = new QualifiedValue(-74.668, ValueExactness.Exact),
                        SectionAttenuation = 0.2,
                        IsClipped = false,
                        IsReflective = true,
                        Comment = ""
                    },
                    BaselineLeft = new MonitoringChangeKeyEvent
                    {
                        KeyEventIndex = 1,
                        DistanceMeters = 5000,
                        EventLoss = 0.005,
                        EventReflectance = new QualifiedValue(-74.141, ValueExactness.AtMost),
                        SectionAttenuation = 0.203,
                        IsClipped = false,
                        IsReflective = false,
                        Comment = ""
                    },
                    BaselineRight = new MonitoringChangeKeyEvent
                    {
                        KeyEventIndex = 3,
                        DistanceMeters = 15000,
                        EventLoss = 0,
                        EventReflectance = new QualifiedValue(-82.555, ValueExactness.AtMost),
                        SectionAttenuation = 0.197,
                        IsClipped = false,
                        IsReflective = false,
                        Comment = ""
                    }
                  },
               new MonitoringChange
                {
                    Type = MonitoringAlarmType.SectionAttenuation,
                    Level = MonitoringAlarmLevel.Critical,
                    DistanceMeters = 15000,
                    DistanceThresholdMeters = 70,
                    Threshold = 15,
                    ThresholdExcessDelta = 1.15,
                    ReflectanceExcessDeltaExactness = null,
                    Current = new MonitoringChangeKeyEvent
                    {
                        KeyEventIndex = 3,
                        DistanceMeters = 15000,
                        EventLoss = 0,
                        EventReflectance = new QualifiedValue(-82.555, ValueExactness.AtMost),
                        SectionAttenuation = 0.197,
                        IsClipped = false,
                        IsReflective = false,
                        Comment = ""
                    },
                    Baseline = new MonitoringChangeKeyEvent
                    {
                        KeyEventIndex = 3,
                        DistanceMeters = 15000,
                        EventLoss = 0,
                        EventReflectance = new QualifiedValue(-82.555, ValueExactness.AtMost),
                        SectionAttenuation = 0.197,
                        IsClipped = false,
                        IsReflective = false,
                        Comment = ""
                    },
                    BaselineLeft = new MonitoringChangeKeyEvent
                    {
                        KeyEventIndex = 2,
                        DistanceMeters = 10000,
                        EventLoss = 0.004,
                        EventReflectance = new QualifiedValue(-74.668, ValueExactness.Exact),
                        SectionAttenuation = 0.2,
                        IsClipped = false,
                        IsReflective = true,
                        Comment = ""
                    },
                    BaselineRight = new MonitoringChangeKeyEvent
                    {
                        KeyEventIndex = 4,
                        DistanceMeters = 20000,
                        EventLoss = -0.007,
                        EventReflectance = new QualifiedValue(-84.066, ValueExactness.AtMost),
                        SectionAttenuation = 0.199,
                        IsClipped = false,
                        IsReflective = false,
                        Comment = ""
                    }
                  },
                };
            }

            return _monitoringChanges;
        }
    }
}