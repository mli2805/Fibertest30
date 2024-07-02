
using System.Text;

namespace Fibertest30.Infrastructure.Emulator;
public class LinkmapGenerator : ILinkmapGenerator
{
    public Task<byte[]> GenerateLinkmap(List<byte[]> sors, double? macrobendThreshold)
    {
        #region Hardcoded linkmap JSON
        const string json = """
          {
            "analysisParameters": {
              "endOfFiberLoss": 20,
              "macrobendLoss": 0.20000000000000001,
              "reflectance": -65,
              "spliceLoss": 0.02
            },
            "extras": {},
            "measurementPlan": {
              "id": "",
              "name": ""
            },
            "networkType": "ptp",
            "nodes": [
              {
                "comment": "",
                "events": [
                  {
                    "dwdm": false,
                    "level": -34.521272216796874,
                    "position": 0,
                    "preciseWavelength": 1627,
                    "reflectance": -48.348999999999997,
                    "reflectanceType": "normal",
                    "sectionLength": 0,
                    "thresholdsCheckResult": {
                      "attenuation": true,
                      "loss": true,
                      "reflectance": true
                    },
                    "wavelength": 1625
                  }
                ],
                "ignoresThresholds": false,
                "tapPort": "thru",
                "tapPortsNum": 1,
                "tapRatio": 50,
                "type": "linkStart",
                "types": [
                  "linkStart"
                ]
              },
              {
                "comment": "",
                "events": [
                  {
                    "dwdm": false,
                    "level": -13.616408210754395,
                    "loss": 0.0050000000000000001,
                    "position": 4.9999772368398467,
                    "preciseWavelength": 1627,
                    "reflectance": -74.141000000000005,
                    "reflectanceType": "tiny",
                    "sectionLength": 4.9999772368398467,
                    "sectionLoss": 1.0149953790784889,
                    "thresholdsCheckResult": {
                      "attenuation": true,
                      "loss": true,
                      "reflectance": true
                    },
                    "wavelength": 1625
                  }
                ],
                "ignoresThresholds": false,
                "tapPort": "thru",
                "tapPortsNum": 1,
                "tapRatio": 50,
                "type": "unknown",
                "types": [
                  "unknown"
                ]
              },
              {
                "comment": "",
                "events": [
                  {
                    "dwdm": false,
                    "level": -14.597839759826659,
                    "loss": 0.0040000000000000001,
                    "position": 9.9999953006520474,
                    "preciseWavelength": 1627,
                    "reflectance": -74.668000000000006,
                    "reflectanceType": "normal",
                    "sectionLength": 5.0000180638122007,
                    "sectionLoss": 0.99500359469862798,
                    "thresholdsCheckResult": {
                      "attenuation": true,
                      "loss": true,
                      "reflectance": true
                    },
                    "wavelength": 1625
                  }
                ],
                "ignoresThresholds": false,
                "tapPort": "thru",
                "tapPortsNum": 1,
                "tapRatio": 50,
                "type": "apcConnector",
                "types": [
                  "apcConnector"
                ]
              },
              {
                "comment": "",
                "events": [
                  {
                    "dwdm": false,
                    "level": -15.60200023651123,
                    "loss": 0,
                    "position": 14.99999295097807,
                    "preciseWavelength": 1627,
                    "reflectance": -82.555000000000007,
                    "reflectanceType": "tiny",
                    "sectionLength": 4.9999976503260228,
                    "sectionLoss": 0.9849995371142265,
                    "thresholdsCheckResult": {
                      "attenuation": true,
                      "loss": true,
                      "reflectance": true
                    },
                    "wavelength": 1625
                  }
                ],
                "ignoresThresholds": false,
                "tapPort": "thru",
                "tapPortsNum": 1,
                "tapRatio": 50,
                "type": "unknown",
                "types": [
                  "unknown"
                ]
              },
              {
                "comment": "",
                "events": [
                  {
                    "dwdm": false,
                    "level": -16.587784210205079,
                    "loss": -0.0070000000000000001,
                    "position": 19.999990601304095,
                    "preciseWavelength": 1627,
                    "reflectance": -84.066000000000003,
                    "reflectanceType": "tiny",
                    "sectionLength": 4.9999976503260246,
                    "sectionLoss": 0.99499953241487893,
                    "thresholdsCheckResult": {
                      "attenuation": true,
                      "loss": true,
                      "reflectance": true
                    },
                    "wavelength": 1625
                  }
                ],
                "ignoresThresholds": false,
                "tapPort": "thru",
                "tapPortsNum": 1,
                "tapRatio": 50,
                "type": "unknown",
                "types": [
                  "unknown"
                ]
              },
              {
                "comment": "",
                "events": [
                  {
                    "dwdm": false,
                    "level": -20.347000122070313,
                    "position": 27.255433512388937,
                    "preciseWavelength": 1627,
                    "reflectance": -47.969000000000001,
                    "reflectanceType": "normal",
                    "sectionLength": 7.2554429110848417,
                    "sectionLoss": 1.4438331393058836,
                    "thresholdsCheckResult": {
                      "attenuation": true,
                      "loss": true,
                      "reflectance": true
                    },
                    "wavelength": 1625
                  }
                ],
                "ignoresThresholds": false,
                "tapPort": "thru",
                "tapPortsNum": 1,
                "tapRatio": 50,
                "type": "linkEnd",
                "types": [
                  "linkEnd"
                ]
              }
            ],
            "parameters": [
              {
                "backscatteringCoeff": -80,
                "refractiveIndex": 1.4686000000000001,
                "wavelength": 1625
              }
            ],
            "ponParameters": {
              "autoPonSplittersNum": 2,
              "firstSplitterInRatio": 1,
              "firstSplitterOutRatio": 1,
              "secondSplitterInRatio": 1,
              "secondSplitterOutRatio": 1,
              "thirdSplitterInRatio": 1,
              "thirdSplitterOutRatio": 1,
              "type": "NotAPon"
            },
            "ponSplitterRatio": 1,
            "sourceTraces": [
              {
                "acquisitionRange": 40.174353201534785,
                "analysisParameters": {
                  "endOfFiberLoss": 20,
                  "reflectance": -65,
                  "spliceLoss": 0.02
                },
                "attWaldoMode": false,
                "autoMeasurement": false,
                "backscatteringCoeff": -80,
                "measurementTime": 623,
                "name": "100",
                "optimalDeadZone": false,
                "pastEofFiberDetected": false,
                "ponParameters": {
                  "autoPonSplittersNum": 2,
                  "firstSplitterInRatio": 1,
                  "firstSplitterOutRatio": 1,
                  "secondSplitterInRatio": 1,
                  "secondSplitterOutRatio": 1,
                  "thirdSplitterInRatio": 1,
                  "thirdSplitterOutRatio": 1,
                  "type": "NotAPon"
                },
                "pulseWidth": 300,
                "refractiveIndex": 1.4686000000000001,
                "resolution": 2.5516857721639652,
                "spanParameters": {
                  "beginCompensatedLoss": 0,
                  "beginIncludesEventLoss": true,
                  "beginIndex": 0,
                  "endCompensatedLoss": 0,
                  "endIncludesEventLoss": true,
                  "endIndex": 0
                },
                "totalLoss": 5.4400000000000004,
                "wavelength": 1625
              }
            ],
            "spanParameters": {
              "beginCompensatedLoss": 0,
              "beginIncludesEventLoss": true,
              "beginIndex": 0,
              "beginSubIndex": 0,
              "endCompensatedLoss": 0,
              "endIncludesEventLoss": true,
              "endIndex": 0,
              "endSubIndex": 0
            },
            "spanTotals": [
              {
                "length": 27.255433512388937,
                "loss": 5.4358311826121062,
                "orl": 30.045879756997863,
                "wavelength": 1625
              }
            ],
            "thresholds": {
              "eventThresholds": {
                "thresholds": []
              },
              "muxThresholds": {
                "thresholds": {}
              },
              "splitterThresholds": {
                "thresholds": [
                  {
                    "inRatio": 1,
                    "maxLoss": 4.5,
                    "minLoss": 3,
                    "outRatio": 2
                  },
                  {
                    "inRatio": 1,
                    "maxLoss": 8.0999999999999996,
                    "minLoss": 6,
                    "outRatio": 4
                  },
                  {
                    "inRatio": 1,
                    "maxLoss": 11.699999999999999,
                    "minLoss": 9,
                    "outRatio": 8
                  },
                  {
                    "inRatio": 1,
                    "maxLoss": 15.300000000000001,
                    "minLoss": 12,
                    "outRatio": 16
                  },
                  {
                    "inRatio": 1,
                    "maxLoss": 18.300000000000001,
                    "minLoss": 15.300000000000001,
                    "outRatio": 32
                  },
                  {
                    "inRatio": 1,
                    "maxLoss": 19.5,
                    "minLoss": 18.300000000000001,
                    "outRatio": 64
                  },
                  {
                    "inRatio": 1,
                    "maxLoss": 24.5,
                    "minLoss": 21.300000000000001,
                    "outRatio": 128
                  },
                  {
                    "inRatio": 2,
                    "maxLoss": 4.7999999999999998,
                    "minLoss": 3,
                    "outRatio": 2
                  },
                  {
                    "inRatio": 2,
                    "maxLoss": 8.4000000000000004,
                    "minLoss": 6,
                    "outRatio": 4
                  },
                  {
                    "inRatio": 2,
                    "maxLoss": 12,
                    "minLoss": 9,
                    "outRatio": 8
                  },
                  {
                    "inRatio": 2,
                    "maxLoss": 15.6,
                    "minLoss": 12,
                    "outRatio": 16
                  },
                  {
                    "inRatio": 2,
                    "maxLoss": 18.600000000000001,
                    "minLoss": 15.6,
                    "outRatio": 32
                  },
                  {
                    "inRatio": 2,
                    "maxLoss": 19.800000000000001,
                    "minLoss": 18.600000000000001,
                    "outRatio": 64
                  },
                  {
                    "inRatio": 2,
                    "maxLoss": 24.800000000000001,
                    "minLoss": 21.600000000000001,
                    "outRatio": 128
                  }
                ]
              },
              "tapThresholds": {
                "thresholds": [
                  {
                    "drop": 100,
                    "ports": 1,
                    "ratio": 0,
                    "thru": 100
                  },
                  {
                    "drop": 4,
                    "ports": 1,
                    "ratio": 50,
                    "thru": 4
                  },
                  {
                    "drop": 4.4000000000000004,
                    "ports": 1,
                    "ratio": 55,
                    "thru": 3.6000000000000001
                  },
                  {
                    "drop": 5,
                    "ports": 1,
                    "ratio": 60,
                    "thru": 3.1000000000000001
                  },
                  {
                    "drop": 5.7000000000000002,
                    "ports": 1,
                    "ratio": 65,
                    "thru": 2.6000000000000001
                  },
                  {
                    "drop": 6.6500000000000004,
                    "ports": 1,
                    "ratio": 70,
                    "thru": 2.25
                  },
                  {
                    "drop": 7.5999999999999996,
                    "ports": 1,
                    "ratio": 75,
                    "thru": 1.8999999999999999
                  },
                  {
                    "drop": 9.0999999999999996,
                    "ports": 1,
                    "ratio": 80,
                    "thru": 1.7
                  },
                  {
                    "drop": 10.699999999999999,
                    "ports": 1,
                    "ratio": 85,
                    "thru": 1.25
                  },
                  {
                    "drop": 12.300000000000001,
                    "ports": 1,
                    "ratio": 90,
                    "thru": 1
                  },
                  {
                    "drop": 13.800000000000001,
                    "ports": 1,
                    "ratio": 93,
                    "thru": 0.69999999999999996
                  },
                  {
                    "drop": 15.9,
                    "ports": 1,
                    "ratio": 95,
                    "thru": 0.55000000000000004
                  },
                  {
                    "drop": 18.050000000000001,
                    "ports": 1,
                    "ratio": 97,
                    "thru": 0.40000000000000002
                  },
                  {
                    "drop": 21.149999999999999,
                    "ports": 1,
                    "ratio": 98,
                    "thru": 0.32000000000000001
                  },
                  {
                    "drop": 23.25,
                    "ports": 1,
                    "ratio": 99,
                    "thru": 0.25
                  },
                  {
                    "drop": 4.5,
                    "ports": 2,
                    "ratio": 0,
                    "thru": 100
                  },
                  {
                    "drop": 7.5,
                    "ports": 2,
                    "ratio": 50,
                    "thru": 4.2000000000000002
                  },
                  {
                    "drop": 7.9000000000000004,
                    "ports": 2,
                    "ratio": 55,
                    "thru": 3.6000000000000001
                  },
                  {
                    "drop": 8.5,
                    "ports": 2,
                    "ratio": 60,
                    "thru": 3.1000000000000001
                  },
                  {
                    "drop": 9.1999999999999993,
                    "ports": 2,
                    "ratio": 65,
                    "thru": 2.6000000000000001
                  },
                  {
                    "drop": 10.15,
                    "ports": 2,
                    "ratio": 70,
                    "thru": 2.25
                  },
                  {
                    "drop": 11.1,
                    "ports": 2,
                    "ratio": 75,
                    "thru": 1.8999999999999999
                  },
                  {
                    "drop": 12.6,
                    "ports": 2,
                    "ratio": 80,
                    "thru": 1.7
                  },
                  {
                    "drop": 14.199999999999999,
                    "ports": 2,
                    "ratio": 85,
                    "thru": 1.25
                  },
                  {
                    "drop": 15.800000000000001,
                    "ports": 2,
                    "ratio": 90,
                    "thru": 1
                  },
                  {
                    "drop": 17.300000000000001,
                    "ports": 2,
                    "ratio": 93,
                    "thru": 0.69999999999999996
                  },
                  {
                    "drop": 19.399999999999999,
                    "ports": 2,
                    "ratio": 95,
                    "thru": 0.55000000000000004
                  },
                  {
                    "drop": 21.550000000000001,
                    "ports": 2,
                    "ratio": 97,
                    "thru": 0.40000000000000002
                  },
                  {
                    "drop": 24.649999999999999,
                    "ports": 2,
                    "ratio": 98,
                    "thru": 0.32000000000000001
                  },
                  {
                    "drop": 26.75,
                    "ports": 2,
                    "ratio": 99,
                    "thru": 0.25
                  },
                  {
                    "drop": 8.0999999999999996,
                    "ports": 4,
                    "ratio": 0,
                    "thru": 100
                  },
                  {
                    "drop": 10.9,
                    "ports": 4,
                    "ratio": 50,
                    "thru": 4.2000000000000002
                  },
                  {
                    "drop": 11.300000000000001,
                    "ports": 4,
                    "ratio": 55,
                    "thru": 3.6000000000000001
                  },
                  {
                    "drop": 11.9,
                    "ports": 4,
                    "ratio": 60,
                    "thru": 3.1000000000000001
                  },
                  {
                    "drop": 12.6,
                    "ports": 4,
                    "ratio": 65,
                    "thru": 2.6000000000000001
                  },
                  {
                    "drop": 13.550000000000001,
                    "ports": 4,
                    "ratio": 70,
                    "thru": 2.25
                  },
                  {
                    "drop": 14.5,
                    "ports": 4,
                    "ratio": 75,
                    "thru": 1.8999999999999999
                  },
                  {
                    "drop": 16,
                    "ports": 4,
                    "ratio": 80,
                    "thru": 1.7
                  },
                  {
                    "drop": 17.600000000000001,
                    "ports": 4,
                    "ratio": 85,
                    "thru": 1.25
                  },
                  {
                    "drop": 19.199999999999999,
                    "ports": 4,
                    "ratio": 90,
                    "thru": 1
                  },
                  {
                    "drop": 20.699999999999999,
                    "ports": 4,
                    "ratio": 93,
                    "thru": 0.69999999999999996
                  },
                  {
                    "drop": 22.800000000000001,
                    "ports": 4,
                    "ratio": 95,
                    "thru": 0.55000000000000004
                  },
                  {
                    "drop": 24.949999999999999,
                    "ports": 4,
                    "ratio": 97,
                    "thru": 0.40000000000000002
                  },
                  {
                    "drop": 28.039999999999999,
                    "ports": 4,
                    "ratio": 98,
                    "thru": 0.32000000000000001
                  },
                  {
                    "drop": 30.140000000000001,
                    "ports": 4,
                    "ratio": 99,
                    "thru": 0.25
                  },
                  {
                    "drop": 11.699999999999999,
                    "ports": 8,
                    "ratio": 0,
                    "thru": 100
                  },
                  {
                    "drop": 14.199999999999999,
                    "ports": 8,
                    "ratio": 50,
                    "thru": 4.2000000000000002
                  },
                  {
                    "drop": 14.6,
                    "ports": 8,
                    "ratio": 55,
                    "thru": 3.6000000000000001
                  },
                  {
                    "drop": 15.199999999999999,
                    "ports": 8,
                    "ratio": 60,
                    "thru": 3.1000000000000001
                  },
                  {
                    "drop": 15.9,
                    "ports": 8,
                    "ratio": 65,
                    "thru": 2.6000000000000001
                  },
                  {
                    "drop": 16.850000000000001,
                    "ports": 8,
                    "ratio": 70,
                    "thru": 2.25
                  },
                  {
                    "drop": 17.800000000000001,
                    "ports": 8,
                    "ratio": 75,
                    "thru": 1.8999999999999999
                  },
                  {
                    "drop": 19.300000000000001,
                    "ports": 8,
                    "ratio": 80,
                    "thru": 1.7
                  },
                  {
                    "drop": 20.899999999999999,
                    "ports": 8,
                    "ratio": 85,
                    "thru": 1.25
                  },
                  {
                    "drop": 22.5,
                    "ports": 8,
                    "ratio": 90,
                    "thru": 1
                  },
                  {
                    "drop": 24,
                    "ports": 8,
                    "ratio": 93,
                    "thru": 0.69999999999999996
                  },
                  {
                    "drop": 26.09,
                    "ports": 8,
                    "ratio": 95,
                    "thru": 0.55000000000000004
                  },
                  {
                    "drop": 28.25,
                    "ports": 8,
                    "ratio": 97,
                    "thru": 0.40000000000000002
                  },
                  {
                    "drop": 31.34,
                    "ports": 8,
                    "ratio": 98,
                    "thru": 0.32000000000000001
                  },
                  {
                    "drop": 33.439999999999998,
                    "ports": 8,
                    "ratio": 99,
                    "thru": 0.25
                  }
                ]
              }
            },
            "totalThresholdsCheckResult": [
              {
                "length": true,
                "loss": true,
                "orl": true,
                "wavelength": 1625
              }
            ],
            "version": "2.16.0"
          }
          """;
        #endregion
        return Task.FromResult(Encoding.UTF8.GetBytes(json));
    }
}
