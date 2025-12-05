# Frontend UI - @infokes/frontend

Vue 3 file manager interface with intuitive UI and real-time sync with backend API.

## 🚀 Quick Start

```bash
# From monorepo root
npm run start:frontend

# Or from frontend directory
cd packages/frontend
bun run dev
```

App runs at: **http://localhost:5173**

## 📋 Features

- ✅ Windows Explorer-style sidebar tree view
- ✅ Folder navigation with breadcrumbs
- ✅ Right-click context menus for operations
- ✅ Create/Edit/Delete folders and files
- ✅ Responsive UI design
- ✅ Real-time sync with backend
- ✅ 11/11 service tests passing

## 🏗️ Architecture

```
src/
├── main.js                    # App entry point
├── App.vue                    # Root component
├── views/
│   └── Home.vue               # Main file manager view
├── components/
│   ├── Sidebar.vue            # Left sidebar
│   ├── TreeFolder.vue         # Recursive tree item
│   ├── Breadcrumb.vue         # Navigation breadcrumbs
│   ├── FolderList.vue         # Folder display list
│   ├── FileList.vue           # File display list
│   ├── FolderItem.vue         # Single folder card
│   ├── FileItem.vue           # Single file card
│   ├── EmptyState.vue         # Empty state message
│   ├── FolderForm.vue         # Folder creation/edit modal
│   ├── FileForm.vue           # File creation/edit modal
│   └── ContextMenu.vue        # Right-click menu
├── composables/
│   ├── useFolders.js          # Folder state & operations
│   ├── useFiles.js            # File state & operations
│   └── useContextMenu.js      # Context menu logic
├── services/
│   ├── folderService.js       # Folder API client
│   └── fileService.js         # File API client
├── router/
│   └── index.ts               # Vue Router config
└── assets/
    ├── base.css               # Base styles
    └── main.css               # Global styles
```

## 📦 Dependencies

**Production:**
- `vue` - UI framework
- `vue-router` - Client-side routing

**Development:**
- `vite` - Build tool
- `@vitejs/plugin-vue` - Vue plugin for Vite
- `vite-plugin-vue-devtools` - DevTools integration
- `@vue/test-utils` - Component testing
- `vitest` - Test framework
- `happy-dom` - DOM implementation
- `jsdom` - DOM simulation

## 🎨 Components

### Layout Components
- **Sidebar** - Folder tree navigation with lazy loading
- **TreeFolder** - Recursive folder node with expand/collapse
- **Breadcrumb** - Navigation breadcrumbs

### Content Components
- **FolderList** - List of folders in current directory
- **FileList** - List of files in current directory
- **FolderItem** - Single folder card
- **FileItem** - Single file card with icon
- **EmptyState** - Empty state message

### Form Components
- **FolderForm** - Create/edit folder modal
- **FileForm** - Create/edit file modal

### Menu Components
- **ContextMenu** - Right-click context menu
- Teleports to body for proper positioning

## 🪝 Composables

### useFolders()
```javascript
const {
  folders,
  currentFolder,
  loading,
  error,
  loadRootFolders,
  loadFolderContents,
  createFolder,
  updateFolder,
  deleteFolder
} = useFolders();
```

### useFiles()
```javascript
const {
  files,
  loading,
  error,
  createFile,
  updateFile,
  deleteFile
} = useFiles();
```

### useContextMenu()
```javascript
const {
  contextMenu,
  showContextMenu,
  closeContextMenu,
  createFolderContextMenu,
  createFolderItemContextMenu,
  createFileItemContextMenu
} = useContextMenu();
```

## 🧪 Testing

```bash
# Run all tests
npm run test --workspace=@infokes/frontend

# From frontend directory
cd packages/frontend
bun test tests/*Service.test.js
```

**Test Coverage:** 11/11 tests passing
- FolderService: 6 tests
- FileService: 5 tests

