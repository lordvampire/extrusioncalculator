import React, { useState } from 'react';
import axios from 'axios';

const ProfileCalculationPage = () => {
  const [profileData, setProfileData] = useState({
    profilbreite: '',
    profilhoehe: '',
    profilgewicht: '',
    profiltyp: '',
    profilkomplexitaet: '',
    zugfestigkeit: '',
    strangzahl: '',
    schrottlaenge: '',
    kundenlaenge: '',
  });

  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/calculate', profileData);
      setResults(response.data);
    } catch (error) {
      console.error('Error calculating profile data:', error);
    }
  };

  return (
    <div>
      <h1>Profile Calculation</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="profilbreite" placeholder="Profilbreite" value={profileData.profilbreite} onChange={handleChange} required />
        <input type="text" name="profilhoehe" placeholder="Profilhöhe" value={profileData.profilhoehe} onChange={handleChange} required />
        <input type="text" name="profilgewicht" placeholder="Profilgewicht" value={profileData.profilgewicht} onChange={handleChange} required />
        <input type="text" name="profiltyp" placeholder="Profiltyp" value={profileData.profiltyp} onChange={handleChange} required />
        <input type="text" name="profilkomplexitaet" placeholder="Profilkomplexität" value={profileData.profilkomplexitaet} onChange={handleChange} required />
        <input type="text" name="zugfestigkeit" placeholder="Zugfestigkeit" value={profileData.zugfestigkeit} onChange={handleChange} required />
        <input type="text" name="strangzahl" placeholder="Strangzahl" value={profileData.strangzahl} onChange={handleChange} required />
        <input type="text" name="schrottlaenge" placeholder="Schrottlänge" value={profileData.schrottlaenge} onChange={handleChange} required />
        <input type="text" name="kundenlaenge" placeholder="Kundenlänge" value={profileData.kundenlaenge} onChange={handleChange} required />
        <button type="submit">Kalkulieren</button>
      </form>
      <h2>Ergebnisse</h2>
      {results.map((result, index) => (
        <div key={index}>
          <h3>Anlage {index + 1}</h3>
          <p>Verpressungsverhältnis: {result.verpressungsverhaeltnis}</p>
          <p>Maximale theoretische Profilgeschwindigkeit: {result.max_theor_profgesch}</p>
          <p>Profilgeschwindigkeit: {result.profgesch}</p>
          <p>Austrittsgewicht: {result.austrittsgewicht}</p>
          <p>Maximale Auszugslänge: {result.max_auszug}</p>
          <p>Kundenlängen pro Runout: {result.kundenlaengen_pro_runout}</p>
          <p>Optimale Bolzenlänge: {result.optimal_bolzenlaenge}</p>
          <p>Produktivität: {result.productivity}</p>
        </div>
      ))}
    </div>
  );
};

export default ProfileCalculationPage;