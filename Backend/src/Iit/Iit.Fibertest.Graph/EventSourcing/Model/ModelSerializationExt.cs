﻿using System.Runtime.Serialization.Formatters.Binary;
using Microsoft.Extensions.Logging;

namespace Iit.Fibertest.Graph
{
    public static class ModelSerializationExt
    {
        public static async Task<byte[]?> Serialize(this Model model, ILogger logger)
        {
            try
            {
                using (MemoryStream stream = new MemoryStream())
                {
                    await Task.Delay(1);
                    var binaryFormatter = new BinaryFormatter();
                    binaryFormatter.Serialize(stream, model);
                    var buf = stream.ToArray();
                    logger.LogInformation($"Model serialization: data size = {buf.Length:0,0.#}");
                    return buf;
                }
            }
            catch (Exception e)
            {
                logger.LogError("Model serialization: " + e.Message);
                return null;
            }
        }

        public static async Task<bool> Deserialize(this Model model, ILogger logger, byte[] buffer)
        {
            try
            {
                using (var stream = new MemoryStream(buffer))
                {
                    await Task.Delay(1);
                    var binaryFormatter = new BinaryFormatter();
                    var model2 = (Model)binaryFormatter.Deserialize(stream);
                    logger.LogInformation("Model deserialized successfully!");
                    model2.AdjustModelDeserializedFromSnapshotMadeByOldVersion();
                    model.CopyFrom(model2);

                    return model2.Rtus.Count == model.Rtus.Count;
                }
            }
            catch (Exception e)
            {
                logger.LogError("Model deserialization: " + e.Message);
                return false;
            }
        }

        // if snapshot was made before v926
        private static void AdjustModelDeserializedFromSnapshotMadeByOldVersion(this Model model)
        {
            if (model.Licenses == null)
            {
                model.Licenses = new List<License>()
                {
                    new License()
                    {
                        LicenseId = new Guid(),
                        ClientStationCount = new LicenseParameter()
                        {
                            Value = 1,
                            ValidUntil = DateTime.MaxValue,
                        },
                        RtuCount = new LicenseParameter(),
                        WebClientCount = new LicenseParameter(),
                        SuperClientStationCount = new LicenseParameter(),
                        CreationDate = DateTime.Today,
                        LoadingDate = DateTime.Today,
                    }
                };
            }

            if (model.TcesNew == null)
                model.TcesNew = new List<TceS>();
            if (model.VeexTests == null)
                model.VeexTests = new List<VeexTest>();
            if (model.GponPortRelations == null)
                model.GponPortRelations = new List<GponPortRelation>();
            if (model.RtuAccidents == null)
                model.RtuAccidents = new List<RtuAccident>();
        }
    }
}