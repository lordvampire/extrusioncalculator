CREATE TABLE extrusionsanlagen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    bolzendurchmesser FLOAT NOT NULL,
    containerdurchmesser FLOAT NOT NULL,
    max_bolzenlaenge FLOAT NOT NULL,
    max_auszugslaenge FLOAT NOT NULL,
    max_stempelgeschw FLOAT NOT NULL,
    max_profilbreite FLOAT NOT NULL,
    totzeit FLOAT NOT NULL,
    max_pullergeschw FLOAT NOT NULL,
    max_strangzahl INT NOT NULL,
    rampenverlust FLOAT NOT NULL
);

CREATE TABLE profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    profilbreite FLOAT NOT NULL,
    profilhöhe FLOAT NOT NULL,
    profilgewicht FLOAT NOT NULL,
    profiltyp TEXT CHECK (profiltyp IN ('flach', 'hohl')) NOT NULL,
    profilkomplexität INT CHECK (profilkomplexität BETWEEN 1 AND 10) NOT NULL,
    zugfestigkeit FLOAT NOT NULL,
    kundenlänge FLOAT NOT NULL,
    anwendungsgebiet TEXT NOT NULL,
    oberflächenanforderung TEXT NOT NULL
);

CREATE TABLE kalkulationen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profil_id UUID REFERENCES profile(id) ON DELETE CASCADE,
    anlage_id UUID REFERENCES extrusionsanlagen(id) ON DELETE CASCADE,
    pressgeschwindigkeit FLOAT NOT NULL,
    strangzahl INT NOT NULL,
    schrittlänge FLOAT NOT NULL,
    produktivität FLOAT NOT NULL,
    recovery FLOAT NOT NULL,
    schrottlänge FLOAT NOT NULL,
    berechnungsdatum TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reduktionsfaktoren (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profilkomplexität INT CHECK (profilkomplexität BETWEEN 1 AND 10) NOT NULL,
    anwendungsgebiet TEXT NOT NULL,
    oberflächenanforderung TEXT NOT NULL,
    reduktionsfaktor FLOAT NOT NULL
);

CREATE TABLE oberflaechenanforderungen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bezeichnung TEXT UNIQUE NOT NULL,
    reduktionsfaktor FLOAT NOT NULL CHECK (reduktionsfaktor BETWEEN 0.1 AND 1.0)
);
CREATE TABLE anwendungsbereiche (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bezeichnung TEXT UNIQUE NOT NULL,
    reduktionsfaktor FLOAT NOT NULL CHECK (reduktionsfaktor BETWEEN 0.1 AND 1.0),
    schrottlaenge FLOAT NOT NULL CHECK (schrottlaenge >= 0)
);
