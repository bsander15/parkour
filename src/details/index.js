import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { findPostsByParkId } from '../services/posts-service';
import ParkDetails from './ParkDetails';
import PostsList from '../postsList';
import { findUsersByDisplayName, findRangersByPark } from '../services/users-services';
import ParkRangers from './ParkRangers';
import ParkActivities from './ParkActivities';
import ParkRelated from './ParkRelated';

function Details() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get('name');

  const [parkApi, setParkApi] = useState();
  const [parkDb, setParkDb] = useState();
  const [parkPosts, setParkPosts] = useState([]);
  const [rangers, setRangers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const NPS_API = `${process.env.REACT_APP_NPS_API_BASE}/parks?q=${name}&api_key=${process.env.REACT_APP_NPS_API_KEY}`;

  let currentUser = useSelector(state => state.auth.currentUser)
  let [canPostToBoard, setCanPostToBoard] = useState(false)

  useEffect(() => {
    axios.get(NPS_API)
      .then(response => {
        const result = response.data;
        const parks = result.data;
        console.log(parks)
        console.log(name);
        const park = parks.filter(park => park.name === name)[0];
        console.log(park);
        if (park) {
          console.log('here')
          setParkApi(park);
        } else {
          setError({message: 'Park not found'});
        }
      })
      .catch(error => {
        setError(error);
      });
  }, []);

  useEffect(() => {
    if (parkApi) {
      findUsersByDisplayName(parkApi.name)
        .then(response => {
          setParkDb(response[0]);
        })
        .catch(error => {
          setError(error);
        })
    }
  }, [parkApi]);

  useEffect(() => {
    if (parkDb) {
      findPostsByParkId(parkDb._id)
        .then(response => {
          setParkPosts(response);
        })
        .catch(error => {
          setError(error);
        })
      findRangersByPark(parkDb._id)
        .then(response => {
          setRangers(response);
          setLoading(false);
        })
        .catch(error => {
          setError(error);
        })
      setCanPostToBoard(currentUser && 
      (currentUser.role === "hikers" || 
      (currentUser.role === "rangers" && currentUser.parkId === parkDb._id)))
    }
  }, [parkDb])


  return (
    loading ? <p>Loading...</p>
      :
      error ? <p>Error: {error.message}</p>
        :
        <>
          <div className='row'>
            <div className='col-md-8'>
              <ParkDetails park={parkApi} username={parkDb.username} />
              <PostsList postFunction = {async () => {return await findPostsByParkId(parkDb._id)}}
                createPost = {{render: canPostToBoard, parkInfo: parkDb}}
                parkInfo={parkDb} />
            </div>
            <div className='d-none d-md-block col-md-4 mt-2'>
              <div className='row subPane bg-brown2 w-75 '>
                <ParkRangers rangers={rangers} />
              </div>
              <div className='row subPane bg-brown2 w-75'>
                <ParkActivities activities={parkApi.activities} />
              </div>
              <div className='row subPane bg-brown2 w-75'>
                <ParkRelated topics={parkApi.topics} />
              </div>
            </div>
          </div>
        </>
  );
}

export default Details;