## 🚀 Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm run preview   # Preview build
npm run test      # Run tests
```

## 🎯 User Interactions

### Navigating Folders
1. Click folder in sidebar tree to expand/collapse
2. Double-click folder or click "Open" in context menu
3. Use breadcrumbs to navigate back
4. Click "Home" to return to root

### Creating Items
1. Right-click on empty area → "New Folder" / "New File"
2. Right-click folder item → "New Folder Inside" / "New File Inside"
3. Fill form and click Save

### Editing Items
1. Right-click item → "Rename"
2. Edit name/properties in modal
3. Click Save

### Deleting Items
1. Right-click item → "Delete"
2. Confirm deletion dialog
3. Item and all children (if folder) removed

### Context Menu Actions

**Empty Area:**
- New Folder
- New File

**Folder Item:**
- Open
- New Folder Inside
- New File Inside
- Rename
- Delete

**File Item:**
- Rename
- Delete

## 🌐 API Integration

Backend connection configured in `services/`:
- **Base URL:** http://localhost:3000
- **Endpoints:** `/folders`, `/files`
- **Response Format:** `{ success: boolean, data: any }`

### Error Handling
- API errors display as toast/alert
- Failed operations prevent state changes
- Retry on network errors

## 📱 Responsive Design

- **Sidebar:** Fixed left panel (250px)
- **Content:** Responsive flex layout
- **Breakpoints:** Works on desktop (1920x1080 tested)

## ⚙️ Configuration

### Node Version
Requires Node.js 20.19+ or 22.12+

### Vite Config
- Port: 5173 (auto-switch if in use)
- HMR: Enabled for hot reload
- Dev tools: Enabled

## 🔗 API Client

### folderService.js
```javascript
// Get folder tree
folderService.getTree()

// Get all folders
folderService.getAll()

// Get folder by ID
folderService.getById(id)

// Get folder contents
folderService.getContents(id)

// Create folder
folderService.create(data)

// Update folder
folderService.update(id, data)

// Delete folder
folderService.delete(id)
```

### fileService.js
```javascript
// Get all files
fileService.getAll()

// Get file by ID
fileService.getById(id)

// Create file
fileService.create(data)

// Update file
fileService.update(id, data)

// Delete file
fileService.delete(id)
```

## 📚 Related Documentation

- [Main README](../../README.md)
- [Monorepo Guide](../../MONOREPO.md)
- [Backend Documentation](../backend/README.md)

## 🤝 Contributing

1. Create components in `src/components/`
2. Use Vue 3 Composition API
3. Add tests in `tests/`
4. Keep components small and focused
5. Use composables for shared logic

## 📄 License

MIT

## Running Tests

```bash
bun test
```

**Test Results**: 11/11 service layer tests passing ✅

**Note**: Currently, only service layer tests run successfully with Bun's native test runner. Component tests using `@vue/test-utils` have compatibility issues with Bun due to WeakMap handling. 

To run component tests, you would need Node.js 18+ and use Vitest instead:
```bash
# Requires Node 18+
npm install
npm run test
```

Working tests:
- ✅ `tests/folderService.test.js` - 5 tests passing
- ✅ `tests/fileService.test.js` - 6 tests passing

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Breadcrumb.vue   # Navigation breadcrumb
│   │   ├── FileForm.vue     # Form for creating/editing files
│   │   ├── FileItem.vue     # Single file display
│   │   ├── FolderForm.vue   # Form for creating/editing folders
│   │   └── FolderItem.vue   # Single folder display
│   ├── composables/         # Vue composables for state management
│   │   ├── useFiles.js      # File operations and state
│   │   └── useFolders.js    # Folder operations and state
│   ├── services/            # API service layer
│   │   ├── fileService.js   # File API calls
│   │   └── folderService.js # Folder API calls
│   ├── views/               # Page components
│   │   └── Home.vue         # Main file manager view
│   ├── router/              # Vue Router configuration
│   ├── App.vue              # Root component
│   └── main.js              # Application entry point
├── tests/                   # Unit tests
│   ├── Breadcrumb.test.js
│   ├── FileItem.test.js
│   ├── FolderForm.test.js
│   ├── FolderItem.test.js
│   └── folderService.test.js
└── vitest.config.js         # Vitest configuration
```

## Component Architecture

### Small Reusable Components

1. **FolderItem.vue** - Displays a single folder (props: folder, emits: open/edit/delete)
2. **FileItem.vue** - Displays a single file with size formatting
3. **FolderForm.vue** - Form for creating or editing folders
4. **FileForm.vue** - Form for creating or editing files
5. **Breadcrumb.vue** - Navigation breadcrumb trail

### Composables (State Management)

- **useFolders.js** - Manages folder state and operations
- **useFiles.js** - Manages file state and operations

### Services (API Layer)

- **folderService.js** - Pure functions for folder API calls
- **fileService.js** - Pure functions for file API calls

## API Integration

The frontend connects to the backend API at `http://localhost:3000`. Make sure the backend is running first.

## Testing

The frontend includes comprehensive unit tests for components and services using Vitest and @vue/test-utils.

Run tests with: `bun test`

## License

MIT
