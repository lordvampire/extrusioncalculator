import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import von axios
import { getOberflaechen, getAnwendungsbereiche } from '../services/api'; // Import der API-Funktionen
import './ProfileCalculationPage.css'; // Import der CSS-Datei

const ProfileCalculationPage = () => {
  const [profileData, setProfileData] = useState({
    profilbreite: '',
    profilhoehe: '',
    profilgewicht: '',
    profiltyp: 'flach', // Standardwert auf "flach" gesetzt
    profilkomplexitaet: '',
    strangzahl: '',
    schrottlaenge: '',
    kundenlaenge: '',
    anwendungsbereich_id: '',
    oberflaechenanforderung_id: '',
  });

  const [results, setResults] = useState([]);
  const [anwendungsbereiche, setAnwendungsbereiche] = useState([]);
  const [oberflaechenanforderungen, setOberflaechenanforderungen] = useState([]);

  useEffect(() => {
    // Laden der Anwendungsbereiche
    getAnwendungsbereiche()
      .then(setAnwendungsbereiche)
      .catch(error => console.error('Error fetching anwendungsbereiche:', error));

    // Laden der Oberflächenanforderungen
    getOberflaechen()
      .then(setOberflaechenanforderungen)
      .catch(error => console.error('Error fetching oberflaechenanforderungen:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://3.68.80.95:8000/api/calculate', profileData); // Überprüfen Sie die URL
      setResults(response.data);
    } catch (error) {
      console.error('Error calculating profile data:', error);
    }
  };

  return (
    <div className="profile-calculation-page">
      <h1>Profile Calculation</h1>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Profilbreite</label>
          <input type="text" name="profilbreite" value={profileData.profilbreite} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Profilhöhe</label>
          <input type="text" name="profilhoehe" value={profileData.profilhoehe} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Profilgewicht</label>
          <input type="text" name="profilgewicht" value={profileData.profilgewicht} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Profiltyp</label>
          <select name="profiltyp" value={profileData.profiltyp} onChange={handleChange} required>
            <option value="flach">Flach</option>
            <option value="hohl">Hohl</option>
          </select>
        </div>
        <div className="form-group">
          <label>Profilkomplexität</label>
          <input type="text" name="profilkomplexitaet" value={profileData.profilkomplexitaet} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Strangzahl</label>
          <input type="text" name="strangzahl" value={profileData.strangzahl} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Schrottlänge</label>
          <input type="text" name="schrottlaenge" value={profileData.schrottlaenge} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Kundenlänge</label>
          <input type="text" name="kundenlaenge" value={profileData.kundenlaenge} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Anwendungsbereich</label>
          <select name="anwendungsbereich_id" value={profileData.anwendungsbereich_id} onChange={handleChange} required>
            <option value="">Anwendungsbereich auswählen</option>
            {anwendungsbereiche.map((bereich) => (
              <option key={bereich.id} value={bereich.id}>{bereich.bezeichnung}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Oberflächenanforderung</label>
          <select name="oberflaechenanforderung_id" value={profileData.oberflaechenanforderung_id} onChange={handleChange} required>
            <option value="">Oberflächenanforderung auswählen</option>
            {oberflaechenanforderungen.map((anforderung) => (
              <option key={anforderung.id} value={anforderung.id}>{anforderung.bezeichnung}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="submit-button">Kalkulieren</button>
      </form>
      <h2>Ergebnisse</h2>
      {results.map((result, index) => (
        <div key={index} className="result">
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