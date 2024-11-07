import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import Sidebar from './Sidebar';
import Browser from './Browser';
import FileView from './FileView';
import '../styles/pages/room.scss';
import { useUser } from '../UserContext';

const Room = ({handleLogout}) => {
  const {username} = useParams();
  const {userProfile} = useUser();

  console.log('userProfile', userProfile);
  console.log('username', username);
  const [selectedFile, setSelectedFile] = useState(null);
  const handleFileSelect = (file) => {
    setSelectedFile(file);
  }

  useEffect(() => {
    if(userProfile?.username !== username) {
      alert('You are not authorized to view this page');
    }
  }, [userProfile, username]);

  if (userProfile?.username !== username) {
    return null;
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