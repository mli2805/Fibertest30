namespace Fibertest30.Application;

 public class OtauManager
    {
        public IOtauController Controller { get; set; } = null!;
        public Otau Otau { get; set; } = null!;
        public SemaphoreSlim Semaphore { get; set; } = null!;

        public volatile bool IsConnected;

        private readonly object _lastCommandLock = new();
        private DateTime _lastCommandTime;
        
        private readonly object _onlineAtLock = new();
        private DateTime? _onlineAt;
        
        private readonly object _offlineAtLock = new();
        private DateTime? _offlineAt;
        
        public DateTime LastCommandTime
        {
            get 
            {
                lock(_lastCommandLock)
                {
                    return _lastCommandTime;
                }
            }
            set 
            {
                lock(_lastCommandLock)
                {
                    _lastCommandTime = value;
                }
            }
        }
        
        public DateTime? OnlineAt
        {
            get 
            {
                lock(_onlineAtLock)
                {
                    return _onlineAt;
                }
            }
            set 
            {
                lock(_onlineAtLock)
                {
                    _onlineAt = value;
                }
            }
        }
        
        public DateTime? OfflineAt
        {
            get 
            {
                lock(_offlineAtLock)
                {
                    return _offlineAt;
                }
            }
            set 
            {
                lock(_offlineAtLock)
                {
                    _offlineAt = value;
                }
            }
        }
}