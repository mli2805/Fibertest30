using Iit.Fibertest.Dto;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Fibertest30.Infrastructure
{
    public class SorFileRepository
    {
        private readonly FtDbContext _ftDbContext;
        private readonly ILogger<SorFileRepository> _logger;

        public SorFileRepository(FtDbContext ftDbContext, ILogger<SorFileRepository> logger)
        {
            _ftDbContext = ftDbContext;
            _logger = logger;
        }

        public async Task<int> AddSorBytesAsync(byte[] sorBytes)
        {
            try
            {
                var sorFile = new SorFile { SorBytes = sorBytes };
                _ftDbContext.SorFiles.Add(sorFile);
                await _ftDbContext.SaveChangesAsync();

                return sorFile.Id;
            }
            catch (Exception e)
            {
                _logger.LogError("AddSorBytesAsync: " + e.Message);
                return -1;
            }
        }

        public async Task<List<int>?> AddMultipleSorBytesAsync(List<byte[]> sors)
        {
            try
            {
                var sorFiles = sors.Select(s => new SorFile { SorBytes = s }).ToList();
                _ftDbContext.SorFiles.AddRange(sorFiles);
                await _ftDbContext.SaveChangesAsync();

                return sorFiles.Select(s => s.Id).ToList();
            }
            catch (Exception e)
            {
                _logger.LogError("AddMultipleSorBytesAsync: " + e.Message);
                return null;
            }
        }

        public async Task<int> UpdateSorBytesAsync(int sorFileId, byte[] sorBytes)
        {
            try
            {
                var record = await _ftDbContext.SorFiles.Where(s => s.Id == sorFileId).FirstOrDefaultAsync();
                if (record == null) return -1;
                record.SorBytes = sorBytes;
                return await _ftDbContext.SaveChangesAsync();
            }
            catch (Exception e)
            {
                _logger.LogError("UpdateSorBytesAsync: " + e.Message);
                return -1;
            }
        }

        public async Task<byte[]?> GetSorBytesAsync(int sorFileId)
        {
            try
            {
                var result = await _ftDbContext.SorFiles.Where(s => s.Id == sorFileId).FirstOrDefaultAsync();
                return result?.SorBytes;
            }
            catch (Exception e)
            {
                _logger.LogError("GetSorBytesAsync: " + e.Message);
                return null;
            }
        }

        public async Task<int> RemoveSorBytesAsync(int sorFileId)
        {
            try
            {
                var result = await _ftDbContext.SorFiles.Where(s => s.Id == sorFileId).FirstOrDefaultAsync();
                if (result == null) return -1;
                _ftDbContext.SorFiles.Remove(result);
                return await _ftDbContext.SaveChangesAsync();
            }
            catch (Exception e)
            {
                _logger.LogError("RemoveSorBytesAsync: " + e.Message);
                return -1;
            }
        }

        public async Task<int> RemoveManySorAsync(int[] sorIds)
        {
            try
            {
                var sors = _ftDbContext.SorFiles.Where(s => sorIds.Contains(s.Id)).ToList();
                _ftDbContext.SorFiles.RemoveRange(sors);
                var recordsAffected = await _ftDbContext.SaveChangesAsync();
                return recordsAffected;
            }
            catch (Exception e)
            {
                _logger.LogError("RemoveManySorAsync: " + e.Message);
                return -1;
            }
        }

    }
}