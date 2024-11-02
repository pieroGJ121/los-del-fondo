import React, {useState} from 'react';
import Sidebar from './Sidebar';
import Browser from './Browser';
import FileView from './FileView';
import '../styles/pages/room.scss';

const Room = ({handleLogout}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileSelect = (file) => {
    setSelectedFile(file);
  }
  
  return (
    <div className="room">
      <Sidebar handleLogout={handleLogout}/>
      <Browser onFileSelect={handleFileSelect}/>
      <FileView file={selectedFile} />
    </div>
  );
};

export default Room;