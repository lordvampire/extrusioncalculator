import React, { useEffect, useState } from "react";
import { getProfile } from "../services/api";

const Profile = () => {
  const [profile, setProfile] = useState([]);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(error => console.error("Fehler beim Laden der Profile:", error));
  }, []);

  return (
    <div>
      <h1>Profile</h1>
      <ul>
        {profile.map(profil => (
          <li key={profil.id}>
            Profilbreite: {profil.profilbreite} mm - Gewicht: {profil.profilgewicht} kg/m
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
