import React, { useState, useRef } from 'react';
import '../styles/pages/browser.scss';

const Browser = ({ onFileSelect }) => {
  const [folders, setFolders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortOption, setSortOption] = useState({ field: 'name', ascending: true });

  const contentInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const toggleFolderRecursive = (folders, id) => {
    return folders.map((folder) => {
      if (folder.id === id) {
        return { ...folder, isExpanded: !folder.isExpanded };
      }
      if (folder.files && folder.files.length) {
        return { ...folder, files: toggleFolderRecursive(folder.files, id) };
      }
      return folder;
    });
  };

  const handleFilesSelection = async (event) => {
    const files = event.target.files;
    const validImages = [];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif'];

    for (const file of files) {
      if (validImageTypes.includes(file.type)) {
        validImages.push(file);
      } else {
        alert(`"${file.name}" is not a valid image file and will be ignored.`);
      }
    }

    const parentId = contentInputRef.current.parentId;

    if (validImages.length > 0) {
      const newFiles = validImages.map((file) => ({ id: file.name, name: file.name, file }));
      setFolders((folders) => addFileToParent(folders, parentId, newFiles));
    }
  };

  const addFileToParent = (folders, parentId, newFile) => {
    return folders.map((folder) => {
      if (folder.id === parentId) {
        return { ...folder, files: [...(folder.files || []), ...newFile] }; // Spread newFile array
      }
      if (folder.files && folder.files.length) {
        return { ...folder, files: addFileToParent(folder.files, parentId, newFile) };
      }
      return folder;
    });
  };

  const renderFolders = (folders, depth = 0) => {
    return folders.map((folder) => (
      <div key={folder.id} className="folder-item" style={{ paddingLeft: `${depth * 20}px` }}>
        <div className="folder-header">
          {folder.isEditing ? (
            <input
              type="text"
              defaultValue={folder.name}
              onBlur={(e) => handleEditFolderName(folder.id, e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleEditFolderName(folder.id, e.target.value)}
              autoFocus
            />
          ) : (
            <span onClick={() => handleFileClick(folder)} onDoubleClick={() => handleToggleEdit(folder.id)}>
              {folder.name}
            </span>
          )}
          {!folder.file && ( 
            <>
              <button onClick={() => handleAddFolder(folder.id)}>+</button>
              <button onClick={() => handleDeleteFolder(folder.id)}>-</button>
              <button onClick={() => handleAddContent(folder.id)}>x</button>
              <button onClick={() => handleToggleFolder(folder.id)}>{folder.isExpanded ? '▼' : '▲'}</button>
            </>
          )}

        </div>
        {folder.isExpanded && folder.files && folder.files.length > 0 && (
          <div className="folder-files">
            {renderFolders(folder.files, depth + 1)}
          </div>
        )}
        {depth === 0 && <hr className='folder-separator' />}
      </div>
    ));
  };

  return (
    <div className="browser">
      <div className="folder-list">
        {renderFolders(sortedFolders)}
      </div>
      <div className='add-buttons'>
        <button onClick={() => handleAddFolder()}>+ Folder</button>
        <button onClick={handleImportFolder}>X Folder</button>
        <input
          type="file"
          ref={folderInputRef}
          webkitdirectory="true"
          directory=""
          style={{ display: 'none' }}
          onChange={handleFilesSelection}
        />
        <input
          type="file"
          ref={contentInputRef}
          multiple
          style={{ display: 'none' }}
          onChange={handleFilesSelection}
        />
      </div>
    </div>
  );
};

export default Browser;