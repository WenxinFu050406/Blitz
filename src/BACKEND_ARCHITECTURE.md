# Blitz App Backend Architecture

## Overview

The Blitz app uses a **localStorage-based backend system** that simulates database operations. This lightweight solution provides persistent data storage without requiring external servers or databases.

## Architecture

### Storage Layer (`/utils/storage.ts`)

The backend is organized into specialized database modules:

#### 1. **Core Storage Module**
```typescript
storage.get<T>(key, defaultValue) // Read data
storage.set<T>(key, value)         // Write data  
storage.remove(key)                // Delete data
storage.clearAll()                 // Clear all app data
```

#### 2. **Landmark Joins Database**
Manages user participation in landmark group events.

**API:**
- `landmarkJoinsDB.getAll()` - Get all joined landmarks
- `landmarkJoinsDB.isJoined(landmarkId)` - Check join status
- `landmarkJoinsDB.join(landmarkId)` - Join an event
- `landmarkJoinsDB.leave(landmarkId)` - Leave an event
- `landmarkJoinsDB.toggle(landmarkId)` - Toggle join status

**Storage Key:** `blitz_landmark_joins`

#### 3. **Friend Requests Database**
Tracks sent friend requests.

**API:**
- `friendRequestsDB.getAll()` - Get all sent requests
- `friendRequestsDB.isSent(userId)` - Check if request sent
- `friendRequestsDB.send(userId)` - Send friend request
- `friendRequestsDB.cancel(userId)` - Cancel request
- `friendRequestsDB.toggle(userId)` - Toggle request status

**Storage Key:** `blitz_friend_requests`

#### 4. **Energy Exchanges Database**
Records energy point exchanges and conversions.

**API:**
- `energyExchangesDB.getAll()` - Get all exchanges
- `energyExchangesDB.add(amount, type)` - Record new exchange
- `energyExchangesDB.getTotalExchanged()` - Get total points exchanged

**Storage Key:** `blitz_energy_exchanges`

#### 5. **Joined Groups Database**
Manages user's riding group memberships.

**API:**
- `joinedGroupsDB.getAll()` - Get all joined groups
- `joinedGroupsDB.isJoined(groupId)` - Check membership
- `joinedGroupsDB.join(groupId)` - Join a group
- `joinedGroupsDB.leave(groupId)` - Leave a group
- `joinedGroupsDB.toggle(groupId)` - Toggle membership

**Storage Key:** `blitz_joined_groups`

#### 6. **User Preferences Database**
Stores user settings and preferences.

**API:**
- `userPreferencesDB.get(key, defaultValue)` - Get preference
- `userPreferencesDB.set(key, value)` - Set preference
- `userPreferencesDB.remove(key)` - Remove preference
- `userPreferencesDB.getAll()` - Get all preferences

**Storage Key:** `blitz_user_preferences`

## Data Persistence

### How It Works

1. **Data is stored in browser's localStorage**
   - Persists across browser sessions
   - Stored as JSON strings
   - Maximum ~10MB storage (varies by browser)

2. **Automatic serialization/deserialization**
   - Objects and arrays are automatically converted to/from JSON
   - Type-safe operations with TypeScript generics

3. **Error handling**
   - All operations include try-catch blocks
   - Errors are logged to console
   - Returns default values on read errors

### Data Format Examples

```javascript
// Landmark Joins
blitz_landmark_joins: ["1", "2", "3"]

// Friend Requests  
blitz_friend_requests: ["james", "lisa"]

// Energy Exchanges
blitz_energy_exchanges: [
  { id: "exchange_1234567890", amount: 500, type: "small_battery", timestamp: 1234567890 },
  { id: "exchange_1234567891", amount: 1000, type: "medium_battery", timestamp: 1234567891 }
]

// User Preferences
blitz_user_preferences: {
  "theme": "light",
  "notifications_enabled": true,
  "distance_unit": "km"
}
```

## Usage Examples

### Example 1: Joining a Landmark Event

```typescript
import { landmarkJoinsDB } from '../utils/storage';

// In LandmarkDetail component
const [joined, setJoined] = useState(() => landmarkJoinsDB.isJoined(landmark.id));

const handleToggleJoin = () => {
  const newStatus = landmarkJoinsDB.toggle(landmark.id);
  setJoined(newStatus);
};
```

### Example 2: Sending a Friend Request

```typescript
import { friendRequestsDB } from '../utils/storage';

// In AddFriend component
const [requestSent, setRequestSent] = useState(() => 
  friendRequestsDB.isSent(user.id)
);

const handleToggleRequest = () => {
  const newStatus = friendRequestsDB.toggle(user.id);
  setRequestSent(newStatus);
};
```

### Example 3: Recording Energy Exchange

```typescript
import { energyExchangesDB } from '../utils/storage';

// When user exchanges points
const handleExchange = (amount: number, type: string) => {
  energyExchangesDB.add(amount, type);
  // Update UI accordingly
};
```

## Benefits

✅ **No External Dependencies** - Works entirely in the browser  
✅ **Instant Persistence** - Data saved immediately  
✅ **Type-Safe** - Full TypeScript support  
✅ **Simple API** - Easy to use and understand  
✅ **Reliable** - Built-in error handling  
✅ **Privacy-Friendly** - All data stays on user's device  

## Limitations

⚠️ **Storage Size** - Limited to ~10MB (browser dependent)  
⚠️ **Single Device** - Data not synced across devices  
⚠️ **Clear on Cache Clear** - Data lost if user clears browser data  
⚠️ **No Server Sync** - Cannot share data between users  

## Future Enhancements

For production deployment, consider:

1. **Backend Integration** - Replace with actual API calls to Supabase/Firebase
2. **Cloud Sync** - Sync data across user's devices
3. **Offline Support** - Use Service Workers for offline functionality
4. **Data Backup** - Export/import functionality for user data
5. **Real-time Updates** - WebSocket support for live data updates

## Migration Path

To migrate to a real backend:

1. Replace database modules in `/utils/storage.ts` with API calls
2. Keep the same interface/API for minimal component changes
3. Add authentication layer
4. Implement server-side data validation
5. Add real-time synchronization

## Debugging

### View Stored Data

Open browser DevTools > Application/Storage > Local Storage

### Clear All Data

```javascript
localStorage.clear();
// Or use the built-in function:
import { storage } from './utils/storage';
storage.clearAll();
```

### Monitor Storage Usage

```javascript
// Check current usage
const used = JSON.stringify(localStorage).length;
console.log(`Storage used: ${(used / 1024).toFixed(2)} KB`);
```

---

**Note:** This architecture is designed for prototype/demo purposes. For production applications with real users, a proper backend solution (Supabase, Firebase, custom API) should be implemented.
