﻿using Optixsoft.SharedCommons.SorSerialization;
using Optixsoft.SorExaminer.OtdrDataFormat;
using Optixsoft.SorExaminer.OtdrDataFormat.IO;
using Optixsoft.SorExaminer.OtdrDataFormat.Structures;
using BinaryWriter = System.IO.BinaryWriter;

namespace Iit.Fibertest.UtilsLib
{
    public static class SorDataRftsExt
    {
        public static EmbeddedData RftsEventsToEmbeddedData(this OtdrDataKnownBlocks sorData)
        {
            byte[] rftsEventsBytes = RftsEventsToBytes(sorData);
            return new EmbeddedData
            {
                Description = "RFTSEVENTS",
                BlockId = sorData.RftsEvents.BlockId,
                Comment = sorData.RftsEvents.LevelName.ToString(),
                DataSize = rftsEventsBytes.Length,
                Data = rftsEventsBytes
            };
        }
        private static byte[] RftsEventsToBytes(OtdrDataKnownBlocks sorData)
        {
            sorData.GeneralParameters.Language = LanguageCode.Utf8;
            using (MemoryStream ms = new MemoryStream())
            {
                BinaryWriter w = new BinaryWriter(ms);
                OpxSerializer opxSerializer = new OpxSerializer(
                    new Optixsoft.SharedCommons.SorSerialization.BinaryWriter(
                        w, sorData.GeneralParameters.Language.GetEncoding()), 
                    new FixDistancesContext(sorData.FixedParameters));

                var otdrBlock = new OtdrBlock(sorData.RftsEvents);
                var list = new List<OtdrBlock> {otdrBlock};
                list.UpdateBlocks(otdrBlock.RevisionNumber);

                w.Write((ushort)otdrBlock.RevisionNumber);
                opxSerializer.Serialize(otdrBlock.Body, otdrBlock.RevisionNumber);
                return ms.ToArray();
            }
        }
    }
}
