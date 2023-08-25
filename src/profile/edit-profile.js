import ProfileHeader from './profile-header';
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { updateUserThunk, profileThunk, logoutThunk } from "../services/auth-thunks";

const EditProfileScreen = () => {
    const { currentUser } = useSelector((state) => state.auth);
    const [profile, setProfile] = useState(currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const save = async () => { await dispatch(updateUserThunk(profile)) };
    useEffect( () => {
        const loadProfile = async () => {
            const { payload } = await dispatch(profileThunk());
            setProfile(payload);
        };
        loadProfile();
    }, []);
    return (
        <div>
        <h1>Profile Screen</h1>
        {profile && (<div>
            <div>
                <label>Profile Name</label>
                <input type="text" value={profile.displayName}
                    onChange={(event) => {
                        const newProfile = {
                            ...profile, displayName: event.target.value,
                        };
                        setProfile(newProfile);
                    }} />
            </div>
            </div>
        )}
        <button
            onClick={() => {
                dispatch(logoutThunk());
                navigate("/login");
            }}>                   Logout</button>
        <button onClick={save}>Save  </button>
    </div>
    );
};
export default EditProfileScreen;