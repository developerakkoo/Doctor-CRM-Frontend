import React, { useEffect, useRef } from 'react';
import axios from 'axios';

const VideoPlayer = ({ videoId }) => {
  const videoRef = useRef();

  useEffect(() => {
    const fetchVideo = async () => {
      const token = localStorage.getItem('token');
      console.log("Token in frontend:", token);

      try {
        const response = await axios.get(
          `http://localhost:9191/api/v1/doctors/videos/stream/${videoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Range: 'bytes=0-',
            },
            responseType: 'blob',
          }
        );

        const videoUrl = URL.createObjectURL(response.data);
        if (videoRef.current) {
          videoRef.current.src = videoUrl;
        }
      } 
      catch (err) {
        console.error('Failed to fetch video:', err.response?.data || err.message);
      }
    };

    fetchVideo();
  }, [videoId]);

  return (
    <div>
      <h3>Video Stream</h3>
      <video ref={videoRef} controls width="600" />
    </div>
  );
};

export default VideoPlayer;