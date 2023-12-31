import ParkIcon from '../assets/park-icon';
import { useSelector } from 'react-redux';
import { BiSolidEdit } from 'react-icons/bi';
import React, { useState } from 'react';
import EditProfileScreen from './edit-profile';


const ProfileHead = ({user}) => {
    let currentUser = useSelector(state => state.auth.currentUser)
    const [isEditing, setIsEditing] = useState(false);

    const handleEditClick = () => {
        // Set the state to indicate that the user is editing
        setIsEditing(true);
    };

    const gradientBackground = (image) => {
        return {
        "background": `linear-gradient(rgba(0, 0, 0, .1), rgba(0, 0, 0, .6)),
        url('${image}') no-repeat center / cover`, "height": "15vh"
        }
    }

    let isPark = user.role === "parks"

    return (
        <div className = "p-0">
            <div style = {gradientBackground(isPark ? user.profileImage : user.backgroundImage)}
            className = "display-block position-relative">
                {user === currentUser && <button
                    onClick={handleEditClick} // Handle the edit button click
                    className="parkour-btn orange-btn btn m-3"
                >
                    <BiSolidEdit /> Edit Profile
                </button>}
                <div className = "position-absolute ps-3" style ={ {"bottom":"0"}}>
                    <h2 className="text-white">
                        {user.displayName}{/* Yosemite <ParkIcon /> */}
                    </h2>
                    <p className = "white">@{user.username}</p>
                </div>
            </div>
            <div className = "p-3 d-flex">
                <div className = "green2 flex-grow-1">{user.profileBio}</div>
                <button className="parkour-btn green-btn btn text-nowrap">
                    Follow +
                </button>
            </div>
            {isEditing && <EditProfileScreen />}
        </div>
    );
};
export default ProfileHead;