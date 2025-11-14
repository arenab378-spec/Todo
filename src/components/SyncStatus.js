import React from 'react';

const SyncStatus = ({ syncStatus, offlineMode, userId }) => {
  return (
    <div className="syncStatus">
      {syncStatus === 'syncing' && <span className="badge syncing">⟳ Syncing...</span>}
      {syncStatus === 'synced' && <span className="badge synced">✅ Synced</span>}
      {syncStatus === 'error' && <span className="badge error">⚠️ Sync Error</span>}
      {offlineMode && <span className="badge offline">📶 Offline Mode</span>}
      {userId && <span className="badge user">👤 {userId.slice(0, 6)}...</span>}
    </div>
  );
};

export default React.memo(SyncStatus);
